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
  GitBranch, GitCommit, GitPullRequest, GitMerge, GitCompare,
  TrendingUp, TrendingDown, Activity, Clock, Users,
  Search, Download, Eye, Plus, CheckCircle,
  BarChart3, Settings, Code2, Zap, Target
} from 'lucide-react'

// Version control metrics
const VERSION_CONTROL_METRICS = [
  {
    id: 'total_commits',
    label: 'Total Commits',
    value: '4,825',
    change: '+342',
    status: 'increasing' as const,
    icon: GitCommit,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'active_branches',
    label: 'Active Branches',
    value: '48',
    change: '+8',
    status: 'increasing' as const,
    icon: GitBranch,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'pull_requests',
    label: 'Pull Requests',
    value: '24',
    change: '+5',
    status: 'good' as const,
    icon: GitPullRequest,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'merge_rate',
    label: 'Merge Rate',
    value: '95',
    unit: '%',
    change: '+2%',
    status: 'good' as const,
    icon: GitMerge,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const COMMIT_ACTIVITY = [
  { month: 'Jan', commits: 425, merges: 42 },
  { month: 'Feb', commits: 512, merges: 48 },
  { month: 'Mar', commits: 589, merges: 56 },
  { month: 'Apr', commits: 645, merges: 62 },
  { month: 'May', commits: 698, merges: 68 },
  { month: 'Jun', commits: 756, merges: 72 },
] as const

const BRANCH_STATS = [
  { branch: 'main', commits: 1245, prs: 24 },
  { branch: 'develop', commits: 856, prs: 18 },
  { branch: 'feature/*', commits: 2103, prs: 42 },
  { branch: 'hotfix/*', commits: 421, prs: 12 },
] as const

const RECENT_COMMITS = [
  {
    id: 'commit-001',
    message: 'Add user authentication flow',
    author: 'Sarah Chen',
    branch: 'feature/auth',
    timestamp: '2 mins ago',
    additions: 245,
    deletions: 42,
    files: 8
  },
  {
    id: 'commit-002',
    message: 'Fix API response handling',
    author: 'Mike Johnson',
    branch: 'hotfix/api-fix',
    timestamp: '15 mins ago',
    additions: 128,
    deletions: 85,
    files: 5
  },
  {
    id: 'commit-003',
    message: 'Update database schema',
    author: 'Emma Wilson',
    branch: 'develop',
    timestamp: '1 hour ago',
    additions: 342,
    deletions: 156,
    files: 12
  },
  {
    id: 'commit-004',
    message: 'Refactor component structure',
    author: 'Alex Rodriguez',
    branch: 'feature/refactor',
    timestamp: '3 hours ago',
    additions: 567,
    deletions: 423,
    files: 18
  },
  {
    id: 'commit-005',
    message: 'Add unit tests for auth module',
    author: 'Sarah Chen',
    branch: 'feature/auth',
    timestamp: '5 hours ago',
    additions: 892,
    deletions: 12,
    files: 24
  },
] as const

export default function VersionControlInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredCommits = useMemo(() => {
    return RECENT_COMMITS.filter(commit => {
      const matchesSearch = searchQuery === '' || 
        commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commit.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBranch = selectedBranch === 'all' || 
        commit.branch === selectedBranch
      return matchesSearch && matchesBranch
    })
  }, [searchQuery, selectedBranch])

  const getAuthorInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-neutral-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-red-600 to-rose-700 rounded-xl shadow-lg shadow-red-900/50'>
                <GitBranch className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Version Control</h1>
                <p className='text-red-400'>Git repository management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-700 bg-gray-800 text-white shadow-sm'>
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
                New Branch
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Version Control Metrics */}
        <section data-template-section='vc-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {VERSION_CONTROL_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-red-900/20 hover:shadow-lg transition-all'>
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

        {/* VCS Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Commit Activity */}
          <section data-template-section='commit-activity' data-chart-type='line' data-metrics='commits,merges'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Commit Activity</CardTitle>
                    <CardDescription className='text-gray-400'>Monthly commits and merges</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +28% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={COMMIT_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='commits' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Commits'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='merges' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Merges'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Branch Statistics */}
          <section data-template-section='branch-stats' data-chart-type='bar' data-metrics='commits,prs'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Branch Statistics</CardTitle>
                    <CardDescription className='text-gray-400'>Commits and PRs by branch</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-500/30 text-blue-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={BRANCH_STATS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='branch' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Legend />
                    <Bar dataKey='commits' name='Commits' fill='#ef4444' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='prs' name='Pull Requests' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Commit Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='commit-browser' data-component-type='commit-list' className='lg:col-span-2'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Recent Commits</CardTitle>
                    <CardDescription className='text-gray-400'>Latest repository changes</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search commits...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-700 bg-gray-700 text-white placeholder:text-gray-400'
                    />
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className='w-32 border-gray-700 bg-gray-700 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Branches</SelectItem>
                        <SelectItem value='main'>main</SelectItem>
                        <SelectItem value='develop'>develop</SelectItem>
                        <SelectItem value='feature/auth'>feature/auth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredCommits.map((commit) => (
                      <motion.div
                        key={commit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600 rounded-xl hover:border-red-600/40 transition-colors cursor-pointer ${
                          selectedCommit === commit.id ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                        onClick={() => setSelectedCommit(commit.id)}
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-2'>
                              <Avatar className='w-8 h-8 bg-gradient-to-br from-red-600 to-rose-700'>
                                <AvatarFallback className='text-white text-xs'>
                                  {getAuthorInitials(commit.author)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className='font-bold text-white'>{commit.message}</h4>
                                <p className='text-sm text-gray-400'>{commit.author}</p>
                              </div>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-400'>
                              <span className='flex items-center'>
                                <GitBranch className='w-3 h-3 mr-1' />
                                {commit.branch}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {commit.timestamp}
                              </span>
                              <span className='flex items-center'>
                                <Code2 className='w-3 h-3 mr-1' />
                                {commit.files} files
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm'>
                            <span className='text-emerald-400'>+{commit.additions}</span>
                            <span className='text-rose-400'>-{commit.deletions}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                              <GitCompare className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
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
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: GitBranch, label: 'New Branch', color: 'from-emerald-500 to-teal-500' },
                    { icon: GitCommit, label: 'Commit Changes', color: 'from-blue-500 to-cyan-500' },
                    { icon: GitPullRequest, label: 'Create PR', color: 'from-purple-500 to-pink-500' },
                    { icon: GitMerge, label: 'Merge Branch', color: 'from-amber-500 to-orange-500' },
                    { icon: Users, label: 'View Contributors', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Repository Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-600 bg-gray-700/50 hover:bg-gray-700 hover:border-red-600/50 text-white h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-gray-700' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-400'>Merge Success Rate</span>
                      <span className='font-medium text-white'>95%</span>
                    </div>
                    <Progress value={95} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-400' />
                      <div>
                        <div className='font-medium text-white'>All Branches Synced</div>
                        <div className='text-sm text-emerald-400'>48 active branches</div>
                      </div>
                    </div>
                    <GitBranch className='w-5 h-5 text-emerald-400' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Repository Statistics */}
        <section data-template-section='repo-statistics' data-component-type='stats-grid'>
          <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Repository Statistics</CardTitle>
                  <CardDescription className='text-gray-400'>Activity and performance insights</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-600 text-white'>
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
                    value: 'Sarah Chen', 
                    detail: '142 commits this month',
                    icon: Activity,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Top Branch', 
                    value: 'feature/*', 
                    detail: '2,103 commits',
                    icon: Target,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Fastest Merge', 
                    value: '2.4h', 
                    detail: 'Average PR merge time',
                    icon: Zap,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Code Changes', 
                    value: '+15K', 
                    detail: 'Lines added this month',
                    icon: Code2,
                    color: 'from-purple-500 to-pink-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600 rounded-xl'>
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