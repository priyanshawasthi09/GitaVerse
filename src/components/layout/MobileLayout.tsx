
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-[100vh] ${isMobile ? 'max-w-full' : 'max-w-md mx-auto border-x border-border/40'} bg-background`}>
      <div className="flex flex-col min-h-[100vh] relative">
        {children}
      </div>
    </div>
  );
}
