
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, MoonStar, Globe, ChevronLeft, BookOpen, ChevronRight, Bell, Volume2, VolumeX, Type, Eye, Heart, Calendar, Moon, Sunrise, Timer, Languages, Palette, Shield, Download, Share2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SettingsMenuProps {
  onClose: () => void;
}

interface Chapter {
  id: number;
  title: string;
  verses: number;
  content?: string;
}

interface Translation {
  id: string;
  name: string;
  language: string;
  author: string;
  description: string;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  // Settings state
  const [selectedTranslation, setSelectedTranslation] = useState<string>('swamiPrabhupada');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number[]>([16]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [dailyReminders, setDailyReminders] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [weeklyGoals, setWeeklyGoals] = useState<boolean>(false);
  const [darkModeSchedule, setDarkModeSchedule] = useState<string>('manual');
  const [readingSpeed, setReadingSpeed] = useState<number[]>([1]);
  const [favoriteQuotes, setFavoriteQuotes] = useState<boolean>(true);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);

  const translations: Translation[] = [
    {
      id: 'swamiPrabhupada',
      name: 'Bhagavad Gita As It Is',
      language: 'English',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'The most widely read translation with detailed purports'
    },
    {
      id: 'swamiMukundananda',
      name: 'Bhagavad Gita - The Song of God',
      language: 'English',
      author: 'Swami Mukundananda',
      description: 'Modern translation with practical insights'
    },
    {
      id: 'swamiChinmayananda',
      name: 'The Holy Geeta',
      language: 'English',
      author: 'Swami Chinmayananda',
      description: 'Classic commentary with philosophical depth'
    }
  ];

  const chapters: Chapter[] = [
    {
      id: 1,
      title: 'Arjuna Vishada Yoga',
      verses: 47,
      content: "Dhritarashtra said: O Sanjaya, after my sons and the sons of Pandu assembled in the place of pilgrimage at Kurukshetra, desiring to fight, what did they do?\n\nSanjaya said: O King, after looking over the army arranged in military formation by the sons of Pandu, King Duryodhana went to his teacher and spoke the following words..."
    },
    {
      id: 2,
      title: 'Sankhya Yoga',
      verses: 72,
      content: "Sanjaya said: Seeing Arjuna full of compassion, his mind depressed, his eyes full of tears, Madhusudana, Krishna, spoke the following words.\n\nThe Supreme Personality of Godhead said: My dear Arjuna, how have these impurities come upon you? They are not at all befitting a man who knows the value of life. They lead not to higher planets but to infamy..."
    }
  ];

  const handleReadChapter = (chapter: Chapter) => {
    setIsLoading(true);
    setSelectedChapter(chapter);
    setIsReadingMode(true);

    setTimeout(() => {
      setIsLoading(false);
      if (soundEnabled) {
        const bell = new Audio('/sounds/meditation-bell.mp3');
        bell.volume = 0.3;
        bell.play().catch(e => console.log('Audio play failed:', e));
      }
    }, 1000);
  };

  const closeReadingMode = () => {
    setIsReadingMode(false);
    setSelectedChapter(null);
  };

  const handleSettingChange = (setting: string, value: any) => {
    // Save settings to localStorage
    localStorage.setItem(`setting_${setting}`, JSON.stringify(value));
    toast.success(`${setting} updated successfully`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      {isReadingMode && selectedChapter ? (
        <div className="w-full max-w-md bg-background rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Chapter {selectedChapter.id}: {selectedChapter.title}</h1>
            <Button variant="ghost" size="sm" onClick={closeReadingMode}>
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-[70vh]">
              <LoadingSpinner size={40} />
            </div>
          ) : (
            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{selectedChapter.verses} verses</span>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none" style={{ fontSize: `${fontSize[0]}px` }}>
                {selectedChapter.content?.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-sm">ॐ</span>
                </div>
                {t('settings')}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Appearance Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Appearance</h3>
              </div>
              
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theme</Label>
                <RadioGroup value={theme} onValueChange={(value) => {
                  if (value !== theme) toggleTheme();
                }} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2">
                      <MoonStar className="h-4 w-4" />
                      Dark
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Auto Dark Mode */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Auto Dark Mode</Label>
                <Select value={darkModeSchedule} onValueChange={setDarkModeSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="sunset">Sunset to Sunrise</SelectItem>
                    <SelectItem value="system">Follow System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Font Size: {fontSize[0]}px</Label>
                <div className="flex items-center space-x-4">
                  <Type className="h-4 w-4" />
                  <Slider
                    value={fontSize}
                    onValueChange={(value) => {
                      setFontSize(value);
                      handleSettingChange('fontSize', value[0]);
                    }}
                    max={24}
                    min={12}
                    step={2}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-8">24px</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Language & Region */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Language & Region</h3>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('language')}</Label>
                <RadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi')} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="en" />
                    <Label htmlFor="en">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hi" id="hi" />
                    <Label htmlFor="hi">हिंदी (Hindi)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Translation Preference */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preferred Translation</Label>
                <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {translations.map((translation) => (
                      <SelectItem key={translation.id} value={translation.id}>
                        <div className="flex flex-col">
                          <span>{translation.name}</span>
                          <span className="text-xs text-muted-foreground">{translation.author}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Audio & Sound */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Audio & Sound</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">Bell sounds and audio feedback</p>
                </div>
                <Switch 
                  checked={soundEnabled} 
                  onCheckedChange={(checked) => {
                    setSoundEnabled(checked);
                    handleSettingChange('soundEnabled', checked);
                  }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Auto-play Audio</Label>
                  <p className="text-xs text-muted-foreground">Automatically play verse recitations</p>
                </div>
                <Switch 
                  checked={autoPlay} 
                  onCheckedChange={(checked) => {
                    setAutoPlay(checked);
                    handleSettingChange('autoPlay', checked);
                  }} 
                />
              </div>

              {/* Reading Speed */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Reading Speed: {readingSpeed[0]}x</Label>
                <Slider
                  value={readingSpeed}
                  onValueChange={(value) => {
                    setReadingSpeed(value);
                    handleSettingChange('readingSpeed', value[0]);
                  }}
                  max={2}
                  min={0.5}
                  step={0.25}
                  className="flex-1"
                />
              </div>
            </div>

            <Separator />

            {/* Notifications & Reminders */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('dailyReminders')}</Label>
                  <p className="text-xs text-muted-foreground">{t('receiveDailyWisdom')}</p>
                </div>
                <Switch 
                  checked={dailyReminders} 
                  onCheckedChange={(checked) => {
                    setDailyReminders(checked);
                    handleSettingChange('dailyReminders', checked);
                  }} 
                />
              </div>

              {dailyReminders && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Reminder Time</Label>
                  <div className="flex items-center gap-2">
                    <Sunrise className="h-4 w-4 text-muted-foreground" />
                    <Select value={reminderTime} onValueChange={setReminderTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM - Morning</SelectItem>
                        <SelectItem value="09:00">9:00 AM - Mid Morning</SelectItem>
                        <SelectItem value="12:00">12:00 PM - Noon</SelectItem>
                        <SelectItem value="18:00">6:00 PM - Evening</SelectItem>
                        <SelectItem value="21:00">9:00 PM - Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Weekly Goals</Label>
                  <p className="text-xs text-muted-foreground">Set and track spiritual goals</p>
                </div>
                <Switch 
                  checked={weeklyGoals} 
                  onCheckedChange={(checked) => {
                    setWeeklyGoals(checked);
                    handleSettingChange('weeklyGoals', checked);
                  }} 
                />
              </div>
            </div>

            <Separator />

            {/* Reading Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Reading</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Auto-save Favorites</Label>
                  <p className="text-xs text-muted-foreground">Automatically save liked quotes</p>
                </div>
                <Switch 
                  checked={favoriteQuotes} 
                  onCheckedChange={(checked) => {
                    setFavoriteQuotes(checked);
                    handleSettingChange('favoriteQuotes', checked);
                  }} 
                />
              </div>

              {/* Quick Access to Chapters */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Chapter Access</Label>
                <div className="grid grid-cols-2 gap-2">
                  {chapters.slice(0, 4).map((chapter) => (
                    <Button
                      key={chapter.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleReadChapter(chapter)}
                      className="text-xs"
                    >
                      Ch. {chapter.id}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy & Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Privacy & Data</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Privacy Mode</Label>
                  <p className="text-xs text-muted-foreground">Hide reading history and stats</p>
                </div>
                <Switch 
                  checked={privacyMode} 
                  onCheckedChange={(checked) => {
                    setPrivacyMode(checked);
                    handleSettingChange('privacyMode', checked);
                  }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share App
                </Button>
              </div>
            </div>

            <Separator />

            {/* App Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Gita Wisdom App</p>
              <p className="text-xs text-muted-foreground">Version 2.1.0 • Made with ❤️</p>
              <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">About</Button>
                <span>•</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">Privacy</Button>
                <span>•</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
