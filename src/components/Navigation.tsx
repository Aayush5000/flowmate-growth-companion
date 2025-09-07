import React from 'react';
import { Home, CheckSquare, Trophy, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'rewards', icon: Trophy, label: 'Rewards' },
  { id: 'audio', icon: Headphones, label: 'Listen' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-elevated border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <Button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              variant="ghost"
              className={`
                flex flex-col items-center gap-1 p-2 h-auto min-w-0 flex-1 transition-all duration-300
                ${isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-in' : ''}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};