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
  LifeBuoy, MessageCircle, Search, Filter, Plus, Download, 
  CheckCircle2, AlertCircle, Clock, Users, TrendingUp, TrendingDown,
  BarChart3, Star, Activity, Tag, Hash, RefreshCw, Settings,
  Bell, User, Mail, Phone, FileText, XCircle, Eye,
  Send, Paperclip, BookOpen, HelpCircle, Zap, Target
} from 'lucide-react'

// Support portal metrics with TypeScript constants
const PORTAL_METRICS = [
  {
    id: 'active_tickets',
    label: 'Active Tickets',
    value: '384',
    change: '+24',
    status: 'increasing' as const,
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'resolution_time',
    label: 'Avg Resolution Time',
    value: '18',
    unit: 'hrs',
    change: '-22%',
    status: 'good' as const,
    icon: Clock,
    color: 'from-emerald-500 to-teal-500',
    format: 'time'
  },
  {
    id: 'agent_utilization',
    label: 'Agent Utilization',
    value: '87',
    unit: '%',
    change: '+8%',
    status: 'good' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'csat_score',
    label: 'CSAT Score',
    value: '4.6',
    unit: '/5',
    change: '+0.3',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'rating'
  }
] as const

const SUPPORT_TICKETS = [
  {
    id: 'ticket-101',
    title: 'Cannot Reset Password',
    customer: 'Michael Chen',
    email: 'michael.chen@company.com',
    priority: 'high',
    status: 'open',
    category: 'Account',
    created: '1 hour ago',
    lastUpdate: '30 minutes ago',
    messages: 2,
    assignedTo: 'Jessica Parker'
  },
  {
    id: 'ticket-102',
    title: 'Billing Discrepancy',
    customer: 'Sarah Johnson',
    email: 'sarah.j@business.com',
    priority: 'medium',
    status: 'in-progress',
    category: 'Billing',
    created: '3 hours ago',
    lastUpdate: '45 minutes ago',
    messages: 4,
    assignedTo: 'Tom Anderson'
  },
  {
    id: 'ticket-103',
    title: 'API Integration Help',
    customer: 'David Wilson',
    email: 'david.w@tech.com',
    priority: 'low',
    status: 'pending',
    category: 'Technical',
    created: '5 hours ago',
    lastUpdate: '2 hours ago',
    messages: 3,
    assignedTo: 'Rachel Kim'
  },
  {
    id: 'ticket-104',
    title: 'Subscription Upgrade',
    customer: 'Emily Davis',
    email: 'emily.d@startup.io',
    priority: 'medium',
    status: 'resolved',
    category: 'Sales',
    created: '1 day ago',
    lastUpdate: '8 hours ago',
    messages: 6,
    assignedTo: 'Mark Roberts'
  },
  {
    id: 'ticket-105',
    title: 'Data Export Request',
    customer: 'James Brown',
    email: 'james.b@enterprise.com',
    priority: 'high',
    status: 'open',
    category: 'Data',
    created: '2 hours ago',
    lastUpdate: '1 hour ago',
    messages: 5,
    assignedTo: 'Jessica Parker'
  },
  {
    id: 'ticket-106',
    title: 'Feature Request - Mobile App',
    customer: 'Linda Martinez',
    email: 'linda.m@agency.com',
    priority: 'low',
    status: 'pending',
    category: 'Feature Request',
    created: '1 day ago',
    lastUpdate: '12 hours ago',
    messages: 1,
    assignedTo: 'Tom Anderson'
  },
] as const

const TICKET_VOLUME_DATA = [
  { month: 'Jan', created: 145, resolved: 132, pending: 18 },
  { month: 'Feb', created: 168, resolved: 155, pending: 24 },
  { month: 'Mar', created: 189, resolved: 172, pending: 22 },
  { month: 'Apr', created: 210, resolved: 195, pending: 28 },
  { month: 'May', created: 234, resolved: 218, pending: 26 },
  { month: 'Jun', created: 256, resolved: 241, pending: 19 },
] as const

const RESPONSE_METRICS_DATA = [
  { day: 'Mon', firstResponse: 2.8, fullResolution: 18.5 },
  { day: 'Tue', firstResponse: 2.4, fullResolution: 16.2 },
  { day: 'Wed', firstResponse: 2.6, fullResolution: 17.8 },
  { day: 'Thu', firstResponse: 2.2, fullResolution: 15.9 },
  { day: 'Fri', firstResponse: 2.9, fullResolution: 19.3 },
  { day: 'Sat', firstResponse: 3.5, fullResolution: 22.4 },
  { day: 'Sun', firstResponse: 3.2, fullResolution: 20.1 },
] as const

const TICKET_DISTRIBUTION = [
  { name: 'Account', count: 92, color: '#3b82f6' },
  { name: 'Billing', count: 68, color: '#8b5cf6' },
  { name: 'Technical', count: 124, color: '#10b981' },
  { name: 'Sales', count: 45, color: '#f59e0b' },
  { name: 'Data', count: 38, color: '#ef4444' },
  { name: 'Feature Request', count: 17, color: '#06b6d4' },
] as const

export default function CustomerSupportPortalTemplate() {
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
    return SUPPORT_TICKETS.filter(ticket => {
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <LifeBuoy className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Support Portal Enterprise</h1>
                <p className='text-gray-600'>Advanced customer support & ticket management</p>
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
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Portal Metrics Overview */}
        <section data-template-section='portal-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PORTAL_METRICS.map((metric) => (
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
                            {metric.change.startsWith('+') || (metric.change.startsWith('-') && metric.status === 'good') ? (
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
          {/* Ticket Volume Trends */}
          <section data-template-section='ticket-volume' data-chart-type='line' data-metrics='created,resolved,pending'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Ticket Volume Trends</CardTitle>
                    <CardDescription>Monthly ticket creation and resolution</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +22% Resolved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TICKET_VOLUME_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='created' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Created'
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

          {/* Response Metrics */}
          <section data-template-section='response-metrics' data-chart-type='bar' data-metrics='firstResponse,fullResolution'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Response Metrics</CardTitle>
                    <CardDescription>First response & full resolution times</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={RESPONSE_METRICS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='firstResponse' name='First Response (hrs)' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='fullResolution' name='Full Resolution (hrs)' fill='#06b6d4' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Tickets Management & Resources */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Tickets List */}
          <section data-template-section='tickets-management' data-component-type='ticket-list' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Support Tickets</CardTitle>
                    <CardDescription>Manage and track customer support tickets</CardDescription>
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
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer ${
                          selectedTicket === ticket.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''
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
                                <MessageCircle className='w-3 h-3 mr-1' />
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

          {/* Help Resources & Actions */}
          <section data-template-section='help-resources' data-component-type='resource-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Help Resources</CardTitle>
                <CardDescription>Documentation and support tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { 
                      title: 'Getting Started', 
                      articles: 28, 
                      icon: BookOpen,
                      color: 'from-blue-500 to-cyan-500' 
                    },
                    { 
                      title: 'Troubleshooting', 
                      articles: 45, 
                      icon: AlertCircle,
                      color: 'from-rose-500 to-red-500' 
                    },
                    { 
                      title: 'Best Practices', 
                      articles: 22, 
                      icon: Star,
                      color: 'from-purple-500 to-pink-500' 
                    },
                    { 
                      title: 'FAQs', 
                      articles: 67, 
                      icon: HelpCircle,
                      color: 'from-emerald-500 to-teal-500' 
                    },
                  ].map((resource, i) => (
                    <div key={i} className='p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer'>
                      <div className='flex items-center space-x-3'>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${resource.color}`}>
                          <resource.icon className='w-5 h-5 text-white' />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-sm'>{resource.title}</h4>
                          <p className='text-xs text-gray-600'>{resource.articles} articles</p>
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
                    { icon: Plus, label: 'Create Ticket', color: 'from-purple-500 to-pink-500' },
                    { icon: Users, label: 'Team Dashboard', color: 'from-blue-500 to-cyan-500' },
                    { icon: BarChart3, label: 'Analytics', color: 'from-emerald-500 to-teal-500' },
                    { icon: Settings, label: 'Configuration', color: 'from-amber-500 to-orange-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-purple-300 h-12'
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

        {/* Distribution & Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Ticket Distribution */}
          <section data-template-section='ticket-distribution' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Ticket Distribution</CardTitle>
                    <CardDescription>Tickets by category breakdown</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={TICKET_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='name' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Ticket Count' radius={[4, 4, 0, 0]}>
                      {TICKET_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Performance Insights */}
          <section data-template-section='performance-insights' data-component-type='stats-grid'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Performance Insights</CardTitle>
                    <CardDescription>Support team performance metrics</CardDescription>
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
                      label: 'Top Performer', 
                      value: 'Jessica Parker', 
                      stat: '168 resolved tickets',
                      icon: Target,
                      color: 'from-emerald-500 to-teal-500'
                    },
                    { 
                      label: 'Best Response Time', 
                      value: '1.8 hrs', 
                      stat: 'Tom Anderson',
                      icon: Zap,
                      color: 'from-purple-500 to-pink-500'
                    },
                    { 
                      label: 'Customer Satisfaction', 
                      value: '4.7/5.0', 
                      stat: '+0.4 this month',
                      icon: Star,
                      color: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      label: 'Team Availability', 
                      value: '18/20', 
                      stat: '90% online',
                      icon: Users,
                      color: 'from-amber-500 to-orange-500'
                    },
                  ].map((insight, i) => (
                    <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${insight.color}`}>
                          <insight.icon className='w-5 h-5 text-white' />
                        </div>
                        <div className='text-sm text-gray-600'>{insight.label}</div>
                      </div>
                      <div className='font-bold text-lg mb-1'>{insight.value}</div>
                      <div className='text-sm text-gray-600'>{insight.stat}</div>
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