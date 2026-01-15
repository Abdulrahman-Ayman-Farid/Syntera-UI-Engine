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
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Send, Phone, Video, Users, User, Search,
  Filter, Plus, Settings, Bell, MoreVertical, Clock, Check,
  CheckCheck, TrendingUp, Star, Pin, Archive, Image as ImageIcon,
  Smile, Paperclip, Mic, AtSign, Hash, Calendar, MapPin
} from 'lucide-react'

// Type-safe messaging metrics
const MESSAGING_STATS = [
  {
    id: 'conversations',
    label: 'Active Conversations',
    value: '246',
    change: '+28',
    status: 'increasing' as const,
    icon: MessageCircle,
    color: 'from-emerald-400 to-teal-500',
    format: 'count'
  },
  {
    id: 'team_members',
    label: 'Team Members',
    value: '89',
    change: '+5',
    status: 'stable' as const,
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
    format: 'count'
  },
  {
    id: 'response_rate',
    label: 'Response Rate',
    value: '94',
    unit: '%',
    change: '+2%',
    status: 'good' as const,
    icon: TrendingUp,
    color: 'from-purple-400 to-pink-500',
    format: 'percent'
  },
  {
    id: 'avg_time',
    label: 'Avg Response Time',
    value: '3.2',
    unit: 'min',
    change: '-12%',
    status: 'good' as const,
    icon: Clock,
    color: 'from-amber-400 to-orange-500',
    format: 'time'
  }
] as const

const CONTACTS = [
  {
    id: 'contact-001',
    name: 'Alexandra Reed',
    avatar: '👩‍💼',
    status: 'online' as const,
    lastMessage: 'Can we discuss the new project?',
    timestamp: 'Just now',
    unread: 2,
    role: 'Product Manager',
    department: 'Product'
  },
  {
    id: 'contact-002',
    name: 'Marcus Johnson',
    avatar: '👨‍💻',
    status: 'online' as const,
    lastMessage: 'I sent the API documentation',
    timestamp: '5 min ago',
    unread: 0,
    role: 'Senior Developer',
    department: 'Engineering'
  },
  {
    id: 'contact-003',
    name: 'Sophie Turner',
    avatar: '👩‍🎨',
    status: 'away' as const,
    lastMessage: 'Updated the design mockups',
    timestamp: '1 hour ago',
    unread: 1,
    role: 'Lead Designer',
    department: 'Design'
  },
  {
    id: 'contact-004',
    name: 'Daniel Kim',
    avatar: '👨‍🔬',
    status: 'offline' as const,
    lastMessage: 'See you at the meeting tomorrow',
    timestamp: '2 hours ago',
    unread: 0,
    role: 'Data Scientist',
    department: 'Analytics'
  },
  {
    id: 'contact-005',
    name: 'Emily Watson',
    avatar: '👩‍💼',
    status: 'online' as const,
    lastMessage: 'Great work on the presentation!',
    timestamp: '3 hours ago',
    unread: 3,
    role: 'Marketing Director',
    department: 'Marketing'
  },
  {
    id: 'contact-006',
    name: 'Ryan Patel',
    avatar: '👨‍🏫',
    status: 'away' as const,
    lastMessage: 'Let me know when you are available',
    timestamp: '5 hours ago',
    unread: 0,
    role: 'Team Lead',
    department: 'Operations'
  },
] as const

const CONVERSATION_MESSAGES = [
  {
    id: 'msg-001',
    senderId: 'contact-001',
    content: 'Hey! I wanted to discuss the timeline for the new feature launch.',
    timestamp: '10:30 AM',
    type: 'text' as const,
    status: 'read' as const
  },
  {
    id: 'msg-002',
    senderId: 'me',
    content: 'Sure! I think we can have it ready by next week. What do you think?',
    timestamp: '10:32 AM',
    type: 'text' as const,
    status: 'read' as const
  },
  {
    id: 'msg-003',
    senderId: 'contact-001',
    content: 'That sounds perfect! Can we schedule a meeting to go over the details?',
    timestamp: '10:35 AM',
    type: 'text' as const,
    status: 'read' as const
  },
  {
    id: 'msg-004',
    senderId: 'me',
    content: 'Absolutely! How about tomorrow at 2 PM? 📅',
    timestamp: '10:36 AM',
    type: 'text' as const,
    status: 'delivered' as const
  },
] as const

const MESSAGE_TYPES_DATA = [
  { name: 'Text', value: 1245, color: '#10b981' },
  { name: 'Images', value: 428, color: '#3b82f6' },
  { name: 'Files', value: 215, color: '#8b5cf6' },
  { name: 'Voice', value: 142, color: '#f59e0b' },
] as const

const WEEKLY_ACTIVITY = [
  { day: 'Mon', messages: 145, calls: 12 },
  { day: 'Tue', messages: 189, calls: 18 },
  { day: 'Wed', messages: 234, calls: 22 },
  { day: 'Thu', messages: 278, calls: 28 },
  { day: 'Fri', messages: 312, calls: 35 },
  { day: 'Sat', messages: 98, calls: 8 },
  { day: 'Sun', messages: 75, calls: 5 },
] as const

export default function PremiumMessagingAppInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-400'
      case 'away': return 'bg-amber-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const filteredContacts = useMemo(() => {
    return CONTACTS.filter(contact => {
      const matchesSearch = searchQuery === '' || 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = filterDepartment === 'all' || 
        contact.department.toLowerCase() === filterDepartment.toLowerCase()
      return matchesSearch && matchesDepartment
    })
  }, [searchQuery, filterDepartment])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/20'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg'>
                <MessageCircle className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>CollabChat</h1>
                <p className='text-gray-600'>Modern team collaboration</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='icon'>
                <Bell className='w-5 h-5' />
              </Button>
              <Button variant='ghost' size='icon'>
                <Settings className='w-5 h-5' />
              </Button>
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
              <Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Message
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Messaging Stats */}
        <section data-template-section='messaging-stats' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {MESSAGING_STATS.map((stat) => (
                <motion.div
                  key={stat.id}
                  layoutId={`stat-${stat.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{stat.value}</span>
                            {stat.unit && (
                              <span className='text-gray-500'>{stat.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            stat.status === 'good' || stat.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
                          }`}>
                            {stat.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                          <stat.icon className='w-6 h-6 text-white' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Message Types Distribution */}
          <section data-template-section='message-types' data-chart-type='pie' data-metrics='types'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Message Types</CardTitle>
                    <CardDescription>Distribution by content type</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    2,030 Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={MESSAGE_TYPES_DATA}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {MESSAGE_TYPES_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Weekly Activity */}
          <section data-template-section='weekly-activity' data-chart-type='bar' data-metrics='messages,calls'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Weekly Activity</CardTitle>
                    <CardDescription>Messages and calls this week</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={WEEKLY_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='messages' name='Messages' fill='#10b981' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='calls' name='Calls' fill='#3b82f6' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Main Chat Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Contacts Sidebar */}
          <section data-template-section='contacts-list' data-component-type='contact-sidebar'>
            <Card className='border border-gray-200 shadow-sm h-[650px] flex flex-col'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Messages</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-4'>
                  <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='all'>All</TabsTrigger>
                    <TabsTrigger value='unread'>Unread</TabsTrigger>
                    <TabsTrigger value='groups'>Groups</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className='flex items-center space-x-2 mt-4'>
                  <Input
                    placeholder='Search contacts...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='flex-1 border-gray-300'
                  />
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className='w-32 border-gray-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Depts</SelectItem>
                      <SelectItem value='product'>Product</SelectItem>
                      <SelectItem value='engineering'>Engineering</SelectItem>
                      <SelectItem value='design'>Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className='flex-1 overflow-hidden p-0'>
                <ScrollArea className='h-full px-6'>
                  <div className='space-y-2 py-4'>
                    <AnimatePresence>
                      {filteredContacts.map((contact) => (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                            selectedContact === contact.id 
                              ? 'bg-emerald-50 border-emerald-200' 
                              : 'bg-white border-gray-200 hover:border-emerald-200'
                          }`}
                          onClick={() => setSelectedContact(contact.id)}
                        >
                          <div className='flex items-start space-x-3'>
                            <div className='relative'>
                              <div className='text-3xl'>{contact.avatar}</div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between mb-1'>
                                <h4 className='font-semibold text-sm truncate'>{contact.name}</h4>
                                <span className='text-xs text-gray-500'>{contact.timestamp}</span>
                              </div>
                              <p className='text-xs text-gray-500 mb-1'>{contact.role}</p>
                              <p className='text-sm text-gray-600 truncate'>{contact.lastMessage}</p>
                            </div>
                            {contact.unread > 0 && (
                              <Badge className='bg-emerald-600 text-white'>{contact.unread}</Badge>
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

          {/* Chat Area */}
          <section data-template-section='chat-area' data-component-type='message-display' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm h-[650px] flex flex-col'>
              {selectedContact ? (
                <>
                  <CardHeader className='border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='text-3xl'>
                          {CONTACTS.find(c => c.id === selectedContact)?.avatar}
                        </div>
                        <div>
                          <h3 className='font-semibold'>
                            {CONTACTS.find(c => c.id === selectedContact)?.name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {CONTACTS.find(c => c.id === selectedContact)?.role}
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
                          <Star className='w-4 h-4' />
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
                        {CONVERSATION_MESSAGES.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] rounded-xl p-4 ${
                              message.senderId === 'me'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
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
                        <ImageIcon className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' size='icon'>
                        <Smile className='w-4 h-4' />
                      </Button>
                      <Input
                        placeholder='Type your message...'
                        className='flex-1 border-gray-300'
                      />
                      <Button variant='ghost' size='icon'>
                        <Mic className='w-4 h-4' />
                      </Button>
                      <Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'>
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
                      No conversation selected
                    </h3>
                    <p className='text-gray-600'>
                      Choose a contact from the list to start messaging
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as DialogRadix from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, MessageCircle, User, Users, Settings, Check, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
}

const usersData: User[] = [
  { id: 1, name: 'John Doe', avatarUrl: 'https://via.placeholder.com/150', lastMessage: 'Hey there!', timestamp: '10:30 AM' },
  { id: 2, name: 'Jane Smith', avatarUrl: 'https://via.placeholder.com/150', lastMessage: 'How are you?', timestamp: 'Yesterday' },
  // More users...
];

const MessagingAppPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(usersData);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
      if (Math.random() < 0.1) {
        setIsError(true);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = usersData.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Navigate to chat page
    router.push(`/chat/${user.id}`);
  };

  return (
    <div className='bg-gradient-to-br from-primary to-secondary min-h-screen text-text flex'>
      <aside className='hidden sm:flex w-1/4 flex-col py-6 px-4 bg-background shadow-md relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Messages</h1>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon'>
              <Settings className='h-4 w-4' aria-hidden='true' />
              <span className='sr-only'>Settings</span>
            </Button>
          </DialogTrigger>
        </div>
        <form className='mb-4'>
          <Label htmlFor='search' className='sr-only'>Search</Label>
          <Input
            id='search'
            placeholder='Search chats...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-9 pr-2'
          />
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none' />
        </form>
        <Separator className='my-2' />
        <ul className='space-y-2'>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className='animate-pulse'>
                <div className='flex items-center space-x-2'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <Skeleton className='h-4 w-1/2 rounded' />
                </div>
              </li>
            ))
          ) : isError ? (
            <div className='flex items-center space-x-2 text-destructive'>
              <AlertTriangle className='h-4 w-4' aria-hidden='true' />
              <p>Failed to load chats.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p>No results found.</p>
          ) : (
            filteredUsers.map(user => (
              <li key={user.id} onClick={() => handleUserClick(user)} className='cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg p-2 transition-colors'>
                <div className='flex items-center space-x-2'>
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>{user.name}</p>
                    <p className='text-xs opacity-75'>{user.lastMessage}</p>
                  </div>
                  <p className='ml-auto text-xs opacity-50'>{user.timestamp}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>
      <main className='w-full flex flex-col px-6 py-8 overflow-y-scroll'>
        {!selectedUser && (
          <div className='flex flex-col items-center justify-center h-full'>
            <MessageCircle className='h-12 w-12 mb-2 text-muted-foreground' />
            <p className='text-lg'>Select a chat to start messaging</p>
          </div>
        )}
        {selectedUser && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>{selectedUser.name}</p>
                  <p className='text-sm opacity-75'>Online</p>
                </div>
              </div>
              <div className='flex space-x-2'>
                <Button variant='ghost' size='icon'>
                  <Filter className='h-4 w-4' aria-hidden='true' />
                  <span className='sr-only'>Filter</span>
                </Button>
                <DialogTrigger asChild>
                  <Button variant='default'>New Message</Button>
                </DialogTrigger>
              </div>
            </div>
            <div className='flex flex-col-reverse space-y-2 space-y-reverse'>
              {/* Chat messages */}
              {[1, 2, 3].map(id => (
                <div key={id} className={`flex ${id % 2 === 0 ? 'justify-end' : ''}`}>{
                  id % 2 === 0 ? (
                    <div className='max-w-[40%] rounded-lg bg-background p-4 shadow-md mr-2'>
                      <p>Hello!</p>
                      <p className='mt-1 text-right text-xs opacity-50'>10:30 AM</p>
                    </div>
                  ) : (
                    <div className='max-w-[40%] rounded-lg bg-accent p-4 shadow-md ml-2'>
                      <p>Hi there!</p>
                      <p className='mt-1 text-right text-xs opacity-50'>10:31 AM</p>
                    </div>
                  )}
                </div>
              ))}
              {/* Shimmer loading effect */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : ''}`}>{
                  index % 2 === 0 ? (
                    <div className='max-w-[40%] animate-pulse rounded-lg bg-background p-4 shadow-md mr-2'>
                      <Skeleton className='h-4 w-full mb-2' />
                      <Skeleton className='h-4 w-3/4' />
                    </div>
                  ) : (
                    <div className='max-w-[40%] animate-pulse rounded-lg bg-accent p-4 shadow-md ml-2'>
                      <Skeleton className='h-4 w-full mb-2' />
                      <Skeleton className='h-4 w-3/4' />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='border-t border-muted-foreground pt-4'>
              <form onSubmit={(e) => e.preventDefault()} className='flex space-x-2'>
                <Input placeholder='Type your message...' className='flex-1' />
                <Button type='submit'>Send</Button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create New Message</DialogTitle>
            <DialogDescription>Select recipients:</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <CommandDialog>
              <CommandInput placeholder='Search people...' />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='People'>
                  {usersData.map(user => (
                    <CommandItem key={user.id} onSelect={() => console.log(user.name)}>
                      <User className='mr-2 h-4 w-4' aria-hidden='true' />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </div>
          <DialogFooter>
            <Button type='submit'>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DialogRadix.Root>
        <DialogRadix.Trigger asChild>
          <Button variant='outline'>Open Modal</Button>
        </DialogRadix.Trigger>
        <DialogRadix.Portal>
          <DialogRadix.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
          <DialogRadix.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
            <DialogRadix.Title className='text-lg font-semibold'>Modal Title</DialogRadix.Title>
            <DialogRadix.Description className='mt-2 text-sm text-muted-foreground'>
              Description goes here.
            </DialogRadix.Description>
            <div className='mt-4'>
              <p>This is the content of the modal.</p>
            </div>
            <div className='mt-6 flex justify-end gap-4'>
              <DialogRadix.Close asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogRadix.Close>
              <Button type='submit'>Confirm</Button>
            </div>
          </DialogRadix.Content>
        </DialogRadix.Portal>
      </DialogRadix.Root>
    </div>
  );
};

export default MessagingAppPage;