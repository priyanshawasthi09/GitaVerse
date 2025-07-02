
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Trophy, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JourneySection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
        Continue Your Journey
        <ArrowUpRight className="h-5 w-5 text-primary" />
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105 sage-gradient sophisticated-border sophisticated-hover" 
          onClick={() => navigate('/chat')}
        >
          <MessageCircle className="h-6 w-6 mb-2 text-primary" />
          <span className="text-lg font-medium text-foreground">Chat</span>
          <span className="text-sm text-muted-foreground">Seek Guidance</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105 lavender-gradient sophisticated-border sophisticated-hover" 
          onClick={() => navigate('/karma')}
        >
          <Trophy className="h-6 w-6 mb-2 text-primary" />
          <span className="text-lg font-medium text-foreground">Karma</span>
          <span className="text-sm text-muted-foreground">Track Progress</span>
        </Button>
      </div>
    </div>
  );
}
