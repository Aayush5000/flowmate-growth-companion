import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from './useProfile';

interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  streak: number;
  last_checked?: string;
  xp_reward: number;
  created_at: string;
}

export const useHabits = () => {
  const { user } = useAuth();
  const { updateXP, checkAndAwardBadge, profile } = useProfile();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching habits:', error);
      } else {
        setHabits(data || []);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitData: Partial<Habit>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habitData.name,
          description: habitData.description,
          xp_reward: habitData.xp_reward || 5
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating habit:', error);
      } else {
        setHabits(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const checkHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || !profile) return;

    const today = new Date().toISOString().split('T')[0];
    const lastChecked = habit.last_checked;

    // Don't allow checking the same habit multiple times in one day
    if (lastChecked === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Calculate new streak
    let newStreak = 1;
    if (lastChecked === yesterdayStr) {
      newStreak = habit.streak + 1;
    }

    const newXP = profile.xp + habit.xp_reward;

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          streak: newStreak,
          last_checked: today
        })
        .eq('id', habitId);

      if (error) {
        console.error('Error checking habit:', error);
      } else {
        setHabits(prev => prev.map(h => 
          h.id === habitId 
            ? { ...h, streak: newStreak, last_checked: today }
            : h
        ));

        await updateXP(newXP);
        await checkAndAwardBadge(newXP);

        // Check for streak badges
        if (newStreak >= 7) {
          await checkStreakBadge(habitId, newStreak);
        }
      }
    } catch (error) {
      console.error('Error checking habit:', error);
    }
  };

  const checkStreakBadge = async (habitId: string, streak: number) => {
    if (!user) return;

    const streakMilestones = [7, 30, 100];
    
    for (const milestone of streakMilestones) {
      if (streak >= milestone) {
        // Check if badge already exists
        const { data: existingBadge } = await supabase
          .from('badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_name', `${milestone} Day Streak`)
          .eq('badge_type', 'streak')
          .maybeSingle();

        if (!existingBadge) {
          // Award new badge
          await supabase
            .from('badges')
            .insert({
              user_id: user.id,
              badge_name: `${milestone} Day Streak`,
              badge_type: 'streak',
              threshold: milestone
            });
        }
      }
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();

      if (error) {
        console.error('Error updating habit:', error);
      } else {
        setHabits(prev => prev.map(habit => habit.id === habitId ? data : habit));
      }
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) {
        console.error('Error deleting habit:', error);
      } else {
        setHabits(prev => prev.filter(habit => habit.id !== habitId));
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchHabits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    habits,
    loading,
    createHabit,
    checkHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits
  };
};