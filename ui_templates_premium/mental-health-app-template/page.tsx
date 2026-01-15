'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
} from '@/components/ui/tooltip'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, ChevronRight, UserCircle, TrendingUp, 
  AlertTriangle, Heart, Brain, Smile, Frown, Meh, Activity,
  Calendar, Clock, MessageSquare, BookOpen, Target, Award,
  CheckCircle, TrendingDown, Users, BarChart3, Sun, Moon,
  Coffee, Droplet, Zap, Settings, Download, Share2
} from 'lucide-react'

// Mental health metrics with TypeScript constants
const MENTAL_HEALTH_METRICS = [
  {
    id: 'total_users',
    label: 'Active Users',
    value: '1,842',
    change: '+124',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'avg_mood',
    label: 'Average Mood',
    value: '7.4',
    unit: '/10',
    change: '+0.8',
    status: 'good' as const,
    icon: Smile,
    color: 'from-emerald-500 to-teal-500',
    format: 'score'
  },
  {
    id: 'therapy_sessions',
    label: 'Sessions Today',
    value: '48',
    change: '+12',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'wellness_score',
    label: 'Wellness Score',
    value: '82',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: Heart,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const MOOD_TRENDS = [
  { date: 'Mon', mood: 6.5, anxiety: 4.2, energy: 7.0, sleep: 6.8 },
  { date: 'Tue', mood: 7.2, anxiety: 3.8, energy: 7.5, sleep: 7.2 },
  { date: 'Wed', mood: 6.8, anxiety: 4.5, energy: 6.5, sleep: 6.5 },
  { date: 'Thu', mood: 7.8, anxiety: 3.2, energy: 8.0, sleep: 7.8 },
  { date: 'Fri', mood: 8.2, anxiety: 2.8, energy: 8.5, sleep: 8.0 },
  { date: 'Sat', mood: 7.5, anxiety: 3.5, energy: 7.8, sleep: 7.5 },
  { date: 'Sun', mood: 7.0, anxiety: 4.0, energy: 7.2, sleep: 7.0 },
] as const

const WELLNESS_ACTIVITIES = [
  { activity: 'Meditation', sessions: 145, duration: 2420, color: '#8b5cf6' },
  { activity: 'Journaling', sessions: 98, duration: 1470, color: '#3b82f6' },
  { activity: 'Exercise', sessions: 72, duration: 2160, color: '#10b981' },
  { activity: 'Therapy', sessions: 48, duration: 2400, color: '#f59e0b' },
] as const

const USERS_DATA = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.m@example.com',
    status: 'Active' as const,
    moodScore: 8.2,
    lastSession: '2 hours ago',
    sessionsCount: 24,
    priority: 'low' as const,
    avatar: 'SM'
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'james.w@example.com',
    status: 'Active' as const,
    moodScore: 6.5,
    lastSession: '1 day ago',
    sessionsCount: 18,
    priority: 'medium' as const,
    avatar: 'JW'
  },
  {
    id: 3,
    name: 'Emily Chen',
    email: 'emily.c@example.com',
    status: 'Inactive' as const,
    moodScore: 5.2,
    lastSession: '1 week ago',
    sessionsCount: 12,
    priority: 'high' as const,
    avatar: 'EC'
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    status: 'Active' as const,
    moodScore: 7.8,
    lastSession: '5 hours ago',
    sessionsCount: 31,
    priority: 'low' as const,
    avatar: 'MB'
  },
] as const

const JOURNAL_ENTRIES = [
  {
    id: 'entry-001',
    user: 'Sarah Mitchell',
    date: '2024-02-05',
    time: '2:30 PM',
    mood: 'positive' as const,
    title: 'Feeling grateful today',
    preview: 'Had a wonderful therapy session. Practicing mindfulness has really helped...',
    tags: ['gratitude', 'mindfulness', 'progress'] as const
  },
  {
    id: 'entry-002',
    user: 'James Wilson',
    date: '2024-02-05',
    time: '10:15 AM',
    mood: 'neutral' as const,
    title: 'Working through challenges',
    preview: 'Some ups and downs today, but staying committed to my wellness routine...',
    tags: ['reflection', 'resilience'] as const
  },
  {
    id: 'entry-003',
    user: 'Michael Brown',
    date: '2024-02-04',
    time: '8:45 PM',
    mood: 'positive' as const,
    title: 'Breakthrough moment',
    preview: 'Finally understanding patterns in my anxiety. Tools from therapy are working...',
    tags: ['breakthrough', 'anxiety', 'therapy'] as const
  },
] as const

export default function MentalHealthApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState(USERS_DATA)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [timeRange, setTimeRange] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getMoodColor = useCallback((mood: string) => {
    switch (mood) {
      case 'positive': return 'border-emerald-300 bg-emerald-50'
      case 'neutral': return 'border-amber-300 bg-amber-50'
      case 'negative': return 'border-rose-300 bg-rose-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }, [])

  const getMoodIcon = useCallback((score: number) => {
    if (score >= 7.5) return { icon: Smile, color: 'text-emerald-500' }
    if (score >= 5.5) return { icon: Meh, color: 'text-amber-500' }
    return { icon: Frown, color: 'text-rose-500' }
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'border-rose-300'
      case 'medium': return 'border-amber-300'
      case 'low': return 'border-emerald-300'
      default: return 'border-gray-300'
    }
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesStatus = filterStatus === 'All' || user.status === filterStatus
      const matchesSearch = searchTerm === '' ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [users, searchTerm, filterStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-pink-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg'>
                <Brain className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>MindWell Pro</h1>
                <p className='text-gray-600'>Mental Health & Wellness Platform</p>
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
              <Button className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New User
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Mental Health Metrics Overview */}
        <section data-template-section='wellness-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {MENTAL_HEALTH_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMetric(metric.id)}
                >
                  <Card className={`h-full border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    selectedMetric === metric.id ? 'ring-2 ring-pink-500 ring-offset-2' : ''
                  }`}>
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

        {/* Analytics & Insights */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Mood Trends */}
          <section data-template-section='mood-trends' data-chart-type='line' data-metrics='mood,anxiety,energy,sleep'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Mood Trends</CardTitle>
                    <CardDescription>Weekly emotional wellness tracking</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12% Improvement
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MOOD_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='date' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='mood' 
                      stroke='#ec4899' 
                      strokeWidth={2}
                      name='Mood Score'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='anxiety' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Anxiety Level'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='energy' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Energy Level'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Wellness Activities */}
          <section data-template-section='wellness-activities' data-chart-type='bar' data-metrics='sessions,duration'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Wellness Activities</CardTitle>
                    <CardDescription>Monthly activity breakdown</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={WELLNESS_ACTIVITIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='activity' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='sessions' name='Total Sessions' radius={[4, 4, 0, 0]}>
                      {WELLNESS_ACTIVITIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* User Management & Journal Entries */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* User List */}
          <section data-template-section='user-management' data-component-type='user-list' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Users</CardTitle>
                    <CardDescription>Mental health platform participants</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search users...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='All'>All Status</SelectItem>
                        <SelectItem value='Active'>Active</SelectItem>
                        <SelectItem value='Inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredUsers.map((user) => {
                      const moodData = getMoodIcon(user.moodScore)
                      const MoodIcon = moodData.icon
                      
                      return (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          whileHover={{ scale: 1.01 }}
                          className={`p-4 bg-gradient-to-r from-gray-50 to-white border rounded-xl hover:border-pink-300 transition-colors ${getPriorityColor(user.priority)}`}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4'>
                              <Avatar className='w-12 h-12'>
                                <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold'>
                                  {user.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className='flex items-center space-x-2'>
                                  <h4 className='font-bold text-gray-900'>{user.name}</h4>
                                  {user.priority === 'high' && (
                                    <Badge variant='destructive' className='text-xs'>
                                      <AlertTriangle className='w-3 h-3 mr-1' />
                                      Priority
                                    </Badge>
                                  )}
                                </div>
                                <p className='text-sm text-gray-600'>{user.email}</p>
                                <div className='flex items-center space-x-4 text-xs text-gray-500 mt-1'>
                                  <span className='flex items-center'>
                                    <Clock className='w-3 h-3 mr-1' />
                                    {user.lastSession}
                                  </span>
                                  <span>•</span>
                                  <span>{user.sessionsCount} sessions</span>
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center space-x-4'>
                              <div className='text-right'>
                                <div className='flex items-center space-x-2'>
                                  <MoodIcon className={`w-5 h-5 ${moodData.color}`} />
                                  <span className='text-lg font-bold text-gray-900'>{user.moodScore}</span>
                                </div>
                                <div className='text-xs text-gray-500'>Mood Score</div>
                              </div>
                              <Badge className={
                                user.status === 'Active' 
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-gray-100 text-gray-800 border-gray-300'
                              }>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions & Recent Entries */}
          <div className='space-y-8'>
            {/* Quick Actions */}
            <section data-template-section='quick-actions' data-component-type='action-panel'>
              <Card className='border border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {[
                      { icon: MessageSquare, label: 'New Session', color: 'from-pink-500 to-rose-500' },
                      { icon: BookOpen, label: 'Journal Entry', color: 'from-purple-500 to-pink-500' },
                      { icon: Target, label: 'Set Goals', color: 'from-emerald-500 to-teal-500' },
                      { icon: Activity, label: 'Track Mood', color: 'from-amber-500 to-orange-500' },
                      { icon: Download, label: 'Export Data', color: 'from-blue-500 to-cyan-500' },
                    ].map((action, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant='outline'
                          className='w-full justify-start border-gray-300 hover:border-pink-300 h-14'
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                            <action.icon className='w-5 h-5 text-white' />
                          </div>
                          {action.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Wellness Score */}
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Overall Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Platform Health</span>
                      <span className='font-medium'>82%</span>
                    </div>
                    <Progress value={82} className='h-2' />
                  </div>
                  
                  <Separator />
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Heart className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium text-sm'>Positive Trend</div>
                        <div className='text-xs text-emerald-600'>Community thriving</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Journal Entries */}
        <section data-template-section='journal-entries' data-component-type='entry-list'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recent Journal Entries</CardTitle>
                  <CardDescription>Latest reflections and insights</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <BookOpen className='w-4 h-4 mr-2' />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <AnimatePresence>
                  {JOURNAL_ENTRIES.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 border rounded-xl ${getMoodColor(entry.mood)} hover:border-pink-300 transition-colors`}
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='w-10 h-10'>
                            <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold'>
                              {entry.user.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className='font-bold text-gray-900'>{entry.title}</h4>
                            <div className='text-xs text-gray-500'>
                              {entry.user} • {entry.date} at {entry.time}
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          entry.mood === 'positive' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          entry.mood === 'neutral' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-rose-100 text-rose-800 border-rose-300'
                        }>
                          {entry.mood}
                        </Badge>
                      </div>
                      <p className='text-sm text-gray-700 mb-3'>{entry.preview}</p>
                      <div className='flex flex-wrap gap-2'>
                        {entry.tags.map((tag, j) => (
                          <Badge key={j} variant='outline' className='border-gray-300 text-xs'>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}