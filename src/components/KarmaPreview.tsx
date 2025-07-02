
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function KarmaPreview() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [streak, setStreak] = useState(() => {
    if (!user) return 0;
    const saved = localStorage.getItem(`dailyStreak_${user.id}`); // Changed to match Home component
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [karmaPoints, setKarmaPoints] = useState(() => {
    if (!user) return 0;
    const saved = localStorage.getItem(`karmaPoints_${user.id}`);
    return saved ? JSON.parse(saved) : 0;
  });

  // Update stats when user changes or when triggered by events
  useEffect(() => {
    const updateStats = () => {
      if (user) {
        const savedStreak = localStorage.getItem(`dailyStreak_${user.id}`);
        const savedPoints = localStorage.getItem(`karmaPoints_${user.id}`);
        setStreak(savedStreak ? JSON.parse(savedStreak) : 0);
        setKarmaPoints(savedPoints ? JSON.parse(savedPoints) : 0);
      } else {
        setStreak(0);
        setKarmaPoints(0);
      }
    };

    updateStats();

    // Listen for custom events
    const handleStatsUpdate = () => updateStats();
    window.addEventListener('statsUpdated', handleStatsUpdate);

    // Set up interval to check for updates
    const interval = setInterval(updateStats, 5000);

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      clearInterval(interval);
    };
  }, [user]);

  return (
    <Card className="p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/karma-detailed')}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{t('karma')}</h2>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-xl font-bold">{streak}</span>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="text-xl font-bold">{karmaPoints}</span>
          <span className="text-xs text-muted-foreground">karma</span>
        </div>
      </div>
    </Card>
  );
}
