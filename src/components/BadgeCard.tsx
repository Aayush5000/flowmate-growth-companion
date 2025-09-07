import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/contexts/GameContext';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <Card className={`
      p-4 text-center transition-all duration-300 border border-card-border
      ${badge.unlocked 
        ? 'bg-gradient-success shadow-success hover:scale-105' 
        : 'bg-card opacity-60 hover:opacity-80'
      }
    `}>
      <div className="relative">
        <div className={`
          text-3xl mb-2 transition-all duration-300
          ${badge.unlocked ? 'animate-bounce-in' : 'grayscale'}
        `}>
          {badge.unlocked ? badge.icon : <Lock className="h-8 w-8 mx-auto text-muted-foreground" />}
        </div>
        
        <h3 className={`
          font-bold text-sm mb-1
          ${badge.unlocked ? 'text-success-foreground' : 'text-muted-foreground'}
        `}>
          {badge.title}
        </h3>
        
        <p className={`
          text-xs
          ${badge.unlocked ? 'text-success-foreground/80' : 'text-muted-foreground'}
        `}>
          {badge.description}
        </p>
        
        {badge.unlocked && badge.unlockedAt && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-xp rounded-full animate-pulse"></div>
        )}
      </div>
    </Card>
  );
};