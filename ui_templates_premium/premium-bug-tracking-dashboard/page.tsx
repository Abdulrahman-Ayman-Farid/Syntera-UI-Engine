'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
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
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown,
  Users, Target, Activity, Zap, Search, Download, Settings,
  Bell, Filter, Calendar, FileText, GitBranch, Code, Shield
} from 'lucide-react'

// Bug tracking metrics with type-safe constants
const BUG_METRICS = [
  {
    id: 'total_bugs',
    label: 'Total Issues',
    value: '342',
    change: '-12',
    status: 'decreasing' as const,
    icon: Bug,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'critical_bugs',
    label: 'Critical',
    value: '18',
    change: '-5',
    status: 'good' as const,
    icon: AlertTriangle,
    color: 'from-red-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'resolved_today',
    label: 'Resolved Today',
    value: '24',
    change: '+8',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'avg_resolution',
    label: 'Avg Resolution',
    value: '2.4',
    unit: 'days',
    change: '-0.3d',
    status: 'good' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  }
] as const

const SEVERITY_DISTRIBUTION = [
  { severity: 'Critical', count: 18, resolved: 12, color: '#ef4444' },
  { severity: 'High', count: 45, resolved: 32, color: '#f59e0b' },
  { severity: 'Medium', count: 128, resolved: 95, color: '#3b82f6' },
  { severity: 'Low', count: 151, resolved: 120, color: '#10b981' },
] as const

const WEEKLY_ACTIVITY = [
  { week: 'W1', opened: 42, closed: 38, backlog: 342 },
  { week: 'W2', opened: 38, closed: 45, backlog: 335 },
  { week: 'W3', opened: 45, closed: 48, backlog: 332 },
  { week: 'W4', opened: 35, closed: 42, backlog: 325 },
  { week: 'W5', opened: 40, closed: 45, backlog: 320 },
  { week: 'W6', opened: 32, closed: 38, backlog: 314 },
] as const

const BUG_LIST = [
  {
    id: 'bug-001',
    title: 'Login authentication fails on mobile',
    severity: 'critical',
    status: 'in-progress',
    assignee: 'John Doe',
    reported: '2 hours ago',
    priority: 'high',
    component: 'Authentication'
  },
  {
    id: 'bug-002',
    title: 'Dashboard charts not rendering',
    severity: 'high',
    status: 'open',
    assignee: 'Jane Smith',
    reported: '5 hours ago',
    priority: 'high',
    component: 'UI'
  },
  {
    id: 'bug-003',
    title: 'API response timeout on heavy load',
    severity: 'high',
    status: 'in-progress',
    assignee: 'Mike Johnson',
    reported: '1 day ago',
    priority: 'medium',
    component: 'Backend'
  },
  {
    id: 'bug-004',
    title: 'Export feature missing data fields',
    severity: 'medium',
    status: 'open',
    assignee: 'Sarah Lee',
    reported: '2 days ago',
    priority: 'medium',
    component: 'Export'
  },
] as const

export default function PremiumBugTrackingDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBug, setSelectedBug] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'in-progress': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredBugs = useMemo(() => {
    return BUG_LIST.filter(bug => {
      const matchesSearch = searchQuery === '' || 
        bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.component.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSeverity = selectedSeverity === 'all' || 
        bug.severity === selectedSeverity
      return matchesSearch && matchesSeverity
    })
  }, [searchQuery, selectedSeverity])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg'>
                <Bug className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>BugTracker Pro</h1>
                <p className='text-gray-600'>Enterprise bug tracking and issue management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'>
                <Bug className='w-4 h-4 mr-2' />
                Report Bug
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Bug Metrics */}
        <section data-template-section='bug-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {BUG_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
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
                            metric.status === 'good' || metric.status === 'decreasing' 
                              ? 'text-emerald-600' 
                              : 'text-rose-600'
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

        {/* Bug Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Severity Distribution */}
          <section data-template-section='severity-distribution' data-chart-type='bar' data-metrics='count,resolved'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Severity Distribution</CardTitle>
                    <CardDescription>Bugs by severity level</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={SEVERITY_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='severity' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Total Bugs' radius={[4, 4, 0, 0]}>
                      {SEVERITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey='resolved' name='Resolved' radius={[4, 4, 0, 0]} fill='#10b981' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Weekly Activity */}
          <section data-template-section='weekly-activity' data-chart-type='line' data-metrics='opened,closed,backlog'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Weekly Activity</CardTitle>
                    <CardDescription>Bug trends over time</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingDown className='w-3 h-3 mr-1' />
                    -8% Backlog
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={WEEKLY_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='week' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='opened' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Opened'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='closed' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Closed'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='backlog' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Backlog'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Bug Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='bug-browser' data-component-type='bug-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Issues</CardTitle>
                    <CardDescription>Current bug list and status</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search bugs...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Severity</SelectItem>
                        <SelectItem value='critical'>Critical</SelectItem>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredBugs.map((bug) => (
                      <motion.div
                        key={bug.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedBug === bug.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedBug(bug.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <Badge className={getSeverityColor(bug.severity)}>
                                {bug.severity}
                              </Badge>
                              <h4 className='font-bold'>{bug.title}</h4>
                              <Badge className={getStatusColor(bug.status)}>
                                {bug.status}
                              </Badge>
                            </div>
                            <div className='grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Users className='w-4 h-4 mr-2' />
                                {bug.assignee}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-4 h-4 mr-2' />
                                {bug.reported}
                              </span>
                              <span className='flex items-center'>
                                <Code className='w-4 h-4 mr-2' />
                                {bug.component}
                              </span>
                              <span className='flex items-center'>
                                <Target className='w-4 h-4 mr-2' />
                                {bug.priority} priority
                              </span>
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
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Bug, label: 'Report Bug', color: 'from-blue-500 to-cyan-500' },
                    { icon: Filter, label: 'Custom Filters', color: 'from-purple-500 to-pink-500' },
                    { icon: GitBranch, label: 'Sprint Board', color: 'from-emerald-500 to-teal-500' },
                    { icon: FileText, label: 'Generate Report', color: 'from-amber-500 to-orange-500' },
                    { icon: Shield, label: 'Security Issues', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-blue-300 h-14'
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
                      <span className='text-gray-600'>Sprint Progress</span>
                      <span className='font-medium'>72%</span>
                    </div>
                    <Progress value={72} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium'>On Track</div>
                        <div className='text-sm text-blue-600'>24 resolved today</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Team Performance */}
        <section data-template-section='team-performance' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Team Performance</CardTitle>
                  <CardDescription>Workload and resolution metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Resolver', 
                    value: 'John Doe', 
                    resolved: '42 bugs',
                    icon: Users,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Fastest Fix', 
                    value: '1.2 hours', 
                    bug: 'UI rendering',
                    icon: Zap,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Critical Rate', 
                    value: '5.3%', 
                    trend: '-1.2%',
                    icon: AlertTriangle,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Resolution Rate', 
                    value: '94%', 
                    status: 'Above target',
                    icon: Target,
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>
                      {stat.resolved && stat.resolved}
                      {stat.bug && `Fix: ${stat.bug}`}
                      {stat.trend && stat.trend}
                      {stat.status && stat.status}
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
            className='w-full rounded-full'
          />
        </div>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className='h-60 rounded-lg' />
            ))
          ) : error ? (
            <p>Error loading bugs. Please try again.</p>
          ) : filteredBugs.length > 0 ? (
            filteredBugs.map((bug) => (
              <Card key={bug.id} className='shadow-sm hover:scale-105 transform transition-transform duration-300 ease-in-out'>
                <CardHeader>
                  <CardTitle>{bug.title}</CardTitle>
                  <CardDescription>Assigned to {bug.assignee.name}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className={`badge ${bug.status === 'Open' ? 'bg-red-500' : 'bg-green-500'}`}>{bug.status}</span>
                    <span className={`badge ${bug.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}>{bug.priority}</span>
                  </div>
                  <div className='mt-4'>
                    <Button variant='ghost' onClick={() => router.push(`/bugs/${bug.id}`)} aria-label={`View details for ${bug.title}`}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No bugs found.</p>
          )}
        </div>
      </main>
      <footer className='bg-primary text-white px-6 py-4 shadow-sm'>
        <p>&copy; 2023 Bug Tracker Inc.</p>
      </footer>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Button variant='default'>Add Bug</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-full p-6 rounded-lg bg-background shadow-lg focus:outline-none'>
            <Dialog.Title className='text-lg font-semibold'>Add New Bug</Dialog.Title>
            <Dialog.Description className='mt-2'>Enter the details of the new bug.</Dialog.Description>
            <Form className='mt-4'>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input id='title' placeholder='Bug title' className='focus:ring-primary focus:border-primary' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea id='description' placeholder='Describe the bug...' className='focus:ring-primary focus:border-primary' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select>
                    <SelectTrigger id='status'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='open'>Open</SelectItem>
                      <SelectItem value='in-progress'>In Progress</SelectItem>
                      <SelectItem value='closed'>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='priority'>Priority</Label>
                  <Select>
                    <SelectTrigger id='priority'>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='low'>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='assignee'>Assignee</Label>
                  <Select>
                    <SelectTrigger id='assignee'>
                      <SelectValue placeholder='Select assignee' />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.email}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='mt-4 flex justify-end'>
                <Button variant='outline' onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant='default' className='ml-2' onClick={handleError}>Submit</Button>
              </div>
            </Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Dashboard;