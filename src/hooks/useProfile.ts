import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  username: string;
  xp: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateXP = async (newXP: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating XP:', error);
      } else {
        setProfile(prev => prev ? { ...prev, xp: newXP } : null);
      }
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };

  const checkAndAwardBadge = async (currentXP: number) => {
    if (!user) return;

    const milestones = [100, 250, 500, 1000, 2500];
    
    for (const milestone of milestones) {
      if (currentXP >= milestone) {
        // Check if badge already exists
        const { data: existingBadge } = await supabase
          .from('badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_name', `XP Master ${milestone}`)
          .eq('badge_type', 'xp_milestone')
          .maybeSingle();

        if (!existingBadge) {
          // Award new badge
          await supabase
            .from('badges')
            .insert({
              user_id: user.id,
              badge_name: `XP Master ${milestone}`,
              badge_type: 'xp_milestone',
              threshold: milestone
            });
        }
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    profile,
    loading,
    updateXP,
    checkAndAwardBadge,
    refetch: fetchProfile
  };
};