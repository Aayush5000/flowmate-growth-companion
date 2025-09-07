import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Briefcase, Coffee, Zap } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { ProgressBar } from '@/components/ProgressBar';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const modeCards = [
  {
    id: 'learn',
    title: 'Learn Mode',
    description: 'Focus on growth and education',
    icon: BookOpen,
    color: 'bg-gradient-primary',
    tasks: ['Read articles', 'Watch tutorials', 'Practice skills']
  },
  {
    id: 'work',
    title: 'Work Mode',
    description: 'Get things done efficiently',
    icon: Briefcase,
    color: 'bg-gradient-success',
    tasks: ['Complete projects', 'Answer emails', 'Meet deadlines']
  },
  {
    id: 'relax',
    title: 'Relax Mode',
    description: 'Mindful and restorative activities',
    icon: Coffee,
    color: 'bg-gradient-xp',
    tasks: ['Meditation', 'Light reading', 'Gentle exercise']
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { profile } = useGame();

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to grow and achieve more today?
          </p>
        </div>

        {/* Quick Stats */}
        <Card className="p-4 mb-6 bg-surface border-card-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Level {profile.level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {profile.xp}/{profile.xpToNextLevel} XP
            </span>
          </div>
          
          <ProgressBar 
            current={profile.xp % 100} 
            max={profile.xpToNextLevel} 
            variant="xp"
            showNumbers={false}
          />
          
          <div className="flex justify-between mt-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-foreground">{profile.totalTasksCompleted}</div>
              <div className="text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary">{profile.currentStreak}</div>
              <div className="text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xp">{profile.xp}</div>
              <div className="text-muted-foreground">Total XP</div>
            </div>
          </div>
        </Card>

        {/* Mode Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Choose Your Focus</h2>
          <div className="space-y-3">
            {modeCards.map((mode) => {
              const Icon = mode.icon;
              return (
                <Card
                  key={mode.id}
                  className="p-4 border border-card-border hover:shadow-glow transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate('tasks')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${mode.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{mode.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{mode.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {mode.tasks.slice(0, 2).map((task, index) => (
                          <span
                            key={index}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('tasks')}
            className="w-full bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform duration-300 font-semibold py-3"
          >
            View All Tasks & Habits
          </Button>
          
          <Button
            onClick={() => onNavigate('audio')}
            variant="outline"
            className="w-full border-border hover:bg-surface-elevated transition-all duration-300 py-3"
          >
            Start Listening Session
          </Button>
        </div>
      </div>
    </div>
  );
};