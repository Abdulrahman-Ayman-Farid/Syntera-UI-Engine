'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, GraduationCap, Clock, Award, Users,
  PlayCircle, FileText, CheckCircle, Calendar,
  Search, Filter, ChevronRight, Bell, MessageSquare,
  BarChart3, Bookmark, Download, Target, TrendingUp,
  TrendingDown, Star, Video, Plus, Settings, Eye,
  Edit, Trash2, Share2, ExternalLink, Tag
} from 'lucide-react'

// Learning metrics with type-safe constants
const LEARNING_METRICS = [
  {
    id: 'total_courses',
    label: 'Active Courses',
    value: '12',
    change: '+3',
    status: 'increasing' as const,
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'learning_hours',
    label: 'Learning Hours',
    value: '156',
    unit: 'hrs',
    change: '+24%',
    status: 'increasing' as const,
    icon: Clock,
    color: 'from-purple-500 to-pink-500',
    format: 'time'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'certificates',
    label: 'Certificates',
    value: '8',
    change: '+2',
    status: 'increasing' as const,
    icon: Award,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const COURSE_CATEGORIES = [
  { category: 'Web Development', count: 4, enrolled: 1245, color: '#3b82f6', icon: '💻' },
  { category: 'Data Science', count: 3, enrolled: 987, color: '#8b5cf6', icon: '📊' },
  { category: 'Design', count: 3, enrolled: 1567, color: '#10b981', icon: '🎨' },
  { category: 'Business', count: 2, enrolled: 654, color: '#f59e0b', icon: '💼' },
] as const

const COURSES_DATA = [
  { 
    id: 'course-001',
    title: 'Advanced React Patterns', 
    category: 'Web Development', 
    progress: 85, 
    instructor: 'Sarah Chen', 
    duration: '12h 30m',
    students: 1245,
    rating: 4.8,
    lessons: 42,
    status: 'in-progress',
    color: 'from-blue-500 to-cyan-500',
    thumbnail: '⚛️'
  },
  { 
    id: 'course-002',
    title: 'Data Science Fundamentals', 
    category: 'Data Science', 
    progress: 45, 
    instructor: 'Dr. Alex Rivera', 
    duration: '18h',
    students: 987,
    rating: 4.9,
    lessons: 56,
    status: 'in-progress',
    color: 'from-purple-500 to-pink-500',
    thumbnail: '📈'
  },
  { 
    id: 'course-003',
    title: 'UI/UX Design Principles', 
    category: 'Design', 
    progress: 30, 
    instructor: 'Maya Patel', 
    duration: '10h 15m',
    students: 1567,
    rating: 4.7,
    lessons: 35,
    status: 'in-progress',
    color: 'from-amber-500 to-orange-500',
    thumbnail: '🎨'
  },
  { 
    id: 'course-004',
    title: 'Machine Learning Basics', 
    category: 'Data Science', 
    progress: 100, 
    instructor: 'Dr. John Smith', 
    duration: '20h',
    students: 2341,
    rating: 4.9,
    lessons: 64,
    status: 'completed',
    color: 'from-emerald-500 to-teal-500',
    thumbnail: '🤖'
  },
] as const

const ASSIGNMENTS_DATA = [
  { 
    id: 'assign-001',
    title: 'React Hook Form Project', 
    course: 'Advanced React Patterns', 
    due: 'Tomorrow', 
    dueDate: '2026-01-15',
    status: 'pending',
    points: 100,
    submitted: false
  },
  { 
    id: 'assign-002',
    title: 'Data Visualization Report', 
    course: 'Data Science Fundamentals', 
    due: 'In 3 days', 
    dueDate: '2026-01-17',
    status: 'submitted',
    points: 100,
    submitted: true,
    grade: 95
  },
  { 
    id: 'assign-003',
    title: 'Design System Exercise', 
    course: 'UI/UX Design Principles', 
    due: 'Next Week', 
    dueDate: '2026-01-21',
    status: 'pending',
    points: 150,
    submitted: false
  },
] as const

const PROGRESS_DATA = [
  { month: 'Aug', hours: 18, courses: 2, certificates: 1 },
  { month: 'Sep', hours: 24, courses: 3, certificates: 1 },
  { month: 'Oct', hours: 32, courses: 4, certificates: 2 },
  { month: 'Nov', hours: 28, courses: 4, certificates: 1 },
  { month: 'Dec', hours: 36, courses: 5, certificates: 2 },
  { month: 'Jan', hours: 42, courses: 6, certificates: 3 },
] as const

export default function LearningManagementSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeCourse, setActiveCourse] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('month')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'submitted': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter(course => {
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || 
        course.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || 
        course.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, categoryFilter, statusFilter])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg'>
                <GraduationCap className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>LearnHub Pro</h1>
                <p className='text-slate-600'>Enterprise learning management system</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='ghost' size='icon'>
                <Bell className='w-5 h-5' />
              </Button>
              <Button variant='ghost' size='icon'>
                <MessageSquare className='w-5 h-5' />
              </Button>
              <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Enroll Course
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Learning Overview */}
        <section data-template-section='learning-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {LEARNING_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-slate-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-slate-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-slate-500'>{metric.unit}</span>
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

        {/* Course Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='count,enrolled'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Course Categories</CardTitle>
                    <CardDescription>Enrollment by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={COURSE_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='category' stroke='#666' angle={-45} textAnchor='end' height={80} />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='enrolled' name='Students Enrolled' radius={[4, 4, 0, 0]}>
                      {COURSE_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Progress Trends */}
          <section data-template-section='progress-trends' data-chart-type='line' data-metrics='hours,courses,certificates'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Learning Progress</CardTitle>
                    <CardDescription>Monthly learning activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +42% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PROGRESS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='hours' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Learning Hours'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='courses' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Active Courses'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='certificates' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Certificates'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Course Browser & Controls */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Course Browser */}
          <section data-template-section='course-browser' data-component-type='course-grid' className='lg:col-span-2'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>My Courses</CardTitle>
                    <CardDescription>Active learning paths and courses</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search courses...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-48 border-slate-300'
                    />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className='w-40 border-slate-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='Web Development'>Web Dev</SelectItem>
                        <SelectItem value='Data Science'>Data Science</SelectItem>
                        <SelectItem value='Design'>Design</SelectItem>
                        <SelectItem value='Business'>Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <Tabs value={viewMode} onValueChange={setViewMode} className='w-auto'>
                      <TabsList>
                        <TabsTrigger value='grid'>Grid</TabsTrigger>
                        <TabsTrigger value='list'>List</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  <AnimatePresence>
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          activeCourse === course.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setActiveCourse(course.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{course.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold'>{course.title}</h4>
                              <Badge className={getStatusColor(course.status)}>
                                {course.status}
                              </Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-slate-600 mb-3'>
                              <span className='flex items-center'>
                                <Tag className='w-3 h-3 mr-1' />
                                {course.category}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {course.duration}
                              </span>
                              <span className='flex items-center'>
                                <Star className='w-3 h-3 mr-1 text-amber-500' />
                                {course.rating}
                              </span>
                            </div>
                            <div className='mb-3'>
                              <div className='flex justify-between text-sm mb-1'>
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className='h-2' />
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Avatar className='w-6 h-6'>
                                  <AvatarFallback className='text-xs'>
                                    {course.instructor.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-sm text-slate-600'>{course.instructor}</span>
                              </div>
                              <Button variant='outline' size='sm'>
                                <PlayCircle className='w-3 h-3 mr-1' />
                                Continue
                              </Button>
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

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-slate-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: BookOpen, label: 'Browse Courses', color: 'from-blue-500 to-cyan-500' },
                    { icon: Video, label: 'Live Sessions', color: 'from-purple-500 to-pink-500' },
                    { icon: FileText, label: 'Assignments', color: 'from-emerald-500 to-teal-500' },
                    { icon: Award, label: 'Certificates', color: 'from-amber-500 to-orange-500' },
                    { icon: Users, label: 'Study Groups', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-slate-300 hover:border-blue-300 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-slate-600'>Weekly Goal</span>
                      <span className='font-medium'>8 / 10 hrs</span>
                    </div>
                    <Progress value={80} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Target className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium'>Daily Streak</div>
                        <div className='text-sm text-blue-600'>14 days 🔥</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Assignments & Schedule */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Assignments */}
          <section data-template-section='assignments' data-component-type='assignment-list'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Upcoming Assignments</CardTitle>
                    <CardDescription>Track your pending work</CardDescription>
                  </div>
                  <Button variant='outline' className='border-slate-300'>
                    <Plus className='w-4 h-4 mr-2' />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {ASSIGNMENTS_DATA.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className='p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start space-x-4'>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              assignment.status === 'submitted' 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-amber-100 text-amber-600'
                            }`}>
                              {assignment.status === 'submitted' ? 
                                <CheckCircle className='w-5 h-5' /> : 
                                <FileText className='w-5 h-5' />
                              }
                            </div>
                            <div>
                              <h4 className='font-medium'>{assignment.title}</h4>
                              <p className='text-sm text-slate-600'>{assignment.course}</p>
                              <div className='flex items-center space-x-4 text-xs text-slate-500 mt-2'>
                                <span className='flex items-center'>
                                  <Calendar className='w-3 h-3 mr-1' />
                                  Due {assignment.due}
                                </span>
                                <span>{assignment.points} points</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Today's Schedule */}
          <section data-template-section='schedule' data-component-type='calendar-view'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Today's Schedule</CardTitle>
                    <CardDescription>Upcoming sessions and events</CardDescription>
                  </div>
                  <Button variant='outline' className='border-slate-300'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Full Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { time: '10:00 AM', title: 'React Workshop', type: 'Live Session', color: 'from-blue-500 to-cyan-500' },
                    { time: '2:00 PM', title: 'Mentor Session', type: '1-on-1', color: 'from-purple-500 to-pink-500' },
                    { time: '4:30 PM', title: 'Group Study', type: 'Collaboration', color: 'from-emerald-500 to-teal-500' },
                  ].map((event, i) => (
                    <div key={i} className='flex items-start space-x-4 p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl'>
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${event.color} flex items-center justify-center text-white`}>
                        <div className='text-center'>
                          <div className='text-xs font-medium'>{event.time.split(' ')[1]}</div>
                          <div className='text-lg font-bold'>{event.time.split(' ')[0].split(':')[0]}</div>
                        </div>
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-medium'>{event.title}</h4>
                          <Badge variant='outline' className='border-slate-300'>
                            {event.type}
                          </Badge>
                        </div>
                        <p className='text-sm text-slate-600 mt-1'>Join via Zoom Meeting</p>
                        <Button variant='ghost' size='sm' className='mt-2 px-0'>
                          <ChevronRight className='w-4 h-4 mr-1' />
                          Join Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Learning Resources */}
        <section data-template-section='learning-resources' data-component-type='resource-grid'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recommended Resources</CardTitle>
                  <CardDescription>Curated learning materials</CardDescription>
                </div>
                <Button variant='outline' className='border-slate-300'>
                  <ExternalLink className='w-4 h-4 mr-2' />
                  View Library
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {[
                  { 
                    title: 'React Documentation', 
                    type: 'Guide', 
                    icon: '📚', 
                    action: 'Read',
                    color: 'from-blue-500 to-cyan-500',
                    downloads: 1245
                  },
                  { 
                    title: 'Design Patterns', 
                    type: 'E-book', 
                    icon: '📖', 
                    action: 'Download',
                    color: 'from-purple-500 to-pink-500',
                    downloads: 987
                  },
                  { 
                    title: 'Coding Exercises', 
                    type: 'Practice', 
                    icon: '💻', 
                    action: 'Start',
                    color: 'from-emerald-500 to-teal-500',
                    downloads: 2341
                  },
                ].map((resource, i) => (
                  <div key={i} className='p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors'>
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                      {resource.icon}
                    </div>
                    <h4 className='font-bold text-slate-900 mb-1'>{resource.title}</h4>
                    <p className='text-sm text-slate-600 mb-4'>{resource.type}</p>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center text-xs text-slate-500'>
                        <Download className='w-3 h-3 mr-1' />
                        {resource.downloads}
                      </div>
                      <Button variant='outline' size='sm' className='border-slate-300'>
                        {resource.action === 'Download' ? <Download className='w-3 h-3 mr-1' /> : null}
                        {resource.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
