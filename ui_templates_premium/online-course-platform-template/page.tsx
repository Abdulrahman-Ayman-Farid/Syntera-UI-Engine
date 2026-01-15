'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
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
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip,
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, GraduationCap, Users, TrendingUp, TrendingDown,
  Search, Filter, Plus, Download, Share2, Eye, Star,
  Clock, Award, BarChart3, PlayCircle, CheckCircle,
  Book, Video, FileText, Headphones, Calendar, Tag,
  Settings, Bell, MoreVertical, ExternalLink, Library,
  Target, Zap, Trophy, Flame, Activity, TrendingUpIcon
} from 'lucide-react'

// Online course platform metrics
const PLATFORM_METRICS = [
  {
    id: 'total_courses',
    label: 'Available Courses',
    value: '485',
    change: '+48',
    status: 'increasing' as const,
    icon: BookOpen,
    color: 'from-sky-500 to-blue-600',
    format: 'count'
  },
  {
    id: 'active_students',
    label: 'Active Students',
    value: '42.8K',
    change: '+15.2%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '91',
    unit: '%',
    change: '+6%',
    status: 'good' as const,
    icon: Target,
    color: 'from-purple-500 to-indigo-600',
    format: 'percent'
  },
  {
    id: 'satisfaction',
    label: 'Satisfaction Score',
    value: '4.8',
    unit: '/5',
    change: '+0.3',
    status: 'good' as const,
    icon: Trophy,
    color: 'from-amber-500 to-orange-600',
    format: 'rating'
  }
] as const

const COURSE_CATEGORIES = [
  { category: 'Technology', courses: 185, students: 18500, color: '#0ea5e9', icon: BookOpen },
  { category: 'Business', courses: 142, students: 14200, color: '#8b5cf6', icon: BarChart3 },
  { category: 'Creative', courses: 98, students: 9800, color: '#10b981', icon: Library },
  { category: 'Health', courses: 60, students: 6000, color: '#f59e0b', icon: Activity },
] as const

const FEATURED_COURSES = [
  {
    id: 'course-001',
    title: 'Complete Web Development 2024',
    instructor: 'Prof. David Miller',
    category: 'technology',
    duration: '64 hours',
    modules: 285,
    students: 22450,
    rating: 4.9,
    progress: 68,
    difficulty: 'intermediate',
    isNew: true,
    thumbnail: '💻'
  },
  {
    id: 'course-002',
    title: 'Business Strategy & Leadership',
    instructor: 'Dr. Rachel Green',
    category: 'business',
    duration: '48 hours',
    modules: 196,
    students: 18920,
    rating: 4.8,
    progress: 45,
    difficulty: 'advanced',
    isNew: false,
    thumbnail: '📊'
  },
  {
    id: 'course-003',
    title: 'Digital Art & Illustration',
    instructor: 'Emma Watson',
    category: 'creative',
    duration: '42 hours',
    modules: 178,
    students: 25680,
    rating: 4.9,
    progress: 82,
    difficulty: 'beginner',
    isNew: true,
    thumbnail: '🎨'
  },
  {
    id: 'course-004',
    title: 'Nutrition & Wellness Coaching',
    instructor: 'Dr. Michael Brown',
    category: 'health',
    duration: '36 hours',
    modules: 142,
    students: 16340,
    rating: 4.7,
    progress: 56,
    difficulty: 'intermediate',
    isNew: false,
    thumbnail: '🍎'
  },
] as const

const LEARNING_TRENDS_DATA = [
  { month: 'Jan', enrollments: 3200, completions: 2850, activeUsers: 35000 },
  { month: 'Feb', enrollments: 3800, completions: 3420, activeUsers: 37500 },
  { month: 'Mar', enrollments: 4500, completions: 4050, activeUsers: 39800 },
  { month: 'Apr', enrollments: 5200, completions: 4680, activeUsers: 41200 },
  { month: 'May', enrollments: 5800, completions: 5220, activeUsers: 42500 },
  { month: 'Jun', enrollments: 6400, completions: 5760, activeUsers: 44800 },
] as const

export default function OnlineCoursePlatform() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'intermediate': return 'bg-sky-100 text-sky-800 border-sky-300'
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredCourses = useMemo(() => {
    return FEATURED_COURSES.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        course.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-sky-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl shadow-lg'>
                <GraduationCap className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>EduPlatform Pro</h1>
                <p className='text-gray-600'>Online learning & course management</p>
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
              <Button className='bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Course
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Platform Metrics */}
        <section data-template-section='platform-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PLATFORM_METRICS.map((metric) => (
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

        {/* Analytics & Trends */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Course Categories */}
          <section data-template-section='course-categories' data-chart-type='bar' data-metrics='courses,students'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Course Categories</CardTitle>
                    <CardDescription>Courses by category and enrollment</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-sky-200 text-sky-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={COURSE_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='category' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='courses' name='Courses' radius={[4, 4, 0, 0]}>
                      {COURSE_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Learning Trends */}
          <section data-template-section='learning-trends' data-chart-type='line' data-metrics='enrollments,completions,activeUsers'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Learning Trends</CardTitle>
                    <CardDescription>Monthly platform activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +28% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={LEARNING_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='enrollments' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Enrollments'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='completions' 
                      stroke='#0ea5e9' 
                      strokeWidth={2}
                      name='Completions'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='activeUsers' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Active Users'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Course Browser & Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Course Browser */}
          <section data-template-section='course-browser' data-component-type='course-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Featured Courses</CardTitle>
                    <CardDescription>Popular and trending courses</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search courses...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='technology'>Technology</SelectItem>
                        <SelectItem value='business'>Business</SelectItem>
                        <SelectItem value='creative'>Creative</SelectItem>
                        <SelectItem value='health'>Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-sky-300 transition-colors cursor-pointer ${
                          selectedCourse === course.id ? 'ring-2 ring-sky-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{course.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold'>{course.title}</h4>
                              {course.isNew && (
                                <Badge className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'>
                                  <Zap className='w-3 h-3 mr-1' />
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className='text-sm text-gray-600 mb-2'>
                              <div className='flex items-center space-x-1'>
                                <GraduationCap className='w-3 h-3' />
                                <span>{course.instructor}</span>
                              </div>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {course.duration}
                              </span>
                              <span className='flex items-center'>
                                <Book className='w-3 h-3 mr-1' />
                                {course.modules} modules
                              </span>
                              <span className='flex items-center'>
                                <Star className='w-3 h-3 mr-1 fill-amber-400 text-amber-400' />
                                {course.rating}
                              </span>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center justify-between text-sm'>
                                <span className='text-gray-600'>Progress</span>
                                <span className='font-medium'>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className='h-2' />
                            </div>
                            <div className='flex items-center justify-between mt-3'>
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                              <div className='flex items-center text-sm text-gray-600'>
                                <Users className='w-3 h-3 mr-1' />
                                {(course.students / 1000).toFixed(1)}K students
                              </div>
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
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'Create Course', color: 'from-sky-500 to-blue-600' },
                    { icon: BookOpen, label: 'Browse Catalog', color: 'from-purple-500 to-indigo-600' },
                    { icon: Users, label: 'Student Dashboard', color: 'from-emerald-500 to-teal-600' },
                    { icon: Trophy, label: 'Achievements', color: 'from-amber-500 to-orange-600' },
                    { icon: BarChart3, label: 'View Analytics', color: 'from-rose-500 to-pink-600' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-sky-300 h-14'
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
                      <span className='text-gray-600'>Learning Progress</span>
                      <span className='font-medium'>91%</span>
                    </div>
                    <Progress value={91} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Flame className='w-5 h-5 text-orange-500' />
                      <div>
                        <div className='font-medium'>Learning Streak</div>
                        <div className='text-sm text-sky-600'>15 days in a row!</div>
                      </div>
                    </div>
                    <Trophy className='w-5 h-5 text-amber-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Platform Insights */}
        <section data-template-section='platform-insights' data-component-type='insights-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Platform Insights</CardTitle>
                  <CardDescription>Performance and engagement metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Course', 
                    value: 'Web Development', 
                    metric: '22.4K enrolled',
                    icon: TrendingUp,
                    color: 'from-emerald-500 to-teal-600'
                  },
                  { 
                    label: 'Best Rated', 
                    value: 'Digital Art', 
                    rating: '4.9/5',
                    icon: Star,
                    color: 'from-purple-500 to-indigo-600'
                  },
                  { 
                    label: 'Most Active', 
                    value: 'Business Strategy', 
                    active: '18.9K learners',
                    icon: Users,
                    color: 'from-sky-500 to-blue-600'
                  },
                  { 
                    label: 'Certificates', 
                    value: 'Issued This Month', 
                    issued: '5,760',
                    icon: Award,
                    color: 'from-amber-500 to-orange-600'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>
                      {stat.metric || stat.rating || stat.active || stat.issued}
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