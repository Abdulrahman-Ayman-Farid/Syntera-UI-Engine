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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch, GitCommit, GitPullRequest, GitMerge, Code2,
  TrendingUp, TrendingDown, Activity, Star, Eye,
  Search, Download, Users, FolderGit2,
  BarChart3, Settings, Clock, CheckCircle, Plus,
  FileCode, Zap, Target
} from 'lucide-react'

// Repository metrics
const REPO_METRICS = [
  {
    id: 'total_repos',
    label: 'Total Repositories',
    value: '156',
    change: '+12',
    status: 'increasing' as const,
    icon: FolderGit2,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'active_branches',
    label: 'Active Branches',
    value: '342',
    change: '+28',
    status: 'increasing' as const,
    icon: GitBranch,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'pull_requests',
    label: 'Open PRs',
    value: '48',
    change: '+5',
    status: 'good' as const,
    icon: GitPullRequest,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'code_quality',
    label: 'Code Quality',
    value: '92',
    unit: '%',
    change: '+3%',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const REPO_ACTIVITY = [
  { month: 'Jan', commits: 245, prs: 18 },
  { month: 'Feb', commits: 312, prs: 24 },
  { month: 'Mar', commits: 389, prs: 31 },
  { month: 'Apr', commits: 425, prs: 28 },
  { month: 'May', commits: 478, prs: 35 },
  { month: 'Jun', commits: 512, prs: 42 },
] as const

const LANGUAGE_STATS = [
  { language: 'TypeScript', loc: 45800, color: '#3178c6' },
  { language: 'JavaScript', loc: 32400, color: '#f7df1e' },
  { language: 'Python', loc: 28900, color: '#3776ab' },
  { language: 'Go', loc: 15600, color: '#00add8' },
] as const

const RECENT_REPOS = [
  {
    id: 'repo-001',
    name: 'Project Alpha',
    description: 'Core platform infrastructure',
    language: 'TypeScript',
    stars: 1245,
    forks: 324,
    branches: 8,
    lastCommit: '2 hours ago',
    status: 'active',
    contributors: 12
  },
  {
    id: 'repo-002',
    name: 'Beta Feature',
    description: 'Experimental feature branch',
    language: 'JavaScript',
    stars: 856,
    forks: 189,
    branches: 12,
    lastCommit: '5 hours ago',
    status: 'active',
    contributors: 8
  },
  {
    id: 'repo-003',
    name: 'Gamma Release',
    description: 'Stable release version',
    language: 'Python',
    stars: 2103,
    forks: 542,
    branches: 5,
    lastCommit: '1 day ago',
    status: 'stable',
    contributors: 24
  },
  {
    id: 'repo-004',
    name: 'Delta Services',
    description: 'Microservices architecture',
    language: 'Go',
    stars: 1567,
    forks: 412,
    branches: 15,
    lastCommit: '3 days ago',
    status: 'active',
    contributors: 16
  },
] as const

export default function NatureInspiredCodeRepository() {
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
      case 'stable': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredRepos = useMemo(() => {
    return RECENT_REPOS.filter(repo => {
      const matchesSearch = searchQuery === '' || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage = selectedLanguage === 'all' || 
        repo.language === selectedLanguage
      return matchesSearch && matchesLanguage
    })
  }, [searchQuery, selectedLanguage])

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-emerald-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg'>
                <FolderGit2 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Nature Code Hub</h1>
                <p className='text-emerald-600'>Organic code collaboration platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-emerald-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg'>
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
                  <Card className='h-full border border-emerald-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-emerald-700'>{metric.label}</p>
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

        {/* Repository Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Commit Activity */}
          <section data-template-section='commit-activity' data-chart-type='line' data-metrics='commits,prs'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Commit Activity</CardTitle>
                    <CardDescription>Monthly commits and PRs</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-300 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +24% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={REPO_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#d1fae5' />
                    <XAxis dataKey='month' stroke='#6b7280' />
                    <YAxis stroke='#6b7280' />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='commits' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Commits'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='prs' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Pull Requests'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Language Distribution */}
          <section data-template-section='language-stats' data-chart-type='bar' data-metrics='loc'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Language Distribution</CardTitle>
                    <CardDescription>Lines of code by language</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-300 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={LANGUAGE_STATS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#d1fae5' />
                    <XAxis dataKey='language' stroke='#6b7280' />
                    <YAxis stroke='#6b7280' />
                    <Legend />
                    <Bar dataKey='loc' name='Lines of Code' fill='#10b981' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Repository Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='repo-browser' data-component-type='repo-list' className='lg:col-span-2'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Repositories</CardTitle>
                    <CardDescription>Your most active projects</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search repositories...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-emerald-300'
                    />
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className='w-32 border-emerald-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Languages</SelectItem>
                        <SelectItem value='TypeScript'>TypeScript</SelectItem>
                        <SelectItem value='JavaScript'>JavaScript</SelectItem>
                        <SelectItem value='Python'>Python</SelectItem>
                        <SelectItem value='Go'>Go</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredRepos.map((repo) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:border-emerald-400 transition-colors cursor-pointer ${
                          selectedRepo === repo.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedRepo(repo.id)}
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-2'>
                              <h4 className='font-bold text-gray-900'>{repo.name}</h4>
                              <Badge className={getStatusColor(repo.status)}>
                                {repo.status}
                              </Badge>
                            </div>
                            <p className='text-sm text-gray-600 mb-3'>{repo.description}</p>
                            <div className='flex items-center space-x-4 text-sm text-gray-600'>
                              <span className='flex items-center'>
                                <Code2 className='w-3 h-3 mr-1' />
                                {repo.language}
                              </span>
                              <span className='flex items-center'>
                                <GitBranch className='w-3 h-3 mr-1' />
                                {repo.branches} branches
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {repo.lastCommit}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm text-gray-600'>
                            <span className='flex items-center'>
                              <Star className='w-3 h-3 mr-1 text-amber-500' />
                              {repo.stars}
                            </span>
                            <span className='flex items-center'>
                              <GitMerge className='w-3 h-3 mr-1' />
                              {repo.forks}
                            </span>
                            <span className='flex items-center'>
                              <Users className='w-3 h-3 mr-1' />
                              {repo.contributors}
                            </span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <GitCommit className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Download className='w-4 h-4' />
                            </Button>
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
            <Card className='border border-emerald-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Repository', color: 'from-emerald-500 to-teal-500' },
                    { icon: GitBranch, label: 'Create Branch', color: 'from-blue-500 to-cyan-500' },
                    { icon: GitPullRequest, label: 'New Pull Request', color: 'from-purple-500 to-pink-500' },
                    { icon: Download, label: 'Clone Repository', color: 'from-amber-500 to-orange-500' },
                    { icon: Users, label: 'Manage Team', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-emerald-300 hover:border-emerald-400 h-14'
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
                      <span className='text-gray-600'>Code Quality</span>
                      <span className='font-medium'>92%</span>
                    </div>
                    <Progress value={92} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium'>All Systems Green</div>
                        <div className='text-sm text-emerald-600'>156 repos healthy</div>
                      </div>
                    </div>
                    <Star className='w-5 h-5 text-amber-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Repository Statistics */}
        <section data-template-section='repo-statistics' data-component-type='stats-grid'>
          <Card className='border border-emerald-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Repository Statistics</CardTitle>
                  <CardDescription>Performance and activity insights</CardDescription>
                </div>
                <Button variant='outline' className='border-emerald-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Most Active', 
                    value: 'Project Alpha', 
                    detail: '512 commits this month',
                    icon: Activity,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Top Contributor', 
                    value: 'Sarah Chen', 
                    detail: '1,245 commits total',
                    icon: Target,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Fastest Build', 
                    value: '2.4s', 
                    detail: 'Beta Feature',
                    icon: Zap,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Open Issues', 
                    value: '24', 
                    detail: 'Across all repos',
                    icon: FileCode,
                    color: 'from-purple-500 to-pink-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>{stat.detail}</div>
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