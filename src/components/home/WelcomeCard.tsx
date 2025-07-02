
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';

export default function WelcomeCard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="sage-gradient sophisticated-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              {t('welcome')} 
              <Heart className="h-4 w-4 text-red-500" />
            </h3>
            <p className="text-sm text-muted-foreground">{t('signInToTrack')}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/signin')} className="sophisticated-border sophisticated-hover">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            {t('signIn')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
