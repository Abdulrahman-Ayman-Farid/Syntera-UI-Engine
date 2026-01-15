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
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Send, Phone, Video, Users, User, Search,
  Filter, Plus, Settings, Bell, MoreVertical, Clock, Check,
  CheckCheck, TrendingUp, TrendingDown, Activity, Hash,
  Star, Pin, Archive, Trash2, Edit, Smile, Paperclip
} from 'lucide-react'

// Messaging metrics with type-safe constants
const MESSAGING_METRICS = [
  {
    id: 'total_messages',
    label: 'Total Messages',
    value: '12,845',
    change: '+842',
    status: 'increasing' as const,
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'active_chats',
    label: 'Active Chats',
    value: '148',
    change: '+12',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'response_time',
    label: 'Avg Response',
    value: '2.4',
    unit: 'min',
    change: '-18%',
    status: 'good' as const,
    icon: Clock,
    color: 'from-emerald-500 to-teal-500',
    format: 'time'
  },
  {
    id: 'online_users',
    label: 'Online Now',
    value: '89',
    change: '+5',
    status: 'stable' as const,
    icon: Activity,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const CHAT_USERS = [
  {
    id: 'user-001',
    name: 'Sarah Wilson',
    avatar: '👩‍💼',
    status: 'online' as const,
    lastMessage: 'Let me check on that...',
    timestamp: '2 min ago',
    unread: 3,
    role: 'Team Lead'
  },
  {
    id: 'user-002',
    name: 'Michael Chen',
    avatar: '👨‍💻',
    status: 'online' as const,
    lastMessage: 'Sounds good! 👍',
    timestamp: '15 min ago',
    unread: 0,
    role: 'Developer'
  },
  {
    id: 'user-003',
    name: 'Emma Davis',
    avatar: '👩‍🎨',
    status: 'away' as const,
    lastMessage: 'I sent the designs',
    timestamp: '1 hour ago',
    unread: 1,
    role: 'Designer'
  },
  {
    id: 'user-004',
    name: 'James Rodriguez',
    avatar: '👨‍🔧',
    status: 'offline' as const,
    lastMessage: 'Will do tomorrow',
    timestamp: '3 hours ago',
    unread: 0,
    role: 'Engineer'
  },
  {
    id: 'user-005',
    name: 'Lisa Anderson',
    avatar: '👩‍💼',
    status: 'online' as const,
    lastMessage: 'Thanks for the update!',
    timestamp: '5 hours ago',
    unread: 2,
    role: 'Manager'
  },
] as const

const MESSAGES = [
  {
    id: 'msg-001',
    senderId: 'user-001',
    content: 'Hey team! How is the project coming along?',
    timestamp: '10:30 AM',
    type: 'text' as const,
    status: 'read' as const
  },
  {
    id: 'msg-002',
    senderId: 'user-002',
    content: 'Great progress! We are ahead of schedule.',
    timestamp: '10:32 AM',
    type: 'text' as const,
    status: 'read' as const
  },
  {
    id: 'msg-003',
    senderId: 'me',
    content: 'Excellent work everyone! 🎉',
    timestamp: '10:35 AM',
    type: 'text' as const,
    status: 'delivered' as const
  },
] as const

const MESSAGE_ACTIVITY_DATA = [
  { day: 'Mon', sent: 420, received: 380, activeUsers: 45 },
  { day: 'Tue', sent: 580, received: 520, activeUsers: 52 },
  { day: 'Wed', sent: 720, received: 650, activeUsers: 68 },
  { day: 'Thu', sent: 890, received: 820, activeUsers: 75 },
  { day: 'Fri', sent: 950, received: 880, activeUsers: 82 },
  { day: 'Sat', sent: 420, received: 390, activeUsers: 38 },
  { day: 'Sun', sent: 380, received: 350, activeUsers: 32 },
] as const

export default function PremiumMessagingApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('chats')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'away': return 'bg-amber-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const filteredUsers = useMemo(() => {
    return CHAT_USERS.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg'>
                <MessageCircle className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>TeamChat Pro</h1>
                <p className='text-gray-600'>Enterprise messaging platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Messaging Metrics */}
        <section data-template-section='messaging-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {MESSAGING_METRICS.map((metric) => (
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

        {/* Message Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Activity Chart */}
          <section data-template-section='message-activity' data-chart-type='line' data-metrics='sent,received'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Message Activity</CardTitle>
                    <CardDescription>Daily message trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +24% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MESSAGE_ACTIVITY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='sent' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Sent Messages'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='received' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Received Messages'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* User Activity Chart */}
          <section data-template-section='user-activity' data-chart-type='bar' data-metrics='activeUsers'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Users</CardTitle>
                    <CardDescription>Daily active user count</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <Users className='w-3 h-3 mr-1' />
                    89 Online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={MESSAGE_ACTIVITY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar 
                      dataKey='activeUsers' 
                      name='Active Users'
                      fill='#8b5cf6'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Chat Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* User List */}
          <section data-template-section='chat-list' data-component-type='user-list'>
            <Card className='border border-gray-200 shadow-sm h-[600px] flex flex-col'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>Conversations</CardTitle>
                  <Button variant='ghost' size='icon'>
                    <Filter className='w-4 h-4' />
                  </Button>
                </div>
                <div className='flex items-center space-x-2 mt-4'>
                  <Input
                    placeholder='Search conversations...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='flex-1 border-gray-300'
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className='w-32 border-gray-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='online'>Online</SelectItem>
                      <SelectItem value='away'>Away</SelectItem>
                      <SelectItem value='offline'>Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className='flex-1 overflow-hidden p-0'>
                <ScrollArea className='h-full px-6'>
                  <div className='space-y-2 py-4'>
                    <AnimatePresence>
                      {filteredUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                            selectedChat === user.id 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-white border-gray-200 hover:border-blue-200'
                          }`}
                          onClick={() => setSelectedChat(user.id)}
                        >
                          <div className='flex items-start space-x-3'>
                            <div className='relative'>
                              <div className='text-3xl'>{user.avatar}</div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between mb-1'>
                                <h4 className='font-semibold text-sm truncate'>{user.name}</h4>
                                <span className='text-xs text-gray-500'>{user.timestamp}</span>
                              </div>
                              <p className='text-xs text-gray-500 mb-1'>{user.role}</p>
                              <p className='text-sm text-gray-600 truncate'>{user.lastMessage}</p>
                            </div>
                            {user.unread > 0 && (
                              <Badge className='bg-blue-600 text-white'>{user.unread}</Badge>
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

          {/* Chat Window */}
          <section data-template-section='chat-window' data-component-type='message-thread' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm h-[600px] flex flex-col'>
              {selectedChat ? (
                <>
                  <CardHeader className='border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='text-3xl'>
                          {CHAT_USERS.find(u => u.id === selectedChat)?.avatar}
                        </div>
                        <div>
                          <h3 className='font-semibold'>
                            {CHAT_USERS.find(u => u.id === selectedChat)?.name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {CHAT_USERS.find(u => u.id === selectedChat)?.role}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Button variant='ghost' size='icon'>
                          <Phone className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon'>
                          <Video className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-1 overflow-hidden p-6'>
                    <ScrollArea className='h-full'>
                      <div className='space-y-4'>
                        {MESSAGES.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] rounded-xl p-4 ${
                              message.senderId === 'me'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className='text-sm'>{message.content}</p>
                              <div className='flex items-center justify-between mt-2'>
                                <span className='text-xs opacity-70'>{message.timestamp}</span>
                                {message.senderId === 'me' && (
                                  <span className='text-xs'>
                                    {message.status === 'read' ? (
                                      <CheckCheck className='w-4 h-4' />
                                    ) : (
                                      <Check className='w-4 h-4' />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <div className='border-t border-gray-200 p-4'>
                    <div className='flex items-center space-x-2'>
                      <Button variant='ghost' size='icon'>
                        <Paperclip className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' size='icon'>
                        <Smile className='w-4 h-4' />
                      </Button>
                      <Input
                        placeholder='Type a message...'
                        className='flex-1 border-gray-300'
                      />
                      <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                        <Send className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center'>
                    <MessageCircle className='w-16 h-16 mx-auto text-gray-400 mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Select a conversation
                    </h3>
                    <p className='text-gray-600'>
                      Choose a chat from the list to start messaging
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