
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Zap, MessageCircle, Clock, Shield } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const { createCheckout, subscribed } = useSubscription();

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckout();
      window.open(url, '_blank');
      onOpenChange(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process');
    }
  };

  if (subscribed) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            Choose Your Spiritual Journey
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Free Plan */}
          <Card className="border-2 border-muted">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Free Plan
              </CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <p className="text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">10 chats per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic Krishna wisdom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Daily spiritual quotes</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary bg-gradient-to-b from-primary/5 to-primary/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Premium Plan
              </CardTitle>
              <div className="text-3xl font-bold">$9.99</div>
              <p className="text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Unlimited chats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced spiritual guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Personalized insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Chat history backup</span>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your payment is processed securely by Stripe. Cancel anytime from your account settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
