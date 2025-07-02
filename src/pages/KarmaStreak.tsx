import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Flame, Trophy, Star, Calendar } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function KarmaStreak() {
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Morning Meditation",
      description: "Start your day with 5 minutes of meditation",
      completed: false
    },
    {
      id: 2,
      title: "Bhagavad Gita Reading",
      description: "Read one verse from the Gita",
      completed: false
    },
    {
      id: 3,
      title: "Act of Kindness",
      description: "Perform one selfless act today",
      completed: false
    }
  ]);

  useEffect(() => {
    // Load saved data from localStorage
    const savedStreak = localStorage.getItem('karmaStreak');
    const savedLastCheckIn = localStorage.getItem('lastCheckIn');
    const savedChallenges = localStorage.getItem('dailyChallenges');

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn);
    if (savedChallenges) setDailyChallenges(JSON.parse(savedChallenges));

    // Calculate progress
    if (savedChallenges) {
      const completed = JSON.parse(savedChallenges).filter((c: Challenge) => c.completed).length;
      setProgress((completed / 3) * 100);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever values change
    localStorage.setItem('karmaStreak', streak.toString());
    localStorage.setItem('lastCheckIn', lastCheckIn || '');
    localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
  }, [streak, lastCheckIn, dailyChallenges]);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    
    if (lastCheckIn === today) {
      toast({
        title: "Already Checked In",
        description: "You've already checked in today. Come back tomorrow!",
      });
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = lastCheckIn === yesterday.toDateString();

    if (isConsecutive || !lastCheckIn) {
      setStreak(prev => prev + 1);
      toast({
        title: "Streak Updated! 🔥",
        description: `You're on a ${streak + 1} day streak!`,
      });
    } else {
      setStreak(1);
      toast({
        title: "New Streak Started",
        description: "Keep going! Consistency is key to spiritual progress.",
      });
    }

    setLastCheckIn(today);
  };

  const toggleChallenge = (id: number) => {
    setDailyChallenges(prev => {
      const updated = prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      );
      
      const completed = updated.filter(c => c.completed).length;
      setProgress((completed / 3) * 100);
      
      return updated;
    });
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <CardHeader>
          <CardTitle className="text-center">Karma Streak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <span className="text-4xl font-bold">{streak}</span>
            <p className="text-sm text-muted-foreground">Days</p>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleCheckIn}
          >
            Daily Check-in
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          
          <div className="space-y-4">
            {dailyChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="flex items-start space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-accent"
                onClick={() => toggleChallenge(challenge.id)}
              >
                <div className="flex-shrink-0">
                  {challenge.completed ? (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  ) : (
                    <Star className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${challenge.completed ? 'text-muted-foreground line-through' : ''}`}>
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
