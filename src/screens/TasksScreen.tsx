import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/GameContext';
import { TaskCard } from '@/components/TaskCard';
import { XPFloatingText } from '@/components/XPFloatingText';

export const TasksScreen: React.FC = () => {
  const { tasks, addTask, completeTask, deleteTask, recentXPGains } = useGame();
  const [filter, setFilter] = useState<'all' | 'task' | 'habit'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<'task' | 'habit'>('task');

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.type === filter
  );

  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskType);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <XPFloatingText gains={recentXPGains} />
      
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tasks & Habits</h1>
            <p className="text-sm text-muted-foreground">
              {activeTasks.length} active • {completedTasks.length} completed
            </p>
          </div>
          
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground hover:scale-110 transition-transform duration-300 rounded-full h-12 w-12 p-0">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">Title</Label>
                  <Input
                    id="title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task or habit..."
                    className="bg-muted border-border text-foreground"
                    onKeyDown={(e) => e.key === 'Enter' ? handleAddTask() : null}
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-foreground">Type</Label>
                  <Select value={newTaskType} onValueChange={(value: 'task' | 'habit') => setNewTaskType(value)}>
                    <SelectTrigger className="bg-muted border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border">
                      <SelectItem value="task" className="text-foreground">Task (one-time)</SelectItem>
                      <SelectItem value="habit" className="text-foreground">Habit (recurring)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddTask} className="w-full bg-gradient-primary text-primary-foreground">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(value: 'all' | 'task' | 'habit') => setFilter(value)}>
            <SelectTrigger className="w-32 bg-muted border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="all" className="text-foreground">All</SelectItem>
              <SelectItem value="task" className="text-foreground">Tasks</SelectItem>
              <SelectItem value="habit" className="text-foreground">Habits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Active Items</h2>
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Completed Today</h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <Card className="p-8 text-center bg-surface border-card-border">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-foreground mb-2">No {filter !== 'all' ? filter + 's' : 'items'} yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first {filter !== 'all' ? filter : 'task or habit'}!
            </p>
            <Button 
              onClick={() => setIsAddingTask(true)}
              className="bg-gradient-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};