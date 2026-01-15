'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Dumbbell, Utensils, Moon, Sun, 
  TrendingUp, Heart, Flame, Target, Calendar,
  Plus, Clock, Award, BarChart3, Bell, Water,
  Footprints, TrendingDown, CheckCircle, AlertCircle
} from 'lucide-react'

// Health Metrics Constants
const HEALTH_METRICS = [
  {
    id: 'calories_burned',
    label: 'Calories Burned',
    value: '420',
    unit: 'kcal',
    progress: 70,
    target: 600,
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    status: 'increasing' as const
  },
  {
    id: 'active_minutes',
    label: 'Active Minutes',
    value: '45',
    unit: 'min',
    progress: 60,
    target: 75,
    icon: Activity,
    color: 'from-green-500 to-emerald-500',
    status: 'increasing' as const
  },
  {
    id: 'heart_rate',
    label: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    progress: 85,
    target: 85,
    icon: Heart,
    color: 'from-red-500 to-rose-500',
    status: 'stable' as const
  },
  {
    id: 'sleep_quality',
    label: 'Sleep Quality',
    value: '8.2',
    unit: 'hrs',
    progress: 90,
    target: 9,
    icon: Moon,
    color: 'from-blue-500 to-indigo-500',
    status: 'good' as const
  }
] as const

// Vitals History Data
const VITALS_DATA = [
  { date: 'Mon', heartRate: 68, calories: 380, steps: 8200, sleep: 7.5 },
  { date: 'Tue', heartRate: 72, calories: 420, steps: 8450, sleep: 8.2 },
  { date: 'Wed', heartRate: 70, calories: 390, steps: 7800, sleep: 7.8 },
  { date: 'Thu', heartRate: 75, calories: 450, steps: 9200, sleep: 8.5 },
  { date: 'Fri', heartRate: 71, calories: 410, steps: 8650, sleep: 8.0 },
  { date: 'Sat', heartRate: 69, calories: 395, steps: 10200, sleep: 8.3 },
  { date: 'Sun', heartRate: 73, calories: 425, steps: 9800, sleep: 8.7 }
] as const

// Workout Plans
const WORKOUT_PLANS = [
  { 
    id: 1, 
    name: 'Morning Yoga', 
    duration: '30 min', 
    calories: '180', 
    type: 'Flexibility',
    time: '06:00 AM',
    completed: true,
    difficulty: 'Easy'
  },
  { 
    id: 2, 
    name: 'Weight Training', 
    duration: '45 min', 
    calories: '320', 
    type: 'Strength',
    time: '08:00 AM',
    completed: true,
    difficulty: 'Moderate'
  },
  { 
    id: 3, 
    name: 'Evening Run', 
    duration: '25 min', 
    calories: '280', 
    type: 'Cardio',
    time: '06:30 PM',
    completed: false,
    difficulty: 'Hard'
  }
] as const

// Daily Goals
const DAILY_GOALS = [
  { id: 'exercise', label: 'Morning Exercise', completed: true },
  { id: 'breakfast', label: 'Healthy Breakfast', completed: true },
  { id: 'steps', label: '10,000 Steps', completed: false },
  { id: 'meditation', label: 'Meditation', completed: false }
] as const

export default function HealthFitnessTracker() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [waterIntake, setWaterIntake] = useState(1500)
  const [stepCount, setStepCount] = useState(8450)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [workoutFilter, setWorkoutFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Filtered workouts based on selection
  const filteredWorkouts = useMemo(() => {
    if (workoutFilter === 'all') return WORKOUT_PLANS
    return WORKOUT_PLANS.filter(w => w.type.toLowerCase() === workoutFilter.toLowerCase())
  }, [workoutFilter])

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    return {
      totalCalories: VITALS_DATA.reduce((sum, day) => sum + day.calories, 0),
      avgHeartRate: Math.round(VITALS_DATA.reduce((sum, day) => sum + day.heartRate, 0) / VITALS_DATA.length),
      totalSteps: VITALS_DATA.reduce((sum, day) => sum + day.steps, 0),
      avgSleep: (VITALS_DATA.reduce((sum, day) => sum + day.sleep, 0) / VITALS_DATA.length).toFixed(1)
    }
  }, [])

  const handleWaterIntake = useCallback((increment: boolean) => {
    setWaterIntake(prev => increment ? prev + 250 : Math.max(0, prev - 250))
  }, [])

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'Flexibility': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Strength': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cardio': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className='bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen flex flex-col'>
      {/* Header */}
      <header 
        data-template-section='header' 
        className='p-6 bg-white/90 backdrop-blur-sm border-b border-emerald-100'
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full'>
              <Activity className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>FitTrack Pro</h1>
              <p className='text-gray-600'>Your personal health companion</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='day'>Today</SelectItem>
                <SelectItem value='week'>This Week</SelectItem>
                <SelectItem value='month'>This Month</SelectItem>
                <SelectItem value='year'>This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='ghost' size='icon'>
              <Bell className='w-5 h-5' />
            </Button>
            <Avatar>
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Welcome & Daily Stats */}
        <section data-template-section='welcome-stats' data-component-type='hero-card'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className='lg:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg'>
              <CardContent className='p-8'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h2 className='text-2xl font-bold mb-2'>Good Morning, Alex!</h2>
                    <p className='opacity-90'>You're doing great! Keep up the good work.</p>
                  </div>
                  <Badge variant='secondary' className='bg-white/20'>
                    <TrendingUp className='w-4 h-4 mr-1' />
                    +12% this week
                  </Badge>
                </div>
                
                <div className='grid grid-cols-2 gap-6 mt-8'>
                  <motion.div 
                    className='bg-white/10 p-4 rounded-xl'
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm'>Daily Steps</span>
                      <Target className='w-4 h-4' />
                    </div>
                    <h3 className='text-2xl font-bold'>{stepCount.toLocaleString()}</h3>
                    <Progress value={85} className='mt-2 bg-white/20' />
                    <span className='text-sm opacity-90'>85% of 10,000 goal</span>
                  </motion.div>
                  
                  <motion.div 
                    className='bg-white/10 p-4 rounded-xl'
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm'>Water Intake</span>
                      <span className='text-sm'>{waterIntake}ml</span>
                    </div>
                    <h3 className='text-2xl font-bold'>6 / 8</h3>
                    <div className='flex space-x-1 mt-2'>
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-8 rounded transition-all cursor-pointer ${
                            i < 6 ? 'bg-white' : 'bg-white/20 hover:bg-white/30'
                          }`}
                          onClick={() => i >= 6 && handleWaterIntake(true)}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Health Metrics Grid */}
        <section data-template-section='health-metrics' data-component-type='kpi-grid' data-metrics='calories,activity,heart-rate,sleep'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Health Metrics</h2>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='day'>Today</SelectItem>
                <SelectItem value='week'>This Week</SelectItem>
                <SelectItem value='month'>This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {HEALTH_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='border border-emerald-100 hover:shadow-lg transition-all h-full'>
                    <CardContent className='p-6'>
                      <div className='flex items-center justify-between mb-4'>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg`}>
                          <metric.icon className='w-6 h-6 text-white' />
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant='outline' className='border-emerald-200'>
                                {metric.progress}%
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              Target: {metric.target} {metric.unit}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <h3 className='text-3xl font-bold text-gray-900'>
                        {metric.value}
                        <span className='text-sm text-gray-600 ml-1'>{metric.unit}</span>
                      </h3>
                      <p className='text-gray-600 text-sm mt-1'>{metric.label}</p>
                      <Progress value={metric.progress} className='mt-4 bg-gray-100' />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
        {/* Weekly Progress Chart */}
        <section data-template-section='progress-chart' data-chart-type='line' data-metrics='heart-rate,calories,steps'>
          <Card className='border border-emerald-100 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Weekly Progress</CardTitle>
                  <CardDescription>Your fitness trends over the past week</CardDescription>
                </div>
                <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                  <TrendingUp className='w-3 h-3 mr-1' />
                  +8% from last week
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={VITALS_DATA}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' stroke='#666' />
                  <YAxis yAxisId='left' stroke='#666' />
                  <YAxis yAxisId='right' orientation='right' stroke='#666' />
                  <TooltipProvider>
                    <Tooltip />
                  </TooltipProvider>
                  <Legend />
                  <Line 
                    yAxisId='left'
                    type='monotone' 
                    dataKey='heartRate' 
                    stroke='#ef4444' 
                    strokeWidth={2}
                    name='Heart Rate (bpm)'
                  />
                  <Line 
                    yAxisId='left'
                    type='monotone' 
                    dataKey='calories' 
                    stroke='#f97316' 
                    strokeWidth={2}
                    name='Calories'
                  />
                  <Line 
                    yAxisId='right'
                    type='monotone' 
                    dataKey='steps' 
                    stroke='#10b981' 
                    strokeWidth={2}
                    name='Steps'
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Workouts & Nutrition */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='workouts' data-component-type='workout-list'>
            <Card className='border border-emerald-100'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center'>
                    <Dumbbell className='w-5 h-5 mr-2 text-emerald-600' />
                    Today's Workouts
                  </CardTitle>
                  <Select value={workoutFilter} onValueChange={setWorkoutFilter}>
                    <SelectTrigger className='w-32'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='flexibility'>Flexibility</SelectItem>
                      <SelectItem value='strength'>Strength</SelectItem>
                      <SelectItem value='cardio'>Cardio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredWorkouts.map((workout) => (
                      <motion.div
                        key={workout.id}
                        layoutId={`workout-${workout.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className='flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:shadow-md transition-shadow'
                      >
                        <div>
                          <div className='flex items-center space-x-2'>
                            <h4 className='font-medium'>{workout.name}</h4>
                            {workout.completed && (
                              <CheckCircle className='w-4 h-4 text-emerald-600' />
                            )}
                          </div>
                          <div className='flex items-center space-x-4 mt-1 text-sm text-gray-600'>
                            <span className='flex items-center'>
                              <Clock className='w-3 h-3 mr-1' />
                              {workout.duration}
                            </span>
                            <span className='flex items-center'>
                              <Flame className='w-3 h-3 mr-1' />
                              {workout.calories} kcal
                            </span>
                            <span className='flex items-center'>
                              <Calendar className='w-3 h-3 mr-1' />
                              {workout.time}
                            </span>
                          </div>
                        </div>
                        <Badge className={getWorkoutTypeColor(workout.type)}>
                          {workout.type}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Button variant='outline' className='w-full border-dashed border-emerald-200'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='nutrition' data-component-type='nutrition-tracker'>
            <Card className='border border-emerald-100'>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Utensils className='w-5 h-5 mr-2 text-amber-600' />
                  Nutrition Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div>
                    <div className='flex justify-between text-sm text-gray-600 mb-2'>
                      <span>Calories</span>
                      <span>1,850 / 2,200</span>
                    </div>
                    <Progress value={84} className='h-2' />
                  </div>
                  
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    {[
                      { label: 'Protein', value: '45g', color: 'bg-blue-500', progress: 75 },
                      { label: 'Carbs', value: '180g', color: 'bg-amber-500', progress: 85 },
                      { label: 'Fat', value: '65g', color: 'bg-red-500', progress: 80 }
                    ].map((nutrient, i) => (
                      <motion.div 
                        key={i} 
                        className='space-y-2'
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className={`h-2 rounded-full ${nutrient.color}`} />
                        <div>
                          <p className='font-medium'>{nutrient.value}</p>
                          <p className='text-sm text-gray-600'>{nutrient.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  <div className='space-y-3'>
                    <h4 className='font-semibold text-sm'>Today's Meals</h4>
                    {[
                      { name: 'Breakfast', calories: 450, time: '08:00 AM' },
                      { name: 'Lunch', calories: 680, time: '12:30 PM' },
                      { name: 'Snack', calories: 200, time: '03:00 PM' },
                      { name: 'Dinner', calories: 520, time: '07:00 PM' }
                    ].map((meal, i) => (
                      <div key={i} className='flex items-center justify-between p-3 bg-amber-50 rounded-lg'>
                        <div>
                          <p className='font-medium'>{meal.name}</p>
                          <p className='text-xs text-gray-600'>{meal.time}</p>
                        </div>
                        <Badge variant='outline' className='border-amber-200'>
                          {meal.calories} kcal
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button variant='default' className='w-full bg-gradient-to-r from-emerald-500 to-teal-500'>
                    <Plus className='w-4 h-4 mr-2' />
                    Log Meal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Achievements */}
        <section data-template-section='achievements' data-component-type='achievement-grid'>
          <Card className='border border-emerald-100'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Award className='w-5 h-5 mr-2 text-amber-500' />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                className='grid grid-cols-2 md:grid-cols-4 gap-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {[
                  { title: '5 Day Streak', desc: 'Workout consistency', icon: '🔥', color: 'from-orange-50 to-red-50' },
                  { title: 'Hydration Hero', desc: '7 days water goal', icon: '💧', color: 'from-blue-50 to-cyan-50' },
                  { title: 'Early Bird', desc: '5AM workout week', icon: '🌅', color: 'from-yellow-50 to-amber-50' },
                  { title: 'Zen Master', desc: 'Meditation streak', icon: '🧘', color: 'from-purple-50 to-pink-50' }
                ].map((achievement, i) => (
                  <motion.div 
                    key={i} 
                    className={`text-center p-4 bg-gradient-to-br ${achievement.color} rounded-xl hover:shadow-lg transition-shadow`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className='text-3xl mb-2'>{achievement.icon}</div>
                    <h4 className='font-bold text-gray-900'>{achievement.title}</h4>
                    <p className='text-sm text-gray-600 mt-1'>{achievement.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </section>

        {/* Daily Goals Summary */}
        <section data-template-section='daily-goals' data-component-type='goal-tracker'>
          <Card className='border border-emerald-100'>
            <CardHeader>
              <CardTitle className='text-gray-900'>Today's Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {DAILY_GOALS.map((goal, i) => (
                  <motion.div 
                    key={goal.id}
                    className='flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className={goal.completed ? 'line-through text-gray-500' : 'font-medium'}>
                      {goal.label}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      goal.completed ? 'bg-emerald-500 text-white' : 'bg-gray-200'
                    }`}>
                      {goal.completed && <CheckCircle className='w-5 h-5' />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}