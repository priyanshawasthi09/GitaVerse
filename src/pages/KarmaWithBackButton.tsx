import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Users, CheckCircle2, Plus, ArrowLeft } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Task {
  id: string;
  title: string;
  karmaPoints: number;
  completed: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  karmaPoints: number;
  rank: number;
}

export default function KarmaWithBackButton() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('karmaStreak');
    return saved ? JSON.parse(saved) : 0;
  });
  const [karmaPoints, setKarmaPoints] = useState(() => {
    const saved = localStorage.getItem('karmaPoints');
    return saved ? JSON.parse(saved) : 0;
  });
  const [lastAction, setLastAction] = useState(() => {
    const saved = localStorage.getItem('lastKarmaAction');
    return saved ? new Date(JSON.parse(saved)) : null;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('karmaTasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Chant Hare Krishna Maha-mantra', karmaPoints: 108, completed: false },
      { id: '2', title: 'Read Bhagavad Gita (1 chapter)', karmaPoints: 50, completed: false },
      { id: '3', title: 'Help someone in need', karmaPoints: 30, completed: false },
      { id: '4', title: 'Offer food to Krishna', karmaPoints: 25, completed: false },
      { id: '5', title: 'Practice meditation', karmaPoints: 20, completed: false }
    ];
  });
  const [newTask, setNewTask] = useState({ title: '', karmaPoints: 0 });
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Radha D.', karmaPoints: 1008, rank: 1 },
    { id: '2', name: 'Krishna P.', karmaPoints: 864, rank: 2 },
    { id: '3', name: 'Arjuna M.', karmaPoints: 756, rank: 3 },
    { id: '4', name: 'You', karmaPoints: karmaPoints, rank: 4 },
    { id: '5', name: 'Bhima S.', karmaPoints: 432, rank: 5 }
  ]);

  useEffect(() => {
    localStorage.setItem('karmaStreak', JSON.stringify(streak));
    localStorage.setItem('karmaPoints', JSON.stringify(karmaPoints));
    localStorage.setItem('lastKarmaAction', JSON.stringify(lastAction));
    localStorage.setItem('karmaTasks', JSON.stringify(tasks));
  }, [streak, karmaPoints, lastAction, tasks]);

  const handleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && !task.completed) {
          setKarmaPoints(prev => prev + task.karmaPoints);
          return { ...task, completed: true };
        }
        return task;
      })
    );
    
    const now = new Date();
    if (!lastAction) {
      setStreak(1);
      setLastAction(now);
    } else {
      const lastActionDate = new Date(lastAction);
      const timeDiff = now.getTime() - lastActionDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        setStreak(prev => prev + 1);
        setLastAction(now);
      } else if (daysDiff > 1) {
        setStreak(1);
        setLastAction(now);
      }
    }
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.karmaPoints > 0) {
      setTasks(prev => [...prev, {
        id: Date.now().toString(),
        title: newTask.title,
        karmaPoints: newTask.karmaPoints,
        completed: false
      }]);
      setNewTask({ title: '', karmaPoints: 0 });
    }
  };

  const resetDailyTasks = () => {
    const now = new Date();
    const lastActionDate = lastAction ? new Date(lastAction) : null;
    
    if (!lastActionDate || now.toDateString() !== lastActionDate.toDateString()) {
      setTasks(prev => prev.map(task => ({ ...task, completed: false })));
    }
  };

  useEffect(() => {
    resetDailyTasks();
  }, []);

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('karma')}</h1>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-2xl font-bold">{karmaPoints}</span>
            <span className="text-sm text-muted-foreground">karma</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daily Tasks</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Karma Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={newTask.karmaPoints}
                    onChange={(e) => setNewTask(prev => ({ ...prev, karmaPoints: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter karma points"
                  />
                </div>
                <Button onClick={handleAddTask} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTaskCompletion(task.id)}
                    disabled={task.completed}
                  >
                    <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.title}
                  </span>
                </div>
                <span className="text-sm font-medium">+{task.karmaPoints}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Local Leaderboard</h2>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  entry.name === 'You' ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-6">{entry.rank}</span>
                  <span>{entry.name}</span>
                </div>
                <span className="font-medium">{entry.karmaPoints}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
