'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Video, Users, MessageCircle, Calendar,
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle,
  BookOpen, FileText, Award, Settings, Bell, BarChart3,
  Play, Mic, Camera, Share2, Download
} from 'lucide-react'

const CLASSROOM_METRICS = [
  {
    id: 'active_students',
    label: 'Active Students',
    value: '45',
    change: '+3',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-pink-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'attendance_rate',
    label: 'Attendance Rate',
    value: '96',
    unit: '%',
    change: '+2%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'live_sessions',
    label: 'Live Sessions',
    value: '8',
    change: '+1',
    status: 'increasing' as const,
    icon: Video,
    color: 'from-yellow-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'engagement_score',
    label: 'Engagement Score',
    value: '8.7',
    unit: '/10',
    change: '+0.5',
    status: 'good' as const,
    icon: Award,
    color: 'from-emerald-500 to-teal-500',
    format: 'score'
  }
] as const

const COURSE_PROGRESS = [
  { course: 'Math 101', enrolled: 45, completed: 38, progress: 84, color: '#ec4899' },
  { course: 'Science 201', enrolled: 42, completed: 35, progress: 83, color: '#f97316' },
  { course: 'History 301', enrolled: 38, completed: 30, progress: 79, color: '#8b5cf6' },
  { course: 'English 102', enrolled: 40, completed: 32, progress: 80, color: '#10b981' },
] as const

const COURSES_DATA = [
  {
    id: 'course-001',
    title: 'Advanced Mathematics',
    instructor: 'Dr. Sarah Johnson',
    time: '10:00 AM - 11:30 AM',
    students: 45,
    status: 'live',
    progress: 65,
    nextSession: '2024-02-20',
    thumbnail: '🔢'
  },
  {
    id: 'course-002',
    title: 'Physics Fundamentals',
    instructor: 'Prof. Michael Chen',
    time: '2:00 PM - 3:30 PM',
    students: 42,
    status: 'scheduled',
    progress: 58,
    nextSession: '2024-02-21',
    thumbnail: '⚛️'
  },
  {
    id: 'course-003',
    title: 'World History',
    instructor: 'Dr. Emily Rodriguez',
    time: '11:00 AM - 12:30 PM',
    students: 38,
    status: 'completed',
    progress: 100,
    nextSession: '2024-02-22',
    thumbnail: '🌍'
  },
  {
    id: 'course-004',
    title: 'English Literature',
    instructor: 'Prof. James Wilson',
    time: '3:00 PM - 4:30 PM',
    students: 40,
    status: 'scheduled',
    progress: 72,
    nextSession: '2024-02-20',
    thumbnail: '📚'
  },
] as const

const WEEKLY_ENGAGEMENT = [
  { day: 'Mon', sessions: 3, participants: 120, duration: 4.5 },
  { day: 'Tue', sessions: 4, participants: 145, duration: 5.2 },
  { day: 'Wed', sessions: 3, participants: 135, duration: 4.8 },
  { day: 'Thu', sessions: 5, participants: 158, duration: 6.1 },
  { day: 'Fri', sessions: 2, participants: 98, duration: 3.5 },
] as const

const STATUS_COLORS = {
  live: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-gray-100 text-gray-800 border-gray-300',
} as const

export default function VirtualClassroomPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState(COURSES_DATA)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [searchQuery, courses])

  const getStatusBadge = useCallback((status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.scheduled
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/20 bg-white/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-white rounded-xl shadow-lg'>
                <Video className='w-8 h-8 text-pink-500' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white drop-shadow-lg'>Virtual Classroom</h1>
                <p className='text-white/90'>Interactive online learning platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-white/30 shadow-sm bg-white/20 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='semester'>This Semester</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-white text-pink-500 hover:bg-white/90 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Classroom Metrics */}
        <section data-template-section='classroom-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {CLASSROOM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-white/20 shadow-xl hover:shadow-2xl transition-all bg-white/20 backdrop-blur-md'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-white/90'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-white/80'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-200' 
                              : 'text-blue-200'
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Course Progress */}
          <section data-template-section='course-progress' data-chart-type='bar' data-metrics='enrolled,completed,progress'>
            <Card className='border border-white/20 shadow-xl bg-white/20 backdrop-blur-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Course Progress</CardTitle>
                    <CardDescription className='text-white/80'>Student completion rates</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-white/30 text-white bg-white/10'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Overview
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={COURSE_PROGRESS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fff' opacity={0.2} />
                    <XAxis dataKey='course' stroke='#fff' />
                    <YAxis stroke='#fff' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey='completed' name='Completed' radius={[8, 8, 0, 0]}>
                      {COURSE_PROGRESS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Weekly Engagement */}
          <section data-template-section='weekly-engagement' data-chart-type='line' data-metrics='sessions,participants,duration'>
            <Card className='border border-white/20 shadow-xl bg-white/20 backdrop-blur-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Weekly Engagement</CardTitle>
                    <CardDescription className='text-white/80'>Session participation trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-300 text-emerald-200 bg-emerald-500/20'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Growing
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={WEEKLY_ENGAGEMENT}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fff' opacity={0.2} />
                    <XAxis dataKey='day' stroke='#fff' />
                    <YAxis stroke='#fff' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='sessions' stroke='#ec4899' strokeWidth={3} name='Sessions' />
                    <Line type='monotone' dataKey='participants' stroke='#8b5cf6' strokeWidth={3} name='Participants' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Course Sessions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Course List */}
          <section data-template-section='course-sessions' data-component-type='course-grid' className='lg:col-span-2'>
            <Card className='border border-white/20 shadow-xl bg-white/20 backdrop-blur-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Live & Scheduled Sessions</CardTitle>
                    <CardDescription className='text-white/80'>Your virtual classrooms</CardDescription>
                  </div>
                  <Input
                    placeholder='Search courses...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-white/30 bg-white/10 text-white placeholder:text-white/50'
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl hover:border-white/50 transition-all cursor-pointer ${
                          selectedCourse === course.id ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='text-4xl'>{course.thumbnail}</div>
                          <Badge className={getStatusBadge(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                        <h4 className='font-bold text-white text-lg mb-1'>{course.title}</h4>
                        <p className='text-sm text-white/80 mb-2'>{course.instructor}</p>
                        <div className='flex items-center justify-between text-sm text-white/70 mb-3'>
                          <span className='flex items-center'>
                            <Clock className='w-3 h-3 mr-1' />
                            {course.time}
                          </span>
                          <span className='flex items-center'>
                            <Users className='w-3 h-3 mr-1' />
                            {course.students}
                          </span>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between text-xs text-white/70'>
                            <span>Progress</span>
                            <span className='font-medium'>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className='h-2' />
                        </div>
                        {course.status === 'live' && (
                          <Button className='w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white'>
                            <Play className='w-4 h-4 mr-2' />
                            Join Now
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Tools */}
          <section data-template-section='quick-tools' data-component-type='tool-panel'>
            <Card className='border border-white/20 shadow-xl h-full bg-white/20 backdrop-blur-md'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Video, label: 'Start Session', color: 'from-pink-500 to-rose-500' },
                    { icon: Calendar, label: 'Schedule Class', color: 'from-purple-500 to-pink-500' },
                    { icon: MessageCircle, label: 'Chat Room', color: 'from-blue-500 to-cyan-500' },
                    { icon: FileText, label: 'Assignments', color: 'from-emerald-500 to-teal-500' },
                    { icon: Award, label: 'Gradebook', color: 'from-amber-500 to-orange-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((tool, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-white/30 hover:border-white/50 h-14 bg-white/10 text-white'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} mr-3 flex items-center justify-center shadow-lg`}>
                        <tool.icon className='w-5 h-5 text-white' />
                      </div>
                      {tool.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-white/20' />
                
                <div className='space-y-4'>
                  <div className='p-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-white/80'>Session Time</span>
                      <span className='font-medium text-white'>24.5 hrs</span>
                    </div>
                    <Progress value={68} className='h-2' />
                  </div>
                  
                  <div className='p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-200' />
                      <div>
                        <div className='font-medium text-white text-sm'>All Systems Ready</div>
                        <div className='text-xs text-emerald-200'>Ready to teach</div>
                      </div>
                    </div>
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
