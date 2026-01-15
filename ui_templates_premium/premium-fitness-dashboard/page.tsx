'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Heart, Dumbbell, Flame, TrendingUp, TrendingDown,
  Users, Calendar, Target, Award, Plus, Search, Filter,
  Clock, Footprints, Zap, Moon, Apple, Droplet, Trophy,
  BarChart3, PieChart as PieChartIcon, CheckCircle, AlertTriangle
} from 'lucide-react'

// Fitness metrics derived from data_types
const FITNESS_METRICS = [
  {
    id: 'active_minutes',
    label: 'Active Minutes',
    value: '385',
    change: '+12%',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    format: 'time'
  },
  {
    id: 'calories_burned',
    label: 'Calories Burned',
    value: '2,450',
    unit: 'kcal',
    change: '+8%',
    status: 'increasing' as const,
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    format: 'calories'
  },
  {
    id: 'workouts',
    label: 'Workouts',
    value: '24',
    change: '+6',
    status: 'increasing' as const,
    icon: Dumbbell,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'heart_rate_avg',
    label: 'Avg Heart Rate',
    value: '72',
    unit: 'bpm',
    change: '-2 bpm',
    status: 'good' as const,
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
    format: 'bpm'
  }
] as const

const WORKOUT_TYPES = [
  { type: 'Cardio', sessions: 45, calories: 3200, color: '#3b82f6', icon: Footprints },
  { type: 'Strength', sessions: 32, calories: 2100, color: '#8b5cf6', icon: Dumbbell },
  { type: 'Yoga', sessions: 24, calories: 1400, color: '#10b981', icon: Moon },
  { type: 'HIIT', sessions: 18, calories: 2800, color: '#f59e0b', icon: Zap },
] as const

const RECENT_WORKOUTS = [
  {
    id: 'workout-001',
    name: 'Morning Cardio',
    type: 'cardio',
    duration: 45,
    calories: 420,
    date: '2 hours ago',
    intensity: 'high',
    status: 'completed',
    emoji: '🏃‍♂️'
  },
  {
    id: 'workout-002',
    name: 'Upper Body Strength',
    type: 'strength',
    duration: 60,
    calories: 350,
    date: '1 day ago',
    intensity: 'medium',
    status: 'completed',
    emoji: '💪'
  },
  {
    id: 'workout-003',
    name: 'Yoga Flow',
    type: 'yoga',
    duration: 30,
    calories: 150,
    date: '2 days ago',
    intensity: 'low',
    status: 'completed',
    emoji: '🧘‍♀️'
  },
  {
    id: 'workout-004',
    name: 'HIIT Circuit',
    type: 'hiit',
    duration: 35,
    calories: 480,
    date: '3 days ago',
    intensity: 'high',
    status: 'completed',
    emoji: '⚡'
  },
] as const

const WEEKLY_DATA = [
  { day: 'Mon', calories: 2100, minutes: 45, heartRate: 75 },
  { day: 'Tue', calories: 2350, minutes: 60, heartRate: 72 },
  { day: 'Wed', calories: 1980, minutes: 40, heartRate: 74 },
  { day: 'Thu', calories: 2580, minutes: 70, heartRate: 71 },
  { day: 'Fri', calories: 2420, minutes: 55, heartRate: 73 },
  { day: 'Sat', calories: 2890, minutes: 85, heartRate: 70 },
  { day: 'Sun', calories: 2120, minutes: 50, heartRate: 72 },
] as const

export default function FitnessDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredWorkouts = useMemo(() => {
    return RECENT_WORKOUTS.filter(workout => {
      const matchesSearch = searchQuery === '' ||
        workout.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' ||
        workout.type === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg'>
                <Activity className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>FitPro Dashboard</h1>
                <p className='text-gray-600'>Track your fitness journey</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Log Workout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Fitness Overview */}
        <section data-template-section='fitness-overview' data-component-type='kpi-grid'>
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {FITNESS_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-500'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing'
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            )}
                            {metric.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg`}>
                          <metric.icon className='w-6 h-6 text-white' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Workout Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Workout Distribution */}
          <section data-template-section='workout-distribution' data-chart-type='bar' data-metrics='sessions,calories'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Workout Distribution</CardTitle>
                    <CardDescription>Sessions by type and calories</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={WORKOUT_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='sessions' name='Sessions' radius={[4, 4, 0, 0]}>
                      {WORKOUT_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Weekly Progress */}
          <section data-template-section='weekly-progress' data-chart-type='line' data-metrics='calories,minutes,heartRate'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Weekly Progress</CardTitle>
                    <CardDescription>Daily fitness metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={WEEKLY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line
                      yAxisId='left'
                      type='monotone'
                      dataKey='calories'
                      stroke='#f59e0b'
                      strokeWidth={2}
                      name='Calories'
                    />
                    <Line
                      yAxisId='left'
                      type='monotone'
                      dataKey='minutes'
                      stroke='#3b82f6'
                      strokeWidth={2}
                      name='Minutes'
                    />
                    <Line
                      yAxisId='right'
                      type='monotone'
                      dataKey='heartRate'
                      stroke='#10b981'
                      strokeWidth={2}
                      name='Heart Rate'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Recent Workouts & Quick Stats */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Recent Workouts */}
          <section data-template-section='recent-workouts' data-component-type='workout-list' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Workouts</CardTitle>
                    <CardDescription>Latest fitness activities</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search workouts...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                      startIcon={Search}
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='cardio'>Cardio</SelectItem>
                        <SelectItem value='strength'>Strength</SelectItem>
                        <SelectItem value='yoga'>Yoga</SelectItem>
                        <SelectItem value='hiit'>HIIT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredWorkouts.map((workout) => (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedWorkout === workout.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedWorkout(workout.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{workout.emoji}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold'>{workout.name}</h4>
                              <Badge className={getIntensityColor(workout.intensity)}>
                                {workout.intensity}
                              </Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {workout.duration} min
                              </span>
                              <span className='flex items-center'>
                                <Flame className='w-3 h-3 mr-1' />
                                {workout.calories} kcal
                              </span>
                              <span className='flex items-center'>
                                <Calendar className='w-3 h-3 mr-1' />
                                {workout.date}
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Heart className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Target className='w-4 h-4' />
                                </Button>
                              </div>
                              <CheckCircle className='w-4 h-4 text-emerald-500' />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Stats & Goals */}
          <section data-template-section='quick-stats' data-component-type='stats-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Goals & Achievements</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {[
                  { icon: Target, label: 'Weekly Goal', current: 385, target: 450, color: 'from-blue-500 to-cyan-500', unit: 'min' },
                  { icon: Flame, label: 'Calorie Target', current: 2450, target: 3000, color: 'from-orange-500 to-red-500', unit: 'kcal' },
                  { icon: Trophy, label: 'Workout Streak', current: 7, target: 10, color: 'from-purple-500 to-pink-500', unit: 'days' },
                ].map((goal, i) => (
                  <div key={i}>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center space-x-2'>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${goal.color}`}>
                          <goal.icon className='w-4 h-4 text-white' />
                        </div>
                        <span className='text-sm font-medium'>{goal.label}</span>
                      </div>
                      <span className='text-sm text-gray-600'>
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className='h-2' />
                  </div>
                ))}

                <Separator className='my-6' />

                <div className='space-y-4'>
                  <div className='p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <Award className='w-5 h-5 text-emerald-600' />
                        <div>
                          <div className='font-medium'>Achievement Unlocked!</div>
                          <div className='text-sm text-emerald-600'>7-Day Streak</div>
                        </div>
                      </div>
                      <CheckCircle className='w-5 h-5 text-emerald-500' />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    {[
                      { icon: Droplet, label: 'Water Intake', value: '2.1L / 3.0L', color: 'from-blue-500 to-cyan-500' },
                      { icon: Moon, label: 'Sleep Quality', value: '7.5h / 8h', color: 'from-purple-500 to-pink-500' },
                      { icon: Apple, label: 'Nutrition Score', value: '85/100', color: 'from-emerald-500 to-teal-500' },
                    ].map((stat, i) => (
                      <Button
                        key={i}
                        variant='outline'
                        className='w-full justify-start border-gray-300 hover:border-blue-300 h-14'
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mr-3 flex items-center justify-center`}>
                          <stat.icon className='w-5 h-5 text-white' />
                        </div>
                        <div className='flex-1 text-left'>
                          <div className='text-sm font-medium'>{stat.label}</div>
                          <div className='text-xs text-gray-600'>{stat.value}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
