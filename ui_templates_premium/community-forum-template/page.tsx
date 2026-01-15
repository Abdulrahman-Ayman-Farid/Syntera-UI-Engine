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
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Heart, Share2, Users, Send, Search, Filter,
  Plus, Edit, Trash, Bell, AtSign, Hash, ThumbsUp, Eye,
  Bookmark, TrendingUp, ChevronRight, UserPlus, Clock,
  Pin, Star, Award, Zap, Activity, BarChart3, PieChart
} from 'lucide-react'

// Forum metrics with type safety
const FORUM_METRICS = [
  {
    id: 'total_threads',
    label: 'Total Threads',
    value: '24,856',
    change: '+1,245',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    format: 'count'
  },
  {
    id: 'active_users',
    label: 'Active Users',
    value: '8,432',
    change: '+12%',
    status: 'increasing' as const,
    icon: Users,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'total_posts',
    label: 'Total Posts',
    value: '156.2k',
    change: '+24%',
    status: 'increasing' as const,
    icon: Send,
    color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'engagement_rate',
    label: 'Engagement Rate',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    format: 'percent'
  }
] as const

const FORUM_CATEGORIES = [
  { id: 'general', name: 'General Discussion', threads: 4520, posts: 28400, color: '#FFD700' },
  { id: 'announcements', name: 'Announcements', threads: 245, posts: 3200, color: '#EAB308' },
  { id: 'help', name: 'Help & Support', threads: 3890, posts: 42100, color: '#3F3F46' },
  { id: 'feedback', name: 'Feedback', threads: 1680, posts: 12800, color: '#78350f' },
] as const

const TRENDING_THREADS = [
  {
    id: 'thread-001',
    title: 'Welcome to our community! Introduce yourself here',
    author: {
      username: 'admin',
      displayName: 'Community Admin',
      avatar: '👨‍💼',
      reputation: 9842
    },
    category: 'general',
    replies: 1284,
    views: 45620,
    likes: 892,
    isPinned: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastActivity: '2 min ago',
    tags: ['welcome', 'introduction']
  },
  {
    id: 'thread-002',
    title: 'Best practices for community engagement in 2024',
    author: {
      username: 'sarah_m',
      displayName: 'Sarah Mitchell',
      avatar: '👩‍💻',
      reputation: 5420
    },
    category: 'general',
    replies: 428,
    views: 12450,
    likes: 324,
    isPinned: false,
    createdAt: '2024-01-12T10:30:00Z',
    lastActivity: '15 min ago',
    tags: ['engagement', 'tips']
  },
  {
    id: 'thread-003',
    title: 'How to use the new forum features?',
    author: {
      username: 'john_d',
      displayName: 'John Doe',
      avatar: '👨‍🎨',
      reputation: 3245
    },
    category: 'help',
    replies: 156,
    views: 5890,
    likes: 124,
    isPinned: false,
    createdAt: '2024-01-13T14:20:00Z',
    lastActivity: '1 hour ago',
    tags: ['help', 'features']
  },
  {
    id: 'thread-004',
    title: 'Community guidelines and rules - Please read!',
    author: {
      username: 'moderator',
      displayName: 'Forum Moderator',
      avatar: '🛡️',
      reputation: 8924
    },
    category: 'announcements',
    replies: 89,
    views: 18240,
    likes: 456,
    isPinned: true,
    createdAt: '2024-01-08T09:00:00Z',
    lastActivity: '3 hours ago',
    tags: ['rules', 'guidelines']
  },
] as const

const ACTIVITY_DATA = [
  { day: 'Mon', posts: 420, threads: 85, users: 1240 },
  { day: 'Tue', posts: 580, threads: 92, users: 1580 },
  { day: 'Wed', posts: 720, threads: 105, users: 1820 },
  { day: 'Thu', posts: 890, threads: 120, users: 2140 },
  { day: 'Fri', posts: 950, threads: 135, users: 2280 },
  { day: 'Sat', posts: 680, threads: 98, users: 1890 },
  { day: 'Sun', posts: 540, threads: 78, users: 1450 },
] as const

const TOP_CONTRIBUTORS = [
  { username: 'sarah_m', posts: 2456, reputation: 5420, avatar: '👩‍💻', badge: 'Expert' },
  { username: 'john_d', posts: 1842, reputation: 3245, avatar: '👨‍🎨', badge: 'Helper' },
  { username: 'emily_r', posts: 1624, reputation: 2890, avatar: '👩‍🔬', badge: 'Active' },
  { username: 'michael_k', posts: 1389, reputation: 2456, avatar: '👨‍🚀', badge: 'Contributor' },
] as const

export default function CommunityForumDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [selectedThread, setSelectedThread] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'announcements': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'help': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'feedback': return 'bg-orange-100 text-orange-800 border-orange-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredThreads = useMemo(() => {
    return TRENDING_THREADS.filter(thread => {
      const matchesSearch = searchQuery === '' || 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || 
        thread.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-lg'>
                <MessageSquare className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Community Forum</h1>
                <p className='text-gray-400'>Connect, discuss, and share knowledge</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-700 bg-gray-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg text-gray-900 font-semibold'>
                <Plus className='w-4 h-4 mr-2' />
                New Thread
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Forum Overview Metrics */}
        <section data-template-section='forum-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {FORUM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-700 bg-gray-800/50 backdrop-blur shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-amber-400'
                          }`}>
                            <TrendingUp className='w-4 h-4 mr-1' />
                            {metric.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${metric.color} shadow-lg`}>
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

        {/* Forum Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Activity Trends */}
          <section data-template-section='activity-trends' data-chart-type='area' data-metrics='posts,threads,users'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Activity Trends</CardTitle>
                    <CardDescription className='text-gray-400'>Weekly forum activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-400'>
                    <Activity className='w-3 h-3 mr-1' />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id='colorPosts' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#FFD700' stopOpacity={0.8}/>
                        <stop offset='95%' stopColor='#FFD700' stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id='colorThreads' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#EAB308' stopOpacity={0.8}/>
                        <stop offset='95%' stopColor='#EAB308' stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='day' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    </TooltipProvider>
                    <Legend />
                    <Area 
                      type='monotone' 
                      dataKey='posts' 
                      stroke='#FFD700' 
                      fillOpacity={1}
                      fill='url(#colorPosts)'
                      name='Posts'
                    />
                    <Area 
                      type='monotone' 
                      dataKey='threads' 
                      stroke='#EAB308' 
                      fillOpacity={1}
                      fill='url(#colorThreads)'
                      name='Threads'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='threads,posts'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Category Distribution</CardTitle>
                    <CardDescription className='text-gray-400'>Threads by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-600 text-purple-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={FORUM_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='name' stroke='#9ca3af' angle={-15} textAnchor='end' height={80} />
                    <YAxis stroke='#9ca3af' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='threads' name='Threads' radius={[4, 4, 0, 0]}>
                      {FORUM_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Thread Browser & Top Contributors */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Trending Threads */}
          <section data-template-section='trending-threads' data-component-type='thread-list' className='lg:col-span-2'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Trending Threads</CardTitle>
                    <CardDescription className='text-gray-400'>Most active discussions</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search threads...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-700 bg-gray-900 text-white'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-40 border-gray-700 bg-gray-900 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='general'>General</SelectItem>
                        <SelectItem value='announcements'>Announcements</SelectItem>
                        <SelectItem value='help'>Help</SelectItem>
                        <SelectItem value='feedback'>Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-32 border-gray-700 bg-gray-900 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='latest'>Latest</SelectItem>
                        <SelectItem value='popular'>Popular</SelectItem>
                        <SelectItem value='replies'>Most Replies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <AnimatePresence>
                  {filteredThreads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-xl hover:border-amber-500/50 transition-colors cursor-pointer ${
                        selectedThread === thread.id ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900' : ''
                      }`}
                      onClick={() => setSelectedThread(thread.id)}
                    >
                      <div className='flex items-start space-x-4'>
                        <div className='text-3xl flex-shrink-0'>{thread.author.avatar}</div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between mb-2'>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-1'>
                                {thread.isPinned && (
                                  <Pin className='w-4 h-4 text-amber-400' />
                                )}
                                <h4 className='font-bold text-white text-lg'>{thread.title}</h4>
                              </div>
                              <p className='text-sm text-gray-400'>
                                by <span className='text-amber-400'>{thread.author.displayName}</span>
                                {' • '}
                                <span className='flex items-center inline-flex'>
                                  <Award className='w-3 h-3 mr-1' />
                                  {thread.author.reputation}
                                </span>
                              </p>
                            </div>
                            <Badge className={getCategoryColor(thread.category)}>
                              {thread.category}
                            </Badge>
                          </div>
                          
                          <div className='flex items-center flex-wrap gap-2 mb-3'>
                            {thread.tags.map((tag) => (
                              <Badge key={tag} variant='outline' className='border-gray-600 text-gray-400 text-xs'>
                                <Hash className='w-3 h-3 mr-1' />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4 text-sm text-gray-400'>
                              <span className='flex items-center'>
                                <MessageSquare className='w-4 h-4 mr-1' />
                                {thread.replies} replies
                              </span>
                              <span className='flex items-center'>
                                <Eye className='w-4 h-4 mr-1' />
                                {thread.views} views
                              </span>
                              <span className='flex items-center'>
                                <Heart className='w-4 h-4 mr-1' />
                                {thread.likes} likes
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-4 h-4 mr-1' />
                                {thread.lastActivity}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                                <Bookmark className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                                <Share2 className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </section>

          {/* Top Contributors */}
          <section data-template-section='top-contributors' data-component-type='user-list'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Top Contributors</CardTitle>
                <CardDescription className='text-gray-400'>Most active members</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {TOP_CONTRIBUTORS.map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-center space-x-4 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-900/80 transition-colors'
                  >
                    <div className='text-2xl'>{user.avatar}</div>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-white'>{user.username}</h4>
                        <Badge variant='outline' className='border-amber-600 text-amber-400 text-xs'>
                          {user.badge}
                        </Badge>
                      </div>
                      <div className='flex items-center space-x-3 text-xs text-gray-400 mt-1'>
                        <span className='flex items-center'>
                          <Send className='w-3 h-3 mr-1' />
                          {user.posts} posts
                        </span>
                        <span className='flex items-center'>
                          <Star className='w-3 h-3 mr-1' />
                          {user.reputation}
                        </span>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' className='border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white'>
                      <UserPlus className='w-4 h-4' />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full border-gray-700 text-gray-400 hover:bg-gray-900'>
                  View All Contributors
                  <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>

        {/* Quick Actions */}
        <section data-template-section='quick-actions' data-component-type='action-grid'>
          <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Button className='h-24 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 flex flex-col items-center justify-center text-gray-900 font-semibold'>
                  <Plus className='w-6 h-6 mb-2' />
                  Create Thread
                </Button>
                <Button variant='outline' className='h-24 border-gray-700 text-gray-300 hover:bg-gray-900 flex flex-col items-center justify-center'>
                  <Search className='w-6 h-6 mb-2' />
                  Search Forum
                </Button>
                <Button variant='outline' className='h-24 border-gray-700 text-gray-300 hover:bg-gray-900 flex flex-col items-center justify-center'>
                  <Bell className='w-6 h-6 mb-2' />
                  Notifications
                </Button>
                <Button variant='outline' className='h-24 border-gray-700 text-gray-300 hover:bg-gray-900 flex flex-col items-center justify-center'>
                  <Users className='w-6 h-6 mb-2' />
                  Members
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
