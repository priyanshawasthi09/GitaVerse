
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, MoonStar, Settings, ArrowUpRight, Zap } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeHeaderProps {
  currentDate: Date;
  dailyStreak: number;
  onToggleTheme: () => void;
  onShowSettings: () => void;
}

export default function WelcomeHeader({ 
  currentDate, 
  dailyStreak, 
  onToggleTheme, 
  onShowSettings 
}: WelcomeHeaderProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const getGreetingMessage = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌙";
  };

  const formattedDate = format(currentDate, "EEEE, MMMM d");

  return (
    <div className="slate-gradient sophisticated-border p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">
              <span>Gita Wisdom</span>
              <span className="ml-2 text-primary">ॐ</span>
            </h1>
            {user && (
              <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full sophisticated-border">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{dailyStreak}</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm font-medium">{getGreetingMessage()}</p>
          <p className="text-muted-foreground/80 text-xs">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleTheme} className="sophisticated-hover">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onShowSettings} className="sophisticated-hover">
            <Settings className="h-4 w-4" />
          </Button>
          {user && (
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="sophisticated-hover">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
