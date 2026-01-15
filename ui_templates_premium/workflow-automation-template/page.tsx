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
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Workflow, GitBranch, Zap, Play, Pause, StopCircle, 
  Search, Filter, Plus, Download, Share2, Eye, Edit, Trash2,
  Star, Clock, Users, TrendingUp, TrendingDown, CheckCircle,
  BarChart3, Settings, Bell, MoreVertical, Tag, Hash,
  Activity, AlertTriangle, Target, Code, Terminal, Cpu,
  Database, Globe, Link, RefreshCw, ArrowRight, Calendar
} from 'lucide-react'

// Workflow automation metrics
const WORKFLOW_METRICS = [
  {
    id: 'total_workflows',
    label: 'Active Workflows',
    value: '48',
    change: '+8',
    status: 'increasing' as const,
    icon: Workflow,
    color: 'from-cyan-600 to-blue-600',
    format: 'count'
  },
  {
    id: 'executions_today',
    label: 'Executions Today',
    value: '2,847',
    change: '+24%',
    status: 'increasing' as const,
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    format: 'count'
  },
  {
    id: 'success_rate',
    label: 'Success Rate',
    value: '98.5',
    unit: '%',
    change: '+1.2%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-600 to-teal-600',
    format: 'percent'
  },
  {
    id: 'time_saved',
    label: 'Time Saved',
    value: '142',
    unit: 'hrs',
    change: '+35%',
    status: 'increasing' as const,
    icon: Clock,
    color: 'from-purple-600 to-pink-600',
    format: 'time'
  }
] as const

const WORKFLOW_DISTRIBUTION = [
  { type: 'Data Processing', count: 15, color: '#3b82f6', icon: Database },
  { type: 'API Integration', count: 12, color: '#10b981', icon: Link },
  { type: 'Notification', count: 10, color: '#f59e0b', icon: Bell },
  { type: 'Scheduling', count: 11, color: '#8b5cf6', icon: Calendar },
] as const

const WORKFLOW_DATA = [
  {
    id: 'workflow-001',
    name: 'Daily Data Sync Pipeline',
    status: 'running',
    trigger: 'Schedule',
    executions: 847,
    success_rate: 99.2,
    last_run: '5 min ago',
    avg_duration: '2.3 min',
    category: 'data-processing'
  },
  {
    id: 'workflow-002',
    name: 'Customer Onboarding Automation',
    status: 'running',
    trigger: 'Webhook',
    executions: 423,
    success_rate: 97.8,
    last_run: '12 min ago',
    avg_duration: '1.8 min',
    category: 'integration'
  },
  {
    id: 'workflow-003',
    name: 'Weekly Report Generator',
    status: 'paused',
    trigger: 'Schedule',
    executions: 156,
    success_rate: 100,
    last_run: '2 days ago',
    avg_duration: '5.2 min',
    category: 'reporting'
  },
  {
    id: 'workflow-004',
    name: 'API Error Alert System',
    status: 'running',
    trigger: 'Event',
    executions: 1245,
    success_rate: 98.5,
    last_run: '1 min ago',
    avg_duration: '0.5 min',
    category: 'monitoring'
  },
  {
    id: 'workflow-005',
    name: 'Database Backup Routine',
    status: 'stopped',
    trigger: 'Manual',
    executions: 89,
    success_rate: 100,
    last_run: '1 week ago',
    avg_duration: '8.5 min',
    category: 'maintenance'
  },
] as const

const EXECUTION_TRENDS = [
  { day: 'Mon', successful: 420, failed: 8, duration: 2.3 },
  { day: 'Tue', successful: 458, failed: 5, duration: 2.1 },
  { day: 'Wed', successful: 492, failed: 12, duration: 2.4 },
  { day: 'Thu', successful: 515, failed: 7, duration: 2.2 },
  { day: 'Fri', successful: 548, failed: 9, duration: 2.3 },
  { day: 'Sat', successful: 385, failed: 3, duration: 2.0 },
  { day: 'Sun', successful: 312, failed: 2, duration: 1.9 },
] as const

const INTEGRATION_STATUS = [
  { name: 'Slack', status: 'connected', executions: 1247, icon: '💬' },
  { name: 'GitHub', status: 'connected', executions: 845, icon: '🐙' },
  { name: 'AWS', status: 'connected', executions: 2341, icon: '☁️' },
  { name: 'Salesforce', status: 'error', executions: 156, icon: '⚡' },
] as const

export default function WorkflowAutomationSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'paused': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'stopped': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'error': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className='w-3 h-3' />
      case 'paused': return <Pause className='w-3 h-3' />
      case 'stopped': return <StopCircle className='w-3 h-3' />
      case 'error': return <AlertTriangle className='w-3 h-3' />
      default: return <Activity className='w-3 h-3' />
    }
  }

  const filteredWorkflows = useMemo(() => {
    return WORKFLOW_DATA.filter(workflow => {
      const matchesSearch = searchQuery === '' || 
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || 
        workflow.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2c3e50] to-[#34495e]'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-700/50 bg-[#1a1a1a]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1a1a1a]/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30'>
                <Workflow className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400'>
                  Workflow Automation
                </h1>
                <p className='text-slate-400'>Streamline processes, maximize efficiency</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-700 bg-[#2c3e50] text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Create Workflow
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Workflow Metrics Overview */}
        <section data-template-section='workflow-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {WORKFLOW_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-slate-700/50 bg-[#2c3e50]/50 backdrop-blur shadow-lg hover:shadow-cyan-500/20 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-slate-400'>{metric.unit}</span>
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

        {/* Analytics & Distribution */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Workflow Distribution */}
          <section data-template-section='workflow-list' data-chart-type='bar' data-metrics='count,type'>
            <Card className='border border-slate-700/50 bg-[#2c3e50]/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Workflow Types</CardTitle>
                    <CardDescription className='text-slate-400'>Distribution by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-cyan-500 text-cyan-400'>
                    <GitBranch className='w-3 h-3 mr-1' />
                    48 Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={WORKFLOW_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#475569' />
                    <XAxis dataKey='type' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Workflows' radius={[8, 8, 0, 0]}>
                      {WORKFLOW_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Execution Trends */}
          <section data-template-section='execution-history' data-chart-type='line' data-metrics='successful,failed,duration'>
            <Card className='border border-slate-700/50 bg-[#2c3e50]/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Execution Trends</CardTitle>
                    <CardDescription className='text-slate-400'>Daily workflow performance</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    98.5% Success
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={EXECUTION_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#475569' />
                    <XAxis dataKey='day' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='successful' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Successful'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='failed' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Failed'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Workflow List & Integrations */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Workflows List */}
          <section data-template-section='workflow-list' data-component-type='workflow-grid' className='lg:col-span-2'>
            <Card className='border border-slate-700/50 bg-[#2c3e50]/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Active Workflows</CardTitle>
                    <CardDescription className='text-slate-400'>Manage automation pipelines</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search workflows...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-slate-700 bg-[#1a1a1a] text-white placeholder:text-slate-500'
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className='w-32 border-slate-700 bg-[#1a1a1a] text-white'>
                        <SelectValue placeholder='Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='running'>Running</SelectItem>
                        <SelectItem value='paused'>Paused</SelectItem>
                        <SelectItem value='stopped'>Stopped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredWorkflows.map((workflow) => (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] border ${
                          selectedWorkflow === workflow.id ? 'border-cyan-500 shadow-lg shadow-cyan-500/30' : 'border-slate-700'
                        } rounded-xl hover:border-cyan-600 transition-all cursor-pointer`}
                        onClick={() => setSelectedWorkflow(workflow.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-2'>
                              <h4 className='font-bold text-white'>{workflow.name}</h4>
                              <Badge className={`text-xs ${getStatusColor(workflow.status)}`}>
                                {getStatusIcon(workflow.status)}
                                <span className='ml-1'>{workflow.status}</span>
                              </Badge>
                            </div>
                            <div className='grid grid-cols-2 gap-4 text-sm text-slate-400'>
                              <span className='flex items-center'>
                                <Target className='w-3 h-3 mr-1' />
                                Trigger: {workflow.trigger}
                              </span>
                              <span className='flex items-center'>
                                <Activity className='w-3 h-3 mr-1' />
                                {workflow.executions} runs
                              </span>
                              <span className='flex items-center'>
                                <CheckCircle className='w-3 h-3 mr-1' />
                                {workflow.success_rate}% success
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {workflow.avg_duration} avg
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='text-xs text-slate-500'>
                            Last run: {workflow.last_run}
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-white'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-white'>
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-emerald-400 hover:text-emerald-300'>
                              <Play className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-amber-400 hover:text-amber-300'>
                              <Pause className='w-4 h-4' />
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

          {/* Integrations Status */}
          <section data-template-section='integrations' data-component-type='integration-panel'>
            <Card className='border border-slate-700/50 bg-[#2c3e50]/50 backdrop-blur shadow-lg h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Integrations</CardTitle>
                <CardDescription className='text-slate-400'>Connected services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {INTEGRATION_STATUS.map((integration, index) => (
                    <div key={index} className='p-4 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] border border-slate-700 rounded-xl hover:border-cyan-600 transition-colors'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center space-x-3'>
                          <div className='text-2xl'>{integration.icon}</div>
                          <div>
                            <div className='font-bold text-white'>{integration.name}</div>
                            <div className='text-xs text-slate-400'>{integration.executions} executions</div>
                          </div>
                        </div>
                        <Badge className={integration.status === 'connected' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-red-100 text-red-800 border-red-300'
                        }>
                          {integration.status}
                        </Badge>
                      </div>
                      <Button variant='outline' size='sm' className='w-full border-slate-700 text-slate-400 hover:bg-slate-800'>
                        <Settings className='w-3 h-3 mr-2' />
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Separator className='my-6 bg-slate-700' />
                
                <div className='space-y-4'>
                  <div className='p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <Globe className='w-5 h-5 text-cyan-400' />
                      <div>
                        <div className='font-medium text-white'>System Health</div>
                        <div className='text-sm text-cyan-300'>All services operational</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className='w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'>
                    <Link className='w-4 h-4 mr-2' />
                    Add Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Workflow Analytics */}
        <section data-template-section='analytics' data-component-type='analytics-grid'>
          <Card className='border border-slate-700/50 bg-[#2c3e50]/50 backdrop-blur shadow-lg'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Automation Analytics</CardTitle>
                  <CardDescription className='text-slate-400'>Performance insights and metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'>
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
                    value: 'Data Sync Pipeline', 
                    metric: '847 executions',
                    icon: Database,
                    color: 'from-cyan-600 to-blue-600'
                  },
                  { 
                    label: 'Fastest Workflow', 
                    value: 'Error Alert System', 
                    metric: '0.5 min avg',
                    icon: Zap,
                    color: 'from-yellow-500 to-orange-600'
                  },
                  { 
                    label: 'Most Reliable', 
                    value: 'Database Backup', 
                    metric: '100% success',
                    icon: CheckCircle,
                    color: 'from-emerald-600 to-teal-600'
                  },
                  { 
                    label: 'Total Time Saved', 
                    value: '142 Hours', 
                    metric: 'This month',
                    icon: Clock,
                    color: 'from-purple-600 to-pink-600'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] border border-slate-700 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-slate-400'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-1 text-white'>{stat.value}</div>
                    <div className='text-sm text-cyan-400'>{stat.metric}</div>
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
