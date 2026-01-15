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
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Heart, Share2, Users, Send, Search, Filter,
  Plus, Edit, Trash, Bell, AtSign, Hash, ThumbsUp, Eye,
  Bookmark, TrendingUp, ChevronRight, UserPlus, Clock,
  Pin, Star, Award, Zap, Activity, BarChart3, Sparkles
} from 'lucide-react'

// Forum metrics - Premium Dark Theme
const FORUM_METRICS = [
  {
    id: 'total_discussions',
    label: 'Total Discussions',
    value: '32,456',
    change: '+2,145',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-purple-600 to-violet-600',
    format: 'count'
  },
  {
    id: 'community_members',
    label: 'Community Members',
    value: '12,840',
    change: '+18%',
    status: 'increasing' as const,
    icon: Users,
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    format: 'count'
  },
  {
    id: 'total_replies',
    label: 'Total Replies',
    value: '248.5k',
    change: '+32%',
    status: 'increasing' as const,
    icon: Send,
    color: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    format: 'count'
  },
  {
    id: 'satisfaction_score',
    label: 'Satisfaction Score',
    value: '94',
    unit: '%',
    change: '+7%',
    status: 'good' as const,
    icon: Star,
    color: 'bg-gradient-to-r from-rose-600 to-pink-600',
    format: 'percent'
  }
] as const

const FORUM_CATEGORIES = [
  { id: 'tech', name: 'Technology', threads: 5840, posts: 32500, color: '#8b5cf6' },
  { id: 'design', name: 'Design', threads: 3920, posts: 21400, color: '#a855f7' },
  { id: 'gaming', name: 'Gaming', threads: 4560, posts: 28900, color: '#c084fc' },
  { id: 'lifestyle', name: 'Lifestyle', threads: 2180, posts: 15600, color: '#d8b4fe' },
] as const

const TRENDING_DISCUSSIONS = [
  {
    id: 'disc-001',
    title: '🚀 Exciting new features coming next month!',
    author: {
      username: 'moderator_pro',
      displayName: 'Premium Moderator',
      avatar: '⭐',
      reputation: 12450,
      badge: 'Platinum'
    },
    category: 'tech',
    replies: 2184,
    views: 68420,
    likes: 1542,
    isPinned: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastActivity: 'Just now',
    tags: ['announcement', 'features', 'premium']
  },
  {
    id: 'disc-002',
    title: 'Advanced tips for maximizing engagement',
    author: {
      username: 'expert_ninja',
      displayName: 'Community Expert',
      avatar: '🎯',
      reputation: 8920
    },
    category: 'design',
    replies: 842,
    views: 24560,
    likes: 678,
    isPinned: false,
    createdAt: '2024-01-12T10:30:00Z',
    lastActivity: '5 min ago',
    tags: ['tutorial', 'engagement', 'advanced']
  },
  {
    id: 'disc-003',
    title: 'Let\'s discuss the latest gaming trends',
    author: {
      username: 'gamer_pro',
      displayName: 'Pro Gamer',
      avatar: '🎮',
      reputation: 6785
    },
    category: 'gaming',
    replies: 456,
    views: 15890,
    likes: 342,
    isPinned: false,
    createdAt: '2024-01-13T14:20:00Z',
    lastActivity: '30 min ago',
    tags: ['gaming', 'trends', 'discussion']
  },
  {
    id: 'disc-004',
    title: 'Monthly community meetup - Join us!',
    author: {
      username: 'event_master',
      displayName: 'Event Coordinator',
      avatar: '🎉',
      reputation: 9456
    },
    category: 'lifestyle',
    replies: 289,
    views: 12450,
    likes: 567,
    isPinned: true,
    createdAt: '2024-01-08T09:00:00Z',
    lastActivity: '2 hours ago',
    tags: ['event', 'meetup', 'community']
  },
] as const

const ENGAGEMENT_DATA = [
  { day: 'Mon', posts: 680, threads: 125, users: 1850 },
  { day: 'Tue', posts: 840, threads: 148, users: 2140 },
  { day: 'Wed', posts: 960, threads: 165, users: 2450 },
  { day: 'Thu', posts: 1120, threads: 182, users: 2780 },
  { day: 'Fri', posts: 1280, threads: 205, users: 3120 },
  { day: 'Sat', posts: 920, threads: 156, users: 2340 },
  { day: 'Sun', posts: 780, threads: 132, users: 2080 },
] as const

const TOP_INFLUENCERS = [
  { username: 'expert_ninja', posts: 4256, reputation: 8920, avatar: '🎯', badge: 'Diamond', online: true },
  { username: 'gamer_pro', posts: 3842, reputation: 6785, avatar: '🎮', badge: 'Gold', online: true },
  { username: 'design_guru', posts: 3124, reputation: 5890, avatar: '🎨', badge: 'Gold', online: false },
  { username: 'tech_wizard', posts: 2889, reputation: 5245, avatar: '🧙', badge: 'Silver', online: true },
] as const

export default function PremiumCommunityForum() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'bg-purple-900/50 text-purple-300 border-purple-500'
      case 'design': return 'bg-violet-900/50 text-violet-300 border-violet-500'
      case 'gaming': return 'bg-fuchsia-900/50 text-fuchsia-300 border-fuchsia-500'
      case 'lifestyle': return 'bg-pink-900/50 text-pink-300 border-pink-500'
      default: return 'bg-gray-900/50 text-gray-300 border-gray-500'
    }
  }

  const filteredDiscussions = useMemo(() => {
    return TRENDING_DISCUSSIONS.filter(disc => {
      const matchesSearch = searchQuery === '' || 
        disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || 
        disc.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'>
      {/* Mesh Gradient Overlay */}
      <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none' />
      
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-purple-900/50 bg-slate-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg shadow-purple-500/50'>
                <MessageSquare className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white flex items-center gap-2'>
                  Premium Forum
                  <Sparkles className='w-6 h-6 text-purple-400' />
                </h1>
                <p className='text-purple-300'>Elite community discussions</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-purple-800 bg-purple-950 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/50 font-semibold'>
                <Plus className='w-4 h-4 mr-2' />
                New Discussion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='relative p-6 space-y-8'>
        {/* Forum Overview Metrics */}
        <section data-template-section='forum-metrics' data-component-type='kpi-grid'>
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
                  <Card className='h-full border border-purple-900/50 bg-slate-900/50 backdrop-blur shadow-lg hover:shadow-purple-500/20 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-purple-300'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-purple-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className='flex items-center text-sm font-medium text-emerald-400'>
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
          {/* Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='line' data-metrics='posts,threads,users'>
            <Card className='border border-purple-900/50 bg-slate-900/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Engagement Trends</CardTitle>
                    <CardDescription className='text-purple-300'>Weekly activity overview</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-400'>
                    <Activity className='w-3 h-3 mr-1' />
                    Growing
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#4c1d95' />
                    <XAxis dataKey='day' stroke='#a78bfa' />
                    <YAxis stroke='#a78bfa' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #6d28d9' }} />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='posts' 
                      stroke='#8b5cf6' 
                      strokeWidth={3}
                      name='Posts'
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                    <Line 
                      type='monotone' 
                      dataKey='threads' 
                      stroke='#a855f7' 
                      strokeWidth={3}
                      name='Threads'
                      dot={{ fill: '#a855f7', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Distribution */}
          <section data-template-section='category-stats' data-chart-type='bar' data-metrics='threads,posts'>
            <Card className='border border-purple-900/50 bg-slate-900/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Category Stats</CardTitle>
                    <CardDescription className='text-purple-300'>Discussions by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-violet-600 text-violet-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Analytics
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={FORUM_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#4c1d95' />
                    <XAxis dataKey='name' stroke='#a78bfa' />
                    <YAxis stroke='#a78bfa' />
                    <TooltipProvider>
                      <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #6d28d9' }} />
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

        {/* Discussion Browser & Top Influencers */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Trending Discussions */}
          <section data-template-section='trending-discussions' data-component-type='discussion-list' className='lg:col-span-2'>
            <Card className='border border-purple-900/50 bg-slate-900/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Trending Discussions</CardTitle>
                    <CardDescription className='text-purple-300'>Hot topics right now</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search discussions...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-purple-800 bg-purple-950 text-white placeholder:text-purple-400'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-40 border-purple-800 bg-purple-950 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='tech'>Technology</SelectItem>
                        <SelectItem value='design'>Design</SelectItem>
                        <SelectItem value='gaming'>Gaming</SelectItem>
                        <SelectItem value='lifestyle'>Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <AnimatePresence>
                  {filteredDiscussions.map((disc) => (
                    <motion.div
                      key={disc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 bg-gradient-to-br from-purple-950/50 to-slate-950/50 border border-purple-800/50 rounded-xl hover:border-purple-500/50 transition-all cursor-pointer ${
                        selectedDiscussion === disc.id ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-950' : ''
                      }`}
                      onClick={() => setSelectedDiscussion(disc.id)}
                    >
                      <div className='flex items-start space-x-4'>
                        <div className='text-3xl flex-shrink-0'>{disc.author.avatar}</div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between mb-2'>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-1'>
                                {disc.isPinned && (
                                  <Pin className='w-4 h-4 text-purple-400' />
                                )}
                                <h4 className='font-bold text-white text-lg'>{disc.title}</h4>
                              </div>
                              <p className='text-sm text-purple-300'>
                                by <span className='text-purple-400 font-semibold'>{disc.author.displayName}</span>
                                {disc.author.badge && (
                                  <>
                                    {' • '}
                                    <Badge variant='outline' className='border-purple-600 text-purple-400 text-xs'>
                                      {disc.author.badge}
                                    </Badge>
                                  </>
                                )}
                              </p>
                            </div>
                            <Badge className={getCategoryColor(disc.category)}>
                              {disc.category}
                            </Badge>
                          </div>
                          
                          <div className='flex items-center flex-wrap gap-2 mb-3'>
                            {disc.tags.map((tag) => (
                              <Badge key={tag} variant='outline' className='border-purple-700 text-purple-300 text-xs'>
                                <Hash className='w-3 h-3 mr-1' />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4 text-sm text-purple-300'>
                              <span className='flex items-center'>
                                <MessageSquare className='w-4 h-4 mr-1' />
                                {disc.replies}
                              </span>
                              <span className='flex items-center'>
                                <Eye className='w-4 h-4 mr-1' />
                                {disc.views}
                              </span>
                              <span className='flex items-center'>
                                <Heart className='w-4 h-4 mr-1' />
                                {disc.likes}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-4 h-4 mr-1' />
                                {disc.lastActivity}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-purple-400 hover:text-white hover:bg-purple-900/50'>
                                <Bookmark className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8 text-purple-400 hover:text-white hover:bg-purple-900/50'>
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

          {/* Top Influencers */}
          <section data-template-section='top-influencers' data-component-type='user-list'>
            <Card className='border border-purple-900/50 bg-slate-900/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Top Influencers</CardTitle>
                <CardDescription className='text-purple-300'>Elite members</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {TOP_INFLUENCERS.map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-center space-x-4 p-3 bg-purple-950/50 rounded-xl hover:bg-purple-950/80 transition-colors'
                  >
                    <div className='text-2xl relative'>
                      {user.avatar}
                      {user.online && (
                        <span className='absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-white'>{user.username}</h4>
                        <Badge variant='outline' className='border-purple-600 text-purple-400 text-xs'>
                          {user.badge}
                        </Badge>
                      </div>
                      <div className='flex items-center space-x-3 text-xs text-purple-300 mt-1'>
                        <span className='flex items-center'>
                          <Send className='w-3 h-3 mr-1' />
                          {user.posts}
                        </span>
                        <span className='flex items-center'>
                          <Star className='w-3 h-3 mr-1' />
                          {user.reputation}
                        </span>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' className='border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white'>
                      <UserPlus className='w-4 h-4' />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full border-purple-800 text-purple-300 hover:bg-purple-950'>
                  View All Influencers
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
