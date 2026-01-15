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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Headphones, MessageSquare, Search, Filter, Plus, Download, 
  CheckCircle, AlertTriangle, Clock, Users, TrendingUp, TrendingDown,
  BarChart3, Star, Activity, Tag, Hash, RefreshCw, Settings,
  Bell, User, Mail, Phone, FileText, AlertCircle, X, Eye,
  Send, Paperclip, BookOpen, HelpCircle, Zap, Shield
} from 'lucide-react'

// Support metrics with TypeScript constants
const SUPPORT_METRICS = [
  {
    id: 'total_tickets',
    label: 'Total Tickets',
    value: '842',
    change: '+48',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'avg_response_time',
    label: 'Avg Response Time',
    value: '2.4',
    unit: 'hrs',
    change: '-15%',
    status: 'good' as const,
    icon: Clock,
    color: 'from-emerald-500 to-teal-500',
    format: 'time'
  },
  {
    id: 'satisfaction_rate',
    label: 'Satisfaction Rate',
    value: '94',
    unit: '%',
    change: '+3%',
    status: 'good' as const,
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'resolution_rate',
    label: 'Resolution Rate',
    value: '89',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const TICKETS_DATA = [
  {
    id: 'ticket-001',
    title: 'Payment Processing Issue',
    customer: 'John Smith',
    email: 'john.smith@email.com',
    priority: 'high',
    status: 'open',
    category: 'Billing',
    created: '2 hours ago',
    lastUpdate: '1 hour ago',
    messages: 3,
    assignedTo: 'Sarah Chen'
  },
  {
    id: 'ticket-002',
    title: 'Account Login Problems',
    customer: 'Emma Wilson',
    email: 'emma.w@email.com',
    priority: 'medium',
    status: 'in-progress',
    category: 'Technical',
    created: '4 hours ago',
    lastUpdate: '30 minutes ago',
    messages: 5,
    assignedTo: 'Mike Johnson'
  },
  {
    id: 'ticket-003',
    title: 'Feature Request - Dark Mode',
    customer: 'Alex Martinez',
    email: 'alex.m@email.com',
    priority: 'low',
    status: 'pending',
    category: 'Feature Request',
    created: '1 day ago',
    lastUpdate: '6 hours ago',
    messages: 2,
    assignedTo: 'Emily Zhang'
  },
  {
    id: 'ticket-004',
    title: 'Order Status Inquiry',
    customer: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    priority: 'medium',
    status: 'resolved',
    category: 'Orders',
    created: '2 days ago',
    lastUpdate: '1 day ago',
    messages: 7,
    assignedTo: 'David Kim'
  },
  {
    id: 'ticket-005',
    title: 'Refund Request',
    customer: 'Robert Brown',
    email: 'robert.b@email.com',
    priority: 'high',
    status: 'open',
    category: 'Billing',
    created: '3 hours ago',
    lastUpdate: '2 hours ago',
    messages: 4,
    assignedTo: 'Sarah Chen'
  },
  {
    id: 'ticket-006',
    title: 'Shipping Delay Complaint',
    customer: 'Jennifer Lee',
    email: 'jennifer.l@email.com',
    priority: 'high',
    status: 'in-progress',
    category: 'Shipping',
    created: '5 hours ago',
    lastUpdate: '1 hour ago',
    messages: 6,
    assignedTo: 'Mike Johnson'
  },
] as const

const TICKET_TRENDS_DATA = [
  { month: 'Jan', open: 120, resolved: 98, pending: 22 },
  { month: 'Feb', open: 145, resolved: 132, pending: 18 },
  { month: 'Mar', open: 168, resolved: 155, pending: 25 },
  { month: 'Apr', open: 189, resolved: 172, pending: 20 },
  { month: 'May', open: 210, resolved: 195, pending: 28 },
  { month: 'Jun', open: 234, resolved: 218, pending: 16 },
] as const

const RESPONSE_TIME_DATA = [
  { day: 'Mon', avgTime: 3.2, target: 2.5 },
  { day: 'Tue', avgTime: 2.8, target: 2.5 },
  { day: 'Wed', avgTime: 2.4, target: 2.5 },
  { day: 'Thu', avgTime: 2.6, target: 2.5 },
  { day: 'Fri', avgTime: 2.9, target: 2.5 },
  { day: 'Sat', avgTime: 3.1, target: 2.5 },
  { day: 'Sun', avgTime: 2.7, target: 2.5 },
] as const

const TICKET_CATEGORIES = [
  { name: 'Technical', count: 145, color: '#3b82f6' },
  { name: 'Billing', count: 98, color: '#8b5cf6' },
  { name: 'Orders', count: 76, color: '#10b981' },
  { name: 'Shipping', count: 54, color: '#f59e0b' },
  { name: 'Feature Request', count: 32, color: '#ef4444' },
] as const

export default function CustomerSupportPortal() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredTickets = useMemo(() => {
    return TICKETS_DATA.filter(ticket => {
      const matchesSearch = searchQuery === '' || 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = selectedPriority === 'all' || 
        ticket.priority === selectedPriority
      const matchesStatus = selectedStatus === 'all' || 
        ticket.status === selectedStatus
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [searchQuery, selectedPriority, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Headphones className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Support Portal Pro</h1>
                <p className='text-gray-600'>Customer support & ticket management</p>
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
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Support Metrics Overview */}
        <section data-template-section='support-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {SUPPORT_METRICS.map((metric) => (
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
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
                          }`}>
                            {metric.change.startsWith('+') || metric.change.startsWith('-') && metric.status === 'good' ? (
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

        {/* Support Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Ticket Trends */}
          <section data-template-section='ticket-trends' data-chart-type='line' data-metrics='open,resolved,pending'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Ticket Trends</CardTitle>
                    <CardDescription>Monthly ticket status overview</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Resolved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TICKET_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='open' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Open'
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
                      dataKey='pending' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Pending'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Response Time Analytics */}
          <section data-template-section='response-time' data-chart-type='bar' data-metrics='avgTime,target'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Response Time Analytics</CardTitle>
                    <CardDescription>Average response time by day</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={RESPONSE_TIME_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='avgTime' name='Avg Time (hrs)' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='target' name='Target (hrs)' fill='#10b981' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Tickets Browser & Knowledge Base */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Tickets List */}
          <section data-template-section='tickets-browser' data-component-type='ticket-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Support Tickets</CardTitle>
                    <CardDescription>Browse and manage customer tickets</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search tickets...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Priority</SelectItem>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className='w-40 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='open'>Open</SelectItem>
                        <SelectItem value='in-progress'>In Progress</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='resolved'>Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredTickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedTicket === ticket.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedTicket(ticket.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-2'>
                              <h4 className='font-bold text-gray-900'>{ticket.title}</h4>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-2'>
                              <span className='flex items-center'>
                                <User className='w-3 h-3 mr-1' />
                                {ticket.customer}
                              </span>
                              <span className='flex items-center'>
                                <Mail className='w-3 h-3 mr-1' />
                                {ticket.email}
                              </span>
                              <span className='flex items-center'>
                                <Tag className='w-3 h-3 mr-1' />
                                {ticket.category}
                              </span>
                            </div>
                            <div className='flex items-center space-x-4 text-xs text-gray-500'>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                Created {ticket.created}
                              </span>
                              <span className='flex items-center'>
                                <RefreshCw className='w-3 h-3 mr-1' />
                                Updated {ticket.lastUpdate}
                              </span>
                              <span className='flex items-center'>
                                <MessageSquare className='w-3 h-3 mr-1' />
                                {ticket.messages} messages
                              </span>
                            </div>
                          </div>
                        </div>
                        <Separator className='my-3' />
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <Avatar className='w-6 h-6'>
                              <AvatarFallback className='text-xs'>{ticket.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className='text-sm text-gray-600'>Assigned to {ticket.assignedTo}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Send className='w-4 h-4' />
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

          {/* Knowledge Base & Quick Actions */}
          <section data-template-section='knowledge-base' data-component-type='resource-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Knowledge Base</CardTitle>
                <CardDescription>Quick access to support resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { 
                      title: 'Payment Issues', 
                      articles: 24, 
                      icon: AlertCircle,
                      color: 'from-rose-500 to-red-500' 
                    },
                    { 
                      title: 'Account Management', 
                      articles: 18, 
                      icon: User,
                      color: 'from-blue-500 to-cyan-500' 
                    },
                    { 
                      title: 'Technical Support', 
                      articles: 32, 
                      icon: Settings,
                      color: 'from-purple-500 to-pink-500' 
                    },
                    { 
                      title: 'Shipping & Delivery', 
                      articles: 15, 
                      icon: Send,
                      color: 'from-emerald-500 to-teal-500' 
                    },
                  ].map((kb, i) => (
                    <div key={i} className='p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer'>
                      <div className='flex items-center space-x-3'>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${kb.color}`}>
                          <kb.icon className='w-5 h-5 text-white' />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-sm'>{kb.title}</h4>
                          <p className='text-xs text-gray-600'>{kb.articles} articles</p>
                        </div>
                        <BookOpen className='w-4 h-4 text-gray-400' />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className='my-6' />

                <div className='space-y-3'>
                  <h3 className='font-semibold text-sm'>Quick Actions</h3>
                  {[
                    { icon: Plus, label: 'Create Ticket', color: 'from-blue-500 to-cyan-500' },
                    { icon: Users, label: 'Manage Agents', color: 'from-purple-500 to-pink-500' },
                    { icon: BarChart3, label: 'View Reports', color: 'from-emerald-500 to-teal-500' },
                    { icon: Settings, label: 'Settings', color: 'from-amber-500 to-orange-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-blue-300 h-12'
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-4 h-4 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Category Distribution & Team Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Ticket Categories */}
          <section data-template-section='ticket-categories' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Ticket Categories</CardTitle>
                    <CardDescription>Tickets distribution by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={TICKET_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='name' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Ticket Count' radius={[4, 4, 0, 0]}>
                      {TICKET_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Team Performance Stats */}
          <section data-template-section='team-performance' data-component-type='stats-grid'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Team Performance</CardTitle>
                    <CardDescription>Support team metrics and insights</CardDescription>
                  </div>
                  <Button variant='outline' className='border-gray-300'>
                    <Download className='w-4 h-4 mr-2' />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    { 
                      label: 'Top Agent', 
                      value: 'Sarah Chen', 
                      stat: '142 resolved',
                      icon: Star,
                      color: 'from-emerald-500 to-teal-500'
                    },
                    { 
                      label: 'Fastest Response', 
                      value: '1.2 hrs', 
                      stat: 'Mike Johnson',
                      icon: Zap,
                      color: 'from-purple-500 to-pink-500'
                    },
                    { 
                      label: 'Customer Satisfaction', 
                      value: '4.8/5.0', 
                      stat: '+0.3 this week',
                      icon: Star,
                      color: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      label: 'Active Agents', 
                      value: '12/15', 
                      stat: '80% online',
                      icon: Users,
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
                      <div className='font-bold text-lg mb-1'>{stat.value}</div>
                      <div className='text-sm text-gray-600'>{stat.stat}</div>
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