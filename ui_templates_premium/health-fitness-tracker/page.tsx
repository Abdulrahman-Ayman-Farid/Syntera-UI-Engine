'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  Activity, Dumbbell, Utensils, Moon, Sun, 
  TrendingUp, Heart, Flame, Target, Calendar,
  Plus, Clock, Award, BarChart3, Bell
} from 'lucide-react'

export default function HealthFitnessTracker() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [waterIntake, setWaterIntake] = useState(1500)
  const [stepCount, setStepCount] = useState(8450)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const healthMetrics = [
    { label: 'Calories Burned', value: '420', unit: 'kcal', icon: Flame, progress: 70, color: 'text-orange-500' },
    { label: 'Active Minutes', value: '45', unit: 'min', icon: Activity, progress: 60, color: 'text-green-500' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, progress: 85, color: 'text-red-500' },
    { label: 'Sleep Quality', value: '8.2', unit: 'hrs', icon: Moon, progress: 90, color: 'text-blue-500' },
  ]

  const workouts = [
    { id: 1, name: 'Morning Yoga', duration: '30 min', calories: '180', type: 'Flexibility' },
    { id: 2, name: 'Weight Training', duration: '45 min', calories: '320', type: 'Strength' },
    { id: 3, name: 'Evening Run', duration: '25 min', calories: '280', type: 'Cardio' },
  ]

  return (
    <div className='bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen flex flex-col'>
      <header className='p-6 bg-white/90 backdrop-blur-sm border-b border-emerald-100'>
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
        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Card className='lg:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white'>
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
                <div className='bg-white/10 p-4 rounded-xl'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm'>Daily Steps</span>
                    <Target className='w-4 h-4' />
                  </div>
                  <h3 className='text-2xl font-bold'>{stepCount.toLocaleString()}</h3>
                  <Progress value={85} className='mt-2 bg-white/20' />
                  <span className='text-sm opacity-90'>85% of 10,000 goal</span>
                </div>
                
                <div className='bg-white/10 p-4 rounded-xl'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm'>Water Intake</span>
                    <span className='text-sm'>{waterIntake}ml</span>
                  </div>
                  <div className='flex space-x-1 mt-2'>
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 h-8 rounded ${i < 6 ? 'bg-white' : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border border-emerald-100'>
            <CardHeader>
              <CardTitle className='text-gray-900'>Today's Goals</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {[
                { label: 'Morning Exercise', completed: true },
                { label: 'Healthy Breakfast', completed: true },
                { label: '10,000 Steps', completed: false },
                { label: 'Meditation', completed: false },
              ].map((goal, i) => (
                <div key={i} className='flex items-center justify-between'>
                  <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                    {goal.label}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    goal.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100'
                  }`}>
                    {goal.completed ? '✓' : ''}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Health Metrics */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Health Metrics</h2>
            <Select defaultValue='week'>
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

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {healthMetrics.map((metric, i) => (
              <Card key={i} className='border border-emerald-100 hover:shadow-lg transition-shadow'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    <Badge variant='outline' className='border-emerald-200'>
                      {metric.progress}%
                    </Badge>
                  </div>
                  <h3 className='text-3xl font-bold text-gray-900'>
                    {metric.value}<span className='text-sm text-gray-600 ml-1'>{metric.unit}</span>
                  </h3>
                  <p className='text-gray-600 text-sm mt-1'>{metric.label}</p>
                  <Progress value={metric.progress} className='mt-4 bg-gray-100' />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workouts & Nutrition */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Card className='border border-emerald-100'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Dumbbell className='w-5 h-5 mr-2 text-emerald-600' />
                Today's Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {workouts.map((workout) => (
                  <div key={workout.id} className='flex items-center justify-between p-4 bg-emerald-50 rounded-lg'>
                    <div>
                      <h4 className='font-medium'>{workout.name}</h4>
                      <div className='flex items-center space-x-4 mt-1 text-sm text-gray-600'>
                        <span className='flex items-center'>
                          <Clock className='w-3 h-3 mr-1' />
                          {workout.duration}
                        </span>
                        <span className='flex items-center'>
                          <Flame className='w-3 h-3 mr-1' />
                          {workout.calories} kcal
                        </span>
                      </div>
                    </div>
                    <Badge className='bg-emerald-100 text-emerald-800 border-emerald-200'>
                      {workout.type}
                    </Badge>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-emerald-200'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Workout
                </Button>
              </div>
            </CardContent>
          </Card>

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
                    { label: 'Protein', value: '45g', color: 'bg-blue-500' },
                    { label: 'Carbs', value: '180g', color: 'bg-amber-500' },
                    { label: 'Fat', value: '65g', color: 'bg-red-500' },
                  ].map((nutrient, i) => (
                    <div key={i} className='space-y-2'>
                      <div className={`h-2 rounded-full ${nutrient.color}`} />
                      <div>
                        <p className='font-medium'>{nutrient.value}</p>
                        <p className='text-sm text-gray-600'>{nutrient.label}</p>
                      </div>
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
        </div>

        {/* Achievements */}
        <Card className='border border-emerald-100'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Award className='w-5 h-5 mr-2 text-amber-500' />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {[
                { title: '5 Day Streak', desc: 'Workout consistency', icon: '🔥' },
                { title: 'Hydration Hero', desc: '7 days water goal', icon: '💧' },
                { title: 'Early Bird', desc: '5AM workout week', icon: '🌅' },
                { title: 'Zen Master', desc: 'Meditation streak', icon: '🧘' },
              ].map((achievement, i) => (
                <div key={i} className='text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl'>
                  <div className='text-3xl mb-2'>{achievement.icon}</div>
                  <h4 className='font-bold text-gray-900'>{achievement.title}</h4>
                  <p className='text-sm text-gray-600 mt-1'>{achievement.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}