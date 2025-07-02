import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Play, Pause, BookOpen, Headphones, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';

interface Chapter {
  id: number;
  title: string;
  verses: number;
  audioUrl: string;
}

interface Translation {
  id: string;
  name: string;
  language: string;
  author: string;
  description: string;
}

const translations: Translation[] = [
  {
    id: 'swami-prabhupada',
    name: 'Bhagavad Gita As It Is',
    language: 'English',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'The most widely read translation with detailed commentary'
  },
  {
    id: 'gita-press',
    name: 'श्रीमद्भगवद्गीता',
    language: 'हिंदी',
    author: 'गीता प्रेस',
    description: 'प्रामाणिक हिंदी अनुवाद और व्याख्या'
  },
  {
    id: 'sanskrit',
    name: 'श्रीमद्भगवद्गीता',
    language: 'संस्कृतम्',
    author: 'मूल संस्कृत',
    description: 'मूल संस्कृत पाठ'
  }
];

const chapters: Chapter[] = [
  { id: 1, title: 'Arjuna Vishada Yoga', verses: 47, audioUrl: '/audio/chapter1.mp3' },
  { id: 2, title: 'Sankhya Yoga', verses: 72, audioUrl: '/audio/chapter2.mp3' },
  { id: 3, title: 'Karma Yoga', verses: 43, audioUrl: '/audio/chapter3.mp3' },
  { id: 4, title: 'Jnana Yoga', verses: 42, audioUrl: '/audio/chapter4.mp3' },
  { id: 5, title: 'Karma Sannyasa Yoga', verses: 29, audioUrl: '/audio/chapter5.mp3' },
  { id: 6, title: 'Dhyana Yoga', verses: 47, audioUrl: '/audio/chapter6.mp3' },
  { id: 7, title: 'Jnana Vijnana Yoga', verses: 30, audioUrl: '/audio/chapter7.mp3' },
  { id: 8, title: 'Akshara Brahma Yoga', verses: 28, audioUrl: '/audio/chapter8.mp3' },
  { id: 9, title: 'Raja Vidya Yoga', verses: 34, audioUrl: '/audio/chapter9.mp3' },
  { id: 10, title: 'Vibhuti Yoga', verses: 42, audioUrl: '/audio/chapter10.mp3' },
  { id: 11, title: 'Vishvarupa Darshana Yoga', verses: 55, audioUrl: '/audio/chapter11.mp3' },
  { id: 12, title: 'Bhakti Yoga', verses: 20, audioUrl: '/audio/chapter12.mp3' },
  { id: 13, title: 'Kshetra Kshetrajna Yoga', verses: 35, audioUrl: '/audio/chapter13.mp3' },
  { id: 14, title: 'Gunatraya Vibhaga Yoga', verses: 27, audioUrl: '/audio/chapter14.mp3' },
  { id: 15, title: 'Purushottama Yoga', verses: 20, audioUrl: '/audio/chapter15.mp3' },
  { id: 16, title: 'Daivasura Sampad Vibhaga Yoga', verses: 24, audioUrl: '/audio/chapter16.mp3' },
  { id: 17, title: 'Shraddhatraya Vibhaga Yoga', verses: 28, audioUrl: '/audio/chapter17.mp3' },
  { id: 18, title: 'Moksha Sannyasa Yoga', verses: 78, audioUrl: '/audio/chapter18.mp3' }
];

export function GitaReading() {
  const { t } = useLanguage();
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0].id);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setIsPlaying(true);
    // Here you would implement the actual audio playback
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Here you would implement the actual audio pause
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('gitaReading')}</h1>
        <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('selectTranslation')} />
          </SelectTrigger>
          <SelectContent>
            {translations.map(translation => (
              <SelectItem key={translation.id} value={translation.id}>
                {translation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('availableTranslations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {translations.map(translation => (
            <div
              key={translation.id}
              className={`p-4 rounded-lg border ${
                selectedTranslation === translation.id ? 'border-primary' : ''
              }`}
            >
              <h3 className="font-medium">{translation.name}</h3>
              <p className="text-sm text-muted-foreground">{translation.language}</p>
              <p className="text-sm text-muted-foreground">{translation.author}</p>
              <p className="text-sm mt-2">{translation.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('chapters')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {chapters.map(chapter => (
            <div
              key={chapter.id}
              className="p-4 rounded-lg border flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">Chapter {chapter.id}</h3>
                <p className="text-sm text-muted-foreground">{chapter.title}</p>
                <p className="text-sm text-muted-foreground">{chapter.verses} verses</p>
              </div>
              <div className="flex items-center gap-2">
                {currentChapter?.id === chapter.id && isPlaying ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePause}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePlay(chapter)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline">
                  <Headphones className="h-4 w-4 mr-2" />
                  {t('read')}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {currentChapter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              {t('nowPlaying')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Chapter {currentChapter.id}</h3>
                <p className="text-sm text-muted-foreground">{currentChapter.title}</p>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isPlaying ? handlePause : () => handlePlay(currentChapter)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 