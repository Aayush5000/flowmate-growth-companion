import React from 'react';
import { Star } from 'lucide-react';

interface XPFloatingTextProps {
  gains: { id: string; amount: number; timestamp: number }[];
}

export const XPFloatingText: React.FC<XPFloatingTextProps> = ({ gains }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {gains.map((gain) => (
        <div
          key={gain.id}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-xp-float"
          style={{
            left: `${45 + Math.random() * 10}%`,
            top: `${45 + Math.random() * 10}%`,
          }}
        >
          <div className="flex items-center gap-1 bg-gradient-xp text-xp-foreground px-3 py-1 rounded-full font-bold text-sm shadow-glow">
            <Star className="h-4 w-4" />
            +{gain.amount} XP
          </div>
        </div>
      ))}
    </div>
  );
};