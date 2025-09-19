import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Edit, Trash2, Star, Flame, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useHabits } from '@/hooks/useHabits';
import { XPFloatingText } from '@/components/XPFloatingText';

const Habits = () => {
  const { habits, loading, createHabit, checkHabit, updateHabit, deleteHabit } = useHabits();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    xp_reward: 5
  });
  const [xpGains, setXpGains] = useState<{ id: string; amount: number; timestamp: number }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHabit) {
      await updateHabit(editingHabit.id, formData);
      setEditingHabit(null);
      toast({
        title: 'Habit Updated',
        description: 'Your habit has been updated successfully.'
      });
    } else {
      await createHabit(formData);
      toast({
        title: 'Habit Created',
        description: 'New habit added to your routine!'
      });
    }
    
    setFormData({ name: '', description: '', xp_reward: 5 });
    setIsDialogOpen(false);
  };

  const handleCheck = async (habit: any) => {
    const today = new Date().toISOString().split('T')[0];
    if (habit.last_checked === today) {
      toast({
        title: 'Already Checked',
        description: 'You\'ve already completed this habit today!',
        variant: 'destructive'
      });
      return;
    }
    
    await checkHabit(habit.id);
    
    // Add XP floating animation
    const newGain = {
      id: `xp-${Date.now()}`,
      amount: habit.xp_reward,
      timestamp: Date.now()
    };
    setXpGains(prev => [...prev, newGain]);
    
    setTimeout(() => {
      setXpGains(prev => prev.filter(gain => gain.id !== newGain.id));
    }, 2000);
    
    toast({
      title: 'Habit Completed! 🔥',
      description: `Streak increased! You earned ${habit.xp_reward} XP.`
    });
  };

  const handleEdit = (habit: any) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description || '',
      xp_reward: habit.xp_reward
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (habitId: string) => {
    await deleteHabit(habitId);
    toast({
      title: 'Habit Deleted',
      description: 'Habit has been removed from your routine.'
    });
  };

  const isCheckedToday = (habit: any) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.last_checked === today;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-orange-500';
    if (streak >= 7) return 'text-yellow-500';
    if (streak >= 3) return 'text-green-500';
    return 'text-muted-foreground';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Habits</h1>
            <p className="text-muted-foreground">
              Build consistency and maintain your streaks
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                </DialogTitle>
                <DialogDescription>
                  {editingHabit 
                    ? 'Update your habit details below.' 
                    : 'Add a new habit to your daily routine.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Habit Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Drink 8 glasses of water"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Why is this habit important to you?"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="xp_reward">XP Reward</Label>
                  <Input
                    id="xp_reward"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setEditingHabit(null);
                    setFormData({ name: '', description: '', xp_reward: 5 });
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingHabit ? 'Update Habit' : 'Create Habit'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Habits List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {habits.length > 0 ? (
              habits.map((habit) => {
                const checkedToday = isCheckedToday(habit);
                
                return (
                  <motion.div
                    key={habit.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Card className={`transition-all duration-200 ${
                      checkedToday 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                        : 'hover:shadow-md'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCheck(habit)}
                              disabled={checkedToday}
                              className={`mt-1 rounded-full p-2 transition-colors ${
                                checkedToday
                                  ? 'bg-green-500 text-white'
                                  : 'border-2 border-muted-foreground hover:border-primary hover:bg-primary/10'
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </motion.button>
                            
                            <div className="flex-1">
                              <h3 className={`font-semibold text-lg ${
                                checkedToday ? 'text-green-700 dark:text-green-300' : ''
                              }`}>
                                {habit.name}
                              </h3>
                              {habit.description && (
                                <p className="text-muted-foreground mt-1">
                                  {habit.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-3">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Flame className={`h-3 w-3 ${getStreakColor(habit.streak)}`} />
                                  {habit.streak} day streak
                                </Badge>
                                <Badge variant={checkedToday ? 'default' : 'secondary'}>
                                  <Star className="h-3 w-3 mr-1" />
                                  {habit.xp_reward} XP
                                </Badge>
                                {checkedToday && (
                                  <Badge className="bg-green-500">
                                    ✓ Done Today
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!checkedToday && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(habit)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(habit.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first habit to start building consistency!
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Habit
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <XPFloatingText gains={xpGains} />
      </div>
    </div>
  );
};

export default Habits;