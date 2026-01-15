'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip,
  PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Folder, FileText, CheckSquare, AlertCircle,
  Search, Filter, Plus, Download, Share2, Eye, Edit, Trash2,
  Calendar, Clock, Users, Target, TrendingUp, TrendingDown,
  BarChart3, Settings, Bell, MoreVertical, Tag,
  Zap, Star, GitBranch, Activity, Flag
} from 'lucide-react'

// Project metrics with type-safe constants
const PROJECT_METRICS = [
  {
    id: 'total_projects',
    label: 'Total Projects',
    value: '42',
    change: '+8',
    status: 'increasing' as const,
    icon: Folder,
    color: 'from-red-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'active_tasks',
    label: 'Active Tasks',
    value: '248',
    change: '+24',
    status: 'increasing' as const,
    icon: CheckSquare,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '78',
    unit: '%',
    change: '+12%',
    status: 'good' as const,
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'team_members',
    label: 'Team Members',
    value: '24',
    change: '+3',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  }
] as const

const PROJECT_STATUS_DISTRIBUTION = [
  { status: 'In Progress', count: 18, color: '#3b82f6' },
  { status: 'Completed', count: 15, color: '#10b981' },
  { status: 'Planning', count: 6, color: '#f59e0b' },
  { status: 'On Hold', count: 3, color: '#ef4444' },
] as const

const PROJECTS_DATA = [
  {
    id: 'proj-001',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'in-progress',
    priority: 'high',
    progress: 75,
    startDate: '2026-01-01',
    endDate: '2026-03-01',
    teamSize: 8,
    tasksCompleted: 45,
    tasksTotal: 60,
    budget: 50000,
    spent: 37500,
    lead: 'Sarah Chen',
    tags: ['Design', 'Development']
  },
  {
    id: 'proj-002',
    name: 'Mobile App Launch',
    description: 'New iOS and Android application',
    status: 'in-progress',
    priority: 'high',
    progress: 60,
    startDate: '2025-12-15',
    endDate: '2026-04-15',
    teamSize: 12,
    tasksCompleted: 72,
    tasksTotal: 120,
    budget: 120000,
    spent: 72000,
    lead: 'Michael Rodriguez',
    tags: ['Mobile', 'Development']
  },
  {
    id: 'proj-003',
    name: 'Data Migration',
    description: 'Legacy system data migration',
    status: 'planning',
    priority: 'medium',
    progress: 25,
    startDate: '2026-02-01',
    endDate: '2026-05-01',
    teamSize: 5,
    tasksCompleted: 12,
    tasksTotal: 48,
    budget: 35000,
    spent: 8750,
    lead: 'Dr. Alex Kumar',
    tags: ['Database', 'Infrastructure']
  },
  {
    id: 'proj-004',
    name: 'Marketing Campaign',
    description: 'Q1 2026 marketing initiatives',
    status: 'completed',
    priority: 'low',
    progress: 100,
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    teamSize: 6,
    tasksCompleted: 35,
    tasksTotal: 35,
    budget: 25000,
    spent: 24500,
    lead: 'Emma Wilson',
    tags: ['Marketing', 'Content']
  },
] as const

const TASK_VELOCITY_DATA = [
  { week: 'W1', completed: 24, planned: 30, inProgress: 18 },
  { week: 'W2', completed: 28, planned: 32, inProgress: 22 },
  { week: 'W3', completed: 32, planned: 35, inProgress: 24 },
  { week: 'W4', completed: 35, planned: 38, inProgress: 26 },
  { week: 'W5', completed: 38, planned: 40, inProgress: 28 },
  { week: 'W6', completed: 42, planned: 42, inProgress: 30 },
] as const

export default function ProjectManagementToolTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'planning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'on-hold': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-amber-600'
      case 'low': return 'text-emerald-600'
      default: return 'text-gray-600'
    }
  }

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.lead.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || 
        project.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || 
        project.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchQuery, statusFilter, priorityFilter])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900/20'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-red-900/30 bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg'>
                <Folder className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>ProjectHub Pro</h1>
                <p className='text-gray-400'>Enterprise project management platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 bg-slate-800 border-gray-700 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 border-gray-700'>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='ghost' size='icon' className='text-white hover:bg-slate-800'>
                <Bell className='w-5 h-5' />
              </Button>
              <Button className='bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Project Overview */}
        <section data-template-section='project-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PROJECT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full bg-slate-800 border-gray-700 shadow-sm hover:shadow-md transition-all'>
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

        {/* Project Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Status Distribution */}
          <section data-template-section='status-distribution' data-chart-type='pie' data-metrics='count'>
            <Card className='bg-slate-800 border-gray-700 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Project Status</CardTitle>
                    <CardDescription className='text-gray-400'>Distribution by status</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-700 text-blue-400'>
                    <PieChart className='w-3 h-3 mr-1' />
                    Pie Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={PROJECT_STATUS_DISTRIBUTION}
                      dataKey='count'
                      nameKey='status'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      label
                    >
                      {PROJECT_STATUS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Task Velocity */}
          <section data-template-section='task-velocity' data-chart-type='line' data-metrics='completed,planned,inProgress'>
            <Card className='bg-slate-800 border-gray-700 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Task Velocity</CardTitle>
                    <CardDescription className='text-gray-400'>Weekly task completion trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-700 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Velocity
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TASK_VELOCITY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='week' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='completed' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Completed'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='planned' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Planned'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='inProgress' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='In Progress'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Project Browser & Controls */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Project Cards */}
          <section data-template-section='project-browser' data-component-type='project-grid' className='lg:col-span-2'>
            <Card className='bg-slate-800 border-gray-700 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Active Projects</CardTitle>
                    <CardDescription className='text-gray-400'>Manage your project portfolio</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search projects...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 bg-slate-900 border-gray-700 text-white'
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className='w-32 bg-slate-900 border-gray-700 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-slate-800 border-gray-700'>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='in-progress'>In Progress</SelectItem>
                        <SelectItem value='completed'>Completed</SelectItem>
                        <SelectItem value='planning'>Planning</SelectItem>
                        <SelectItem value='on-hold'>On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')} className='w-auto'>
                      <TabsList className='bg-slate-900'>
                        <TabsTrigger value='grid'>Grid</TabsTrigger>
                        <TabsTrigger value='table'>Table</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-gray-700 rounded-xl hover:border-red-700/50 transition-colors cursor-pointer ${
                          selectedProject === project.id ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900' : ''
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold text-white'>{project.name}</h4>
                              <div className='flex items-center space-x-2'>
                                <Flag className={`w-4 h-4 ${getPriorityColor(project.priority)}`} />
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                            <p className='text-sm text-gray-400 mb-3'>{project.description}</p>
                            <div className='grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3'>
                              <span className='flex items-center'>
                                <Calendar className='w-3 h-3 mr-1' />
                                {project.endDate}
                              </span>
                              <span className='flex items-center'>
                                <Users className='w-3 h-3 mr-1' />
                                {project.teamSize} members
                              </span>
                              <span className='flex items-center'>
                                <CheckSquare className='w-3 h-3 mr-1' />
                                {project.tasksCompleted}/{project.tasksTotal} tasks
                              </span>
                              <span className='flex items-center'>
                                <Target className='w-3 h-3 mr-1' />
                                ${project.spent.toLocaleString()}
                              </span>
                            </div>
                            <div className='mb-3'>
                              <div className='flex justify-between text-sm mb-1'>
                                <span className='text-gray-400'>Progress</span>
                                <span className='text-white font-medium'>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className='h-2' />
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Avatar className='w-6 h-6'>
                                  <AvatarFallback className='text-xs bg-red-900 text-white'>
                                    {project.lead.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-sm text-gray-400'>{project.lead}</span>
                              </div>
                              <div className='flex items-center space-x-1'>
                                <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                                  <Eye className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                                  <Edit className='w-4 h-4' />
                                </Button>
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
            <Card className='bg-slate-800 border-gray-700 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Project', color: 'from-red-500 to-rose-500' },
                    { icon: CheckSquare, label: 'Task Board', color: 'from-blue-500 to-cyan-500' },
                    { icon: Calendar, label: 'Timeline', color: 'from-emerald-500 to-teal-500' },
                    { icon: Users, label: 'Team Resources', color: 'from-purple-500 to-pink-500' },
                    { icon: BarChart3, label: 'Reports', color: 'from-amber-500 to-orange-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start bg-slate-900 border-gray-700 hover:border-red-700/50 text-white h-14'
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
                      <span className='text-gray-400'>Team Capacity</span>
                      <span className='text-white font-medium'>18 / 24</span>
                    </div>
                    <Progress value={75} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-red-900/30 to-rose-900/30 border border-red-700/50 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Zap className='w-5 h-5 text-red-400' />
                      <div>
                        <div className='font-medium text-white'>Sprint Active</div>
                        <div className='text-sm text-red-400'>5 days remaining</div>
                      </div>
                    </div>
                    <Activity className='w-5 h-5 text-emerald-400' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Team & Milestones */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Team Members */}
          <section data-template-section='team-members' data-component-type='team-grid'>
            <Card className='bg-slate-800 border-gray-700 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Team Members</CardTitle>
                    <CardDescription className='text-gray-400'>Active project contributors</CardDescription>
                  </div>
                  <Button variant='outline' className='bg-slate-900 border-gray-700 text-white'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {[
                    { name: 'Sarah Chen', role: 'Project Lead', tasks: 12, color: 'bg-red-900' },
                    { name: 'Michael Rodriguez', role: 'Developer', tasks: 18, color: 'bg-blue-900' },
                    { name: 'Emma Wilson', role: 'Designer', tasks: 8, color: 'bg-purple-900' },
                    { name: 'Dr. Alex Kumar', role: 'Architect', tasks: 10, color: 'bg-emerald-900' },
                    { name: 'Lisa Zhang', role: 'QA Lead', tasks: 14, color: 'bg-amber-900' },
                    { name: 'Tom Parker', role: 'DevOps', tasks: 7, color: 'bg-cyan-900' },
                  ].map((member, i) => (
                    <div key={i} className='p-4 bg-slate-900 border border-gray-700 rounded-xl text-center'>
                      <Avatar className='w-12 h-12 mx-auto mb-2'>
                        <AvatarFallback className={`${member.color} text-white`}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className='font-medium text-white text-sm'>{member.name}</h4>
                      <p className='text-xs text-gray-400'>{member.role}</p>
                      <Badge variant='outline' className='mt-2 border-gray-700 text-gray-400'>
                        {member.tasks} tasks
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Milestones */}
          <section data-template-section='milestones' data-component-type='milestone-list'>
            <Card className='bg-slate-800 border-gray-700 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Upcoming Milestones</CardTitle>
                    <CardDescription className='text-gray-400'>Key project deliverables</CardDescription>
                  </div>
                  <Button variant='outline' className='bg-slate-900 border-gray-700 text-white'>
                    <Calendar className='w-4 h-4 mr-2' />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { 
                      title: 'Beta Release', 
                      project: 'Mobile App Launch', 
                      date: 'Jan 20', 
                      status: 'on-track',
                      completion: 85
                    },
                    { 
                      title: 'Design Approval', 
                      project: 'Website Redesign', 
                      date: 'Jan 25', 
                      status: 'at-risk',
                      completion: 60
                    },
                    { 
                      title: 'Data Migration Test', 
                      project: 'Data Migration', 
                      date: 'Feb 1', 
                      status: 'on-track',
                      completion: 40
                    },
                    { 
                      title: 'Campaign Launch', 
                      project: 'Marketing Campaign', 
                      date: 'Feb 5', 
                      status: 'completed',
                      completion: 100
                    },
                  ].map((milestone, i) => (
                    <div key={i} className='p-4 bg-slate-900 border border-gray-700 rounded-xl'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <h4 className='font-medium text-white'>{milestone.title}</h4>
                          <p className='text-sm text-gray-400'>{milestone.project}</p>
                        </div>
                        <div className='text-right'>
                          <div className='text-sm text-gray-400'>{milestone.date}</div>
                          <Badge className={
                            milestone.status === 'completed' ? 'bg-emerald-900 text-emerald-400' :
                            milestone.status === 'at-risk' ? 'bg-red-900 text-red-400' :
                            'bg-blue-900 text-blue-400'
                          }>
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={milestone.completion} className='h-2' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
