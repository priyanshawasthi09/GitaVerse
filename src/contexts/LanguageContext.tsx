import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'sa';

type TranslationValue = {
  [key in Language]: string;
} | {
  [key: string]: TranslationValue;
};

interface Translations {
  [key: string]: TranslationValue;
}

const translations: Translations = {
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत है',
    sa: 'स्वागतम्',
  },
  dailyPractice: {
    en: 'Daily Practice',
    hi: 'दैनिक अभ्यास',
    sa: 'दैनिक साधना',
  },
  meditation: {
    en: 'Meditation',
    hi: 'ध्यान',
    sa: 'ध्यानम्',
  },
  reading: {
    en: 'Reading',
    hi: 'पाठन',
    sa: 'पठनम्',
  },
  reflection: {
    en: 'Reflection',
    hi: 'चिंतन',
    sa: 'मननम्',
  },
  start: {
    en: 'Start',
    hi: 'शुरू करें',
    sa: 'आरभ्यताम्',
  },
  pause: {
    en: 'Pause',
    hi: 'रोकें',
    sa: 'विरम्यताम्',
  },
  resume: {
    en: 'Resume',
    hi: 'जारी रखें',
    sa: 'पुनः आरभ्यताम्',
  },
  complete: {
    en: 'Complete',
    hi: 'पूर्ण',
    sa: 'समाप्तम्',
  },
  savedQuotes: {
    en: 'Saved Quotes',
    hi: 'सहेजे गए उद्धरण',
    sa: 'सुरक्षिताः वचनानि',
  },
  share: {
    en: 'Share',
    hi: 'साझा करें',
    sa: 'विभज्यताम्',
  },
  delete: {
    en: 'Delete',
    hi: 'हटाएं',
    sa: 'नष्ट्यताम्',
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
    sa: 'परिचयः',
  },
  editProfile: {
    en: 'Edit Profile',
    hi: 'प्रोफ़ाइल संपादित करें',
    sa: 'परिचयः संशोध्यताम्',
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    sa: 'विन्यासः',
  },
  notifications: {
    en: 'Notifications',
    hi: 'सूचनाएं',
    sa: 'सूचनाः',
  },
  darkMode: {
    en: 'Dark Mode',
    hi: 'डार्क मोड',
    sa: 'तमस् प्रकारः',
  },
  language: {
    en: 'Language',
    hi: 'भाषा',
    sa: 'भाषा',
  },
  yourStatistics: {
    en: 'Your Statistics',
    hi: 'आपके आँकड़े',
    sa: 'तव सांख्यिकी',
  },
  totalPractices: {
    en: 'Total Practices',
    hi: 'कुल अभ्यास',
    sa: 'कुल साधनानि',
  },
  completedPractices: {
    en: 'Completed Practices',
    hi: 'पूर्ण अभ्यास',
    sa: 'समाप्त साधनानि',
  },
  currentStreak: {
    en: 'Current Streak',
    hi: 'वर्तमान लगातार',
    sa: 'वर्तमान शृंखला',
  },
  longestStreak: {
    en: 'Longest Streak',
    hi: 'सबसे लंबा लगातार',
    sa: 'दीर्घतम शृंखला',
  },
  dailyReminders: {
    en: 'Daily Reminders',
    hi: 'दैनिक अनुस्मारक',
    sa: 'दैनिक स्मरणानि',
  },
  receiveDailyWisdom: {
    en: 'Receive daily wisdom notifications',
    hi: 'दैनिक ज्ञान की सूचनाएं प्राप्त करें',
    sa: 'दैनिक ज्ञानस्य सूचनाः प्राप्नुहि',
  },
  signInToTrack: {
    en: 'Sign in to track your spiritual journey',
    hi: 'अपनी आध्यात्मिक यात्रा को ट्रैक करने के लिए साइन इन करें',
    sa: 'अध्यात्मिक यात्रां ट्रैक कर्तुं प्रविश्यताम्',
  },
  signIn: {
    en: 'Sign In',
    hi: 'साइन इन',
    sa: 'प्रविश्यताम्',
  },
  dailyWisdom: {
    en: 'Daily Wisdom',
    hi: 'दैनिक ज्ञान',
    sa: 'दैनिक ज्ञानम्',
  },
  chat: {
    en: 'Ask Krishna',
    hi: 'कृष्ण से पूछें',
    sa: 'कृष्णं पृच्छतु',
  },
  seekGuidance: {
    en: 'Seek guidance',
    hi: 'मार्गदर्शन प्राप्त करें',
    sa: 'मार्गदर्शनं प्राप्नुहि',
  },
  beginYourJourney: {
    en: 'Begin Your Journey',
    hi: 'अपनी यात्रा शुरू करें',
    sa: 'यात्रां आरभ्यताम्',
  },
  buildStreak: {
    en: 'Build your streak',
    hi: 'अपनी लगातार श्रृंखला बनाएं',
    sa: 'शृंखलां निर्मायताम्',
  },
  ambientSounds: {
    en: 'Ambient Sounds',
    hi: 'परिवेश ध्वनियाँ',
    sa: 'परिवेश ध्वनयः',
  },
  stopMusic: {
    en: 'Stop Music',
    hi: 'संगीत बंद करें',
    sa: 'संगीतं विरम्यताम्',
  },
  addPractice: {
    en: 'Add Practice',
    hi: 'अभ्यास जोड़ें',
    sa: 'साधनं योज्यताम्',
  },
  addNewPractice: {
    en: 'Add New Practice',
    hi: 'नया अभ्यास जोड़ें',
    sa: 'नूतनं साधनं योज्यताम्',
  },
  practiceName: {
    en: 'Practice Name',
    hi: 'अभ्यास का नाम',
    sa: 'साधनस्य नाम',
  },
  durationMinutes: {
    en: 'Duration (minutes)',
    hi: 'अवधि (मिनट)',
    sa: 'अवधिः (मिनटाः)',
  },
  todayProgress: {
    en: "Today's Progress",
    hi: 'आज की प्रगति',
    sa: 'अद्य प्रगतिः',
  },
  editPractice: {
    en: 'Edit Practice',
    hi: 'अभ्यास संपादित करें',
    sa: 'साधनं संशोध्यताम्',
  },
  saveChanges: {
    en: 'Save Changes',
    hi: 'परिवर्तन सहेजें',
    sa: 'परिवर्तनानि सुरक्ष्यताम्',
  },
  shareQuote: {
    en: 'Share Quote',
    hi: 'उद्धरण साझा करें',
    sa: 'वचनं विभज्यताम्',
  },
  copy: {
    en: 'Copy',
    hi: 'कॉपी करें',
    sa: 'नकलं कुरु',
  },
  quoteDeleted: {
    en: 'Quote Deleted',
    hi: 'उद्धरण हटा दिया गया',
    sa: 'वचनं नष्टम्',
  },
  quoteDeletedMessage: {
    en: 'The quote has been removed from your saved collection.',
    hi: 'उद्धरण आपके सहेजे गए संग्रह से हटा दिया गया है।',
    sa: 'वचनं तव सुरक्षित संग्रहात् नष्टम्।',
  },
  quoteCopied: {
    en: 'Quote Copied',
    hi: 'उद्धरण कॉपी किया गया',
    sa: 'वचनं नकलितम्',
  },
  quoteCopiedMessage: {
    en: 'The quote has been copied to your clipboard.',
    hi: 'उद्धरण आपके क्लिपबोर्ड पर कॉपी किया गया है।',
    sa: 'वचनं तव क्लिपबोर्डे नकलितम्।',
  },
  noSavedQuotes: {
    en: 'No saved quotes yet.',
    hi: 'अभी तक कोई सहेजे गए उद्धरण नहीं हैं।',
    sa: 'अद्यापि न कोऽपि सुरक्षितः वचनः।',
  },
  savedQuotesDescription: {
    en: 'Quotes you save from conversations with Krishna will appear here.',
    hi: 'कृष्ण के साथ वार्तालाप से आपके द्वारा सहेजे गए उद्धरण यहां दिखाई देंगे।',
    sa: 'कृष्णेन सह वार्तालापात् त्वया सुरक्षितानि वचनानि अत्र दृश्यन्ते।',
  },
  typeMessage: {
    en: 'Type your message...',
    hi: 'अपना संदेश टाइप करें...',
    sa: 'संदेशं लिखतु...',
  },
  aiResponse: {
    en: 'O dear soul, I am here to guide you on your spiritual journey. How may I assist you today?',
    hi: 'हे प्रिय आत्मा, मैं आपकी आध्यात्मिक यात्रा में आपका मार्गदर्शन करने के लिए यहाँ हूँ। मैं आज आपकी कैसे सहायता कर सकता हूँ?',
    sa: 'हे प्रिय आत्मन्, अहं तव आध्यात्मिक यात्रायां मार्गदर्शनाय अत्र अस्मि। अद्य कथं साहाय्यं करोमि?',
  },
  startRecording: {
    en: 'Start voice recording',
    hi: 'आवाज़ रिकॉर्डिंग शुरू करें',
    sa: 'ध्वनिमुद्रणम् आरभ्यताम्',
  },
  stopRecording: {
    en: 'Stop voice recording',
    hi: 'आवाज़ रिकॉर्डिंग बंद करें',
    sa: 'ध्वनिमुद्रणं समाप्यताम्',
  },
  send: {
    en: 'Send message',
    hi: 'संदेश भेजें',
    sa: 'संदेशं प्रेषयतु',
  },
  gentleRain: {
    en: 'Gentle Rain',
    hi: 'मंद वर्षा',
    sa: 'मृदु वर्षा',
  },
  oceanWaves: {
    en: 'Ocean Waves',
    hi: 'समुद्र की लहरें',
    sa: 'सागर तरङ्गाः',
  },
  forestSounds: {
    en: 'Forest Sounds',
    hi: 'वन की ध्वनियाँ',
    sa: 'वन ध्वनयः',
  },
  singingBowl: {
    en: 'Singing Bowl',
    hi: 'ध्यान कटोरा',
    sa: 'ध्यान पात्रम्',
  },
  reset: {
    en: 'Reset',
    hi: 'रीसेट',
    sa: 'पुनः स्थापयतु',
  },
  gitaReading: {
    title: {
      en: 'Bhagavad Gita Reading',
      hi: 'भगवद्गीता पाठन',
      sa: 'भगवद्गीता पठनम्'
    },
    selectTranslation: {
      en: 'Select Translation',
      hi: 'अनुवाद चुनें',
      sa: 'अनुवादं चिनुत'
    },
    verses: {
      en: 'Verses',
      hi: 'श्लोक',
      sa: 'श्लोकाः'
    },
    playAudio: {
      en: 'Play Audio',
      hi: 'ऑडियो चलाएं',
      sa: 'श्रव्यं वादयतु'
    },
    pauseAudio: {
      en: 'Pause Audio',
      hi: 'ऑडियो रोकें',
      sa: 'श्रव्यं विरमतु'
    },
    translations: {
      swamiPrabhupada: {
        name: {
          en: 'Bhagavad Gita As It Is',
          hi: 'भगवद्गीता यथारूप',
          sa: 'भगवद्गीता यथा स्वरूपम्'
        },
        author: {
          en: 'A.C. Bhaktivedanta Swami Prabhupada',
          hi: 'ए.सी. भक्तिवेदांत स्वामी प्रभुपाद',
          sa: 'ए.सी. भक्तिवेदान्त स्वामी प्रभुपाद'
        },
        description: {
          en: 'The most widely read translation with detailed purports',
          hi: 'विस्तृत व्याख्या के साथ सर्वाधिक पढ़ा जाने वाला अनुवाद',
          sa: 'विस्तृत व्याख्यया सह बहुपठितः अनुवादः'
        }
      },
      swamiMukundananda: {
        name: {
          en: 'Bhagavad Gita - The Song of God',
          hi: 'भगवद्गीता - भगवान का गीत',
          sa: 'भगवद्गीता - भगवतः गीतम्'
        },
        author: {
          en: 'Swami Mukundananda',
          hi: 'स्वामी मुकुंदानंद',
          sa: 'स्वामी मुकुन्दानन्द'
        },
        description: {
          en: 'Modern translation with practical insights',
          hi: 'व्यावहारिक अंतर्दृष्टि के साथ आधुनिक अनुवाद',
          sa: 'व्यावहारिक दृष्ट्या सह आधुनिक अनुवादः'
        }
      },
      swamiChinmayananda: {
        name: {
          en: 'The Holy Geeta',
          hi: 'पवित्र गीता',
          sa: 'पवित्रा गीता'
        },
        author: {
          en: 'Swami Chinmayananda',
          hi: 'स्वामी चिन्मयानंद',
          sa: 'स्वामी चिन्मयानन्द'
        },
        description: {
          en: 'Classic commentary with philosophical depth',
          hi: 'दार्शनिक गहराई के साथ शास्त्रीय व्याख्या',
          sa: 'दार्शनिक गाम्भीर्येण सह शास्त्रीय व्याख्या'
        }
      }
    }
  },
  karma: {
    en: "Karma",
    hi: "कर्म",
    sa: "कर्म"
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'hi', 'sa'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: TranslationValue = translations;
    
    for (const k of keys) {
      if (!value[k]) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      value = value[k] as TranslationValue;
    }

    if (typeof value === 'object' && value[language]) {
      return value[language] as string;
    }

    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 