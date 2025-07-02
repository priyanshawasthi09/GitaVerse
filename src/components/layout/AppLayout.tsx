
import React from "react";
import { MobileLayout } from "./MobileLayout";
import { BottomNav } from "./BottomNav";
import { PageHeader } from "./PageHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <MobileLayout>
      <PageHeader />
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <BottomNav />
    </MobileLayout>
  );
}
