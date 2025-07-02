
import { useState, useEffect } from 'react';
import { sampleQuotes } from '@/data/sampleQuotes';
import { useAuth } from '@/contexts/AuthContext';

interface Quote {
  verse: string;
  translation: string;
  chapter: number;
  verse_number: number;
  explanation: string;
}

export function useQuotes() {
  const { user } = useAuth();
  
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>(() => {
    if (!user) return [];
    const saved = localStorage.getItem(`savedQuotes_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`savedQuotes_${user.id}`, JSON.stringify(savedQuotes));
      // Trigger custom event for real-time updates
      window.dispatchEvent(new CustomEvent('statsUpdated'));
    }
  }, [savedQuotes, user]);

  // Update when user changes
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`savedQuotes_${user.id}`);
      setSavedQuotes(saved ? JSON.parse(saved) : []);
    } else {
      setSavedQuotes([]);
    }
  }, [user]);

  const getRandomQuote = (): Quote => {
    const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
    return sampleQuotes[randomIndex];
  };

  const saveQuote = (quote: Quote) => {
    // Check if quote already exists
    const exists = savedQuotes.some(
      (q) => q.chapter === quote.chapter && q.verse_number === quote.verse_number
    );
    
    if (!exists) {
      setSavedQuotes((prev) => [...prev, quote]);
    }
  };

  const removeQuote = (quote: Quote) => {
    setSavedQuotes((prev) =>
      prev.filter(
        (q) => !(q.chapter === quote.chapter && q.verse_number === quote.verse_number)
      )
    );
  };

  return {
    savedQuotes,
    getRandomQuote,
    saveQuote,
    removeQuote,
  };
}
