import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

interface Practice {
  id: string;
  name: string;
  completed: boolean;
  date: string;
}

export default function DailyPractice() {
  const { t } = useLanguage();
  const [practices, setPractices] = useState<Practice[]>([]);
  const [newPracticeName, setNewPracticeName] = useState('');

  useEffect(() => {
    const savedPractices = localStorage.getItem('practices');
    if (savedPractices) {
      setPractices(JSON.parse(savedPractices));
    }
  }, []);

  const addPractice = () => {
    if (newPracticeName.trim()) {
      const newPractice: Practice = {
        id: Date.now().toString(),
        name: newPracticeName,
        completed: false,
        date: new Date().toISOString()
      };
      const updatedPractices = [...practices, newPractice];
      setPractices(updatedPractices);
      localStorage.setItem('practices', JSON.stringify(updatedPractices));
      setNewPracticeName('');
      toast.success(t('practiceAdded'));
    }
  };

  const deletePractice = (id: string) => {
    const updatedPractices = practices.filter(practice => practice.id !== id);
    setPractices(updatedPractices);
    localStorage.setItem('practices', JSON.stringify(updatedPractices));
    toast.success(t('practiceDeleted'));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('dailyPractice')}</h1>
      
      <div className="mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('addPractice')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addPractice')}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder={t('practiceName')}
                value={newPracticeName}
                onChange={(e) => setNewPracticeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPractice()}
              />
              <Button onClick={addPractice}>{t('add')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {practices.map((practice) => (
          <div
            key={practice.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <span className={practice.completed ? 'line-through text-muted-foreground' : ''}>
                {practice.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deletePractice(practice.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 