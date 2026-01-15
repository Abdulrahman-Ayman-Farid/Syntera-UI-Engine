'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch, GitFork, Star, Eye, Code2, GitCommit,
  TrendingUp, TrendingDown, Activity, Clock, Users,
  Search, Download, Plus, CheckCircle,
  BarChart3, Settings, Folder, Zap, Target
} from 'lucide-react'

// Code repository metrics
const REPO_METRICS = [
  {
    id: 'total_repos',
    label: 'Repositories',
    value: '248',
    change: '+18',
    status: 'increasing' as const,
    icon: Folder,
    color: 'from-red-600 to-rose-700',
    format: 'count'
  },
  {
    id: 'total_stars',
    label: 'Total Stars',
    value: '12.4K',
    change: '+842',
    status: 'increasing' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-600',
    format: 'count'
  },
  {
    id: 'total_forks',
    label: 'Total Forks',
    value: '3.2K',
    change: '+245',
    status: 'increasing' as const,
    icon: GitFork,
    color: 'from-purple-500 to-pink-600',
    format: 'count'
  },
  {
    id: 'contributors',
    label: 'Contributors',
    value: '84',
    change: '+12',
    status: 'good' as const,
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    format: 'count'
  }
] as const

const REPO_ACTIVITY = [
  { month: 'Jan', stars: 825, forks: 245 },
  { month: 'Feb', stars: 942, forks: 298 },
  { month: 'Mar', stars: 1105, forks: 342 },
  { month: 'Apr', stars: 1267, forks: 398 },
  { month: 'May', stars: 1389, forks: 445 },
  { month: 'Jun', stars: 1524, forks: 512 },
] as const

const LANGUAGE_DISTRIBUTION = [
  { language: 'TypeScript', repos: 89, color: '#3178c6' },
  { language: 'JavaScript', repos: 67, color: '#f7df1e' },
  { language: 'Python', repos: 54, color: '#3776ab' },
  { language: 'Go', repos: 38, color: '#00add8' },
] as const

const FEATURED_REPOS = [
  {
    id: 'repo-001',
    name: 'React',
    owner: 'facebook',
    description: 'A declarative, efficient, and flexible JavaScript library',
    language: 'JavaScript',
    stars: 190000,
    forks: 45000,
    watchers: 6800,
    lastUpdate: '2 hours ago',
    status: 'active',
    issues: 824
  },
  {
    id: 'repo-002',
    name: 'Next.js',
    owner: 'vercel',
    description: 'The React Framework for Production',
    language: 'TypeScript',
    stars: 100000,
    forks: 20000,
    watchers: 3200,
    lastUpdate: '5 hours ago',
    status: 'active',
    issues: 456
  },
  {
    id: 'repo-003',
    name: 'Tailwind CSS',
    owner: 'tailwindlabs',
    description: 'A utility-first CSS framework',
    language: 'CSS',
    stars: 80000,
    forks: 15000,
    watchers: 2800,
    lastUpdate: '1 day ago',
    status: 'active',
    issues: 234
  },
  {
    id: 'repo-004',
    name: 'FastAPI',
    owner: 'tiangolo',
    description: 'High performance Python web framework',
    language: 'Python',
    stars: 65000,
    forks: 12000,
    watchers: 2100,
    lastUpdate: '3 days ago',
    status: 'active',
    issues: 312
  },
] as const

export default function PremiumCodeRepositoryInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'deprecated': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredRepos = useMemo(() => {
    return FEATURED_REPOS.filter(repo => {
      const matchesSearch = searchQuery === '' || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage = selectedLanguage === 'all' || 
        repo.language === selectedLanguage
      return matchesSearch && matchesLanguage
    })
  }, [searchQuery, selectedLanguage])

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-rose-900/20'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-red-900/20 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-red-600 to-rose-700 rounded-xl shadow-lg shadow-red-900/50'>
                <Code2 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Premium Code Hub</h1>
                <p className='text-red-400'>Elite repository management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-red-900/30 bg-gray-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-lg shadow-red-900/50'>
                <Plus className='w-4 h-4 mr-2' />
                New Repository
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Repository Metrics */}
        <section data-template-section='repo-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {REPO_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-red-900/20 bg-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-red-900/20 hover:shadow-lg transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-red-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
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

        {/* Repository Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Repository Activity */}
          <section data-template-section='repo-activity' data-chart-type='line' data-metrics='stars,forks'>
            <Card className='border border-red-900/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Repository Activity</CardTitle>
                    <CardDescription className='text-gray-400'>Monthly stars and forks growth</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={REPO_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='stars' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Stars'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='forks' 
                      stroke='#a855f7' 
                      strokeWidth={2}
                      name='Forks'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Language Distribution */}
          <section data-template-section='language-distribution' data-chart-type='bar' data-metrics='repos'>
            <Card className='border border-red-900/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Language Distribution</CardTitle>
                    <CardDescription className='text-gray-400'>Repositories by language</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-500/30 text-blue-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={LANGUAGE_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='language' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Legend />
                    <Bar dataKey='repos' name='Repositories' fill='#ef4444' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Repository Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='repo-browser' data-component-type='repo-grid' className='lg:col-span-2'>
            <Card className='border border-red-900/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Featured Repositories</CardTitle>
                    <CardDescription className='text-gray-400'>Popular and trending projects</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search repositories...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-red-900/30 bg-gray-700 text-white placeholder:text-gray-400'
                    />
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className='w-32 border-red-900/30 bg-gray-700 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Languages</SelectItem>
                        <SelectItem value='JavaScript'>JavaScript</SelectItem>
                        <SelectItem value='TypeScript'>TypeScript</SelectItem>
                        <SelectItem value='Python'>Python</SelectItem>
                        <SelectItem value='CSS'>CSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredRepos.map((repo) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-red-900/20 rounded-xl hover:border-red-600/40 transition-colors cursor-pointer ${
                          selectedRepo === repo.id ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                        onClick={() => setSelectedRepo(repo.id)}
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-1'>
                              <Avatar className='w-6 h-6 bg-gradient-to-br from-red-600 to-rose-700'>
                                <AvatarFallback className='text-white text-xs'>
                                  {repo.owner[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm text-gray-400'>{repo.owner}</span>
                            </div>
                            <h4 className='font-bold text-white mb-2'>{repo.name}</h4>
                            <p className='text-sm text-gray-400 mb-3 line-clamp-2'>{repo.description}</p>
                            <div className='flex items-center space-x-3 text-sm text-gray-400'>
                              <Badge className={getStatusColor(repo.status)}>
                                {repo.language}
                              </Badge>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {repo.lastUpdate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Separator className='my-3 bg-red-900/20' />
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center space-x-4 text-gray-400'>
                            <span className='flex items-center'>
                              <Star className='w-3 h-3 mr-1 text-amber-500' />
                              {formatNumber(repo.stars)}
                            </span>
                            <span className='flex items-center'>
                              <GitFork className='w-3 h-3 mr-1' />
                              {formatNumber(repo.forks)}
                            </span>
                            <span className='flex items-center'>
                              <Eye className='w-3 h-3 mr-1' />
                              {formatNumber(repo.watchers)}
                            </span>
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
            <Card className='border border-red-900/20 bg-gray-800/50 backdrop-blur-sm shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Repository', color: 'from-emerald-500 to-teal-500' },
                    { icon: GitFork, label: 'Fork Repository', color: 'from-blue-500 to-cyan-500' },
                    { icon: Star, label: 'Star Repository', color: 'from-amber-500 to-orange-500' },
                    { icon: Download, label: 'Clone Repository', color: 'from-purple-500 to-pink-500' },
                    { icon: Users, label: 'Manage Team', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-red-900/30 bg-gray-700/50 hover:bg-gray-700 hover:border-red-600/50 text-white h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-red-900/20' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-400'>Repository Health</span>
                      <span className='font-medium text-white'>98%</span>
                    </div>
                    <Progress value={98} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-400' />
                      <div>
                        <div className='font-medium text-white'>All Systems Active</div>
                        <div className='text-sm text-emerald-400'>248 repositories</div>
                      </div>
                    </div>
                    <Code2 className='w-5 h-5 text-emerald-400' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Repository Statistics */}
        <section data-template-section='repo-statistics' data-component-type='stats-grid'>
          <Card className='border border-red-900/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Repository Statistics</CardTitle>
                  <CardDescription className='text-gray-400'>Performance and engagement metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-red-900/30 text-white'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Repo', 
                    value: 'React', 
                    detail: '190K stars',
                    icon: Target,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Most Forked', 
                    value: 'React', 
                    detail: '45K forks',
                    icon: GitFork,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Most Active', 
                    value: 'Next.js', 
                    detail: 'Updated 2h ago',
                    icon: Activity,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'New Today', 
                    value: '5', 
                    detail: 'Repositories created',
                    icon: Zap,
                    color: 'from-blue-500 to-cyan-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-red-900/20 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-400'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2 text-white'>{stat.value}</div>
                    <div className='text-sm text-gray-400'>{stat.detail}</div>
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