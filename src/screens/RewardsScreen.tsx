import React from 'react';
import { Star, Trophy, Flame, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { ProgressBar } from '@/components/ProgressBar';
import { BadgeCard } from '@/components/BadgeCard';

export const RewardsScreen: React.FC = () => {
  const { profile, badges } = useGame();
  
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  
  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Track your achievements and growth</p>
        </div>

        {/* Profile Card */}
        <Card className="p-4 mb-6 bg-gradient-primary text-primary-foreground border-none shadow-glow">
          <div className="text-center">
            <div className="text-4xl mb-2">🚀</div>
            <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5" />
              <span className="text-lg font-semibold">Level {profile.level}</span>
            </div>
            
            <ProgressBar 
              current={profile.xp % 100} 
              max={profile.xpToNextLevel}
              label="Progress to next level"
              variant="xp"
            />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 text-center bg-surface border-card-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5 text-success" />
              <span className="font-bold text-xl text-foreground">{profile.totalTasksCompleted}</span>
            </div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </Card>
          
          <Card className="p-4 text-center bg-surface border-card-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl text-foreground">{profile.currentStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </Card>
          
          <Card className="p-4 text-center bg-surface border-card-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-xp" />
              <span className="font-bold text-xl text-foreground">{profile.xp}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </Card>
          
          <Card className="p-4 text-center bg-surface border-card-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-warning" />
              <span className="font-bold text-xl text-foreground">{unlockedBadges.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Achievements
          </h2>
          
          {unlockedBadges.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Unlocked ({unlockedBadges.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {unlockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}
          
          {lockedBadges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Coming Up ({lockedBadges.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {lockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <Card className="p-4 bg-accent/10 border-accent/30 text-center">
          <div className="text-2xl mb-2">💪</div>
          <h3 className="font-semibold text-foreground mb-1">Keep it up!</h3>
          <p className="text-sm text-muted-foreground">
            You're building great habits. Complete {3 - (profile.currentStreak % 3)} more tasks to unlock your next streak milestone!
          </p>
        </Card>
      </div>
    </div>
  );
};