import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Simulate loading progress
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Slight delay before calling onLoadComplete to show 100%
          setTimeout(() => {
            onLoadComplete();
          }, 500);
          return 100;
        }
        // Speed up progress near the end
        const increment = prevProgress > 80 ? 3 : prevProgress > 50 ? 2 : 1;
        return prevProgress + increment;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [onLoadComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center" 
      style={{ backgroundColor: '#F5E6D3' }}
    >
      <div className="max-w-md w-full px-6 flex flex-col items-center">
        <div className="w-80 h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
          <img 
            src="/bhagavad-gita.jpg" 
            alt="Bhagavad Gita" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="w-full">
          <Progress 
            value={progress} 
            className="w-full h-2.5 mb-4" 
            style={{
              backgroundColor: 'rgba(139, 69, 19, 0.2)'
            }}
          />
        </div>
        
        <div className="flex items-center">
          <Loader className="animate-spin mr-2 text-amber-800" size={16} />
          <p className="text-sm text-amber-900">
            Loading wisdom...{progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
