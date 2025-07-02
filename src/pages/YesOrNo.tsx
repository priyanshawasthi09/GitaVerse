
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

export default function YesOrNo() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRandomAnswer = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://yesno.wtf/api");
      const data = await response.json();
      setAnswer(data.answer);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Yes or No?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            {answer && (
              <div className="text-4xl font-bold animate-in fade-in">
                {answer.toUpperCase()}
              </div>
            )}
            
            {answer && <div className="h-4"></div>}
            
            <Button 
              onClick={getRandomAnswer} 
              className="w-full text-lg" 
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                "Get Answer"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}
