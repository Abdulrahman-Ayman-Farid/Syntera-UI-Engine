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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Target, TrendingUp, TrendingDown, Clock, 
  Zap, Users, Terminal, Folder, CheckCircle, Hash,
  Eye, Edit, Share2, Sparkles, Settings, Activity
} from 'lucide-react'

// Project metrics with type-safe constants
const PROJECT_METRICS = [
  {
    id: 'active_projects',
    label: 'Active Projects',
    value: '24',
    change: '+8',
    status: 'increasing' as const,
    icon: Folder,
    color: 'from-pink-500 to-rose-500',
    glowColor: 'shadow-pink-500/50'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '87',
    unit: '%',
    change: '+12%',
    status: 'good' as const,
    icon: Target,
    color: 'from-cyan-500 to-blue-500',
    glowColor: 'shadow-cyan-500/50'
  },
  {
    id: 'team_members',
    label: 'Team Members',
    value: '156',
    change: '+23',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/50'
  },
  {
    id: 'sprint_velocity',
    label: 'Sprint Velocity',
    value: '42',
    unit: 'pts',
    change: '+5%',
    status: 'good' as const,
    icon: Zap,
    color: 'from-purple-500 to-violet-500',
    glowColor: 'shadow-purple-500/50'
  }
] as const

const PROJECT_STATUSES = [
  { status: 'Planning', count: 8, color: '#6366f1', percentage: 33 },
  { status: 'In Progress', count: 12, color: '#10b981', percentage: 50 },
  { status: 'Review', count: 3, color: '#f59e0b', percentage: 12 },
  { status: 'Completed', count: 1, color: '#8b5cf6', percentage: 5 }
] as const

const RECENT_PROJECTS = [
  {
    id: 'proj-001',
    title: 'Neural Network Dashboard',
    description: 'AI-powered analytics platform',
    status: 'in-progress' as const,
    priority: 'high' as const,
    progress: 75,
    team: [
      { id: 1, name: 'Alice Chen', avatar: '🦄', role: 'Lead Dev' },
      { id: 2, name: 'Bob Smith', avatar: '🚀', role: 'UI/UX' }
    ],
    deadline: '2026-02-15',
    tags: ['AI', 'Dashboard', 'Analytics'],
    completedTasks: 18,
    totalTasks: 24
  },
  {
    id: 'proj-002',
    title: 'Cybersecurity Platform',
    description: 'Advanced threat detection system',
    status: 'in-progress' as const,
    priority: 'critical' as const,
    progress: 45,
    team: [
      { id: 4, name: 'David Lee', avatar: '🛡️', role: 'Security' }
    ],
    deadline: '2026-01-30',
    tags: ['Security', 'Platform'],
    completedTasks: 12,
    totalTasks: 27
  },
  {
    id: 'proj-003',
    title: 'Blockchain Integration',
    description: 'Decentralized app infrastructure',
    status: 'planning' as const,
    priority: 'medium' as const,
    progress: 20,
    team: [
      { id: 6, name: 'Frank Zhang', avatar: '💎', role: 'Blockchain' }
    ],
    deadline: '2026-03-20',
    tags: ['Blockchain', 'Web3'],
    completedTasks: 5,
    totalTasks: 25
  }
] as const

const SPRINT_DATA = [
  { sprint: 'S1', planned: 45, completed: 42 },
  { sprint: 'S2', planned: 50, completed: 48 },
  { sprint: 'S3', planned: 48, completed: 45 },
  { sprint: 'S4', planned: 52, completed: 50 },
  { sprint: 'S5', planned: 55, completed: 52 },
  { sprint: 'S6', planned: 58, completed: 42 }
] as const

const TEAM_ACTIVITY = [
  { month: 'Jan', commits: 420, prs: 85, reviews: 120 },
  { month: 'Feb', commits: 580, prs: 92, reviews: 145 },
  { month: 'Mar', commits: 720, prs: 105, reviews: 160 },
  { month: 'Apr', commits: 890, prs: 120, reviews: 180 },
  { month: 'May', commits: 950, prs: 135, reviews: 195 },
  { month: 'Jun', commits: 1020, prs: 150, reviews: 210 }
] as const

export default function CyberpunkProjectManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'planning' | 'in-progress' | 'review' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
      case 'in-progress': return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'review': return 'bg-amber-500/20 text-amber-300 border-amber-500/50'
      case 'completed': return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    }
  }

  const filteredProjects = useMemo(() => {
    return RECENT_PROJECTS.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black'>
      {/* Cyberpunk Grid Background */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none' />
      
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-pink-500/20 bg-black/80 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <motion.div 
                className='p-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg shadow-pink-500/50'
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Terminal className='w-8 h-8 text-white' />
              </motion.div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent'>
                  CyberProject Pro
                </h1>
                <p className='text-cyan-400 text-sm font-mono'>Enterprise Project Management // v2.0.26</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-pink-500/30 bg-black/50 text-white shadow-lg shadow-pink-500/20'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-900 border-pink-500/30'>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg shadow-pink-500/50'>
                <Plus className='w-4 h-4 mr-2' />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8 relative'>
        {/* Project Overview KPIs */}
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
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className={`h-full border border-pink-500/20 bg-black/50 backdrop-blur-sm hover:border-pink-500/50 transition-all shadow-lg ${metric.glowColor}`}>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-cyan-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && <span className='text-pink-400'>{metric.unit}</span>}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-green-400' 
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

        {/* Analytics & Status Distribution */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Sprint Velocity Chart */}
          <section data-template-section='neon-stats' data-chart-type='bar' data-metrics='velocity,completed'>
            <Card className='border border-cyan-500/20 bg-black/50 backdrop-blur-sm shadow-lg shadow-cyan-500/20'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Sprint Velocity</CardTitle>
                    <CardDescription className='text-cyan-400'>Team performance by sprint</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-cyan-500/30 text-cyan-400'>
                    <Activity className='w-3 h-3 mr-1' />
                    Agile
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={SPRINT_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#4f4f4f' />
                    <XAxis dataKey='sprint' stroke='#06b6d4' />
                    <YAxis stroke='#06b6d4' />
                    <Legend />
                    <Bar dataKey='planned' name='Planned' fill='#ec4899' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='completed' name='Completed' fill='#06b6d4' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Project Status Distribution */}
          <section data-template-section='analytics-panel' data-chart-type='pie' data-metrics='status,count'>
            <Card className='border border-purple-500/20 bg-black/50 backdrop-blur-sm shadow-lg shadow-purple-500/20'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Project Status</CardTitle>
                    <CardDescription className='text-purple-400'>Distribution by stage</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-500/30 text-purple-400'>24 Total</Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={PROJECT_STATUSES}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({status, percentage}) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      dataKey='count'
                    >
                      {PROJECT_STATUSES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Team Activity */}
        <section data-template-section='team-activity' data-chart-type='line' data-metrics='commits,prs,reviews'>
          <Card className='border border-green-500/20 bg-black/50 backdrop-blur-sm shadow-lg shadow-green-500/20'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Team Activity</CardTitle>
                  <CardDescription className='text-green-400'>Development metrics over time</CardDescription>
                </div>
                <Badge variant='outline' className='border-green-500/30 text-green-400'>
                  <TrendingUp className='w-3 h-3 mr-1' />
                  +24%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={TEAM_ACTIVITY}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#4f4f4f' />
                  <XAxis dataKey='month' stroke='#10b981' />
                  <YAxis stroke='#10b981' />
                  <Legend />
                  <Line type='monotone' dataKey='commits' stroke='#ec4899' strokeWidth={2} name='Commits' />
                  <Line type='monotone' dataKey='prs' stroke='#06b6d4' strokeWidth={2} name='Pull Requests' />
                  <Line type='monotone' dataKey='reviews' stroke='#10b981' strokeWidth={2} name='Reviews' />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Projects Grid */}
        <section data-template-section='project-grid' data-component-type='project-cards'>
          <Card className='border border-pink-500/20 bg-black/50 backdrop-blur-sm shadow-lg shadow-pink-500/20'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Active Projects</CardTitle>
                  <CardDescription className='text-pink-400'>Manage and track project progress</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search projects...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-pink-500/30 bg-black/50 text-white placeholder:text-gray-500'
                  />
                  <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                    <SelectTrigger className='w-32 border-pink-500/30 bg-black/50 text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-900 border-pink-500/30'>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='planning'>Planning</SelectItem>
                      <SelectItem value='in-progress'>In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 bg-gradient-to-br from-gray-900 to-black border border-pink-500/30 rounded-xl hover:border-pink-500/60 transition-all cursor-pointer ${
                        selectedProject === project.id ? 'ring-2 ring-pink-500' : ''
                      }`}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className='space-y-3'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <h4 className='font-bold text-white mb-1'>{project.title}</h4>
                            <p className='text-sm text-gray-400'>{project.description}</p>
                          </div>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant='outline' className='border-cyan-500/30 text-cyan-400 text-xs'>
                              <Hash className='w-3 h-3 mr-1' />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className='space-y-2'>
                          <div className='flex items-center justify-between text-sm'>
                            <span className='text-gray-400'>Progress</span>
                            <span className='text-white font-medium'>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className='h-2 bg-gray-800' />
                          <div className='flex items-center justify-between text-xs text-gray-500'>
                            <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                            <span className='flex items-center'>
                              <Clock className='w-3 h-3 mr-1' />
                              Due {project.deadline}
                            </span>
                          </div>
                        </div>

                        <Separator className='bg-gray-800' />

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center -space-x-2'>
                            {project.team.map((member) => (
                              <TooltipProvider key={member.id}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center border-2 border-black text-sm'>
                                      {member.avatar}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className='bg-gray-900 border-pink-500/30'>
                                    <p className='text-white'>{member.name}</p>
                                    <p className='text-xs text-gray-400'>{member.role}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>

                        <div className='flex items-center space-x-2'>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-cyan-400 hover:bg-cyan-500/10'>
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-pink-400 hover:bg-pink-500/10'>
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-purple-400 hover:bg-purple-500/10'>
                            <Share2 className='w-4 h-4' />
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
      </main>
    </div>
  )
}
