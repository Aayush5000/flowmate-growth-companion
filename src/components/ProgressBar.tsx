import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showNumbers?: boolean;
  variant?: 'default' | 'xp' | 'success';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  label,
  showNumbers = true,
  variant = 'default'
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const getProgressColor = () => {
    switch (variant) {
      case 'xp':
        return 'bg-gradient-xp';
      case 'success':
        return 'bg-gradient-success';
      default:
        return 'bg-gradient-primary';
    }
  };

  return (
    <div className="w-full">
      {(label || showNumbers) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showNumbers && (
            <span className="text-sm text-muted-foreground">
              {current}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3 bg-muted rounded-full overflow-hidden"
        />
        <div 
          className={`absolute top-0 left-0 h-full ${getProgressColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        
        {percentage > 0 && (
          <div 
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs font-bold text-white mix-blend-difference"
            style={{ opacity: percentage > 20 ? 1 : 0 }}
          >
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};