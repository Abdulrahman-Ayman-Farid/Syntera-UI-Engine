'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { 
  Plus, Search, Filter, ChevronRight, Bell, X, Bug, AlertCircle,
  CheckCircle, Clock, TrendingUp, TrendingDown, BarChart3, Eye,
  Edit, Trash2, MessageSquare, Paperclip, Tag, Calendar
} from 'lucide-react'

// Type-safe bug metrics with as const
const BUG_METRICS = [
  {
    id: 'total_bugs',
    label: 'Total Bugs',
    value: '147',
    change: '+12',
    status: 'warning' as const,
    icon: Bug,
    color: 'from-rose-500 to-red-500',
    format: 'count'
  },
  {
    id: 'open_bugs',
    label: 'Open Bugs',
    value: '42',
    change: '+5',
    status: 'warning' as const,
    icon: AlertCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    value: '89',
    change: '+18',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    value: '16',
    change: '-3',
    status: 'decreasing' as const,
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  }
] as const

const SEVERITY_DISTRIBUTION = [
  { severity: 'Critical', count: 8, color: '#dc2626' },
  { severity: 'High', count: 15, color: '#ea580c' },
  { severity: 'Medium', count: 34, color: '#f59e0b' },
  { severity: 'Low', count: 25, color: '#10b981' },
] as const

const BUG_TRENDS = [
  { week: 'Week 1', reported: 28, resolved: 22 },
  { week: 'Week 2', reported: 35, resolved: 30 },
  { week: 'Week 3', reported: 32, resolved: 35 },
  { week: 'Week 4', reported: 25, resolved: 28 },
] as const

const MOCK_BUGS = [
  {
    id: 'BUG-001',
    title: 'Login form validation fails on special characters',
    description: 'Users cannot login when password contains special characters',
    status: 'open' as const,
    priority: 'high' as const,
    severity: 'critical' as const,
    assignee: { name: 'John Doe', avatar: 'JD' },
    reporter: 'Alice Smith',
    createdAt: '2024-01-10',
    tags: ['authentication', 'security']
  },
  {
    id: 'BUG-002',
    title: 'Dashboard loading spinner stuck',
    description: 'Loading indicator does not disappear after data loads',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    severity: 'medium' as const,
    assignee: { name: 'Jane Smith', avatar: 'JS' },
    reporter: 'Bob Johnson',
    createdAt: '2024-01-12',
    tags: ['ui', 'performance']
  },
  {
    id: 'BUG-003',
    title: 'API timeout on large data requests',
    description: 'Requests fail when fetching more than 1000 records',
    status: 'open' as const,
    priority: 'high' as const,
    severity: 'high' as const,
    assignee: { name: 'Mike Ross', avatar: 'MR' },
    reporter: 'Carol White',
    createdAt: '2024-01-14',
    tags: ['api', 'backend']
  },
  {
    id: 'BUG-004',
    title: 'Export PDF button not responsive',
    description: 'Button does not work on mobile devices',
    status: 'closed' as const,
    priority: 'low' as const,
    severity: 'low' as const,
    assignee: { name: 'Sarah Lee', avatar: 'SL' },
    reporter: 'Dave Brown',
    createdAt: '2024-01-08',
    tags: ['mobile', 'export']
  },
] as const

export default function BugTrackingToolEnhanced() {
  const [bugs, setBugs] = useState(MOCK_BUGS)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'closed'>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRange, setTimeRange] = useState('month')
  const [showNewBugDialog, setShowNewBugDialog] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const matchesSearch = searchQuery === '' || 
        bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || bug.status === filterStatus
      const matchesSeverity = filterSeverity === 'all' || bug.severity === filterSeverity
      return matchesSearch && matchesStatus && matchesSeverity
    })
  }, [bugs, searchQuery, filterStatus, filterSeverity])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'in-progress': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'closed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-amber-500 text-white'
      case 'low': return 'bg-emerald-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-rose-600 to-red-600 rounded-xl shadow-lg'>
                <Bug className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>BugTracker Pro</h1>
                <p className='text-gray-600'>Comprehensive bug tracking & management</p>
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
                </SelectContent>
              </Select>
              <Button 
                className='bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-lg'
                onClick={() => setShowNewBugDialog(true)}
              >
                <Plus className='w-4 h-4 mr-2' />
                Report Bug
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Bug Metrics */}
        <section data-template-section='bug-metrics' data-component-type='kpi-grid'>
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
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' 
                              ? 'text-emerald-600' 
                              : metric.status === 'warning'
                              ? 'text-rose-600'
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Severity Distribution */}
          <section data-template-section='severity-distribution' data-chart-type='bar' data-metrics='count,severity'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Severity Distribution</CardTitle>
                    <CardDescription>Bugs grouped by severity level</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-rose-200 text-rose-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
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
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Bug Count' radius={[4, 4, 0, 0]}>
                      {SEVERITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Bug Trends */}
          <section data-template-section='bug-trends' data-chart-type='line' data-metrics='reported,resolved'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Bug Resolution Trends</CardTitle>
                    <CardDescription>Weekly reported vs resolved bugs</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +15% Resolution
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={BUG_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='week' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='reported' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Reported'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='resolved' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Resolved'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Filters */}
        <section data-template-section='bug-filters' data-component-type='filter-bar'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <Input
                    placeholder='Search bugs...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border-gray-300 focus:border-rose-500'
                    startIcon={Search}
                  />
                </div>
                <div className='flex gap-4'>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className='w-40 border-gray-300'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='open'>Open</SelectItem>
                      <SelectItem value='in-progress'>In Progress</SelectItem>
                      <SelectItem value='closed'>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={(value: any) => setFilterSeverity(value)}>
                    <SelectTrigger className='w-40 border-gray-300'>
                      <SelectValue placeholder='Severity' />
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
            </CardContent>
          </Card>
        </section>

        {/* Bug List */}
        <section data-template-section='bug-list' data-component-type='data-table'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Bug Reports</CardTitle>
                  <CardDescription>{filteredBugs.length} bugs found</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Filter className='w-4 h-4 mr-2' />
                  Advanced Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='space-y-4'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-20' />
                  ))}
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredBugs.map((bug, index) => (
                          <motion.tr
                            key={bug.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className='hover:bg-gray-50 transition-colors'
                          >
                            <TableCell className='font-mono text-sm'>{bug.id}</TableCell>
                            <TableCell>
                              <div>
                                <div className='font-medium'>{bug.title}</div>
                                <div className='text-sm text-gray-600 line-clamp-1'>{bug.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(bug.status)}>
                                {bug.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getSeverityColor(bug.severity)}>
                                {bug.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center space-x-2'>
                                <Avatar className='w-8 h-8'>
                                  <AvatarFallback className='text-xs bg-gradient-to-br from-rose-500 to-red-500 text-white'>
                                    {bug.assignee.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-sm'>{bug.assignee.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className='text-sm text-gray-600'>{bug.createdAt}</TableCell>
                            <TableCell className='text-right'>
                              <div className='flex items-center justify-end space-x-2'>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                                        <Eye className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                                        <Edit className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Bug</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* New Bug Dialog */}
      <Dialog open={showNewBugDialog} onOpenChange={setShowNewBugDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Report New Bug</DialogTitle>
            <DialogDescription>Provide details about the bug you encountered</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='title'>Bug Title</Label>
              <Input id='title' placeholder='Brief description of the bug' className='mt-2' />
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <textarea
                id='description'
                placeholder='Detailed description of the bug...'
                className='w-full mt-2 p-3 border border-gray-300 rounded-lg min-h-[100px]'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='severity'>Severity</Label>
                <Select>
                  <SelectTrigger className='mt-2'>
                    <SelectValue placeholder='Select severity' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='critical'>Critical</SelectItem>
                    <SelectItem value='high'>High</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='low'>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='priority'>Priority</Label>
                <Select>
                  <SelectTrigger className='mt-2'>
                    <SelectValue placeholder='Select priority' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='high'>High</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='low'>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowNewBugDialog(false)}>
              Cancel
            </Button>
            <Button className='bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'>
              <Plus className='w-4 h-4 mr-2' />
              Report Bug
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
