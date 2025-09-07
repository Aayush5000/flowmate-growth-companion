import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  xpReward: number;
  type: 'task' | 'habit';
  streak?: number;
  lastCompletedDate?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: {
    type: 'tasks_completed' | 'streak' | 'xp_earned';
    count: number;
  };
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

interface GameContextType {
  profile: UserProfile;
  tasks: Task[];
  badges: Badge[];
  addTask: (title: string, type: 'task' | 'habit') => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  recentXPGains: { id: string; amount: number; timestamp: number }[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const INITIAL_BADGES: Badge[] = [
  {
    id: 'first-task',
    title: 'Getting Started',
    description: 'Complete your first task',
    icon: '🎯',
    unlocked: false,
    requirement: { type: 'tasks_completed', count: 1 }
  },
  {
    id: 'task-warrior',
    title: 'Task Warrior',
    description: 'Complete 10 tasks',
    icon: '⚔️',
    unlocked: false,
    requirement: { type: 'tasks_completed', count: 10 }
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    unlocked: false,
    requirement: { type: 'streak', count: 3 }
  },
  {
    id: 'xp-collector',
    title: 'XP Collector',
    description: 'Earn 100 XP',
    icon: '💎',
    unlocked: false,
    requirement: { type: 'xp_earned', count: 100 }
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Read 10 pages',
    completed: false,
    xpReward: 15,
    type: 'habit',
    streak: 0
  },
  {
    id: '2',
    title: 'Send important email',
    completed: false,
    xpReward: 10,
    type: 'task'
  },
  {
    id: '3',
    title: 'Exercise for 30 minutes',
    completed: false,
    xpReward: 20,
    type: 'habit',
    streak: 2
  }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'FlowMate User',
    level: 1,
    xp: 25,
    xpToNextLevel: 100,
    totalTasksCompleted: 2,
    currentStreak: 2,
    longestStreak: 3
  });

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [recentXPGains, setRecentXPGains] = useState<{ id: string; amount: number; timestamp: number }[]>([]);

  const addTask = (title: string, type: 'task' | 'habit') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      xpReward: type === 'habit' ? 15 : 10,
      type,
      streak: type === 'habit' ? 0 : undefined
    };
    setTasks(prev => [...prev, newTask]);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        const updatedTask = {
          ...task,
          completed: true,
          completedAt: new Date(),
          streak: task.type === 'habit' ? (task.streak || 0) + 1 : task.streak
        };

        // Add XP gain animation
        setRecentXPGains(prev => [
          ...prev,
          { id: Date.now().toString(), amount: task.xpReward, timestamp: Date.now() }
        ]);

        // Update profile
        setProfile(prevProfile => {
          const newXP = prevProfile.xp + task.xpReward;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            ...prevProfile,
            xp: newXP,
            level: newLevel,
            totalTasksCompleted: prevProfile.totalTasksCompleted + 1,
            currentStreak: prevProfile.currentStreak + 1
          };
        });

        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Check for badge unlocks
  useEffect(() => {
    setBadges(prev => prev.map(badge => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      switch (badge.requirement.type) {
        case 'tasks_completed':
          shouldUnlock = profile.totalTasksCompleted >= badge.requirement.count;
          break;
        case 'streak':
          shouldUnlock = profile.currentStreak >= badge.requirement.count;
          break;
        case 'xp_earned':
          shouldUnlock = profile.xp >= badge.requirement.count;
          break;
      }

      if (shouldUnlock) {
        return { ...badge, unlocked: true, unlockedAt: new Date() };
      }
      return badge;
    }));
  }, [profile]);

  // Clean up old XP gains
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setRecentXPGains(prev => prev.filter(gain => Date.now() - gain.timestamp < 2000));
    }, 2000);
    return () => clearTimeout(cleanup);
  }, [recentXPGains]);

  return (
    <GameContext.Provider value={{
      profile,
      tasks,
      badges,
      addTask,
      completeTask,
      deleteTask,
      recentXPGains
    }}>
      {children}
    </GameContext.Provider>
  );
};