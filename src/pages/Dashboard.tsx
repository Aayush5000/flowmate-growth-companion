import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckSquare, Target, Trophy, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useBadges } from '@/hooks/useBadges';

const Dashboard = () => {
  const { profile } = useProfile();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { badges } = useBadges();

  const completedTasksToday = tasks.filter(task => 
    task.completed && 
    new Date(task.completed_at!).toDateString() === new Date().toDateString()
  ).length;

  const activeHabits = habits.filter(habit => habit.streak > 0).length;

  const nextXPMilestone = Math.ceil((profile?.xp || 0) / 100) * 100;
  const xpProgress = ((profile?.xp || 0) % 100);

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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground text-lg">
            Ready to flow into productivity?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.xp || 0}</div>
                <div className="mt-2">
                  <Progress value={xpProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {100 - xpProgress} XP to {nextXPMilestone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasksToday}</div>
                <p className="text-xs text-muted-foreground">
                  Tasks completed today
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeHabits}</div>
                <p className="text-xs text-muted-foreground">
                  Habits with active streaks
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{badges.length}</div>
                <p className="text-xs text-muted-foreground">
                  Achievement badges
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump into your most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/tasks">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Task
                  </Button>
                </Link>
                <Link to="/habits">
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Check Habits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>
                  Your latest achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="space-y-2">
                    {badges.slice(0, 3).map((badge) => (
                      <motion.div
                        key={badge.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <Trophy className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{badge.badge_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(badge.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Complete tasks to earn your first badges!
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Tasks Preview */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>
                    Your latest task activity
                  </CardDescription>
                </div>
                <Link to="/tasks">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        task.completed 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                          : 'bg-card'
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full ${
                        task.completed ? 'bg-green-500' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-medium ${
                          task.completed ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={task.completed ? 'default' : 'secondary'}>
                        +{task.xp_reward} XP
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No tasks yet. Create your first task to get started!
                  </p>
                  <Link to="/tasks">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Task
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;