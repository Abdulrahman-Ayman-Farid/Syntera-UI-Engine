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
  CartesianGrid, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Heart, Share2, Users, Send, Search, Filter,
  Plus, Edit, Trash, Bell, AtSign, Hash, ThumbsUp, Eye,
  Bookmark, TrendingUp, ChevronRight, UserCircle2, Clock,
  Pin, Star, Award, Zap, Activity, BarChart3, Sparkles, Flower2
} from 'lucide-react'

// Forum metrics - Cherry Blossom Theme
const FORUM_METRICS = [
  {
    id: 'community_posts',
    label: 'Community Posts',
    value: '28,945',
    change: '+2,842',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-pink-400 to-rose-400',
    format: 'count'
  },
  {
    id: 'active_members',
    label: 'Active Members',
    value: '9,234',
    change: '+16%',
    status: 'increasing' as const,
    icon: Users,
    color: 'bg-gradient-to-r from-rose-400 to-pink-500',
    format: 'count'
  },
  {
    id: 'conversations',
    label: 'Conversations',
    value: '18.2k',
    change: '+31%',
    status: 'increasing' as const,
    icon: Send,
    color: 'bg-gradient-to-r from-pink-500 to-fuchsia-500',
    format: 'count'
  },
  {
    id: 'happiness_score',
    label: 'Happiness Score',
    value: '98',
    unit: '%',
    change: '+6%',
    status: 'good' as const,
    icon: Heart,
    color: 'bg-gradient-to-r from-rose-500 to-pink-600',
    format: 'percent'
  }
] as const

const FORUM_CATEGORIES = [
  { id: 'lifestyle', name: 'Lifestyle', threads: 7840, posts: 48500, color: '#FFB6C1' },
  { id: 'creativity', name: 'Creativity', threads: 5920, posts: 36400, color: '#FADADD' },
  { id: 'wellness', name: 'Wellness', threads: 4560, posts: 24900, color: '#FF6B91' },
  { id: 'community', name: 'Community', threads: 3180, posts: 18600, color: '#FF4D7A' },
] as const

const FEATURED_TOPICS = [
  {
    id: 'topic-001',
    title: '🌸 Welcome to our beautiful community!',
    author: {
      username: 'blossom_admin',
      displayName: 'Cherry Admin',
      avatar: '🌸',
      reputation: 18420,
      badge: 'Rose Gold'
    },
    category: 'community',
    replies: 4284,
    views: 128420,
    likes: 3542,
    isPinned: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastActivity: '1 min ago',
    tags: ['welcome', 'community', 'intro']
  },
  {
    id: 'topic-002',
    title: 'Inspiring creative projects for spring',
    author: {
      username: 'creative_soul',
      displayName: 'Creative Soul',
      avatar: '🎨',
      reputation: 12820
    },
    category: 'creativity',
    replies: 1842,
    views: 54560,
    likes: 1292,
    isPinned: false,
    createdAt: '2024-01-12T10:30:00Z',
    lastActivity: '12 min ago',
    tags: ['creativity', 'inspiration', 'spring']
  },
  {
    id: 'topic-003',
    title: 'Wellness tips for a balanced life',
    author: {
      username: 'wellness_guide',
      displayName: 'Wellness Guide',
      avatar: '🧘',
      reputation: 9785
    },
    category: 'wellness',
    replies: 856,
    views: 24890,
    likes: 642,
    isPinned: false,
    createdAt: '2024-01-13T14:20:00Z',
    lastActivity: '25 min ago',
    tags: ['wellness', 'health', 'balance']
  },
  {
    id: 'topic-004',
    title: '💖 Share your favorite lifestyle moments',
    author: {
      username: 'lifestyle_lover',
      displayName: 'Lifestyle Enthusiast',
      avatar: '✨',
      reputation: 11456
    },
    category: 'lifestyle',
    replies: 1089,
    views: 38240,
    likes: 867,
    isPinned: false,
    createdAt: '2024-01-08T09:00:00Z',
    lastActivity: '1 hour ago',
    tags: ['lifestyle', 'moments', 'sharing']
  },
] as const

const ENGAGEMENT_TRENDS = [
  { day: 'Mon', posts: 580, comments: 1240, likes: 2850 },
  { day: 'Tue', posts: 720, comments: 1580, likes: 3240 },
  { day: 'Wed', posts: 840, comments: 1820, likes: 3850 },
  { day: 'Thu', posts: 920, comments: 2140, likes: 4280 },
  { day: 'Fri', posts: 1080, comments: 2480, likes: 5120 },
  { day: 'Sat', posts: 760, comments: 1890, likes: 3640 },
  { day: 'Sun', posts: 640, comments: 1650, likes: 3080 },
] as const

const BELOVED_MEMBERS = [
  { username: 'creative_soul', posts: 4856, reputation: 12820, avatar: '🎨', badge: 'Artist', isOnline: true },
  { username: 'lifestyle_lover', posts: 4242, reputation: 11456, avatar: '✨', badge: 'Influencer', isOnline: true },
  { username: 'wellness_guide', posts: 3824, reputation: 9785, avatar: '🧘', badge: 'Guide', isOnline: false },
  { username: 'kindness_advocate', posts: 3489, reputation: 8945, avatar: '💝', badge: 'Supporter', isOnline: true },
] as const

export default function CherryBlossomForumDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'lifestyle': return 'bg-pink-100 text-pink-800 border-pink-300'
      case 'creativity': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'wellness': return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300'
      case 'community': return 'bg-pink-200 text-pink-900 border-pink-400'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredTopics = useMemo(() => {
    return FEATURED_TOPICS.filter(topic => {
      const matchesSearch = searchQuery === '' || 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || 
        topic.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white'>
      {/* Decorative Petals Effect */}
      <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent pointer-events-none' />
      
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-pink-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl shadow-lg shadow-pink-300/50'>
                <Flower2 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-pink-900 flex items-center gap-2'>
                  Cherry Blossom Forum
                  <Sparkles className='w-5 h-5 text-pink-400' />
                </h1>
                <p className='text-pink-700'>Blooming conversations & connections</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-pink-300 bg-white text-pink-900 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-300/50 text-white font-semibold'>
                <Plus className='w-4 h-4 mr-2' />
                New Topic
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='relative p-6 space-y-8'>
        {/* Forum Metrics */}
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
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-pink-200 bg-white backdrop-blur shadow-md hover:shadow-lg hover:shadow-pink-200/50 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-pink-700'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-pink-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-pink-600'>{metric.unit}</span>
                            )}
                          </div>
                          <div className='flex items-center text-sm font-medium text-emerald-600'>
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='area' data-metrics='posts,comments,likes'>
            <Card className='border border-pink-200 bg-white backdrop-blur shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-pink-900'>Engagement Trends</CardTitle>
                    <CardDescription className='text-pink-700'>Weekly community activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-700 bg-emerald-50'>
                    <Activity className='w-3 h-3 mr-1' />
                    Thriving
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={ENGAGEMENT_TRENDS}>
                    <defs>
                      <linearGradient id='colorPosts' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#FFB6C1' stopOpacity={0.8}/>
                        <stop offset='95%' stopColor='#FFB6C1' stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id='colorLikes' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#FF6B91' stopOpacity={0.8}/>
                        <stop offset='95%' stopColor='#FF6B91' stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#FCE7F3' />
                    <XAxis dataKey='day' stroke='#9D174D' />
                    <YAxis stroke='#9D174D' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#FFF0F5', border: '1px solid #FFB6C1' }} />
                    </TooltipProvider>
                    <Legend />
                    <Area 
                      type='monotone' 
                      dataKey='posts' 
                      stroke='#FFB6C1' 
                      fillOpacity={1}
                      fill='url(#colorPosts)'
                      name='Posts'
                      strokeWidth={2}
                    />
                    <Area 
                      type='monotone' 
                      dataKey='likes' 
                      stroke='#FF6B91' 
                      fillOpacity={1}
                      fill='url(#colorLikes)'
                      name='Likes'
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Distribution */}
          <section data-template-section='category-stats' data-chart-type='bar' data-metrics='threads,posts'>
            <Card className='border border-pink-200 bg-white backdrop-blur shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-pink-900'>Category Distribution</CardTitle>
                    <CardDescription className='text-pink-700'>Topics by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-rose-600 text-rose-700 bg-rose-50'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Overview
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={FORUM_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#FCE7F3' />
                    <XAxis dataKey='name' stroke='#9D174D' />
                    <YAxis stroke='#9D174D' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#FFF0F5', border: '1px solid #FFB6C1' }} />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='threads' name='Threads' radius={[10, 10, 0, 0]}>
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

        {/* Topics & Members */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Featured Topics */}
          <section data-template-section='featured-topics' data-component-type='topic-list' className='lg:col-span-2'>
            <Card className='border border-pink-200 bg-white backdrop-blur shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-pink-900'>Featured Topics</CardTitle>
                    <CardDescription className='text-pink-700'>Trending conversations</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search topics...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-pink-300 bg-white text-pink-900 placeholder:text-pink-400'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-40 border-pink-300 bg-white text-pink-900'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='lifestyle'>Lifestyle</SelectItem>
                        <SelectItem value='creativity'>Creativity</SelectItem>
                        <SelectItem value='wellness'>Wellness</SelectItem>
                        <SelectItem value='community'>Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <AnimatePresence>
                  {filteredTopics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-pink-200 rounded-xl hover:border-pink-400 hover:shadow-lg hover:shadow-pink-200/50 transition-all cursor-pointer ${
                        selectedTopic === topic.id ? 'ring-2 ring-pink-400 ring-offset-2' : ''
                      }`}
                      onClick={() => setSelectedTopic(topic.id)}
                    >
                      <div className='flex items-start space-x-4'>
                        <div className='text-3xl flex-shrink-0'>{topic.author.avatar}</div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between mb-2'>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-1'>
                                {topic.isPinned && (
                                  <Pin className='w-4 h-4 text-pink-500' />
                                )}
                                <h4 className='font-bold text-pink-900 text-lg'>{topic.title}</h4>
                              </div>
                              <p className='text-sm text-pink-700'>
                                by <span className='text-pink-600 font-semibold'>{topic.author.displayName}</span>
                                {topic.author.badge && (
                                  <>
                                    {' • '}
                                    <Badge variant='outline' className='border-pink-500 text-pink-700 text-xs bg-white/50'>
                                      {topic.author.badge}
                                    </Badge>
                                  </>
                                )}
                              </p>
                            </div>
                            <Badge className={getCategoryStyle(topic.category)}>
                              {topic.category}
                            </Badge>
                          </div>
                          
                          <div className='flex items-center flex-wrap gap-2 mb-3'>
                            {topic.tags.map((tag) => (
                              <Badge key={tag} variant='outline' className='border-pink-400 text-pink-700 text-xs bg-white/50'>
                                <Hash className='w-3 h-3 mr-1' />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4 text-sm text-pink-700'>
                              <span className='flex items-center'>
                                <MessageSquare className='w-4 h-4 mr-1' />
                                {topic.replies}
                              </span>
                              <span className='flex items-center'>
                                <Eye className='w-4 h-4 mr-1' />
                                {topic.views}
                              </span>
                              <span className='flex items-center'>
                                <Heart className='w-4 h-4 mr-1' />
                                {topic.likes}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-4 h-4 mr-1' />
                                {topic.lastActivity}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-pink-600 hover:text-pink-900 hover:bg-pink-100'>
                                <Bookmark className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-pink-600 hover:text-pink-900 hover:bg-pink-100'>
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

          {/* Beloved Members */}
          <section data-template-section='beloved-members' data-component-type='member-list'>
            <Card className='border border-pink-200 bg-white backdrop-blur shadow-md'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-pink-900'>Beloved Members</CardTitle>
                <CardDescription className='text-pink-700'>Community favorites</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {BELOVED_MEMBERS.map((member, index) => (
                  <motion.div
                    key={member.username}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-center space-x-4 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors'
                  >
                    <div className='text-2xl relative'>
                      {member.avatar}
                      {member.isOnline && (
                        <span className='absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-pink-900'>{member.username}</h4>
                        <Badge variant='outline' className='border-pink-500 text-pink-700 text-xs bg-white/50'>
                          {member.badge}
                        </Badge>
                      </div>
                      <div className='flex items-center space-x-3 text-xs text-pink-700 mt-1'>
                        <span className='flex items-center'>
                          <Send className='w-3 h-3 mr-1' />
                          {member.posts}
                        </span>
                        <span className='flex items-center'>
                          <Star className='w-3 h-3 mr-1' />
                          {member.reputation}
                        </span>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' className='border-pink-500 text-pink-700 hover:bg-pink-500 hover:text-white'>
                      <Heart className='w-4 h-4' />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full border-pink-300 text-pink-700 hover:bg-pink-50'>
                  View All Members
                  <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
