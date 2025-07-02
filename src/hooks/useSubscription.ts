
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
}

interface ChatUsage {
  chat_count: number;
  date: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true,
    error: null,
  });
  const [chatUsage, setChatUsage] = useState<ChatUsage>({ chat_count: 0, date: new Date().toISOString().split('T')[0] });

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setSubscriptionData(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Subscription check error:', error);
        setSubscriptionData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message || 'Failed to check subscription' 
        }));
        return;
      }

      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Subscription check error:', error);
      setSubscriptionData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to check subscription' 
      }));
    }
  };

  const getChatUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_usage')
        .select('chat_count, date')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Chat usage error:', error);
        return;
      }

      if (data) {
        setChatUsage(data);
      }
    } catch (error) {
      console.error('Chat usage error:', error);
    }
  };

  const createCheckout = async () => {
    if (!session) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    return data;
  };

  const openCustomerPortal = async () => {
    if (!session) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    return data;
  };

  const canChat = () => {
    if (subscriptionData.subscribed) return true;
    return chatUsage.chat_count < 10;
  };

  const getRemainingChats = () => {
    if (subscriptionData.subscribed) return Infinity;
    return Math.max(0, 10 - chatUsage.chat_count);
  };

  useEffect(() => {
    checkSubscription();
    getChatUsage();
  }, [user, session]);

  return {
    ...subscriptionData,
    chatUsage,
    checkSubscription,
    getChatUsage,
    createCheckout,
    openCustomerPortal,
    canChat,
    getRemainingChats,
  };
};
