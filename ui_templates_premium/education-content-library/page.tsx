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
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, GraduationCap, Users, TrendingUp, TrendingDown,
  Search, Filter, Plus, Download, Share2, Eye, Star,
  Clock, Award, BarChart3, PlayCircle, CheckCircle,
  Book, Video, FileText, Headphones, Calendar, Tag,
  Settings, Bell, MoreVertical, ExternalLink, Library
} from 'lucide-react'

// Learning metrics derived from data_types
const LEARNING_METRICS = [
  {
    id: 'total_courses',
    label: 'Total Courses',
    value: '248',
    change: '+24',
    status: 'increasing' as const,
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'active_learners',
    label: 'Active Learners',
    value: '15.2K',
    change: '+8.5%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'avg_rating',
    label: 'Avg. Rating',
    value: '4.8',
    unit: '/5',
    change: '+0.3',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'rating'
  }
] as const

const COURSE_CATEGORIES = [
  { category: 'Programming', count: 85, progress: 72, color: '#3b82f6', icon: BookOpen },
  { category: 'Data Science', count: 45, progress: 65, color: '#8b5cf6', icon: BarChart3 },
  { category: 'Design', count: 58, progress: 78, color: '#10b981', icon: Library },
  { category: 'Business', count: 60, progress: 58, color: '#f59e0b', icon: Award },
] as const

const FEATURED_COURSES = [
  {
    id: 'course-001',
    title: 'Complete Web Development Bootcamp',
    author: 'Dr. Sarah Johnson',
    category: 'programming',
    duration: '42 hours',
    lessons: 156,
    enrolled: 12450,
    rating: 4.9,
    progress: 65,
    difficulty: 'intermediate',
    thumbnail: '📚'
  },
  {
    id: 'course-002',
    title: 'Machine Learning Fundamentals',
    author: 'Prof. Michael Chen',
    category: 'data-science',
    duration: '28 hours',
    lessons: 98,
    enrolled: 8920,
    rating: 4.8,
    progress: 42,
    difficulty: 'advanced',
    thumbnail: '🤖'
  },
  {
    id: 'course-003',
    title: 'UI/UX Design Masterclass',
    author: 'Emma Williams',
    category: 'design',
    duration: '35 hours',
    lessons: 124,
    enrolled: 15680,
    rating: 4.9,
    progress: 88,
    difficulty: 'beginner',
    thumbnail: '🎨'
  },
  {
    id: 'course-004',
    title: 'Digital Marketing Strategy',
    author: 'James Anderson',
    category: 'business',
    duration: '24 hours',
    lessons: 86,
    enrolled: 9340,
    rating: 4.7,
    progress: 54,
    difficulty: 'intermediate',
    thumbnail: '📈'
  },
] as const

const LEARNING_PROGRESS_DATA = [
  { month: 'Jan', completions: 145, enrollments: 280, engagement: 78 },
  { month: 'Feb', completions: 168, enrollments: 320, engagement: 82 },
  { month: 'Mar', completions: 192, enrollments: 385, engagement: 85 },
  { month: 'Apr', completions: 225, enrollments: 420, engagement: 87 },
  { month: 'May', completions: 248, enrollments: 465, engagement: 89 },
  { month: 'Jun', completions: 285, enrollments: 510, engagement: 92 },
] as const

export default function EducationContentLibrary() {
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
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredCourses = useMemo(() => {
    return FEATURED_COURSES.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        course.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Library className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>EduLibrary Pro</h1>
                <p className='text-gray-600'>Educational content & learning management</p>
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
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Course
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Learning Metrics */}
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

        {/* Analytics & Progress */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Course Distribution */}
          <section data-template-section='course-distribution' data-chart-type='bar' data-metrics='count,progress'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Course Categories</CardTitle>
                    <CardDescription>Courses by category and completion</CardDescription>
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
                    <XAxis dataKey='category' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Course Count' radius={[4, 4, 0, 0]}>
                      {COURSE_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Learning Progress Trends */}
          <section data-template-section='learning-trends' data-chart-type='line' data-metrics='completions,enrollments,engagement'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Learning Progress</CardTitle>
                    <CardDescription>Monthly learning activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={LEARNING_PROGRESS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='completions' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Completions'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='enrollments' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Enrollments'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='engagement' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Engagement %'
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
                        <SelectItem value='programming'>Programming</SelectItem>
                        <SelectItem value='data-science'>Data Science</SelectItem>
                        <SelectItem value='design'>Design</SelectItem>
                        <SelectItem value='business'>Business</SelectItem>
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
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedCourse === course.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{course.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold'>{course.title}</h4>
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                            </div>
                            <div className='text-sm text-gray-600 mb-2'>
                              <div className='flex items-center space-x-1'>
                                <GraduationCap className='w-3 h-3' />
                                <span>{course.author}</span>
                              </div>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {course.duration}
                              </span>
                              <span className='flex items-center'>
                                <PlayCircle className='w-3 h-3 mr-1' />
                                {course.lessons} lessons
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
                              <div className='flex items-center space-x-2'>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Eye className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Share2 className='w-4 h-4' />
                                </Button>
                              </div>
                              <div className='flex items-center text-sm text-gray-600'>
                                <Users className='w-3 h-3 mr-1' />
                                {(course.enrolled / 1000).toFixed(1)}K enrolled
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
                    { icon: Plus, label: 'Add Course', color: 'from-blue-500 to-cyan-500' },
                    { icon: BookOpen, label: 'Browse Library', color: 'from-purple-500 to-pink-500' },
                    { icon: Users, label: 'Manage Students', color: 'from-emerald-500 to-teal-500' },
                    { icon: Award, label: 'View Certificates', color: 'from-amber-500 to-orange-500' },
                    { icon: BarChart3, label: 'View Analytics', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-blue-300 h-14'
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
                      <span className='text-gray-600'>Course Completion</span>
                      <span className='font-medium'>87%</span>
                    </div>
                    <Progress value={87} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium'>Learning Status</div>
                        <div className='text-sm text-blue-600'>On track with goals</div>
                      </div>
                    </div>
                    <Star className='w-5 h-5 text-amber-500 fill-amber-400' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Learning Insights */}
        <section data-template-section='learning-insights' data-component-type='insights-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Learning Insights</CardTitle>
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
                    metric: '12.4K enrolled',
                    icon: TrendingUp,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Best Rated', 
                    value: 'UI/UX Masterclass', 
                    rating: '4.9/5',
                    icon: Star,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Most Active', 
                    value: 'Data Science Path', 
                    active: '8.9K learners',
                    icon: Users,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Certificates', 
                    value: 'Issued This Month', 
                    issued: '2,845',
                    icon: Award,
                    color: 'from-amber-500 to-orange-500'
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-white p-6 text-center'>
        © 2023 Educational Content Library. All rights reserved.
      </footer>
      {isAddingCourse && (
        <Dialog.Root open={isAddingCourse} onOpenChange={setIsAddingCourse}>
          <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm' />
            <Dialog.Content className='fixed left-1/2 top-1/2 max-h-90 overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-2xl focus:outline-none animate-fade-in'>
              <Dialog.Title className='text-xl font-semibold mb-4'>Add New Course</Dialog.Title>
              <form className='space-y-4'>
                <div>
                  <label htmlFor='title' className='block text-sm font-medium'>
                    Title
                  </label>
                  <Input id='title' placeholder='Course Title' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div>
                  <label htmlFor='author' className='block text-sm font-medium'>
                    Author
                  </label>
                  <Input id='author' placeholder='Author Name' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div>
                  <label htmlFor='duration' className='block text-sm font-medium'>
                    Duration
                  </label>
                  <Input id='duration' placeholder='1 hour' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div>
                  <label htmlFor='progress' className='block text-sm font-medium'>
                    Progress
                  </label>
                  <Input id='progress' type='number' placeholder='75' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div className='flex justify-end space-x-4'>
                  <Button variant='outline' onClick={cancelAddCourse}>
                    Cancel
                  </Button>
                  <Button type='submit' className='bg-accent hover:bg-accent-focus'>
                    Save
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};

export default EducationContentLibrary;