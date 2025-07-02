import React, { useState, useEffect } from "react";
import { toast } from 'sonner';
import { format, startOfWeek, endOfWeek, isWithinInterval, addDays, differenceInDays, getDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import KarmaPreview from "@/components/KarmaPreview";
import { useTheme } from "@/hooks/use-theme";
import { SettingsMenu } from "@/components/SettingsMenu";
import { gurbaniQuotes } from "@/data/gurbaniQuotes";
import { additionalWisdomQuotes } from "@/data/additionalWisdom";
import { sampleQuotes } from "@/data/sampleQuotes";
import { useAuth } from '@/contexts/AuthContext';
import WelcomeHeader from "@/components/home/WelcomeHeader";
import WelcomeCard from "@/components/home/WelcomeCard";
import DailyCheckin from "@/components/home/DailyCheckin";
import DailyWisdomSection from "@/components/home/DailyWisdomSection";
import JourneySection from "@/components/home/JourneySection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowUpRight, Sun, MoonStar, Settings } from "lucide-react";

interface DailyQuote {
  text: string;
  author: string;
  date: string;
  translation?: string;
  source?: string;
}

interface GitaQuote {
  verse: string;
  translation: string;
  chapter: number;
  verse_number: number;
  explanation: string;
}

interface WeeklyGoal {
  current: number;
  target: number;
  weekStart: string;
  checkedDays: string[];
  currentDayOfWeek: number;
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const [quote, setQuote] = useState<GitaQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();

  // Helper functions
  const getCurrentWeekStart = () => {
    return format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  };

  const getCurrentDayOfWeek = () => {
    const day = getDay(currentDate);
    return day === 0 ? 7 : day;
  };

  const checkStreakValidity = (lastCheckinDate: string | null): number => {
    if (!lastCheckinDate) return 0;
    
    const lastCheckin = new Date(lastCheckinDate);
    const today = new Date();
    const daysDifference = differenceInDays(today, lastCheckin);
    
    return daysDifference > 1 ? 0 : JSON.parse(localStorage.getItem(`dailyStreak_${user?.id}`) || '0');
  };

  // State management
  const [dailyStreak, setDailyStreak] = useState(() => {
    if (!user) return 7;
    const lastCheckinKey = `lastCheckin_${user.id}`;
    const lastCheckin = localStorage.getItem(lastCheckinKey);
    return checkStreakValidity(lastCheckin);
  });
  
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal>(() => {
    if (!user) return { 
      current: getCurrentDayOfWeek() - 1,
      target: 7, 
      weekStart: getCurrentWeekStart(), 
      checkedDays: [],
      currentDayOfWeek: getCurrentDayOfWeek()
    };
    
    const saved = localStorage.getItem(`weeklyGoal_${user.id}`);
    const currentWeekStart = getCurrentWeekStart();
    const currentDayOfWeek = getCurrentDayOfWeek();
    
    if (saved) {
      const parsedGoal = JSON.parse(saved);
      if (parsedGoal.weekStart !== currentWeekStart) {
        return { 
          current: 0, 
          target: 7, 
          weekStart: currentWeekStart, 
          checkedDays: [],
          currentDayOfWeek
        };
      }
      return { ...parsedGoal, currentDayOfWeek };
    }
    
    return { 
      current: 0, 
      target: 7, 
      weekStart: currentWeekStart, 
      checkedDays: [],
      currentDayOfWeek
    };
  });
  
  const [showMotivation, setShowMotivation] = useState(false);
  
  const [todaysQuoteCount, setTodaysQuoteCount] = useState(() => {
    if (!user) return 1;
    const saved = localStorage.getItem(`todaysQuoteCount_${user.id}`);
    return saved ? JSON.parse(saved) : 1;
  });

  // Save data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`dailyStreak_${user.id}`, JSON.stringify(dailyStreak));
      localStorage.setItem(`weeklyGoal_${user.id}`, JSON.stringify(weeklyGoal));
      localStorage.setItem(`todaysQuoteCount_${user.id}`, JSON.stringify(todaysQuoteCount));
      
      const existingKarma = localStorage.getItem(`karmaPoints_${user.id}`);
      if (!existingKarma) {
        localStorage.setItem(`karmaPoints_${user.id}`, JSON.stringify(0));
      }
      
      window.dispatchEvent(new CustomEvent('statsUpdated'));
    }
  }, [dailyStreak, weeklyGoal, todaysQuoteCount, user]);

  // Check and update weekly goal
  useEffect(() => {
    const currentWeekStart = getCurrentWeekStart();
    const currentDayOfWeek = getCurrentDayOfWeek();
    
    if (user) {
      if (weeklyGoal.weekStart !== currentWeekStart) {
        const newWeeklyGoal = { 
          current: 0, 
          target: 7, 
          weekStart: currentWeekStart, 
          checkedDays: [],
          currentDayOfWeek
        };
        setWeeklyGoal(newWeeklyGoal);
      } else if (weeklyGoal.currentDayOfWeek !== currentDayOfWeek) {
        setWeeklyGoal(prev => ({ ...prev, currentDayOfWeek }));
      }
      
      const lastCheckinKey = `lastCheckin_${user.id}`;
      const lastCheckin = localStorage.getItem(lastCheckinKey);
      const validStreak = checkStreakValidity(lastCheckin);
      if (validStreak !== dailyStreak) {
        setDailyStreak(validStreak);
      }
    } else {
      setWeeklyGoal(prev => ({ 
        ...prev, 
        current: currentDayOfWeek - 1, 
        currentDayOfWeek,
        weekStart: currentWeekStart
      }));
    }
  }, [user, currentDate]);

  useEffect(() => {
    setTimeout(() => {
      setQuote({
        verse: "The mind is everything. What you think you become.",
        translation: "मन एव मनुष्याणां कारणं बन्धमोक्षयोः",
        chapter: 6,
        verse_number: 5,
        explanation: "The mind is the cause of both bondage and liberation."
      });
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = async () => {
    setIsRefreshing(true);
    
    const gitaQuotes = sampleQuotes.map(quote => ({
      text: quote.translation,
      author: `Bhagavad Gita ${quote.chapter}:${quote.verse_number}`,
      date: new Date().toISOString(),
      translation: quote.verse,
      source: quote.explanation
    }));

    const formattedGurbaniQuotes = gurbaniQuotes.map(quote => ({
      text: quote.text,
      translation: quote.translation,
      author: quote.author,
      source: quote.source,
      date: new Date().toISOString()
    }));

    const formattedWisdomQuotes = additionalWisdomQuotes.map(quote => ({
      text: quote.text,
      translation: quote.translation,
      author: quote.author,
      source: quote.source,
      date: new Date().toISOString()
    }));

    const inspirationalQuotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        date: new Date().toISOString(),
        source: "Stanford Commencement Speech"
      },
      {
        text: "In the midst of winter, I found there was, within me, an invincible summer.",
        author: "Albert Camus",
        date: new Date().toISOString(),
        source: "The Stranger"
      },
      {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        date: new Date().toISOString(),
        source: "Ancient Wisdom"
      },
      {
        text: "What we think, we become.",
        author: "Buddha",
        date: new Date().toISOString(),
        source: "Buddhist Teaching"
      },
      {
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
        date: new Date().toISOString(),
        source: "Literary Wisdom"
      },
      {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        date: new Date().toISOString(),
        source: "Tao Te Ching"
      },
      {
        text: "Darkness cannot drive out darkness; only light can do that.",
        author: "Martin Luther King Jr.",
        date: new Date().toISOString(),
        source: "Civil Rights Wisdom"
      },
      {
        text: "Yesterday is history, tomorrow is a mystery, today is a gift.",
        author: "Eleanor Roosevelt",
        date: new Date().toISOString(),
        source: "Inspirational Wisdom"
      }
    ];

    const allQuotes = [...gitaQuotes, ...formattedGurbaniQuotes, ...formattedWisdomQuotes, ...inspirationalQuotes];
    
    const quoteKey = user ? `dailyQuote_${user.id}` : 'dailyQuote_guest';
    const savedQuote = localStorage.getItem(quoteKey);
    const today = new Date().toDateString();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (savedQuote) {
      const parsedQuote = JSON.parse(savedQuote);
      if (new Date(parsedQuote.date).toDateString() === today) {
        setDailyQuote(parsedQuote);
        setIsRefreshing(false);
        setIsLoading(false);
        return;
      }
    }
    
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setDailyQuote(randomQuote);
    localStorage.setItem(quoteKey, JSON.stringify(randomQuote));
    setIsRefreshing(false);
    setIsLoading(false);
  };

  const handleSaveQuote = () => {
    if (dailyQuote) {
      const quoteText = dailyQuote.translation 
        ? `${dailyQuote.text}\n\n${dailyQuote.translation}`
        : dailyQuote.text;
      
      if (user) {
        const savedQuotes = JSON.parse(localStorage.getItem(`savedQuotes_${user.id}`) || '[]');
        savedQuotes.push({
          id: Date.now().toString(),
          text: quoteText,
          source: dailyQuote.source || `${dailyQuote.author}`,
          date: new Date().toISOString()
        });
        localStorage.setItem(`savedQuotes_${user.id}`, JSON.stringify(savedQuotes));
        
        const currentKarma = JSON.parse(localStorage.getItem(`karmaPoints_${user.id}`) || '0');
        const newKarma = currentKarma + 5;
        localStorage.setItem(`karmaPoints_${user.id}`, JSON.stringify(newKarma));
        
        const karmaHistory = JSON.parse(localStorage.getItem(`karmaHistory_${user.id}`) || '[]');
        karmaHistory.push({
          action: 'Saved Quote',
          points: 5,
          date: new Date().toISOString()
        });
        localStorage.setItem(`karmaHistory_${user.id}`, JSON.stringify(karmaHistory));
        
        window.dispatchEvent(new CustomEvent('statsUpdated'));
      } else {
        toast.info('Sign in to save quotes permanently', {
          description: "Your quotes will be saved to your profile",
        });
        return;
      }
      
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 2000);
      toast.success(t('quoteSaved') + ' ✨ (+5 karma)', {
        description: "Keep collecting wisdom!",
      });
    }
  };

  const handleShareQuote = () => {
    if (!dailyQuote) return;
    
    const quoteText = dailyQuote.translation 
      ? `${dailyQuote.text}\n\n${dailyQuote.translation}\n\n~ ${dailyQuote.author}`
      : `${dailyQuote.text}\n\n~ ${dailyQuote.author}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Daily Wisdom from ${dailyQuote.author}`,
        text: quoteText,
        url: window.location.href
      }).catch(() => {
        toast.error(t('shareFailed'));
      });
    } else {
      navigator.clipboard.writeText(quoteText);
      toast.success(t('quoteCopied'));
    }
  };

  const refreshQuote = async () => {
    setDailyQuote(null);
    const quoteKey = user ? `dailyQuote_${user.id}` : 'dailyQuote_guest';
    localStorage.removeItem(quoteKey);
    
    if (user) {
      const newCount = todaysQuoteCount + 1;
      setTodaysQuoteCount(newCount);
    }
    
    await loadDailyQuote();
    toast.success(t('quoteRefreshed') + ' 🔄', {
      description: user ? `Quote #${todaysQuoteCount + 1} for today` : 'New quote loaded',
    });
  };

  const handleDailyCheckin = () => {
    if (!user) {
      toast.info('Sign in to track your daily progress', {
        description: "Create an account to save your streak",
      });
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const currentWeekStart = getCurrentWeekStart();
    const currentDayOfWeek = getCurrentDayOfWeek();
    
    if (weeklyGoal.checkedDays.includes(today)) {
      toast.success(`Already checked in today! Day ${currentDayOfWeek}/7 ✅`, {
        description: "Come back tomorrow to continue your streak!",
      });
      return;
    }

    let updatedWeeklyGoal = weeklyGoal;
    if (weeklyGoal.weekStart !== currentWeekStart) {
      updatedWeeklyGoal = { 
        current: 0, 
        target: 7, 
        weekStart: currentWeekStart, 
        checkedDays: [],
        currentDayOfWeek
      };
    }

    const lastCheckinKey = `lastCheckin_${user.id}`;
    const lastCheckin = localStorage.getItem(lastCheckinKey);
    let newStreak = dailyStreak;

    if (lastCheckin) {
      const lastCheckinDate = new Date(lastCheckin);
      const todayDate = new Date();
      const daysDifference = differenceInDays(todayDate, lastCheckinDate);
      
      if (daysDifference === 1) {
        newStreak = dailyStreak + 1;
      } else if (daysDifference > 1) {
        newStreak = 1;
      } else if (daysDifference === 0) {
        return;
      }
    } else {
      newStreak = 1;
    }

    setDailyStreak(newStreak);
    localStorage.setItem(lastCheckinKey, today);
    
    const newWeeklyGoal = {
      ...updatedWeeklyGoal,
      current: updatedWeeklyGoal.current + 1,
      checkedDays: [...updatedWeeklyGoal.checkedDays, today],
      currentDayOfWeek
    };
    setWeeklyGoal(newWeeklyGoal);
    
    const currentKarma = JSON.parse(localStorage.getItem(`karmaPoints_${user.id}`) || '0');
    const karmaBonus = newStreak >= 7 ? 15 : 10;
    const newKarma = currentKarma + karmaBonus;
    localStorage.setItem(`karmaPoints_${user.id}`, JSON.stringify(newKarma));
    
    const karmaHistory = JSON.parse(localStorage.getItem(`karmaHistory_${user.id}`) || '[]');
    karmaHistory.push({
      action: `Daily Check-in (Day ${newStreak})`,
      points: karmaBonus,
      date: new Date().toISOString()
    });
    localStorage.setItem(`karmaHistory_${user.id}`, JSON.stringify(karmaHistory));
    
    window.dispatchEvent(new CustomEvent('statsUpdated'));
    
    toast.success(`Day ${newStreak} streak! 🔥 (+${karmaBonus} karma)`, {
      description: `Week progress: ${newWeeklyGoal.current}/${newWeeklyGoal.target} - Today is ${currentDayOfWeek}/7`,
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span>Gita Wisdom</span>
              <span className="ml-2 text-amber-900">ॐ</span>
            </h1>
            <p className="text-muted-foreground">{format(currentDate, "EEEE, MMMM d")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            {!user && (
              <Button variant="outline" size="icon" onClick={() => navigate('/signin')}>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {!user && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-amber-900 dark:text-amber-100">Welcome</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Sign in to track your progress</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/signin')} className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/30">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Daily Wisdom</h2>
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800/50">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-full mb-4 bg-purple-200 dark:bg-purple-800" />
              <Skeleton className="h-4 w-3/4 bg-purple-200 dark:bg-purple-800" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Begin Your Journey</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-800/50 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/30" onClick={() => navigate('/chat')}>
              <MessageCircle className="h-6 w-6 mb-2" />
              <span className="text-lg">Chat</span>
              <span className="text-sm text-teal-600 dark:text-teal-400">Seek Guidance</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30" onClick={() => navigate('/karma')}>
              <ArrowUpRight className="h-6 w-6 mb-2" />
              <span className="text-lg">Karma</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Track your actions</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!quote) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner size={40} className="text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto p-4 space-y-6 bg-gradient-to-b from-background to-slate-50/50 dark:to-slate-900/50 min-h-screen">
      <WelcomeHeader 
        currentDate={currentDate}
        dailyStreak={dailyStreak}
        onToggleTheme={toggleTheme}
        onShowSettings={() => setShowSettings(true)}
      />

      {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} />}

      {!user && <WelcomeCard />}

      {user && (
        <DailyCheckin 
          weeklyGoal={weeklyGoal}
          currentDate={currentDate}
          onDailyCheckin={handleDailyCheckin}
        />
      )}

      {user && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Karma Tracker</h2>
          <KarmaPreview />
        </div>
      )}

      <DailyWisdomSection 
        dailyQuote={dailyQuote}
        isRefreshing={isRefreshing}
        showMotivation={showMotivation}
        todaysQuoteCount={todaysQuoteCount}
        onSaveQuote={handleSaveQuote}
        onShareQuote={handleShareQuote}
        onRefreshQuote={refreshQuote}
        user={user}
      />

      <JourneySection />
    </div>
  );
}
