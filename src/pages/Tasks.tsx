import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/hooks/useTasks';
import { XPFloatingText } from '@/components/XPFloatingText';

const Tasks = () => {
  const { tasks, loading, createTask, completeTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    xp_reward: 10
  });
  const [xpGains, setXpGains] = useState<{ id: string; amount: number; timestamp: number }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      await updateTask(editingTask.id, formData);
      setEditingTask(null);
      toast({
        title: 'Task Updated',
        description: 'Your task has been updated successfully.'
      });
    } else {
      await createTask(formData);
      toast({
        title: 'Task Created',
        description: 'New task added to your list!'
      });
    }
    
    setFormData({ title: '', description: '', xp_reward: 10 });
    setIsDialogOpen(false);
  };

  const handleComplete = async (task: any) => {
    if (task.completed) return;
    
    await completeTask(task.id);
    
    // Add XP floating animation
    const newGain = {
      id: `xp-${Date.now()}`,
      amount: task.xp_reward,
      timestamp: Date.now()
    };
    setXpGains(prev => [...prev, newGain]);
    
    setTimeout(() => {
      setXpGains(prev => prev.filter(gain => gain.id !== newGain.id));
    }, 2000);
    
    toast({
      title: 'Task Completed! 🎉',
      description: `Great job! You earned ${task.xp_reward} XP.`
    });
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      xp_reward: task.xp_reward
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed from your list.'
    });
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
            <h1 className="text-4xl font-bold mb-2">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your daily tasks and earn XP
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
                <DialogDescription>
                  {editingTask 
                    ? 'Update your task details below.' 
                    : 'Add a new task to your productivity journey.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add more details..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="xp_reward">XP Reward</Label>
                  <Input
                    id="xp_reward"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', xp_reward: 10 });
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <Card className={`transition-all duration-200 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                      : 'hover:shadow-md'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleComplete(task)}
                            disabled={task.completed}
                            className={`mt-1 rounded-full p-1 transition-colors ${
                              task.completed
                                ? 'bg-green-500 text-white'
                                : 'border-2 border-muted-foreground hover:border-primary hover:bg-primary/10'
                            }`}
                          >
                            <CheckSquare className="h-4 w-4" />
                          </motion.button>
                          
                          <div className="flex-1">
                            <h3 className={`font-semibold text-lg ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={task.completed ? 'default' : 'secondary'}>
                                <Star className="h-3 w-3 mr-1" />
                                {task.xp_reward} XP
                              </Badge>
                              {task.completed && task.completed_at && (
                                <Badge variant="outline">
                                  Completed {new Date(task.completed_at).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!task.completed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(task.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first task to start earning XP!
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Task
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

export default Tasks;