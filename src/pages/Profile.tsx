
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Edit, Settings, Calendar, Trophy, Flame, BookMarked, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProfileSetup } from "@/components/ProfileSetup";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState<string | null>(null);

  // Stats data - now properly synced with Home component
  const [stats, setStats] = useState({
    karmaPoints: 0,
    streak: 0,
    savedQuotes: 0,
    completedTasks: 0
  });

  // Detailed data for views
  const [detailedData, setDetailedData] = useState<any>({
    savedQuotes: [],
    tasks: [],
    karmaHistory: []
  });

  useEffect(() => {
    loadProfile();
    loadStats();
    loadDetailedData();
    
    // Set up real-time listeners for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (user && e.key && e.key.includes(user.id)) {
        loadStats();
        loadDetailedData();
      }
    };

    // Listen for custom events from other components
    const handleStatsUpdate = () => {
      loadStats();
      loadDetailedData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('statsUpdated', handleStatsUpdate);
    
    // Set up interval to check for updates every 5 seconds
    const interval = setInterval(() => {
      loadStats();
      loadDetailedData();
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      clearInterval(interval);
    };
  }, [user]);

  const loadProfile = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      // Fix the date format if it's invalid
      if (parsedData.createdAt && !isValidDate(parsedData.createdAt)) {
        // If date is invalid, set it to the user's actual creation date or current date
        parsedData.createdAt = user?.created_at || new Date().toISOString();
        localStorage.setItem('userData', JSON.stringify(parsedData));
      }
      setProfile(parsedData);
    } else if (user) {
      // Show profile setup if no profile data exists
      setShowProfileSetup(true);
    }
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const loadStats = () => {
    if (!user) {
      setStats({
        karmaPoints: 0,
        streak: 0,
        savedQuotes: 0,
        completedTasks: 0
      });
      return;
    }

    // Use the same keys as Home component for consistency
    const karmaPoints = JSON.parse(localStorage.getItem(`karmaPoints_${user.id}`) || '0');
    const dailyStreak = JSON.parse(localStorage.getItem(`dailyStreak_${user.id}`) || '0'); // Changed from karmaStreak to dailyStreak
    const savedQuotes = JSON.parse(localStorage.getItem(`savedQuotes_${user.id}`) || '[]').length;
    const tasks = JSON.parse(localStorage.getItem(`karmaTasks_${user.id}`) || '[]');
    const completedTasks = tasks.filter((task: any) => task.completed).length;

    // Also check for weekly goal data from Home component
    const weeklyGoal = JSON.parse(localStorage.getItem(`weeklyGoal_${user.id}`) || '{"current": 0}');
    const todaysQuoteCount = JSON.parse(localStorage.getItem(`todaysQuoteCount_${user.id}`) || '1');

    setStats({
      karmaPoints,
      streak: dailyStreak,
      savedQuotes,
      completedTasks
    });
  };

  const loadDetailedData = () => {
    if (!user) return;

    const savedQuotes = JSON.parse(localStorage.getItem(`savedQuotes_${user.id}`) || '[]');
    const tasks = JSON.parse(localStorage.getItem(`karmaTasks_${user.id}`) || '[]');
    const karmaHistory = JSON.parse(localStorage.getItem(`karmaHistory_${user.id}`) || '[]');

    setDetailedData({
      savedQuotes,
      tasks,
      karmaHistory
    });
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/signin");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    loadProfile();
    toast.success("Welcome to Gita Wisdom! Your profile is now set up.");
  };

  const handleStatClick = (statType: string) => {
    setShowDetailedView(statType);
  };

  const handleBackToProfile = () => {
    setShowDetailedView(null);
  };

  const formatJoinedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If date is invalid, use user creation date or current date
        const fallbackDate = user?.created_at ? new Date(user.created_at) : new Date();
        return fallbackDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (showProfileSetup) {
    return <ProfileSetup onComplete={handleProfileSetupComplete} />;
  }

  if (!profile) {
    return (
      <div className="container max-w-md mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Profile...</h1>
        </div>
      </div>
    );
  }

  // Detailed view for stats
  if (showDetailedView) {
    return (
      <div className="container max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToProfile}
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {showDetailedView === 'streak' && 'Day Streak'}
            {showDetailedView === 'karmaPoints' && 'Karma Points'}
            {showDetailedView === 'savedQuotes' && 'Saved Quotes'}
            {showDetailedView === 'completedTasks' && 'Completed Tasks'}
          </h1>
        </div>

        {showDetailedView === 'streak' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Flame className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                <h2 className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                  {stats.streak} Days
                </h2>
                <p className="text-muted-foreground">Current streak of daily check-ins</p>
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Keep checking in daily to maintain your streak!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showDetailedView === 'karmaPoints' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                  {stats.karmaPoints} Points
                </h2>
                <p className="text-muted-foreground">Total karma earned</p>
              </div>
              {detailedData.karmaHistory.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Activity</h3>
                  {detailedData.karmaHistory.slice(-10).reverse().map((entry: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">{entry.action || 'Daily check-in'}</span>
                      <span className="font-semibold text-yellow-600">+{entry.points || 10}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Start your spiritual journey to earn karma points!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {showDetailedView === 'savedQuotes' && (
          <div className="space-y-4">
            {detailedData.savedQuotes.length > 0 ? (
              detailedData.savedQuotes.map((quote: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="font-semibold mb-2 text-primary">
                      "{quote.translation || quote.text || quote.verse}"
                    </p>
                    <div className="text-sm text-muted-foreground mb-2">
                      <p>Chapter {quote.chapter}, Verse {quote.verse_number}</p>
                      {quote.source && <p className="italic">- {quote.source}</p>}
                    </div>
                    {quote.explanation && (
                      <p className="text-xs text-muted-foreground italic mt-2 p-2 bg-muted rounded">
                        {quote.explanation}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <BookMarked className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No saved quotes yet. Start saving quotes from your daily wisdom!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {showDetailedView === 'completedTasks' && (
          <div className="space-y-4">
            {detailedData.tasks.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="bg-green-50 dark:bg-green-950/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {detailedData.tasks.filter((task: any) => task.completed).length}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-950/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {detailedData.tasks.filter((task: any) => !task.completed).length}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Pending</p>
                    </CardContent>
                  </Card>
                </div>
                {detailedData.tasks.map((task: any, index: number) => (
                  <Card key={index} className={task.completed ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${task.completed ? 'line-through text-green-700 dark:text-green-300' : ''}`}>
                            {task.task || task.title || 'Spiritual Task'}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <Badge variant={task.completed ? 'default' : 'secondary'}>
                          {task.completed ? 'Done' : 'Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No tasks yet. Visit the Karma dashboard to start your spiritual tasks!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/edit-profile")}
          aria-label="Edit profile"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              {profile.avatarUrl && !profile.avatarUrl.includes('placeholder') ? (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              ) : (
                <AvatarFallback className="text-lg font-bold bg-black text-white">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
              {profile.phone && (
                <p className="text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </p>
              )}
              <Badge variant="secondary" className="mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                Joined {formatJoinedDate(profile.createdAt)}
              </Badge>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-4 p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground italic">"{profile.bio}"</p>
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full mt-4" 
            onClick={() => navigate("/edit-profile")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards - Updated to reflect real-time data */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800/50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('streak')}
        >
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.streak}</p>
            <p className="text-sm text-orange-600 dark:text-orange-400">Day Streak</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800/50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('karmaPoints')}
        >
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.karmaPoints}</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Karma Points</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800/50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('savedQuotes')}
        >
          <CardContent className="p-4 text-center">
            <BookMarked className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.savedQuotes}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Saved Quotes</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800/50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('completedTasks')}
        >
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completedTasks}</p>
            <p className="text-sm text-green-600 dark:text-green-400">Tasks Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/karma-detailed")}
        >
          <Trophy className="h-4 w-4 mr-2" />
          View Karma Dashboard
        </Button>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/chat")}
        >
          <BookMarked className="h-4 w-4 mr-2" />
          Continue Spiritual Journey
        </Button>
      </div>

      {/* Sign Out Button */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-4">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              "Signing out..."
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
