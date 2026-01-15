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
  Users, MessageSquare, FileText, Calendar, CheckCircle, 
  Search, Filter, Plus, Download, Share2, Eye, Edit, Trash2,
  Star, Clock, TrendingUp, TrendingDown, Zap, Target,
  BarChart3, Settings, Bell, MoreVertical, Tag, Hash,
  FolderOpen, Video, Mic, Phone, Mail, Send, Paperclip,
  Activity, Award, Briefcase, GitBranch, Code
} from 'lucide-react'

// Team collaboration metrics
const TEAM_METRICS = [
  {
    id: 'active_projects',
    label: 'Active Projects',
    value: '24',
    change: '+4',
    status: 'increasing' as const,
    icon: Briefcase,
    color: 'from-blue-600 to-cyan-600',
    format: 'count'
  },
  {
    id: 'team_members',
    label: 'Team Members',
    value: '142',
    change: '+12',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-emerald-600 to-teal-600',
    format: 'count'
  },
  {
    id: 'messages_today',
    label: 'Messages Today',
    value: '3,247',
    change: '+18%',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'from-purple-600 to-pink-600',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Task Completion',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const PROJECT_DISTRIBUTION = [
  { status: 'Active', count: 24, color: '#10b981', icon: Activity },
  { status: 'Planning', count: 8, color: '#3b82f6', icon: Calendar },
  { status: 'On Hold', count: 5, color: '#f59e0b', icon: Clock },
  { status: 'Completed', count: 47, color: '#8b5cf6', icon: CheckCircle },
] as const

const TEAM_MEMBERS = [
  {
    id: 'member-001',
    name: 'Sarah Anderson',
    role: 'Product Manager',
    avatar: '👩‍💼',
    status: 'online',
    projects: 5,
    tasks_completed: 42,
    messages: 234,
    last_active: 'Active now'
  },
  {
    id: 'member-002',
    name: 'Michael Chen',
    role: 'Lead Developer',
    avatar: '👨‍💻',
    status: 'online',
    projects: 7,
    tasks_completed: 58,
    messages: 412,
    last_active: 'Active now'
  },
  {
    id: 'member-003',
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    avatar: '👩‍🎨',
    status: 'away',
    projects: 4,
    tasks_completed: 35,
    messages: 189,
    last_active: '15 min ago'
  },
  {
    id: 'member-004',
    name: 'David Kim',
    role: 'QA Engineer',
    avatar: '👨‍🔬',
    status: 'offline',
    projects: 3,
    tasks_completed: 28,
    messages: 156,
    last_active: '2 hours ago'
  },
  {
    id: 'member-005',
    name: 'Jessica Taylor',
    role: 'Marketing Lead',
    avatar: '👩‍💼',
    status: 'online',
    projects: 6,
    tasks_completed: 45,
    messages: 298,
    last_active: 'Active now'
  },
] as const

const ACTIVITY_TRENDS = [
  { week: 'Week 1', messages: 1450, tasks: 85, files: 42 },
  { week: 'Week 2', messages: 1680, tasks: 92, files: 48 },
  { week: 'Week 3', messages: 1820, tasks: 105, files: 55 },
  { week: 'Week 4', messages: 2050, tasks: 118, files: 62 },
  { week: 'Week 5', messages: 2240, tasks: 125, files: 68 },
  { week: 'Week 6', messages: 2480, tasks: 142, files: 75 },
] as const

const RECENT_ACTIVITIES = [
  {
    id: 'activity-001',
    user: 'Sarah Anderson',
    avatar: '👩‍💼',
    action: 'created new project',
    target: 'Mobile App Redesign',
    timestamp: '5 minutes ago',
    type: 'project'
  },
  {
    id: 'activity-002',
    user: 'Michael Chen',
    avatar: '👨‍💻',
    action: 'completed task',
    target: 'API Integration',
    timestamp: '12 minutes ago',
    type: 'task'
  },
  {
    id: 'activity-003',
    user: 'Emily Rodriguez',
    avatar: '👩‍🎨',
    action: 'uploaded file',
    target: 'Design Mockups v2.fig',
    timestamp: '1 hour ago',
    type: 'file'
  },
  {
    id: 'activity-004',
    user: 'Jessica Taylor',
    avatar: '👩‍💼',
    action: 'started meeting',
    target: 'Marketing Strategy Session',
    timestamp: '2 hours ago',
    type: 'meeting'
  },
] as const

export default function TeamCollaborationPlatformSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'away': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'away': return 'bg-amber-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter(member => {
      const matchesSearch = searchQuery === '' || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || 
        member.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#FFF5EB] via-[#F1C232] to-[#E5B257]'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-amber-300/50 bg-[#FFF5EB]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#FFF5EB]/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Team Collaboration Hub
                </h1>
                <p className='text-amber-700'>Unite, Communicate, Achieve</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-amber-400 bg-white text-gray-900 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Invite Member
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Team Metrics Overview */}
        <section data-template-section='workspace-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {TEAM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-amber-300 bg-white/80 backdrop-blur shadow-lg hover:shadow-xl transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-600'>{metric.unit}</span>
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

        {/* Analytics & Distribution */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Project Distribution */}
          <section data-template-section='project-board' data-chart-type='bar' data-metrics='count,status'>
            <Card className='border border-amber-300 bg-white/80 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Project Status</CardTitle>
                    <CardDescription className='text-gray-600'>Distribution by status</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-500 text-amber-700'>
                    <Briefcase className='w-3 h-3 mr-1' />
                    {PROJECT_DISTRIBUTION.reduce((sum, p) => sum + p.count, 0)} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={PROJECT_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fbbf24' />
                    <XAxis dataKey='status' stroke='#78350f' />
                    <YAxis stroke='#78350f' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Projects' radius={[8, 8, 0, 0]}>
                      {PROJECT_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Activity Trends */}
          <section data-template-section='analytics' data-chart-type='line' data-metrics='messages,tasks,files'>
            <Card className='border border-amber-300 bg-white/80 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Activity Trends</CardTitle>
                    <CardDescription className='text-gray-600'>Weekly collaboration metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +42% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ACTIVITY_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fbbf24' />
                    <XAxis dataKey='week' stroke='#78350f' />
                    <YAxis stroke='#78350f' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='messages' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Messages'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='tasks' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Tasks'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='files' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Files'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Team Members & Recent Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Team Members List */}
          <section data-template-section='team-members' data-component-type='member-grid' className='lg:col-span-2'>
            <Card className='border border-amber-300 bg-white/80 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Team Directory</CardTitle>
                    <CardDescription className='text-gray-600'>Active team members</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search members...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-amber-400 bg-white text-gray-900'
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className='w-32 border-amber-400 bg-white text-gray-900'>
                        <SelectValue placeholder='Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='online'>Online</SelectItem>
                        <SelectItem value='away'>Away</SelectItem>
                        <SelectItem value='offline'>Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 bg-gradient-to-br from-white to-amber-50 border ${
                          selectedMember === member.id ? 'border-amber-500 shadow-lg' : 'border-amber-200'
                        } rounded-xl hover:border-amber-400 transition-all cursor-pointer`}
                        onClick={() => setSelectedMember(member.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-start space-x-3 flex-1'>
                            <div className='relative'>
                              <div className='text-3xl'>{member.avatar}</div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusDot(member.status)} border-2 border-white`}></div>
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-1'>
                                <h4 className='font-bold text-gray-900'>{member.name}</h4>
                                <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                                  {member.status}
                                </Badge>
                              </div>
                              <p className='text-sm text-gray-600 mb-2'>{member.role}</p>
                              <div className='flex items-center space-x-4 text-sm text-gray-500'>
                                <span className='flex items-center'>
                                  <Briefcase className='w-3 h-3 mr-1' />
                                  {member.projects} projects
                                </span>
                                <span className='flex items-center'>
                                  <CheckCircle className='w-3 h-3 mr-1' />
                                  {member.tasks_completed} tasks
                                </span>
                                <span className='flex items-center'>
                                  <MessageSquare className='w-3 h-3 mr-1' />
                                  {member.messages} messages
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='text-xs text-gray-500'>
                            {member.last_active}
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-600 hover:text-gray-900'>
                              <MessageSquare className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-600 hover:text-gray-900'>
                              <Video className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-600 hover:text-gray-900'>
                              <Mail className='w-4 h-4' />
                            </Button>
                          </div>
                          <Button variant='outline' size='sm' className='border-amber-400 text-amber-700 hover:bg-amber-50'>
                            View Profile
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity Feed */}
          <section data-template-section='file-sharing' data-component-type='activity-feed'>
            <Card className='border border-amber-300 bg-white/80 backdrop-blur shadow-lg h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-gray-900'>Recent Activity</CardTitle>
                <CardDescription className='text-gray-600'>Latest team updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {RECENT_ACTIVITIES.map((activity, index) => (
                    <div key={activity.id} className='p-3 bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-lg hover:border-amber-400 transition-colors'>
                      <div className='flex items-start space-x-3'>
                        <div className='text-2xl'>{activity.avatar}</div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm text-gray-900'>
                            <span className='font-semibold'>{activity.user}</span>
                            {' '}
                            <span className='text-gray-600'>{activity.action}</span>
                          </p>
                          <p className='text-sm font-medium text-amber-700 truncate'>
                            {activity.target}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {activity.timestamp}
                          </p>
                        </div>
                        <div className='flex-shrink-0'>
                          {activity.type === 'project' && <Briefcase className='w-4 h-4 text-blue-500' />}
                          {activity.type === 'task' && <CheckCircle className='w-4 h-4 text-emerald-500' />}
                          {activity.type === 'file' && <FileText className='w-4 h-4 text-purple-500' />}
                          {activity.type === 'meeting' && <Video className='w-4 h-4 text-amber-500' />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className='my-6 bg-amber-300' />
                
                <div className='space-y-4'>
                  <div className='p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <Award className='w-6 h-6 text-amber-600' />
                      <div>
                        <div className='font-medium text-gray-900'>Team Performance</div>
                        <div className='text-sm text-amber-700'>Excellent collaboration this week!</div>
                      </div>
                    </div>
                    <Progress value={87} className='h-2 bg-amber-200' />
                  </div>
                  
                  <Button className='w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'>
                    <Activity className='w-4 h-4 mr-2' />
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Collaboration Insights */}
        <section data-template-section='workspace-overview' data-component-type='insights-grid'>
          <Card className='border border-amber-300 bg-white/80 backdrop-blur shadow-lg'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-gray-900'>Collaboration Insights</CardTitle>
                  <CardDescription className='text-gray-600'>Key team performance indicators</CardDescription>
                </div>
                <Button variant='outline' className='border-amber-400 text-amber-700 hover:bg-amber-50'>
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
                    value: 'Michael Chen', 
                    metric: '412 messages',
                    icon: Star,
                    color: 'from-amber-500 to-orange-600'
                  },
                  { 
                    label: 'Top Project', 
                    value: 'Mobile App Redesign', 
                    metric: '24 contributors',
                    icon: Target,
                    color: 'from-blue-600 to-cyan-600'
                  },
                  { 
                    label: 'Files Shared', 
                    value: '1,247 Files', 
                    metric: '+24% this month',
                    icon: FileText,
                    color: 'from-purple-600 to-pink-600'
                  },
                  { 
                    label: 'Response Time', 
                    value: '< 2 hours', 
                    metric: 'Average response',
                    icon: Zap,
                    color: 'from-emerald-600 to-teal-600'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-1 text-gray-900'>{stat.value}</div>
                    <div className='text-sm text-amber-700'>{stat.metric}</div>
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
