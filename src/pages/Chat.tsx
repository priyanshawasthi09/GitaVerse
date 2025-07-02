
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Mic, Send, BookmarkPlus, Crown, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { SubscriptionModal } from "@/components/SubscriptionModal";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isPending?: boolean;
}

export default function Chat() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, session } = useAuth();
  const { subscribed, canChat, getRemainingChats, getChatUsage } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('aiResponse'),
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchKrishnaResponse = async (prompt: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-krishna', {
        body: { prompt }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data?.text) {
        throw new Error('No response received from Krishna');
      }

      return data.text;
    } catch (error) {
      console.error('Error calling Krishna function:', error);
      throw error;
    }
  };

  const incrementChatCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('increment_chat_count', {
        user_uuid: user.id
      });
      
      if (error) {
        console.error('Error incrementing chat count:', error);
      } else {
        console.log('Chat count incremented:', data);
        // Refresh chat usage
        getChatUsage();
      }
    } catch (error) {
      console.error('Error incrementing chat count:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if user can chat
    if (!canChat()) {
      setShowSubscriptionModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    const pendingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "...",
      isUser: false,
      timestamp: new Date(),
      isPending: true
    };

    setMessages(prev => [...prev, userMessage, pendingMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Increment chat count first
      await incrementChatCount();
      
      const response = await fetchKrishnaResponse(inputMessage);
      
      console.log('Response received from Krishna AI');
      
      setMessages(prev => 
        prev.map(msg => 
          msg.isPending ? {
            ...msg, 
            text: response,
            isPending: false
          } : msg
        )
      );
    } catch (error) {
      console.error('Error getting response:', error);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.isPending ? {
            ...msg, 
            text: "I apologize, but I'm unable to provide wisdom at this moment. Perhaps this is an opportunity to practice patience, as taught in the Gita.",
            isPending: false
          } : msg
        )
      );
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to Krishna. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement actual voice recording logic here
  };

  const saveQuote = (text: string) => {
    if (!user) return;
    
    // Save the quote to localStorage with user ID
    const savedQuotes = JSON.parse(localStorage.getItem(`savedQuotes_${user.id}`) || '[]');
    const newQuote = {
      id: Date.now().toString(),
      text: text,
      source: "Krishna AI",
      date: new Date().toISOString()
    };
    
    savedQuotes.push(newQuote);
    localStorage.setItem(`savedQuotes_${user.id}`, JSON.stringify(savedQuotes));
    
    toast({
      title: t('quoteSaved'),
      description: "The wisdom has been saved to your collection.",
    });
  };

  const remainingChats = getRemainingChats();

  return (
    <div className="container max-w-md mx-auto h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-background to-slate-50/30 dark:to-slate-900/30">
      <div className="flex items-center justify-between p-4 border-b border-border slate-gradient">
        <h1 className="text-lg font-semibold">Ask Krishna</h1>
        <div className="flex items-center gap-2">
          {!subscribed && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              <span className="text-xs text-amber-700 dark:text-amber-300">
                {remainingChats} left
              </span>
            </div>
          )}
          {subscribed && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
              <Crown className="h-3 w-3 text-primary" />
              <span className="text-xs text-primary">Premium</span>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            DeepSeek AI
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <SubscriptionBanner />
        
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <Card
                  className={`max-w-[80%] p-4 shadow-sm border transition-all duration-300 hover:shadow-md ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground sophisticated-border'
                      : 'slate-gradient sophisticated-border text-foreground'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm leading-relaxed">
                      {message.isPending ? (
                        <span className="animate-gentle-pulse flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          Krishna is contemplating...
                        </span>
                      ) : (
                        message.text
                      )}
                    </p>
                    {!message.isUser && !message.isPending && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 sophisticated-hover text-primary"
                        onClick={() => saveQuote(message.text)}
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <span className={`text-xs opacity-70 mt-2 block ${message.isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-border slate-gradient">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`transition-all duration-300 hover:scale-105 sophisticated-hover ${
              isRecording 
                ? 'text-red-500 bg-red-50 dark:bg-red-950/20' 
                : 'text-primary'
            }`}
            onClick={toggleRecording}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            placeholder={isLoading ? t('waitingForKrishna') : t('typeMessage')}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 sophisticated-border bg-background/80 placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        {!subscribed && remainingChats <= 3 && remainingChats > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
            {remainingChats} free chats remaining today
          </p>
        )}
      </div>

      <SubscriptionModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal} 
      />
    </div>
  );
}
