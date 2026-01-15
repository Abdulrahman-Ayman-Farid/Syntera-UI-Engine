'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
import {
  Palette, Camera, Code, Music, Film, Heart,
  Eye, Share2, Download, MessageCircle, MoreVertical,
  TrendingUp, TrendingDown, Users, Award, Sparkles, Filter,
  Instagram, Twitter, Github, Linkedin, Globe,
  ChevronRight, ExternalLink, Calendar, Plus, Settings,
  BarChart3, Star, Folder, Tag, Zap
} from 'lucide-react'

// Portfolio metrics derived from data_types
const PORTFOLIO_METRICS = [
  {
    id: 'total_projects',
    label: 'Total Projects',
    value: '127',
    change: '+12',
    status: 'increasing' as const,
    icon: Palette,
    color: 'from-purple-500 to-pink-600',
    format: 'count'
  },
  {
    id: 'total_views',
    label: 'Total Views',
    value: '245K',
    change: '+18%',
    status: 'increasing' as const,
    icon: Eye,
    color: 'from-blue-500 to-cyan-600',
    format: 'count'
  },
  {
    id: 'engagement',
    label: 'Engagement Rate',
    value: '8.4',
    unit: '%',
    change: '+2.1%',
    status: 'good' as const,
    icon: Heart,
    color: 'from-rose-500 to-red-600',
    format: 'percent'
  },
  {
    id: 'avg_rating',
    label: 'Avg. Rating',
    value: '4.9',
    unit: '/5',
    change: '+0.2',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-600',
    format: 'rating'
  }
] as const

const PROJECT_CATEGORIES = [
  { category: 'Photography', count: 42, engagement: 85, color: '#8b5cf6', icon: Camera },
  { category: 'Design', count: 38, engagement: 92, color: '#ec4899', icon: Palette },
  { category: 'Development', count: 28, engagement: 78, color: '#3b82f6', icon: Code },
  { category: 'Film', count: 19, engagement: 88, color: '#f59e0b', icon: Film },
] as const

const FEATURED_PROJECTS = [
  {
    id: 'project-001',
    title: 'Urban Architecture Series',
    category: 'photography',
    views: 24500,
    likes: 3200,
    comments: 245,
    featured: true,
    tags: ['Architecture', 'Urban', 'Modern'],
    createdAt: '2024-01-15',
    thumbnail: '📸'
  },
  {
    id: 'project-002',
    title: 'Abstract Motion Graphics',
    category: 'design',
    views: 18900,
    likes: 2100,
    comments: 189,
    featured: true,
    tags: ['Abstract', 'Motion', 'Digital'],
    createdAt: '2024-01-10',
    thumbnail: '🎨'
  },
  {
    id: 'project-003',
    title: 'E-Commerce Platform',
    category: 'development',
    views: 31200,
    likes: 4500,
    comments: 312,
    featured: false,
    tags: ['Web', 'React', 'UI/UX'],
    createdAt: '2024-01-08',
    thumbnail: '💻'
  },
  {
    id: 'project-004',
    title: 'Brand Identity System',
    category: 'design',
    views: 15600,
    likes: 1800,
    comments: 156,
    featured: false,
    tags: ['Branding', 'Logo', 'Identity'],
    createdAt: '2024-01-05',
    thumbnail: '✨'
  },
  {
    id: 'project-005',
    title: 'Cinematic Short Film',
    category: 'film',
    views: 42500,
    likes: 5200,
    comments: 425,
    featured: true,
    tags: ['Cinematic', 'Short Film', 'Storytelling'],
    createdAt: '2024-01-03',
    thumbnail: '🎬'
  },
  {
    id: 'project-006',
    title: 'Sound Design Portfolio',
    category: 'music',
    views: 17800,
    likes: 2400,
    comments: 178,
    featured: false,
    tags: ['Sound', 'Music', 'Audio'],
    createdAt: '2024-01-01',
    thumbnail: '🎵'
  },
] as const

const ENGAGEMENT_DATA = [
  { month: 'Jan', views: 42000, likes: 5200, shares: 890 },
  { month: 'Feb', views: 58000, likes: 7100, shares: 1240 },
  { month: 'Mar', views: 72000, likes: 8900, shares: 1580 },
  { month: 'Apr', views: 89000, likes: 11200, shares: 2050 },
  { month: 'May', views: 95000, likes: 12400, shares: 2280 },
  { month: 'Jun', views: 102000, likes: 13800, shares: 2650 },
] as const

export default function CreativePortfolioPlatform() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [likedProjects, setLikedProjects] = useState(new Set<string>())

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const toggleLike = (projectId: string) => {
    const newLiked = new Set(likedProjects)
    if (newLiked.has(projectId)) {
      newLiked.delete(projectId)
    } else {
      newLiked.add(projectId)
    }
    setLikedProjects(newLiked)
  }

  const filteredProjects = useMemo(() => {
    return FEATURED_PROJECTS.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || 
        project.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-purple-900/50 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <Palette className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>CreativeHub Pro</h1>
                <p className='text-purple-300'>Portfolio showcase & project management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-purple-800 bg-slate-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 border-purple-700'>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Portfolio Metrics */}
        <section data-template-section='portfolio-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PORTFOLIO_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-purple-900/50 bg-slate-800/50 backdrop-blur shadow-sm hover:shadow-purple-500/20 transition-all'>
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
          {/* Project Distribution */}
          <section data-template-section='project-distribution' data-chart-type='bar' data-metrics='count,engagement'>
            <Card className='border border-purple-900/50 bg-slate-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Project Categories</CardTitle>
                    <CardDescription className='text-purple-300'>Projects by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-600 text-purple-400 bg-purple-950/50'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={PROJECT_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='category' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Project Count' radius={[4, 4, 0, 0]}>
                      {PROJECT_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='line' data-metrics='views,likes,shares'>
            <Card className='border border-purple-900/50 bg-slate-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Engagement Trends</CardTitle>
                    <CardDescription className='text-purple-300'>Monthly portfolio activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-400 bg-emerald-950/50'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +24% Growth
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
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                    />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='views' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Views'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='likes' 
                      stroke='#ec4899' 
                      strokeWidth={2}
                      name='Likes'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='shares' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Shares'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Project Browser & Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Project Browser */}
          <section data-template-section='project-browser' data-component-type='project-grid' className='lg:col-span-2'>
            <Card className='border border-purple-900/50 bg-slate-800/50 backdrop-blur shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Featured Projects</CardTitle>
                    <CardDescription className='text-purple-300'>Showcase portfolio</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search projects...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-purple-800 bg-slate-900 text-white'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-purple-800 bg-slate-900 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-slate-800 border-purple-700'>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='photography'>Photography</SelectItem>
                        <SelectItem value='design'>Design</SelectItem>
                        <SelectItem value='development'>Development</SelectItem>
                        <SelectItem value='film'>Film</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-900/50 rounded-xl hover:border-purple-600 transition-colors cursor-pointer ${
                          selectedProject === project.id ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{project.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold text-white'>{project.title}</h4>
                              {project.featured && (
                                <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0'>
                                  <Sparkles className='w-3 h-3 mr-1' />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className='flex flex-wrap gap-1 mb-3'>
                              {project.tags.map((tag, i) => (
                                <Badge key={i} variant='outline' className='text-xs border-purple-700 text-purple-300'>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-purple-400 mb-3'>
                              <span className='flex items-center'>
                                <Eye className='w-3 h-3 mr-1' />
                                {(project.views / 1000).toFixed(1)}K
                              </span>
                              <span className='flex items-center'>
                                <Heart className='w-3 h-3 mr-1' />
                                {(project.likes / 1000).toFixed(1)}K
                              </span>
                              <span className='flex items-center'>
                                <MessageCircle className='w-3 h-3 mr-1' />
                                {project.comments}
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Button 
                                  variant='ghost' 
                                  size='icon' 
                                  className='h-8 w-8'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleLike(project.id)
                                  }}
                                >
                                  <Heart className={`w-4 h-4 ${likedProjects.has(project.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Share2 className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <ExternalLink className='w-4 h-4' />
                                </Button>
                              </div>
                              <div className='text-xs text-purple-500'>
                                <Calendar className='w-3 h-3 inline mr-1' />
                                {new Date(project.createdAt).toLocaleDateString()}
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
            <Card className='border border-purple-900/50 bg-slate-800/50 backdrop-blur shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Project', color: 'from-purple-500 to-pink-600' },
                    { icon: Folder, label: 'Browse Gallery', color: 'from-blue-500 to-cyan-600' },
                    { icon: Users, label: 'Collaborators', color: 'from-emerald-500 to-teal-600' },
                    { icon: BarChart3, label: 'Analytics', color: 'from-amber-500 to-orange-600' },
                    { icon: Award, label: 'Achievements', color: 'from-rose-500 to-red-600' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-purple-800 bg-slate-900/50 hover:bg-slate-800 hover:border-purple-600 h-14 text-white'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-purple-900/50' />
                
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Sparkles className='w-5 h-5 text-amber-400' />
                      <div>
                        <div className='font-medium text-white'>Portfolio Score</div>
                        <div className='text-sm text-purple-300'>Excellent engagement</div>
                      </div>
                    </div>
                    <div className='text-2xl font-bold text-white'>8.4</div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-purple-300'>Social Reach</span>
                      <span className='font-medium text-white'>245K</span>
                    </div>
                    <div className='flex gap-2'>
                      {[Instagram, Twitter, Github, Linkedin].map((Icon, i) => (
                        <Button key={i} variant='outline' size='icon' className='h-8 w-8 border-purple-800'>
                          <Icon className='w-4 h-4' />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Portfolio Insights */}
        <section data-template-section='portfolio-insights' data-component-type='insights-grid'>
          <Card className='border border-purple-900/50 bg-slate-800/50 backdrop-blur shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Portfolio Insights</CardTitle>
                  <CardDescription className='text-purple-300'>Performance and engagement metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-purple-800 bg-slate-900 text-white'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Project', 
                    value: 'Cinematic Short', 
                    metric: '42.5K views',
                    icon: TrendingUp,
                    color: 'from-emerald-500 to-teal-600'
                  },
                  { 
                    label: 'Most Liked', 
                    value: 'E-Commerce Platform', 
                    likes: '4.5K likes',
                    icon: Heart,
                    color: 'from-rose-500 to-pink-600'
                  },
                  { 
                    label: 'Featured Work', 
                    value: 'Urban Architecture', 
                    status: 'Trending',
                    icon: Sparkles,
                    color: 'from-purple-500 to-pink-600'
                  },
                  { 
                    label: 'Collaborations', 
                    value: 'Active Projects', 
                    count: '8',
                    icon: Users,
                    color: 'from-blue-500 to-cyan-600'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-900/50 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-purple-300'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2 text-white'>{stat.value}</div>
                    <div className='text-sm text-purple-400'>
                      {stat.metric || stat.likes || stat.status || stat.count}
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
                  <Sparkles className='w-3 h-3 mr-1' />
                  Creative Portfolio
                </Badge>
                <h1 className='text-5xl lg:text-7xl font-bold tracking-tight mb-6'>
                  <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'>
                    Alex Morgan
                  </span>
                  <br />
                  <span className='text-white'>Digital Creator</span>
                </h1>
                <p className='text-xl text-gray-300 mb-8 max-w-2xl'>
                  Crafting immersive digital experiences through design, photography, 
                  and development. Turning ideas into visually stunning realities.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                    View Projects
                    <ChevronRight className='w-4 h-4 ml-2' />
                  </Button>
                  <Button variant='outline' className='border-white/30 bg-white/5 hover:bg-white/10'>
                    <MessageCircle className='w-4 h-4 mr-2' />
                    Contact Me
                  </Button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className='relative'
              >
                <div className='w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-1'>
                  <div className='w-full h-full rounded-full bg-gray-900 p-4'>
                    <div className='w-full h-full rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center'>
                      <Palette className='w-24 h-24 text-white/50' />
                    </div>
                  </div>
                </div>
                <div className='absolute -top-4 -right-4'>
                  <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                    <Award className='w-3 h-3 mr-1' />
                    Featured
                  </Badge>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className='px-6 py-8'>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='max-w-6xl mx-auto mb-12'
        >
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
              <Card key={index} className='bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all hover:scale-105'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-400'>{stat.label}</p>
                      <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                      <div className='flex items-center text-emerald-400 text-sm mt-1'>
                        <TrendingUp className='w-3 h-3 mr-1' />
                        {stat.change}
                      </div>
                    </div>
                    <div className='p-3 rounded-full bg-gradient-to-br from-white/10 to-transparent'>
                      <stat.icon className='w-6 h-6' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='max-w-6xl mx-auto mb-12'
        >
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-3xl font-bold'>Featured Work</h2>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-48 bg-white/5 border-white/10'>
                <SelectValue placeholder='Filter by category' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900 border-white/10'>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className='hover:bg-white/10'>
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex items-center'>
                        <cat.icon className='w-4 h-4 mr-2' />
                        {cat.label}
                      </div>
                      <Badge variant='outline' className='border-white/20'>
                        {cat.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <AnimatePresence>
            <Masonry
              breakpointCols={breakpointColumns}
              className='flex -ml-6 w-auto'
              columnClassName='pl-6 bg-clip-padding'
            >
              {projects
                .filter(p => selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory)
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='mb-6'
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className='group cursor-pointer bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] overflow-hidden'>
                          <div className={`h-48 bg-gradient-to-r ${project.color} relative overflow-hidden`}>
                            {project.featured && (
                              <Badge className='absolute top-4 left-4 bg-white/20 backdrop-blur-sm'>
                                Featured
                              </Badge>
                            )}
                            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                              <div className='p-4 bg-black/60 backdrop-blur-sm rounded-full'>
                                <Eye className='w-6 h-6' />
                              </div>
                            </div>
                          </div>
                          <CardContent className='p-6'>
                            <div className='flex items-start justify-between mb-4'>
                              <div>
                                <h3 className='text-xl font-bold mb-2'>{project.title}</h3>
                                <p className='text-gray-400'>{project.category}</p>
                              </div>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleLike(project.id)
                                }}
                                className='hover:bg-white/10'
                              >
                                <Heart className={`w-5 h-5 ${likedProjects.has(project.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                            </div>
                            <div className='flex flex-wrap gap-2 mb-4'>
                              {project.tags.map((tag, i) => (
                                <Badge key={i} variant='outline' className='border-white/20'>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className='flex items-center justify-between text-sm text-gray-400'>
                              <div className='flex items-center space-x-4'>
                                <span className='flex items-center'>
                                  <Eye className='w-3 h-3 mr-1' />
                                  {project.views.toLocaleString()}
                                </span>
                                <span className='flex items-center'>
                                  <Heart className='w-3 h-3 mr-1' />
                                  {project.likes}
                                </span>
                              </div>
                              <Button variant='ghost' size='sm' className='text-white/60 hover:text-white'>
                                <ExternalLink className='w-3 h-3' />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className='max-w-4xl bg-gray-900 border-white/10'>
                        {selectedProject && (
                          <div className='p-6'>
                            <div className={`h-64 bg-gradient-to-r ${project.color} rounded-lg mb-6`} />
                            <h3 className='text-2xl font-bold mb-2'>{project.title}</h3>
                            <p className='text-gray-400 mb-4'>{project.category}</p>
                            <div className='flex items-center space-x-4 mb-6'>
                              <Badge variant='outline' className='border-white/20'>
                                {project.views.toLocaleString()} views
                              </Badge>
                              <Badge variant='outline' className='border-white/20'>
                                {project.likes} likes
                              </Badge>
                            </div>
                            <p className='text-gray-300'>
                              A detailed description of this creative project goes here. 
                              This could include the inspiration, tools used, challenges faced, 
                              and the final outcome.
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
            </Masonry>
          </AnimatePresence>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='max-w-6xl mx-auto'
        >
          <Card className='bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-white/10'>
            <CardContent className='p-8'>
              <div className='text-center'>
                <h3 className='text-2xl font-bold mb-4'>Let's Connect</h3>
                <p className='text-gray-300 mb-6'>Follow my creative journey across platforms</p>
                <div className='flex justify-center space-x-6'>
                  {[
                    { icon: Instagram, label: 'Instagram', color: 'from-purple-600 to-pink-600' },
                    { icon: Twitter, label: 'Twitter', color: 'from-blue-500 to-cyan-500' },
                    { icon: Github, label: 'GitHub', color: 'from-gray-700 to-black' },
                    { icon: Linkedin, label: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
                    { icon: Globe, label: 'Website', color: 'from-emerald-500 to-teal-500' },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href='#'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-full bg-gradient-to-br ${social.color} shadow-lg`}
                    >
                      <social.icon className='w-6 h-6' />
                    </motion.a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}