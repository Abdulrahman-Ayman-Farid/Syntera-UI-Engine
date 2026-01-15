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
  Bug, Shield, Crown, AlertTriangle, CheckCircle, XCircle,
  Search, Filter, Plus, Download, Share2, Eye, Edit, Trash2,
  Star, Clock, Users, TrendingUp, TrendingDown, Zap,
  BarChart3, PieChart as PieChartIcon, Settings, Bell,
  MoreVertical, Tag, Calendar, Hash, Target, Activity,
  GitBranch, Code, Terminal, FileCode, AlertCircle
} from 'lucide-react'

// Bug metrics with royal theme
const BUG_METRICS = [
  {
    id: 'total_bugs',
    label: 'Total Issues',
    value: '1,247',
    change: '-12',
    status: 'decreasing' as const,
    icon: Bug,
    color: 'from-purple-600 to-indigo-600',
    format: 'count'
  },
  {
    id: 'critical_bugs',
    label: 'Critical Bugs',
    value: '23',
    change: '-5',
    status: 'good' as const,
    icon: AlertTriangle,
    color: 'from-red-600 to-rose-600',
    format: 'count'
  },
  {
    id: 'resolved_today',
    label: 'Resolved Today',
    value: '47',
    change: '+18%',
    status: 'increasing' as const,
    icon: CheckCircle,
    color: 'from-emerald-600 to-teal-600',
    format: 'count'
  },
  {
    id: 'resolution_rate',
    label: 'Resolution Rate',
    value: '94',
    unit: '%',
    change: '+2%',
    status: 'good' as const,
    icon: Crown,
    color: 'from-amber-500 to-yellow-500',
    format: 'percent'
  }
] as const

const PRIORITY_DISTRIBUTION = [
  { priority: 'Critical', count: 23, color: '#ef4444', icon: AlertCircle },
  { priority: 'High', count: 145, color: '#f97316', icon: AlertTriangle },
  { priority: 'Medium', count: 458, color: '#eab308', icon: Target },
  { priority: 'Low', count: 621, color: '#10b981', icon: CheckCircle },
] as const

const BUG_DATA = [
  {
    id: 'bug-001',
    title: 'Authentication Fails on Royal Portal',
    status: 'critical',
    priority: 'Critical',
    assignee: 'Lord Byron',
    avatar: '👑',
    reported: '2 hours ago',
    labels: ['security', 'auth'],
    comments: 12,
    royal_severity: 'Imperial'
  },
  {
    id: 'bug-002',
    title: 'Crown Icon Not Rendering',
    status: 'in_progress',
    priority: 'High',
    assignee: 'Lady Catherine',
    avatar: '💎',
    reported: '5 hours ago',
    labels: ['ui', 'icons'],
    comments: 8,
    royal_severity: 'Noble'
  },
  {
    id: 'bug-003',
    title: 'Royal Theme Colors Inconsistent',
    status: 'open',
    priority: 'Medium',
    assignee: 'Sir Edmund',
    avatar: '⚜️',
    reported: '1 day ago',
    labels: ['design', 'theme'],
    comments: 5,
    royal_severity: 'Squire'
  },
  {
    id: 'bug-004',
    title: 'Performance Issue in Palace Dashboard',
    status: 'resolved',
    priority: 'High',
    assignee: 'Duke Alexander',
    avatar: '🛡️',
    reported: '2 days ago',
    labels: ['performance', 'dashboard'],
    comments: 15,
    royal_severity: 'Noble'
  },
  {
    id: 'bug-005',
    title: 'Notification Sound Too Loud',
    status: 'open',
    priority: 'Low',
    assignee: 'Duchess Victoria',
    avatar: '👸',
    reported: '3 days ago',
    labels: ['audio', 'ux'],
    comments: 3,
    royal_severity: 'Peasant'
  },
] as const

const RESOLUTION_TRENDS = [
  { week: 'Week 1', opened: 45, resolved: 38, critical: 8 },
  { week: 'Week 2', opened: 52, resolved: 48, critical: 5 },
  { week: 'Week 3', opened: 48, resolved: 55, critical: 7 },
  { week: 'Week 4', opened: 42, resolved: 58, critical: 4 },
  { week: 'Week 5', opened: 38, resolved: 62, critical: 3 },
  { week: 'Week 6', opened: 35, resolved: 65, critical: 2 },
] as const

const TEAM_ACTIVITY = [
  { name: 'Lord Byron', resolved: 42, avatar: '👑', rank: 'Master Debugger' },
  { name: 'Lady Catherine', resolved: 38, avatar: '💎', rank: 'Senior Fixer' },
  { name: 'Sir Edmund', resolved: 35, avatar: '⚜️', rank: 'Code Guardian' },
  { name: 'Duke Alexander', resolved: 31, avatar: '🛡️', rank: 'Bug Slayer' },
] as const

export default function RoyalBugTrackerSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBug, setSelectedBug] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'open': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'from-red-600 to-rose-600'
      case 'High': return 'from-orange-600 to-amber-600'
      case 'Medium': return 'from-yellow-600 to-amber-500'
      case 'Low': return 'from-emerald-600 to-teal-600'
      default: return 'from-gray-600 to-slate-600'
    }
  }

  const filteredBugs = useMemo(() => {
    return BUG_DATA.filter(bug => {
      const matchesSearch = searchQuery === '' || 
        bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = selectedPriority === 'all' || 
        bug.priority === selectedPriority
      const matchesStatus = selectedStatus === 'all' || 
        bug.status === selectedStatus
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [searchQuery, selectedPriority, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A1A4A] to-[#1E1E2F]'>
      {/* Royal Header */}
      <header className='sticky top-0 z-50 border-b border-purple-900/50 bg-[#1E1E2F]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1E1E2F]/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/50'>
                <Crown className='w-8 h-8 text-yellow-300' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-300 to-yellow-300'>
                  Royal Bug Tracker
                </h1>
                <p className='text-purple-300'>Imperial Issue Management System</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-purple-700 bg-[#2A1A4A] text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-[#1E1E2F] font-bold shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Report Bug
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Bug Metrics Overview */}
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
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-purple-700/50 bg-[#2A1A4A]/50 backdrop-blur shadow-lg shadow-purple-900/30 hover:shadow-purple-700/50 transition-all'>
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
                              : metric.status === 'decreasing'
                              ? 'text-blue-400'
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

        {/* Bug Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Priority Distribution */}
          <section data-template-section='priority-matrix' data-chart-type='bar' data-metrics='count,priority'>
            <Card className='border border-purple-700/50 bg-[#2A1A4A]/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Priority Distribution</CardTitle>
                    <CardDescription className='text-purple-300'>Issues by severity level</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-yellow-500 text-yellow-300'>
                    <Shield className='w-3 h-3 mr-1' />
                    Royal Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={PRIORITY_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#4B0082' />
                    <XAxis dataKey='priority' stroke='#D8BFD8' />
                    <YAxis stroke='#D8BFD8' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Bug Count' radius={[8, 8, 0, 0]}>
                      {PRIORITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Resolution Trends */}
          <section data-template-section='resolution-trends' data-chart-type='line' data-metrics='opened,resolved,critical'>
            <Card className='border border-purple-700/50 bg-[#2A1A4A]/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Resolution Trends</CardTitle>
                    <CardDescription className='text-purple-300'>Weekly bug activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500 text-emerald-300'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Efficiency
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={RESOLUTION_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#4B0082' />
                    <XAxis dataKey='week' stroke='#D8BFD8' />
                    <YAxis stroke='#D8BFD8' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='opened' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Opened'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='resolved' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Resolved'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='critical' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Critical'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Bug List & Team Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Bug List */}
          <section data-template-section='issue-list' data-component-type='bug-table' className='lg:col-span-2'>
            <Card className='border border-purple-700/50 bg-[#2A1A4A]/50 backdrop-blur shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Active Issues</CardTitle>
                    <CardDescription className='text-purple-300'>Royal bug tracking system</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search issues...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-purple-700 bg-[#1E1E2F] text-white placeholder:text-purple-400'
                    />
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className='w-32 border-purple-700 bg-[#1E1E2F] text-white'>
                        <SelectValue placeholder='Priority' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Priority</SelectItem>
                        <SelectItem value='Critical'>Critical</SelectItem>
                        <SelectItem value='High'>High</SelectItem>
                        <SelectItem value='Medium'>Medium</SelectItem>
                        <SelectItem value='Low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className='w-32 border-purple-700 bg-[#1E1E2F] text-white'>
                        <SelectValue placeholder='Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='critical'>Critical</SelectItem>
                        <SelectItem value='open'>Open</SelectItem>
                        <SelectItem value='in_progress'>In Progress</SelectItem>
                        <SelectItem value='resolved'>Resolved</SelectItem>
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 bg-gradient-to-br from-[#1E1E2F] to-[#2A1A4A] border ${
                          selectedBug === bug.id ? 'border-yellow-500 shadow-lg shadow-yellow-500/30' : 'border-purple-800'
                        } rounded-xl hover:border-purple-600 transition-all cursor-pointer`}
                        onClick={() => setSelectedBug(bug.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-start space-x-3 flex-1'>
                            <div className='text-2xl'>{bug.avatar}</div>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-2 mb-2'>
                                <h4 className='font-bold text-white'>{bug.title}</h4>
                                <Badge className={`text-xs ${getStatusColor(bug.status)}`}>
                                  {bug.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className='flex items-center space-x-4 text-sm text-purple-300'>
                                <span className='flex items-center'>
                                  <AlertTriangle className='w-3 h-3 mr-1' />
                                  {bug.priority}
                                </span>
                                <span className='flex items-center'>
                                  <Users className='w-3 h-3 mr-1' />
                                  {bug.assignee}
                                </span>
                                <span className='flex items-center'>
                                  <Clock className='w-3 h-3 mr-1' />
                                  {bug.reported}
                                </span>
                                <span className='flex items-center'>
                                  <Crown className='w-3 h-3 mr-1' />
                                  {bug.royal_severity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getPriorityColor(bug.priority)} text-white text-xs font-bold`}>
                            {bug.priority}
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            {bug.labels.map((label, i) => (
                              <Badge key={i} variant='outline' className='border-purple-600 text-purple-300 text-xs'>
                                <Tag className='w-3 h-3 mr-1' />
                                {label}
                              </Badge>
                            ))}
                          </div>
                          <div className='flex items-center space-x-3'>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-purple-300 hover:text-white'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-purple-300 hover:text-white'>
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-purple-300 hover:text-white'>
                              <Share2 className='w-4 h-4' />
                            </Button>
                            <span className='text-sm text-purple-400'>{bug.comments} comments</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Team Activity */}
          <section data-template-section='team-activity' data-component-type='leaderboard'>
            <Card className='border border-purple-700/50 bg-[#2A1A4A]/50 backdrop-blur shadow-lg h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Royal Court</CardTitle>
                <CardDescription className='text-purple-300'>Top bug slayers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {TEAM_ACTIVITY.map((member, index) => (
                    <div key={index} className='p-4 bg-gradient-to-br from-[#1E1E2F] to-[#2A1A4A] border border-purple-800 rounded-xl hover:border-yellow-500 transition-colors'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <div className='text-2xl'>{member.avatar}</div>
                        <div className='flex-1'>
                          <div className='font-bold text-white'>{member.name}</div>
                          <div className='text-xs text-purple-300'>{member.rank}</div>
                        </div>
                        {index === 0 && (
                          <Crown className='w-5 h-5 text-yellow-400' />
                        )}
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-purple-300'>Resolved</span>
                          <span className='font-medium text-white'>{member.resolved} bugs</span>
                        </div>
                        <Progress value={(member.resolved / 50) * 100} className='h-2 bg-purple-900' />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className='my-6 bg-purple-800' />
                
                <div className='space-y-4'>
                  <div className='p-4 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-600/50 rounded-lg'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <Shield className='w-5 h-5 text-yellow-400' />
                      <div>
                        <div className='font-medium text-white'>Royal Decree</div>
                        <div className='text-sm text-yellow-300'>All critical bugs must be resolved</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'>
                    <Users className='w-4 h-4 mr-2' />
                    View Full Court
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Bug Analytics Dashboard */}
        <section data-template-section='analytics' data-component-type='analytics-grid'>
          <Card className='border border-purple-700/50 bg-[#2A1A4A]/50 backdrop-blur shadow-lg'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Imperial Analytics</CardTitle>
                  <CardDescription className='text-purple-300'>Comprehensive bug tracking insights</CardDescription>
                </div>
                <Button variant='outline' className='border-yellow-500 text-yellow-300 hover:bg-yellow-500/10'>
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
                    value: 'Authentication Module', 
                    count: 145,
                    icon: Code,
                    color: 'from-purple-600 to-indigo-600'
                  },
                  { 
                    label: 'Fastest Resolution', 
                    value: 'Lord Byron', 
                    time: '2.3 hours avg',
                    icon: Zap,
                    color: 'from-yellow-500 to-amber-500'
                  },
                  { 
                    label: 'Critical Today', 
                    value: '3 Urgent Issues', 
                    status: 'Attention Required',
                    icon: AlertTriangle,
                    color: 'from-red-600 to-rose-600'
                  },
                  { 
                    label: 'Quality Score', 
                    value: '94% Success', 
                    rating: 'Excellent',
                    icon: CheckCircle,
                    color: 'from-emerald-600 to-teal-600'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-[#1E1E2F] to-[#2A1A4A] border border-purple-800 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-purple-300'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2 text-white'>{stat.value}</div>
                    <div className='text-sm text-purple-400'>
                      {stat.count && `${stat.count} total bugs`}
                      {stat.time && `Average: ${stat.time}`}
                      {stat.status && stat.status}
                      {stat.rating && `Rating: ${stat.rating}`}
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
