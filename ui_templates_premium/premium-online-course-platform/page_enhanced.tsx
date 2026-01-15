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
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, BookOpen, Video, Award, TrendingUp, TrendingDown,
  Users, CheckCircle, Clock, Star, FileText, Play, Download,
  Upload, Settings, BarChart3, Calendar, Target, MessageCircle
} from 'lucide-react'

const COURSE_METRICS = [
  {
    id: 'enrolled_students',
    label: 'Enrolled Students',
    value: '2,847',
    change: '+245',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'active_courses',
    label: 'Active Courses',
    value: '42',
    unit: '',
    change: '+6',
    status: 'increasing' as const,
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '89',
    unit: '%',
    change: '+7%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'satisfaction_score',
    label: 'Satisfaction',
    value: '4.8',
    unit: '/5.0',
    change: '+0.3',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'rating'
  }
] as const

const COURSE_CATEGORIES = [
  { category: 'Technology', courses: 12, students: 845, color: '#3b82f6' },
  { category: 'Business', courses: 10, students: 682, color: '#8b5cf6' },
  { category: 'Design', courses: 8, students: 524, color: '#ec4899' },
  { category: 'Science', courses: 7, students: 456, color: '#10b981' },
  { category: 'Arts', courses: 5, students: 340, color: '#f59e0b' },
] as const

const COURSES_DATA = [
  {
    id: 'course-001',
    title: 'Full Stack Web Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'Technology',
    enrolled: 245,
    completed: 198,
    rating: 4.9,
    duration: '12 weeks',
    progress: 81,
    thumbnail: '💻'
  },
  {
    id: 'course-002',
    title: 'Digital Marketing Mastery',
    instructor: 'Prof. Michael Chen',
    category: 'Business',
    enrolled: 189,
    completed: 167,
    rating: 4.7,
    duration: '8 weeks',
    progress: 88,
    thumbnail: '📊'
  },
  {
    id: 'course-003',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Emily Rodriguez',
    category: 'Design',
    enrolled: 156,
    completed: 142,
    rating: 4.8,
    duration: '10 weeks',
    progress: 91,
    thumbnail: '🎨'
  },
  {
    id: 'course-004',
    title: 'Data Science & Analytics',
    instructor: 'Dr. James Wilson',
    category: 'Technology',
    enrolled: 234,
    completed: 189,
    rating: 4.9,
    duration: '14 weeks',
    progress: 81,
    thumbnail: '📈'
  },
  {
    id: 'course-005',
    title: 'Introduction to AI & ML',
    instructor: 'Prof. Lisa Anderson',
    category: 'Technology',
    enrolled: 298,
    completed: 245,
    rating: 5.0,
    duration: '16 weeks',
    progress: 82,
    thumbnail: '🤖'
  },
] as const

const ENROLLMENT_TRENDS = [
  { month: 'Aug', enrollments: 420, completions: 345, active: 1850 },
  { month: 'Sep', enrollments: 485, completions: 389, active: 2100 },
  { month: 'Oct', enrollments: 528, completions: 412, active: 2280 },
  { month: 'Nov', enrollments: 562, completions: 445, active: 2450 },
  { month: 'Dec', enrollments: 598, completions: 478, active: 2680 },
  { month: 'Jan', enrollments: 645, completions: 512, active: 2847 },
] as const

export default function PremiumOnlineCoursePlatformPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('semester')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [courses, setCourses] = useState(COURSES_DATA)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, filterCategory, courses])

  const getCategoryColor = useCallback((category: string) => {
    const colors = {
      Technology: 'bg-blue-100 text-blue-800 border-blue-300',
      Business: 'bg-purple-100 text-purple-800 border-purple-300',
      Design: 'bg-pink-100 text-pink-800 border-pink-300',
      Science: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Arts: 'bg-amber-100 text-amber-800 border-amber-300',
    }
    return colors[category as keyof typeof colors] || colors.Technology
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-blue-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg'>
                <BookOpen className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Premium Course Platform
                </h1>
                <p className='text-gray-600'>Online learning & skill development</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-blue-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='semester'>This Semester</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Create Course
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Course Metrics */}
        <section data-template-section='course-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {COURSE_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-blue-200 shadow-sm hover:shadow-lg transition-all bg-white'>
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
                              : 'text-blue-600'
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
          {/* Course Categories */}
          <section data-template-section='course-categories' data-chart-type='bar' data-metrics='courses,students'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Course Categories</CardTitle>
                    <CardDescription>Distribution by subject</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-300 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Analytics
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={COURSE_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e7ff' />
                    <XAxis dataKey='category' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='courses' name='Courses' radius={[8, 8, 0, 0]} fill='#8b5cf6' />
                    <Bar dataKey='students' name='Students' radius={[8, 8, 0, 0]}>
                      {COURSE_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Enrollment Trends */}
          <section data-template-section='enrollment-trends' data-chart-type='line' data-metrics='enrollments,completions,active'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Enrollment Trends</CardTitle>
                    <CardDescription>Student activity over time</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-300 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +54% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ENROLLMENT_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e7ff' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='enrollments' stroke='#3b82f6' strokeWidth={3} name='New Enrollments' />
                    <Line type='monotone' dataKey='completions' stroke='#10b981' strokeWidth={3} name='Completions' />
                    <Line type='monotone' dataKey='active' stroke='#8b5cf6' strokeWidth={3} name='Active Students' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Course Catalog */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Course List */}
          <section data-template-section='course-catalog' data-component-type='course-grid' className='lg:col-span-2'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Course Catalog</CardTitle>
                    <CardDescription>Available online courses</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search courses...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-blue-300'
                    />
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className='w-32 border-blue-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='Technology'>Technology</SelectItem>
                        <SelectItem value='Business'>Business</SelectItem>
                        <SelectItem value='Design'>Design</SelectItem>
                        <SelectItem value='Science'>Science</SelectItem>
                        <SelectItem value='Arts'>Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer ${
                          selectedCourse === course.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-start space-x-3'>
                            <div className='text-4xl'>{course.thumbnail}</div>
                            <div>
                              <h4 className='font-bold text-gray-900 mb-1'>{course.title}</h4>
                              <p className='text-sm text-gray-600'>{course.instructor}</p>
                              <div className='flex items-center space-x-2 mt-2'>
                                <Badge className={getCategoryColor(course.category)}>
                                  {course.category}
                                </Badge>
                                <div className='flex items-center text-sm text-amber-600'>
                                  <Star className='w-3 h-3 mr-1 fill-current' />
                                  {course.rating}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='grid grid-cols-3 gap-4 mb-3 text-sm'>
                          <div>
                            <div className='text-gray-500'>Enrolled</div>
                            <div className='font-bold text-gray-900'>{course.enrolled}</div>
                          </div>
                          <div>
                            <div className='text-gray-500'>Completed</div>
                            <div className='font-bold text-gray-900'>{course.completed}</div>
                          </div>
                          <div>
                            <div className='text-gray-500'>Duration</div>
                            <div className='font-bold text-gray-900'>{course.duration}</div>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between text-xs text-gray-600'>
                            <span>Completion Rate</span>
                            <span className='font-medium'>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className='h-2' />
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
            <Card className='border border-blue-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'Create Course', color: 'from-blue-500 to-cyan-500' },
                    { icon: Upload, label: 'Upload Content', color: 'from-purple-500 to-pink-500' },
                    { icon: Users, label: 'Manage Students', color: 'from-emerald-500 to-teal-500' },
                    { icon: BarChart3, label: 'View Analytics', color: 'from-amber-500 to-orange-500' },
                    { icon: MessageCircle, label: 'Discussion Forum', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Platform Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-blue-300 hover:border-blue-500 h-14 bg-white'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center shadow-lg`}>
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
                      <span className='text-gray-600'>Platform Usage</span>
                      <span className='font-medium'>89%</span>
                    </div>
                    <Progress value={89} className='h-2' />
                  </div>
                  
                  <div className='p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium text-sm'>Excellent Performance</div>
                        <div className='text-xs text-emerald-600'>All systems operational</div>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Target className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium text-sm'>Monthly Goal</div>
                        <div className='text-xs text-blue-600'>3,000 enrollments target</div>
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
