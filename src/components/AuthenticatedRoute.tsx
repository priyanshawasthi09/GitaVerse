
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-slate-50/30 dark:to-slate-900/30">
        <Card className="p-8 bg-background/80 backdrop-blur-sm border shadow-lg">
          <CardContent className="flex flex-col items-center space-y-4 p-0">
            <LoadingSpinner size={32} />
            <p className="text-muted-foreground text-sm">Loading your session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    // Redirect to sign in with return path
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
