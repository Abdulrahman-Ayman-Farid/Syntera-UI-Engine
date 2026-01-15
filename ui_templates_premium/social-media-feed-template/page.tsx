'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  PieChart, Pie, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Share2, Bookmark, Send, Search,
  Filter, Plus, MoreHorizontal, Bell, Users, User, TrendingUp,
  Eye, ThumbsUp, Hash, Clock, Image as ImageIcon, Video,
  Smile, MapPin, Calendar, Star, Award, Target
} from 'lucide-react'

// Type-safe social media metrics
const SOCIAL_METRICS = [
  {
    id: 'total_posts',
    label: 'Total Posts',
    value: '2,845',
    change: '+124',
    status: 'increasing' as const,
    icon: MessageCircle,
    color: 'from-rose-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'engagement',
    label: 'Engagement Rate',
    value: '8.4',
    unit: '%',
    change: '+1.2%',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'followers',
    label: 'Total Followers',
    value: '48.2',
    unit: 'K',
    change: '+2.4K',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'reach',
    label: 'Daily Reach',
    value: '156',
    unit: 'K',
    change: '+18%',
    status: 'good' as const,
    icon: Eye,
    color: 'from-amber-500 to-yellow-500',
    format: 'count'
  }
] as const

const SOCIAL_POSTS = [
  {
    id: 'post-001',
    author: 'Emma Richardson',
    authorAvatar: '👩‍💼',
    authorRole: 'Content Creator',
    content: 'Just launched our new autumn collection! 🍂 The warm tones and cozy fabrics are perfect for the season. Check out the full collection on our website!',
    timestamp: '2 hours ago',
    likes: 1245,
    comments: 89,
    shares: 42,
    views: 12400,
    type: 'image' as const,
    trending: true
  },
  {
    id: 'post-002',
    author: 'Marcus Chen',
    authorAvatar: '👨‍💻',
    authorRole: 'Tech Influencer',
    content: 'Amazing productivity hack I discovered today! Using the Pomodoro technique with these new apps has doubled my output. Who else is using this method?',
    timestamp: '4 hours ago',
    likes: 892,
    comments: 124,
    shares: 38,
    views: 9200,
    type: 'text' as const,
    trending: false
  },
  {
    id: 'post-003',
    author: 'Sophia Martinez',
    authorAvatar: '👩‍🎨',
    authorRole: 'Digital Artist',
    content: 'New artwork dropped! 🎨 This piece took me 40 hours to complete. Inspired by the vibrant colors of autumn sunsets. What do you think?',
    timestamp: '6 hours ago',
    likes: 2104,
    comments: 245,
    shares: 156,
    views: 18500,
    type: 'image' as const,
    trending: true
  },
  {
    id: 'post-004',
    author: 'David Kim',
    authorAvatar: '👨‍🍳',
    authorRole: 'Food Blogger',
    content: 'Recipe of the day: Pumpkin Spice Everything! 🎃 Follow along as I show you how to make the perfect autumn treats. Link in bio!',
    timestamp: '8 hours ago',
    likes: 1567,
    comments: 178,
    shares: 92,
    views: 14200,
    type: 'video' as const,
    trending: false
  },
  {
    id: 'post-005',
    author: 'Lisa Anderson',
    authorAvatar: '👩‍💼',
    authorRole: 'Business Coach',
    content: 'Top 5 tips for growing your online business in Q4. Swipe through for insights that have helped my clients 10x their revenue!',
    timestamp: '12 hours ago',
    likes: 945,
    comments: 67,
    shares: 28,
    views: 8900,
    type: 'carousel' as const,
    trending: false
  },
] as const

const ENGAGEMENT_DATA = [
  { day: 'Mon', likes: 1245, comments: 342, shares: 128 },
  { day: 'Tue', likes: 1580, comments: 428, shares: 156 },
  { day: 'Wed', likes: 1890, comments: 512, shares: 198 },
  { day: 'Thu', likes: 2245, comments: 645, shares: 234 },
  { day: 'Fri', likes: 2680, comments: 782, shares: 289 },
  { day: 'Sat', likes: 1820, comments: 456, shares: 178 },
  { day: 'Sun', likes: 1450, comments: 368, shares: 142 },
] as const

const CONTENT_TYPES_DATA = [
  { name: 'Images', value: 1245, color: '#ef4444' },
  { name: 'Videos', value: 842, color: '#f59e0b' },
  { name: 'Text', value: 456, color: '#8b5cf6' },
  { name: 'Carousels', value: 302, color: '#3b82f6' },
] as const

const TRENDING_TOPICS = [
  { tag: '#AutumnVibes', posts: '2.4K', growth: '+45%' },
  { tag: '#TechTips', posts: '1.8K', growth: '+32%' },
  { tag: '#FoodieLife', posts: '3.2K', growth: '+28%' },
  { tag: '#ArtisticSoul', posts: '1.5K', growth: '+52%' },
  { tag: '#BusinessGrowth', posts: '2.1K', growth: '+38%' },
] as const

export default function SocialMediaFeedTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [activeTab, setActiveTab] = useState('feed')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredPosts = useMemo(() => {
    let filtered = [...SOCIAL_POSTS]
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(post => post.type === filterType)
    }
    
    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.likes - a.likes)
    } else if (sortBy === 'engagement') {
      filtered.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
    }
    
    return filtered
  }, [searchQuery, filterType, sortBy])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/50 to-yellow-50/30'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-orange-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>SocialHub</h1>
                <p className='text-gray-600'>Your autumn social feed</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='icon'>
                <Bell className='w-5 h-5' />
              </Button>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-orange-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Social Metrics */}
        <section data-template-section='social-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {SOCIAL_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-orange-200 shadow-sm hover:shadow-md transition-all'>
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
                            <TrendingUp className='w-4 h-4 mr-1' />
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

        {/* Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='line' data-metrics='likes,comments,shares'>
            <Card className='border border-orange-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Engagement Trends</CardTitle>
                    <CardDescription>Weekly interaction metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-rose-200 text-rose-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +42% Week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='likes' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Likes'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='comments' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Comments'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='shares' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Shares'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Content Types */}
          <section data-template-section='content-types' data-chart-type='pie' data-metrics='types'>
            <Card className='border border-orange-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Content Types</CardTitle>
                    <CardDescription>Distribution by format</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-200 text-amber-700'>
                    2,845 Posts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={CONTENT_TYPES_DATA}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {CONTENT_TYPES_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Main Feed Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Feed Controls & Posts */}
          <section data-template-section='social-feed' data-component-type='post-feed' className='lg:col-span-3'>
            <Card className='border border-orange-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>Your Feed</CardTitle>
                  <div className='flex items-center space-x-2'>
                    <Input
                      placeholder='Search posts...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-orange-300'
                    />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className='w-32 border-orange-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='image'>Images</SelectItem>
                        <SelectItem value='video'>Videos</SelectItem>
                        <SelectItem value='text'>Text</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-32 border-orange-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='recent'>Recent</SelectItem>
                        <SelectItem value='popular'>Popular</SelectItem>
                        <SelectItem value='engagement'>Top Engaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[800px]'>
                  <div className='space-y-6'>
                    <AnimatePresence>
                      {filteredPosts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <Card className='border border-orange-200 bg-white hover:shadow-md transition-shadow'>
                            <CardHeader>
                              <div className='flex items-start justify-between'>
                                <div className='flex items-center space-x-3'>
                                  <div className='text-3xl'>{post.authorAvatar}</div>
                                  <div>
                                    <div className='flex items-center space-x-2'>
                                      <h4 className='font-semibold'>{post.author}</h4>
                                      {post.trending && (
                                        <Badge className='bg-gradient-to-r from-rose-500 to-orange-500 text-white'>
                                          <TrendingUp className='w-3 h-3 mr-1' />
                                          Trending
                                        </Badge>
                                      )}
                                    </div>
                                    <p className='text-sm text-gray-600'>{post.authorRole}</p>
                                    <p className='text-xs text-gray-500 flex items-center mt-1'>
                                      <Clock className='w-3 h-3 mr-1' />
                                      {post.timestamp}
                                    </p>
                                  </div>
                                </div>
                                <Button variant='ghost' size='icon'>
                                  <MoreHorizontal className='w-4 h-4' />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className='text-gray-900 mb-4'>{post.content}</p>
                              {post.type === 'image' && (
                                <div className='w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center'>
                                  <ImageIcon className='w-16 h-16 text-orange-400' />
                                </div>
                              )}
                              {post.type === 'video' && (
                                <div className='w-full h-64 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex items-center justify-center'>
                                  <Video className='w-16 h-16 text-red-400' />
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className='border-t border-orange-100'>
                              <div className='w-full space-y-3'>
                                <div className='flex items-center justify-between text-sm text-gray-600'>
                                  <span className='flex items-center'>
                                    <Eye className='w-4 h-4 mr-1' />
                                    {formatNumber(post.views)} views
                                  </span>
                                  <span>
                                    {formatNumber(post.likes + post.comments + post.shares)} interactions
                                  </span>
                                </div>
                                <Separator />
                                <div className='flex items-center justify-around'>
                                  <Button variant='ghost' className='flex-1 hover:text-rose-500'>
                                    <Heart className='w-4 h-4 mr-2' />
                                    {formatNumber(post.likes)}
                                  </Button>
                                  <Button variant='ghost' className='flex-1 hover:text-blue-500'>
                                    <MessageCircle className='w-4 h-4 mr-2' />
                                    {formatNumber(post.comments)}
                                  </Button>
                                  <Button variant='ghost' className='flex-1 hover:text-purple-500'>
                                    <Share2 className='w-4 h-4 mr-2' />
                                    {formatNumber(post.shares)}
                                  </Button>
                                  <Button variant='ghost' className='flex-1 hover:text-amber-500'>
                                    <Bookmark className='w-4 h-4' />
                                  </Button>
                                </div>
                              </div>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          {/* Trending Sidebar */}
          <section data-template-section='trending-topics' data-component-type='trending-sidebar'>
            <div className='space-y-6'>
              {/* Trending Topics */}
              <Card className='border border-orange-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold flex items-center'>
                    <TrendingUp className='w-5 h-5 mr-2 text-rose-500' />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {TRENDING_TOPICS.map((topic, index) => (
                      <motion.div
                        key={topic.tag}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className='p-3 rounded-lg border border-orange-200 hover:border-rose-300 cursor-pointer transition-colors'
                      >
                        <div className='flex items-center justify-between mb-1'>
                          <span className='font-semibold text-rose-600'>{topic.tag}</span>
                          <Badge className='bg-gradient-to-r from-rose-500 to-orange-500 text-white'>
                            {topic.growth}
                          </Badge>
                        </div>
                        <p className='text-sm text-gray-600'>{topic.posts} posts</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Users */}
              <Card className='border border-orange-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold flex items-center'>
                    <Users className='w-5 h-5 mr-2 text-blue-500' />
                    Suggested For You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {['Content Creator', 'Digital Artist', 'Tech Expert'].map((role, index) => (
                      <div key={index} className='flex items-center justify-between p-2'>
                        <div className='flex items-center space-x-3'>
                          <div className='text-2xl'>👤</div>
                          <div>
                            <p className='font-semibold text-sm'>User {index + 1}</p>
                            <p className='text-xs text-gray-600'>{role}</p>
                          </div>
                        </div>
                        <Button size='sm' className='bg-gradient-to-r from-rose-500 to-orange-500'>
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
      setFilteredPosts(posts);
      return;
    }
    setFilteredPosts(
      posts.filter(post =>
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, posts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='bg-background text-text min-h-screen flex flex-col'>
      <header className='bg-primary text-accent px-6 py-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Social Media Feed</h1>
          <button onClick={handleToggleSidebar} className='md:hidden'>
            <Users size={24} />
          </button>
        </div>
      </header>
      <main className='flex-1 flex overflow-hidden'>
        <aside
          className={`w-64 hidden md:block bg-secondary text-text fixed h-screen shadow-lg transition-transform duration-300 ${
isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
}}`
        >
          <div className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Filters</h2>
            <form>
              <div className='mb-4'>
                <label htmlFor='search' className='block text-sm font-medium mb-1'>
                  Search
                </label>
                <Input
                  id='search'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='w-full'
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='sort' className='block text-sm font-medium mb-1'>
                  Sort By
                </label>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Date' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='date'>Date</SelectItem>
                    <SelectItem value='likes'>Likes</SelectItem>
                    <SelectItem value='comments'>Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant='default' className='w-full'>Apply Filters</Button>
            </form>
          </div>
        </aside>
        <div className='flex-1 p-6 overflow-y-auto relative'>
          <div className='absolute inset-0 bg-gradient-to-bl from-primary via-secondary to-accent opacity-10 z-[-1]' />{
            isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className='text-center mt-10'>
                <h2 className='text-xl font-semibold'>No posts found.</h2>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className='bg-accent text-text shadow-lg mb-6 rounded-xl'>
                  <CardHeader className='border-b border-t border-l border-burgundy'>
                    <div className='flex space-x-4'>
                      <Avatar>
                        <AvatarImage src='https://via.placeholder.com/40' alt={`${post.author}'s avatar`} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{post.author}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='py-4'>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className='flex justify-between items-center'>
                    <div className='flex space-x-4'>
                      <button aria-label='Like post'>
                        <Heart size={20} />
                      </button>
                      <span>{post.likes}</span>
                    </div>
                    <div className='flex space-x-4'>
                      <button aria-label='Comment on post'>
                        <MessageCircle size={20} />
                      </button>
                      <span>{post.comments}</span>
                    </div>
                    <div className='flex space-x-4'>
                      <button aria-label='Share post'>
                        <Share2 size={20} />
                      </button>
                      <span>{post.shares}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
        </div>
      </main>
      <footer className='bg-primary text-accent px-6 py-4'>
        <div className='flex justify-center'>
          <p>&copy; 2023 Social Media Feed</p>
        </div>
      </footer>
    </div>
  );
};

export default SocialMediaFeedPage;