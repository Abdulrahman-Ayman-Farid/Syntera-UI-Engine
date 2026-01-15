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
  PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, GraduationCap, Users, TrendingUp, TrendingDown,
  Search, Filter, Plus, Download, Share2, Eye, Star,
  Clock, Award, BarChart3, PlayCircle, CheckCircle,
  Book, Video, FileText, Headphones, Calendar, Tag,
  Settings, Bell, MoreVertical, ExternalLink, Library,
  Sparkles, Target, Brain, Zap
} from 'lucide-react'

// Premium learning metrics
const PREMIUM_METRICS = [
  {
    id: 'total_resources',
    label: 'Learning Resources',
    value: '1,248',
    change: '+124',
    status: 'increasing' as const,
    icon: Library,
    color: 'from-indigo-500 to-purple-600',
    format: 'count'
  },
  {
    id: 'active_students',
    label: 'Active Students',
    value: '28.5K',
    change: '+12.5%',
    status: 'increasing' as const,
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '94',
    unit: '%',
    change: '+7%',
    status: 'good' as const,
    icon: Target,
    color: 'from-blue-500 to-cyan-600',
    format: 'percent'
  },
  {
    id: 'satisfaction',
    label: 'Satisfaction Score',
    value: '4.9',
    unit: '/5',
    change: '+0.4',
    status: 'good' as const,
    icon: Sparkles,
    color: 'from-amber-500 to-orange-600',
    format: 'rating'
  }
] as const

const LEARNING_CATEGORIES = [
  { category: 'Programming', resources: 425, engagement: 88, color: '#6366f1', icon: BookOpen },
  { category: 'Data Science', resources: 285, engagement: 82, color: '#8b5cf6', icon: BarChart3 },
  { category: 'Design', resources: 318, engagement: 90, color: '#10b981', icon: Sparkles },
  { category: 'Business', resources: 220, engagement: 76, color: '#f59e0b', icon: Target },
] as const

const PREMIUM_COURSES = [
  {
    id: 'premium-001',
    title: 'Advanced Full-Stack Development',
    author: 'Dr. Emily Rodriguez',
    category: 'programming',
    duration: '58 hours',
    modules: 245,
    enrolled: 18420,
    rating: 4.9,
    progress: 72,
    difficulty: 'advanced',
    isPremium: true,
    thumbnail: '🚀'
  },
  {
    id: 'premium-002',
    title: 'Deep Learning & Neural Networks',
    author: 'Prof. Alex Zhang',
    category: 'data-science',
    duration: '46 hours',
    modules: 189,
    enrolled: 14280,
    rating: 4.8,
    progress: 55,
    difficulty: 'advanced',
    isPremium: true,
    thumbnail: '🧠'
  },
  {
    id: 'premium-003',
    title: 'Advanced UI/UX Design Systems',
    author: 'Sophie Martinez',
    category: 'design',
    duration: '42 hours',
    modules: 167,
    enrolled: 22150,
    rating: 5.0,
    progress: 89,
    difficulty: 'intermediate',
    isPremium: true,
    thumbnail: '✨'
  },
  {
    id: 'premium-004',
    title: 'Strategic Business Leadership',
    author: 'Michael Thompson',
    category: 'business',
    duration: '38 hours',
    modules: 142,
    enrolled: 16890,
    rating: 4.8,
    progress: 63,
    difficulty: 'intermediate',
    isPremium: true,
    thumbnail: '📊'
  },
] as const

const ENGAGEMENT_DATA = [
  { month: 'Jan', courses: 185, students: 22500, satisfaction: 4.6 },
  { month: 'Feb', courses: 205, students: 24200, satisfaction: 4.7 },
  { month: 'Mar', courses: 235, students: 26800, satisfaction: 4.7 },
  { month: 'Apr', courses: 268, students: 28100, satisfaction: 4.8 },
  { month: 'May', courses: 295, students: 29800, satisfaction: 4.9 },
  { month: 'Jun', courses: 318, students: 31500, satisfaction: 4.9 },
] as const

export default function PremiumEducationalLibrary() {
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
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredCourses = useMemo(() => {
    return PREMIUM_COURSES.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        course.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-indigo-800/50 bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg'>
                <Library className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Premium EduLibrary</h1>
                <p className='text-indigo-300'>Advanced learning resources & analytics</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-indigo-700 bg-slate-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 border-indigo-700'>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Resource
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Premium Metrics */}
        <section data-template-section='premium-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PREMIUM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-indigo-800/50 bg-slate-800/50 backdrop-blur shadow-sm hover:shadow-indigo-500/20 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-indigo-300'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-indigo-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-amber-400'
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

        {/* Analytics & Engagement */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='resources,engagement'>
            <Card className='border border-indigo-800/50 bg-slate-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Learning Categories</CardTitle>
                    <CardDescription className='text-indigo-300'>Resources by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-indigo-600 text-indigo-400 bg-indigo-950/50'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={LEARNING_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='category' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4f46e5' }}
                    />
                    <Legend />
                    <Bar dataKey='resources' name='Resources' radius={[4, 4, 0, 0]}>
                      {LEARNING_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='line' data-metrics='courses,students,satisfaction'>
            <Card className='border border-indigo-800/50 bg-slate-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Engagement Trends</CardTitle>
                    <CardDescription className='text-indigo-300'>Monthly learning activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-400 bg-emerald-950/50'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +22% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='month' stroke='#94a3b8' />
                    <YAxis yAxisId='left' stroke='#94a3b8' />
                    <YAxis yAxisId='right' orientation='right' stroke='#94a3b8' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4f46e5' }}
                    />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='courses' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Courses'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='students' 
                      stroke='#6366f1' 
                      strokeWidth={2}
                      name='Students'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='satisfaction' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Satisfaction'
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
          <section data-template-section='premium-courses' data-component-type='course-grid' className='lg:col-span-2'>
            <Card className='border border-indigo-800/50 bg-slate-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Premium Courses</CardTitle>
                    <CardDescription className='text-indigo-300'>Exclusive advanced content</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search courses...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-indigo-700 bg-slate-900 text-white'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-indigo-700 bg-slate-900 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-slate-800 border-indigo-700'>
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
                        className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-800/50 rounded-xl hover:border-indigo-600 transition-colors cursor-pointer ${
                          selectedCourse === course.id ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : ''
                        }`}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{course.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold text-white'>{course.title}</h4>
                              {course.isPremium && (
                                <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0'>
                                  <Sparkles className='w-3 h-3 mr-1' />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <div className='text-sm text-indigo-300 mb-2'>
                              <div className='flex items-center space-x-1'>
                                <GraduationCap className='w-3 h-3' />
                                <span>{course.author}</span>
                              </div>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-indigo-400 mb-3'>
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
                                <span className='text-indigo-300'>Progress</span>
                                <span className='font-medium text-white'>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className='h-2' />
                            </div>
                            <div className='flex items-center justify-between mt-3'>
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                              <div className='flex items-center text-sm text-indigo-400'>
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
            <Card className='border border-indigo-800/50 bg-slate-800/50 backdrop-blur shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'Add Resource', color: 'from-indigo-500 to-purple-600' },
                    { icon: Library, label: 'Browse Library', color: 'from-blue-500 to-cyan-600' },
                    { icon: Brain, label: 'AI Recommendations', color: 'from-emerald-500 to-teal-600' },
                    { icon: Award, label: 'View Achievements', color: 'from-amber-500 to-orange-600' },
                    { icon: BarChart3, label: 'Analytics Dashboard', color: 'from-rose-500 to-pink-600' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-indigo-700 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-600 h-14 text-white'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-indigo-800/50' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-indigo-300'>Overall Progress</span>
                      <span className='font-medium text-white'>94%</span>
                    </div>
                    <Progress value={94} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Sparkles className='w-5 h-5 text-amber-400' />
                      <div>
                        <div className='font-medium text-white'>Premium Status</div>
                        <div className='text-sm text-indigo-300'>All features unlocked</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-400' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Learning Insights */}
        <section data-template-section='learning-insights' data-component-type='insights-grid'>
          <Card className='border border-indigo-800/50 bg-slate-800/50 backdrop-blur shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Learning Insights</CardTitle>
                  <CardDescription className='text-indigo-300'>Performance and engagement metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-indigo-700 bg-slate-900 text-white'>
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
                    value: 'Full-Stack Dev', 
                    metric: '18.4K enrolled',
                    icon: TrendingUp,
                    color: 'from-emerald-500 to-teal-600'
                  },
                  { 
                    label: 'Best Rated', 
                    value: 'UI/UX Systems', 
                    rating: '5.0/5',
                    icon: Star,
                    color: 'from-purple-500 to-pink-600'
                  },
                  { 
                    label: 'Most Active', 
                    value: 'Neural Networks', 
                    active: '14.2K learners',
                    icon: Brain,
                    color: 'from-blue-500 to-cyan-600'
                  },
                  { 
                    label: 'Certificates', 
                    value: 'Issued This Month', 
                    issued: '4,285',
                    icon: Award,
                    color: 'from-amber-500 to-orange-600'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-800/50 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-indigo-300'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2 text-white'>{stat.value}</div>
                    <div className='text-sm text-indigo-400'>
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
        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Recommended Courses</h2>
            <Button size='sm' variant='outline'>
              See More
            </Button>
          </div>
          <ScrollArea className='overflow-y-hidden w-full'>
            <div className='flex space-x-4'>
              {isLoading ? (
                <Skeleton className='w-72 h-40 rounded-lg' />
              ) : error ? (
                <div className='text-red-500'>{error}</div>
              ) : (
                filteredCourses.map(course => (
                  <Card key={course.id} className='border-none bg-secondary/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300'>
                    <CardContent className='p-4'>
                      <Avatar className='mb-4'>
                        <AvatarImage src={course.thumbnail} alt={`${course.title} Thumbnail`} />
                        <AvatarFallback>{course.author[0]}</AvatarFallback>
                      </Avatar>
                      <CardTitle className='text-lg font-semibold'>{course.title}</CardTitle>
                      <CardFooter className='mt-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <UserCircle2 className='w-4 h-4 drop-shadow-lg' /> <span className='text-xs'>{course.author}</span>
                          </div>
                          <Progress value={course.progress} className='w-24 h-2' /> <span className='text-xs'>{course.progress}%</span>
                        </div>
                      </CardFooter>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </section>
        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Your Learning Path</h2>
            <Button size='sm' variant='outline'>
              Edit Path
            </Button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, index) => (
              <div key={index} className='relative rounded-lg overflow-hidden cursor-pointer group'>
                <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: 'url(https://via.placeholder.com/150)' }}></div>
                <div className='absolute inset-0 bg-black opacity-30'></div>
                <div className='absolute bottom-0 left-0 right-0 px-4 py-3 bg-secondary/80'>
                  <span className='text-sm font-medium'>Module {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <aside className={`fixed top-0 left-0 h-screen bg-primary/90 backdrop-blur-sm z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>n        <div className='p-6'>
          <Button size='icon' className='block md:hidden mb-4' onClick={() => setIsSidebarOpen(false)}>
            <ChevronRight className='w-6 h-6 drop-shadow-lg' />
          </Button>
          <h3 className='text-xl font-semibold mb-4'>Filters</h3>
          <form className='space-y-4'>
            <div>
              <label htmlFor='categories' className='block text-sm font-medium'>Categories</label>
              <Select onValueChange={(value) => console.log(value)}>n                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Select categories...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectLabel>Select a category</SelectLabel>
                  <SelectItem value='programming'>Programming</SelectItem>
                  <SelectItem value='datascience'>Data Science</SelectItem>
                  <SelectItem value='business'>Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor='difficulty' className='block text-sm font-medium'>Difficulty Level</label>
              <Select onValueChange={(value) => console.log(value)}>n                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Select difficulty...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectLabel>Select a difficulty level</SelectLabel>
                  <SelectItem value='beginner'>Beginner</SelectItem>
                  <SelectItem value='intermediate'>Intermediate</SelectItem>
                  <SelectItem value='advanced'>Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor='duration' className='block text-sm font-medium'>Duration</label>
              <Select onValueChange={(value) => console.log(value)}>n                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Select duration...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectLabel>Select a duration</SelectLabel>
                  <SelectItem value='<1hour'>< 1 hour</SelectItem>
                  <SelectItem value='1-3hours'>1 - 3 hours</SelectItem>
                  <SelectItem value='>3hours'>> 3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type='submit' className='w-full'>Apply Filters</Button>
          </form>
        </div>
      </aside>
      <footer className='bg-primary p-6 text-center'>
        <p>&copy; 2023 Educational Library. All rights reserved.</p>
      </footer>
    </div>
  )
}