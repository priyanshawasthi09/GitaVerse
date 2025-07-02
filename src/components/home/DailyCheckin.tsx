
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Target } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

interface WeeklyGoal {
  current: number;
  target: number;
  weekStart: string;
  checkedDays: string[];
  currentDayOfWeek: number;
}

interface DailyCheckinProps {
  weeklyGoal: WeeklyGoal;
  currentDate: Date;
  onDailyCheckin: () => void;
}

export default function DailyCheckin({ weeklyGoal, currentDate, onDailyCheckin }: DailyCheckinProps) {
  const getDayName = (dayNum: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNum] || '';
  };

  const getWeekProgress = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
  };

  const isCheckedInToday = weeklyGoal.checkedDays.includes(format(new Date(), 'yyyy-MM-dd'));

  return (
    <Card className="warm-gradient sophisticated-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Daily Check-in</h3>
              <p className="text-sm text-muted-foreground">
                Today: {getDayName(weeklyGoal.currentDayOfWeek)} ({weeklyGoal.currentDayOfWeek}/7)
              </p>
            </div>
          </div>
          <Button 
            onClick={onDailyCheckin}
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            disabled={isCheckedInToday}
          >
            <Gift className="h-4 w-4 mr-1" />
            {isCheckedInToday ? 'Done' : 'Check-in'}
          </Button>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Target className="h-3 w-3" />
              Weekly Goal ({getWeekProgress()})
            </span>
            <span className="text-foreground font-medium">{weeklyGoal.current}/{weeklyGoal.target}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground">
            {weeklyGoal.current === weeklyGoal.target ? 
              "🎉 Weekly goal completed!" : 
              `${weeklyGoal.target - weeklyGoal.current} more check-ins to complete this week`
            }
          </div>
          
          <div className="flex justify-between mt-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              const dayNumber = index + 1;
              const isToday = dayNumber === weeklyGoal.currentDayOfWeek;
              const dayDate = format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), index), 'yyyy-MM-dd');
              const isChecked = weeklyGoal.checkedDays.includes(dayDate);
              
              return (
                <div 
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isChecked 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : isToday 
                        ? 'bg-primary/20 text-primary border-2 border-primary/50' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
