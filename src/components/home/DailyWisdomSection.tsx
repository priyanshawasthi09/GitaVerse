
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Share2, RefreshCw, Star, Clock, Trophy, TrendingUp, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyQuote {
  text: string;
  author: string;
  date: string;
  translation?: string;
  source?: string;
}

interface DailyWisdomSectionProps {
  dailyQuote: DailyQuote | null;
  isRefreshing: boolean;
  showMotivation: boolean;
  todaysQuoteCount: number;
  onSaveQuote: () => void;
  onShareQuote: () => void;
  onRefreshQuote: () => void;
  user: any;
}

export default function DailyWisdomSection({
  dailyQuote,
  isRefreshing,
  showMotivation,
  todaysQuoteCount,
  onSaveQuote,
  onShareQuote,
  onRefreshQuote,
  user
}: DailyWisdomSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{t('dailyWisdom')}</h2>
          {user && (
            <div className="flex items-center bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full sophisticated-border">
              <Star className="h-3 w-3 text-primary mr-1" />
              <span className="text-xs font-medium text-primary">#{todaysQuoteCount}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showMotivation && (
            <div className="animate-bounce">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRefreshQuote} 
            disabled={isRefreshing}
            className="sophisticated-hover"
          >
            <RefreshCw className={`h-4 w-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card className="lavender-gradient sophisticated-border shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          {isRefreshing || !dailyQuote ? (
            <div className="flex items-center justify-center min-h-[120px]">
              <div className="text-center space-y-3">
                <LoadingSpinner size={32} className="text-primary" />
                <p className="text-sm text-muted-foreground animate-gentle-pulse">Finding your next wisdom...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full mt-1">
                  <BookMarked className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed font-medium text-foreground">{dailyQuote.text}</p>
                  {dailyQuote.translation && (
                    <p className="text-base text-muted-foreground italic border-l-4 border-primary/30 pl-4 mt-3">
                      {dailyQuote.translation}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-foreground">- {dailyQuote.author}</p>
                  {dailyQuote.source && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {dailyQuote.source}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onSaveQuote}
                    className="sophisticated-hover"
                  >
                    <BookMarked className="h-4 w-4 text-primary" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onShareQuote}
                    className="sophisticated-hover"
                  >
                    <Share2 className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {user && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="slate-gradient sophisticated-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Today's Progress</p>
                  <p className="text-lg font-bold text-foreground">{todaysQuoteCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="warm-gradient sophisticated-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Streak</p>
                  <p className="text-lg font-bold text-foreground">{user ? JSON.parse(localStorage.getItem(`dailyStreak_${user.id}`) || '0') : 0} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
