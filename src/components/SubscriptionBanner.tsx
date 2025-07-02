
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

export const SubscriptionBanner = () => {
  const { subscribed, getRemainingChats, createCheckout, loading } = useSubscription();

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckout();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process');
    }
  };

  if (loading || subscribed) return null;

  const remainingChats = getRemainingChats();

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                {remainingChats > 0 ? `${remainingChats} Free Chats Remaining` : 'Free Chats Exhausted'}
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {remainingChats > 0 
                  ? 'Upgrade to Premium for unlimited spiritual guidance'
                  : 'Upgrade to continue your spiritual journey with Krishna AI'
                }
              </p>
            </div>
          </div>
          <Button 
            onClick={handleUpgrade}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
