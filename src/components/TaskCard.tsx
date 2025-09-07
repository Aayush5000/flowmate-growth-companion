import React, { useState } from 'react';
import { Check, Star, Flame, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/contexts/GameContext';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    if (task.completed) return;
    
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(task.id);
      setIsCompleting(false);
    }, 300);
  };

  return (
    <Card className={`
      p-4 border border-card-border transition-all duration-300 hover:shadow-glow
      ${task.completed ? 'bg-success/10 border-success/30' : 'bg-card hover:bg-surface-elevated'}
      ${isCompleting ? 'animate-pulse-success' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Button
            onClick={handleComplete}
            disabled={task.completed}
            className={`
              h-8 w-8 rounded-full p-0 transition-all duration-300
              ${task.completed 
                ? 'bg-success hover:bg-success text-success-foreground' 
                : 'bg-primary hover:bg-primary-glow text-primary-foreground hover:scale-110'
              }
            `}
          >
            <Check className={`h-4 w-4 ${isCompleting ? 'animate-bounce-in' : ''}`} />
          </Button>
          
          <div className="flex-1">
            <h3 className={`
              font-medium transition-all duration-300
              ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}
            `}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-xp" />
                <span className="text-xs text-xp font-medium">{task.xpReward} XP</span>
              </div>
              
              {task.type === 'habit' && (
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">{task.streak || 0} streak</span>
                </div>
              )}
              
              <span className={`
                text-xs px-2 py-0.5 rounded-full font-medium
                ${task.type === 'habit' 
                  ? 'bg-secondary/20 text-secondary' 
                  : 'bg-accent/20 text-accent'
                }
              `}>
                {task.type}
              </span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => onDelete(task.id)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};