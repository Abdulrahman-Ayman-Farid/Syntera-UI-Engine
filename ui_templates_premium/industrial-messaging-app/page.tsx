'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Send, Phone, Video, Users, User, Search,
  Filter, Plus, Settings, Bell, MoreHorizontal, Clock, Check,
  CheckCheck, TrendingUp, TrendingDown, Activity, AlertCircle,
  Shield, Lock, Zap, Database, Server, Cpu, HardDrive
} from 'lucide-react'

// Industrial messaging metrics with type-safe constants
const INDUSTRIAL_METRICS = [
  {
    id: 'system_messages',
    label: 'System Messages',
    value: '8,456',
    change: '+324',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'from-red-600 to-orange-600',
    format: 'count'
  },
  {
    id: 'active_workers',
    label: 'Active Workers',
    value: '142',
    change: '+8',
    status: 'stable' as const,
    icon: Users,
    color: 'from-amber-600 to-yellow-600',
    format: 'count'
  },
  {
    id: 'uptime',
    label: 'System Uptime',
    value: '99.8',
    unit: '%',
    change: '+0.2%',
    status: 'good' as const,
    icon: Activity,
    color: 'from-emerald-600 to-green-600',
    format: 'percent'
  },
  {
    id: 'response_time',
    label: 'Response Time',
    value: '1.8',
    unit: 's',
    change: '-0.3s',
    status: 'good' as const,
    icon: Zap,
    color: 'from-blue-600 to-cyan-600',
    format: 'time'
  }
] as const

const WORKER_CHANNELS = [
  {
    id: 'channel-001',
    name: 'Production Floor A',
    avatar: '🏭',
    status: 'active' as const,
    lastMessage: 'Machine #3 maintenance completed',
    timestamp: '2 min ago',
    unread: 4,
    workers: 24,
    department: 'Manufacturing'
  },
  {
    id: 'channel-002',
    name: 'Quality Control',
    avatar: '🔍',
    status: 'active' as const,
    lastMessage: 'Batch QA-2401 approved',
    timestamp: '15 min ago',
    unread: 0,
    workers: 12,
    department: 'Quality'
  },
  {
    id: 'channel-003',
    name: 'Maintenance Team',
    avatar: '🔧',
    status: 'warning' as const,
    lastMessage: 'Urgent: Conveyor belt issue',
    timestamp: '30 min ago',
    unread: 8,
    workers: 18,
    department: 'Maintenance'
  },
  {
    id: 'channel-004',
    name: 'Safety & Compliance',
    avatar: '🛡️',
    status: 'active' as const,
    lastMessage: 'Daily safety briefing complete',
    timestamp: '1 hour ago',
    unread: 0,
    workers: 8,
    department: 'Safety'
  },
  {
    id: 'channel-005',
    name: 'Logistics & Shipping',
    avatar: '📦',
    status: 'active' as const,
    lastMessage: 'Shipment #8842 dispatched',
    timestamp: '2 hours ago',
    unread: 2,
    workers: 16,
    department: 'Logistics'
  },
] as const

const CHANNEL_MESSAGES = [
  {
    id: 'msg-001',
    senderId: 'worker-042',
    senderName: 'John Martinez',
    content: 'Machine #3 scheduled maintenance is complete. All systems operational.',
    timestamp: '14:30',
    type: 'status' as const,
    priority: 'normal' as const
  },
  {
    id: 'msg-002',
    senderId: 'supervisor-12',
    senderName: 'Sarah Johnson',
    content: 'Great work! Please update the maintenance log.',
    timestamp: '14:32',
    type: 'response' as const,
    priority: 'normal' as const
  },
  {
    id: 'msg-003',
    senderId: 'me',
    senderName: 'System Admin',
    content: 'Log updated. Next scheduled maintenance in 2 weeks.',
    timestamp: '14:35',
    type: 'system' as const,
    priority: 'normal' as const
  },
] as const

const MESSAGE_FLOW_DATA = [
  { hour: '08:00', sent: 45, received: 38, alerts: 2 },
  { hour: '10:00', sent: 62, received: 58, alerts: 1 },
  { hour: '12:00', sent: 78, received: 72, alerts: 3 },
  { hour: '14:00', sent: 95, received: 88, alerts: 2 },
  { hour: '16:00', sent: 88, received: 82, alerts: 1 },
  { hour: '18:00', sent: 54, received: 48, alerts: 0 },
] as const

const DEPARTMENT_ACTIVITY = [
  { dept: 'Mfg', messages: 245, color: '#B8322F' },
  { dept: 'QC', messages: 142, color: '#D29922' },
  { dept: 'Maint', messages: 186, color: '#EAEAEA' },
  { dept: 'Safety', messages: 98, color: '#10b981' },
  { dept: 'Log', messages: 124, color: '#3b82f6' },
] as const

export default function IndustrialMessagingApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [activeTab, setActiveTab] = useState('channels')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500'
      case 'warning': return 'bg-amber-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-amber-500 bg-amber-50'
      case 'normal': return 'border-gray-300 bg-white'
      default: return 'border-gray-300 bg-white'
    }
  }

  const filteredChannels = useMemo(() => {
    return WORKER_CHANNELS.filter(channel => {
      const matchesSearch = searchQuery === '' || 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.department.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = filterDepartment === 'all' || 
        channel.department.toLowerCase() === filterDepartment.toLowerCase()
      return matchesSearch && matchesDepartment
    })
  }, [searchQuery, filterDepartment])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg'>
                <MessageSquare className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>IndustrialComm</h1>
                <p className='text-gray-400'>Manufacturing communication hub</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge variant='outline' className='border-emerald-500 text-emerald-400'>
                <Activity className='w-3 h-3 mr-1' />
                All Systems Operational
              </Badge>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-700 bg-gray-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700'>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='shift'>This Shift</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Alert
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Industrial Metrics */}
        <section data-template-section='industrial-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {INDUSTRIAL_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md transition-all'>
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
                            {metric.change.startsWith('+') || metric.change.startsWith('-') ? (
                              metric.change.startsWith('+') ? (
                                <TrendingUp className='w-4 h-4 mr-1' />
                              ) : (
                                <TrendingDown className='w-4 h-4 mr-1' />
                              )
                            ) : null}
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
          {/* Message Flow */}
          <section data-template-section='message-flow' data-chart-type='line' data-metrics='sent,received,alerts'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Message Flow</CardTitle>
                    <CardDescription className='text-gray-400'>Hourly communication traffic</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-red-600 text-red-400'>
                    <Clock className='w-3 h-3 mr-1' />
                    Real-time
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MESSAGE_FLOW_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='hour' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='sent' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Sent'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='received' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Received'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='alerts' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Alerts'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Department Activity */}
          <section data-template-section='dept-activity' data-chart-type='bar' data-metrics='messages'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Department Activity</CardTitle>
                    <CardDescription className='text-gray-400'>Messages by department</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-600 text-amber-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12% Today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={DEPARTMENT_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='dept' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Legend />
                    <Bar 
                      dataKey='messages' 
                      name='Messages'
                      radius={[4, 4, 0, 0]}
                    >
                      {DEPARTMENT_ACTIVITY.map((entry, index) => (
                        <motion.rect 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Communication Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Channels List */}
          <section data-template-section='channels-list' data-component-type='channel-sidebar'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm h-[600px] flex flex-col'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Communication Channels</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-4'>
                  <TabsList className='grid w-full grid-cols-2 bg-gray-700/50'>
                    <TabsTrigger value='channels' className='data-[state=active]:bg-red-600'>Channels</TabsTrigger>
                    <TabsTrigger value='alerts' className='data-[state=active]:bg-red-600'>Alerts</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className='flex items-center space-x-2 mt-4'>
                  <Input
                    placeholder='Search channels...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='flex-1 border-gray-700 bg-gray-900 text-white'
                  />
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className='w-32 border-gray-700 bg-gray-900 text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='all'>All Depts</SelectItem>
                      <SelectItem value='manufacturing'>Mfg</SelectItem>
                      <SelectItem value='quality'>Quality</SelectItem>
                      <SelectItem value='maintenance'>Maint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className='flex-1 overflow-hidden p-0'>
                <ScrollArea className='h-full px-6'>
                  <div className='space-y-2 py-4'>
                    <AnimatePresence>
                      {filteredChannels.map((channel) => (
                        <motion.div
                          key={channel.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                            selectedChannel === channel.id 
                              ? 'bg-red-900/30 border-red-600' 
                              : 'bg-gray-900/50 border-gray-700 hover:border-red-600'
                          }`}
                          onClick={() => setSelectedChannel(channel.id)}
                        >
                          <div className='flex items-start space-x-3'>
                            <div className='relative'>
                              <div className='text-3xl'>{channel.avatar}</div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${getStatusColor(channel.status)}`} />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between mb-1'>
                                <h4 className='font-semibold text-sm truncate text-white'>{channel.name}</h4>
                                <span className='text-xs text-gray-400'>{channel.timestamp}</span>
                              </div>
                              <p className='text-xs text-gray-500 mb-1'>{channel.workers} workers · {channel.department}</p>
                              <p className='text-sm text-gray-300 truncate'>{channel.lastMessage}</p>
                            </div>
                            {channel.unread > 0 && (
                              <Badge className='bg-red-600 text-white'>{channel.unread}</Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          {/* Channel Messages */}
          <section data-template-section='channel-messages' data-component-type='message-thread' className='lg:col-span-2'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm h-[600px] flex flex-col'>
              {selectedChannel ? (
                <>
                  <CardHeader className='border-b border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='text-3xl'>
                          {WORKER_CHANNELS.find(c => c.id === selectedChannel)?.avatar}
                        </div>
                        <div>
                          <h3 className='font-semibold text-white'>
                            {WORKER_CHANNELS.find(c => c.id === selectedChannel)?.name}
                          </h3>
                          <p className='text-sm text-gray-400'>
                            {WORKER_CHANNELS.find(c => c.id === selectedChannel)?.workers} workers
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                          <Phone className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                          <AlertCircle className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                          <Settings className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                          <MoreHorizontal className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-1 overflow-hidden p-6'>
                    <ScrollArea className='h-full'>
                      <div className='space-y-4'>
                        {CHANNEL_MESSAGES.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] rounded-xl p-4 border ${
                              message.senderId === 'me'
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-transparent'
                                : message.type === 'system'
                                ? 'bg-blue-900/30 text-blue-200 border-blue-700'
                                : 'bg-gray-900 text-gray-100 border-gray-700'
                            }`}>
                              {message.senderId !== 'me' && (
                                <p className='text-xs font-semibold mb-1 opacity-70'>{message.senderName}</p>
                              )}
                              <p className='text-sm'>{message.content}</p>
                              <div className='flex items-center justify-between mt-2'>
                                <span className='text-xs opacity-70'>{message.timestamp}</span>
                                {message.senderId === 'me' && (
                                  <CheckCheck className='w-4 h-4' />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className='border-t border-gray-700 p-4'>
                    <div className='flex items-center space-x-2 w-full'>
                      <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                        <Plus className='w-4 h-4' />
                      </Button>
                      <Input
                        placeholder='Type your message...'
                        className='flex-1 border-gray-700 bg-gray-900 text-white'
                      />
                      <Button className='bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'>
                        <Send className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center'>
                    <MessageSquare className='w-16 h-16 mx-auto text-gray-600 mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      No channel selected
                    </h3>
                    <p className='text-gray-400'>
                      Choose a channel from the list to view messages
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      const mockData = [
        { id: 1, sender: 'Alice', content: 'Hello Bob!', timestamp: '10:00 AM' },
        { id: 2, sender: 'Bob', content: 'Hi Alice!', timestamp: '10:01 AM' },
        { id: 3, sender: 'Alice', content: 'How are you?', timestamp: '10:02 AM' },
        { id: 4, sender: 'Bob', content: 'Doing great! And you?', timestamp: '10:03 AM' },
      ]
      setMessages(mockData)
      setFilteredMessages(mockData)
      setIsLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    // Filter messages based on search query
    if (!searchQuery) {
      setFilteredMessages(messages)
    } else {
      const filtered = messages.filter((msg) =>
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMessages(filtered)
    }
  }, [searchQuery, messages])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulate sending message
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessages([...messages, { id: Date.now(), sender: 'Alice', content: values.message, timestamp: new Date().toLocaleTimeString() }])
      form.reset()
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-[#1F2937] text-white min-h-screen flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl z-50'>
        <div className='flex items-center gap-4'>
          <button onClick={() => router.back()} className='p-2 rounded-full hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <ChevronRight className='w-5 h-5 transform rotate-180' aria-hidden='true' />
          </button>
          <span className='font-semibold'>Messaging</span>
        </div>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <Search className='w-5 h-5' aria-hidden='true' />
            <span className='sr-only'>Search Messages</span>
          </Button>
          <DialogTrigger asChild>
            <Button variant='ghost' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
              <Bell className='w-5 h-5' aria-hidden='true' />
              <span className='sr-only'>Notifications</span>
            </Button>
          </DialogTrigger>
          <Button variant='ghost' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <Settings className='w-5 h-5' aria-hidden='true' />
            <span className='sr-only'>Settings</span>
          </Button>
        </div>
      </header>
      <main className='flex flex-1 overflow-y-auto'>
        <aside className='hidden md:flex flex-col w-64 bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl p-6 space-y-4'>
          <Input placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='border-b border-b-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500' />
          <Tabs defaultValue='chats'>
            <TabsList className='space-x-2'>
              <TabsTrigger value='chats'>Chats</TabsTrigger>
              <TabsTrigger value='groups'>Groups</TabsTrigger>
            </TabsList>
            <TabsContent value='chats'>
              <ul className='mt-4'>
                {[...Array(5)].map((_, i) => (
                  <li key={i} className='flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                    <Avatar>
                      <AvatarImage src={`https://example.com/user${i + 1}.jpg`} alt={`User ${i + 1}`} />
                      <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                    </Avatar>
                    <span>User {i + 1}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value='groups'>
              <ul className='mt-4'>
                {[...Array(3)].map((_, i) => (
                  <li key={i} className='flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                    <Avatar>
                      <AvatarImage src={`https://example.com/group${i + 1}.jpg`} alt={`Group ${i + 1}`} />
                      <AvatarFallback>{`G${i + 1}`}</AvatarFallback>
                    </Avatar>
                    <span>Group {i + 1}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </aside>
        <section className='flex-1 p-6'>
          <div className='mb-4'>
            <Input
              placeholder='Search messages...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full border-b border-b-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            />
          </div>
          <div className='space-y-4'>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-20 rounded-lg' />
              ))
            ) : isError ? (
              <p>Error loading messages.</p>
            ) : filteredMessages.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              filteredMessages.map((msg) => (
                <Card key={msg.id} className='bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-lg p-4'>
                  <CardHeader>
                    <CardTitle className='text-lg font-semibold'>{msg.sender}</CardTitle>
                  </CardHeader>
                  <CardContent className='py-2'>
                    <p>{msg.content}</p>
                  </CardContent>
                  <CardFooter className='text-right text-xs'>
                    {msg.timestamp}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          <Form {...form} onSubmit={onSubmit} className='mt-6'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex items-center gap-2'>
                  <FormControl>
                    <Input
                      placeholder='Type your message here...'
                      className='flex-1 border-b border-b-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                      {...field}
                    />
                  </FormControl>
                  <Button disabled={isLoading} className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                    Send
                  </Button>
                </FormItem>
              )}
            />
          </Form>
        </section>
      </main>
      <footer className='flex items-center justify-center px-6 py-4 bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl'>
        <span className='text-sm'>© 2023 Industrial Messaging Inc.</span>
      </footer>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-lg p-6'>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Stay up-to-date with the latest notifications.
          </DialogDescription>
          <div className='mt-4 space-y-4'>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className='bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-lg p-4'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>New Message</CardTitle>
                </CardHeader>
                <CardContent className='py-2'>
                  <p>You have a new message from User {i + 1}</p>
                </CardContent>
                <CardFooter className='text-right text-xs'>
                  Just now
                </CardFooter>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant='default' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
              Mark All as Read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}