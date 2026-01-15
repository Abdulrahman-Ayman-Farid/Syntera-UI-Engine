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
  Bookmark, TrendingUp, ChevronRight, UserPlus, Clock,
  Pin, Star, Award, Zap, Activity, BarChart3, Sun
} from 'lucide-react'

// Forum metrics - Warm Desert Theme
const FORUM_METRICS = [
  {
    id: 'active_threads',
    label: 'Active Threads',
    value: '18,945',
    change: '+1,842',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'members_online',
    label: 'Members Online',
    value: '6,234',
    change: '+15%',
    status: 'increasing' as const,
    icon: Users,
    color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    format: 'count'
  },
  {
    id: 'daily_posts',
    label: 'Daily Posts',
    value: '12.8k',
    change: '+28%',
    status: 'increasing' as const,
    icon: Send,
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
    format: 'count'
  },
  {
    id: 'member_satisfaction',
    label: 'Satisfaction',
    value: '96',
    unit: '%',
    change: '+4%',
    status: 'good' as const,
    icon: Star,
    color: 'bg-gradient-to-r from-amber-600 to-yellow-600',
    format: 'percent'
  }
] as const

const FORUM_CATEGORIES = [
  { id: 'discussion', name: 'Discussions', threads: 6840, posts: 42500, color: '#D29E5D' },
  { id: 'support', name: 'Support', threads: 4920, posts: 31400, color: '#F2C871' },
  { id: 'showcase', name: 'Showcase', threads: 3560, posts: 18900, color: '#FFB830' },
  { id: 'feedback', name: 'Feedback', threads: 2180, posts: 12600, color: '#DD6D02' },
] as const

const FEATURED_POSTS = [
  {
    id: 'post-001',
    title: '☀️ Welcome to our warm community - Start here!',
    author: {
      username: 'sunny_admin',
      displayName: 'Community Manager',
      avatar: '🌟',
      reputation: 15420,
      badge: 'Gold Member'
    },
    category: 'discussion',
    replies: 3284,
    views: 89420,
    likes: 2142,
    isPinned: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastActivity: '3 min ago',
    tags: ['welcome', 'intro', 'pinned']
  },
  {
    id: 'post-002',
    title: 'Best practices for community collaboration',
    author: {
      username: 'collab_expert',
      displayName: 'Collaboration Expert',
      avatar: '🤝',
      reputation: 9820
    },
    category: 'discussion',
    replies: 1242,
    views: 34560,
    likes: 892,
    isPinned: false,
    createdAt: '2024-01-12T10:30:00Z',
    lastActivity: '18 min ago',
    tags: ['collaboration', 'tips', 'best-practices']
  },
  {
    id: 'post-003',
    title: 'Need help with account settings',
    author: {
      username: 'new_user_23',
      displayName: 'New Member',
      avatar: '👤',
      reputation: 145
    },
    category: 'support',
    replies: 24,
    views: 1890,
    likes: 12,
    isPinned: false,
    createdAt: '2024-01-13T14:20:00Z',
    lastActivity: '45 min ago',
    tags: ['support', 'account', 'help']
  },
  {
    id: 'post-004',
    title: '🎨 Check out my latest project showcase!',
    author: {
      username: 'creative_designer',
      displayName: 'Creative Designer',
      avatar: '🎨',
      reputation: 7456
    },
    category: 'showcase',
    replies: 189,
    views: 8240,
    likes: 567,
    isPinned: false,
    createdAt: '2024-01-08T09:00:00Z',
    lastActivity: '1 hour ago',
    tags: ['showcase', 'design', 'creative']
  },
] as const

const ACTIVITY_TIMELINE = [
  { time: '9 AM', posts: 320, replies: 580, members: 1450 },
  { time: '12 PM', posts: 480, replies: 840, members: 2240 },
  { time: '3 PM', posts: 620, replies: 1120, members: 2850 },
  { time: '6 PM', posts: 780, replies: 1360, members: 3420 },
  { time: '9 PM', posts: 540, replies: 980, members: 2640 },
] as const

const ACTIVE_MEMBERS = [
  { username: 'creative_designer', posts: 3856, reputation: 7456, avatar: '🎨', badge: 'Creator', status: 'online' },
  { username: 'collab_expert', posts: 3242, reputation: 9820, avatar: '🤝', badge: 'Expert', status: 'online' },
  { username: 'helpful_guide', posts: 2824, reputation: 6190, avatar: '🧭', badge: 'Helper', status: 'away' },
  { username: 'tech_mentor', posts: 2489, reputation: 5845, avatar: '💡', badge: 'Mentor', status: 'online' },
] as const

export default function WarmDesertForumDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'discussion': return 'bg-amber-100 text-amber-800 border-amber-400'
      case 'support': return 'bg-yellow-100 text-yellow-800 border-yellow-400'
      case 'showcase': return 'bg-orange-100 text-orange-800 border-orange-400'
      case 'feedback': return 'bg-red-100 text-red-800 border-red-400'
      default: return 'bg-gray-100 text-gray-800 border-gray-400'
    }
  }

  const filteredPosts = useMemo(() => {
    return FEATURED_POSTS.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || 
        post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'>
      {/* Decorative Background */}
      <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200/30 via-transparent to-transparent pointer-events-none' />
      
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-amber-300 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30'>
                <Sun className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-amber-900'>Desert Community</h1>
                <p className='text-amber-700'>Warm, welcoming discussions</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-amber-300 bg-white text-amber-900 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='all'>All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 text-white font-semibold'>
                <Plus className='w-4 h-4 mr-2' />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='relative p-6 space-y-8'>
        {/* Forum Metrics */}
        <section data-template-section='forum-stats' data-component-type='kpi-grid'>
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
                  <Card className='h-full border border-amber-200 bg-white/80 backdrop-blur shadow-md hover:shadow-lg hover:shadow-amber-200/50 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-amber-700'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-amber-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-amber-600'>{metric.unit}</span>
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

        {/* Analytics Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Activity Timeline */}
          <section data-template-section='activity-timeline' data-chart-type='area' data-metrics='posts,replies,members'>
            <Card className='border border-amber-200 bg-white/80 backdrop-blur shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-amber-900'>Activity Timeline</CardTitle>
                    <CardDescription className='text-amber-700'>Today's engagement pattern</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-700 bg-emerald-50'>
                    <Activity className='w-3 h-3 mr-1' />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={ACTIVITY_TIMELINE}>
                    <defs>
                      <linearGradient id='colorActivity' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#F59E0B' stopOpacity={0.8}/>
                        <stop offset='95%' stopColor='#F59E0B' stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#FDE68A' />
                    <XAxis dataKey='time' stroke='#92400E' />
                    <YAxis stroke='#92400E' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }} />
                    </TooltipProvider>
                    <Legend />
                    <Area 
                      type='monotone' 
                      dataKey='posts' 
                      stroke='#F59E0B' 
                      fillOpacity={1}
                      fill='url(#colorActivity)'
                      name='Posts'
                      strokeWidth={2}
                    />
                    <Area 
                      type='monotone' 
                      dataKey='replies' 
                      stroke='#D97706' 
                      fillOpacity={0.3}
                      fill='#FDE68A'
                      name='Replies'
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Statistics */}
          <section data-template-section='category-breakdown' data-chart-type='bar' data-metrics='threads,posts'>
            <Card className='border border-amber-200 bg-white/80 backdrop-blur shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-amber-900'>Category Breakdown</CardTitle>
                    <CardDescription className='text-amber-700'>Posts by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-orange-600 text-orange-700 bg-orange-50'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Stats
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={FORUM_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#FDE68A' />
                    <XAxis dataKey='name' stroke='#92400E' />
                    <YAxis stroke='#92400E' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }} />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='threads' name='Threads' radius={[8, 8, 0, 0]}>
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

        {/* Posts & Members Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Featured Posts */}
          <section data-template-section='featured-posts' data-component-type='post-list' className='lg:col-span-2'>
            <Card className='border border-amber-200 bg-white/80 backdrop-blur shadow-md'>
              <CardHeader>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-amber-900'>Featured Posts</CardTitle>
                    <CardDescription className='text-amber-700'>Popular discussions</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search posts...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-amber-300 bg-white text-amber-900 placeholder:text-amber-500'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-40 border-amber-300 bg-white text-amber-900'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='discussion'>Discussions</SelectItem>
                        <SelectItem value='support'>Support</SelectItem>
                        <SelectItem value='showcase'>Showcase</SelectItem>
                        <SelectItem value='feedback'>Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <AnimatePresence>
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all cursor-pointer ${
                        selectedPost === post.id ? 'ring-2 ring-amber-500 ring-offset-2' : ''
                      }`}
                      onClick={() => setSelectedPost(post.id)}
                    >
                      <div className='flex items-start space-x-4'>
                        <div className='text-3xl flex-shrink-0'>{post.author.avatar}</div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between mb-2'>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-1'>
                                {post.isPinned && (
                                  <Pin className='w-4 h-4 text-amber-600' />
                                )}
                                <h4 className='font-bold text-amber-900 text-lg'>{post.title}</h4>
                              </div>
                              <p className='text-sm text-amber-700'>
                                by <span className='text-amber-600 font-semibold'>{post.author.displayName}</span>
                                {post.author.badge && (
                                  <>
                                    {' • '}
                                    <Badge variant='outline' className='border-amber-500 text-amber-700 text-xs bg-amber-50'>
                                      {post.author.badge}
                                    </Badge>
                                  </>
                                )}
                              </p>
                            </div>
                            <Badge className={getCategoryStyle(post.category)}>
                              {post.category}
                            </Badge>
                          </div>
                          
                          <div className='flex items-center flex-wrap gap-2 mb-3'>
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant='outline' className='border-amber-400 text-amber-700 text-xs bg-white/50'>
                                <Hash className='w-3 h-3 mr-1' />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4 text-sm text-amber-700'>
                              <span className='flex items-center'>
                                <MessageSquare className='w-4 h-4 mr-1' />
                                {post.replies}
                              </span>
                              <span className='flex items-center'>
                                <Eye className='w-4 h-4 mr-1' />
                                {post.views}
                              </span>
                              <span className='flex items-center'>
                                <Heart className='w-4 h-4 mr-1' />
                                {post.likes}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-4 h-4 mr-1' />
                                {post.lastActivity}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-amber-600 hover:text-amber-900 hover:bg-amber-100'>
                                <Bookmark className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-amber-600 hover:text-amber-900 hover:bg-amber-100'>
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

          {/* Active Members */}
          <section data-template-section='active-members' data-component-type='member-list'>
            <Card className='border border-amber-200 bg-white/80 backdrop-blur shadow-md'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-amber-900'>Active Members</CardTitle>
                <CardDescription className='text-amber-700'>Top contributors</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {ACTIVE_MEMBERS.map((member, index) => (
                  <motion.div
                    key={member.username}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-center space-x-4 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors'
                  >
                    <div className='text-2xl relative'>
                      {member.avatar}
                      {member.status === 'online' && (
                        <span className='absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white' />
                      )}
                      {member.status === 'away' && (
                        <span className='absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-amber-900'>{member.username}</h4>
                        <Badge variant='outline' className='border-amber-500 text-amber-700 text-xs bg-white/50'>
                          {member.badge}
                        </Badge>
                      </div>
                      <div className='flex items-center space-x-3 text-xs text-amber-700 mt-1'>
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
                    <Button variant='outline' size='sm' className='border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white'>
                      <UserPlus className='w-4 h-4' />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full border-amber-300 text-amber-700 hover:bg-amber-50'>
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
