'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Users, MapPin, DollarSign, Clock, CheckCircle,
  AlertCircle, Plus, Edit, Trash, Send, Download, Upload,
  ArrowRight, ArrowLeft, Search, Filter, UserPlus, FileText,
  TrendingUp, TrendingDown, Eye, Tag, Star
} from 'lucide-react'

// ============================================================================
// TypeScript Constants - Event Planning Domain Data
// ============================================================================

const EVENT_METRICS = [
  {
    id: 'total_events',
    label: 'Total Events',
    value: '342',
    change: '+45',
    status: 'increasing' as const,
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'total_guests',
    label: 'Total Guests',
    value: '8,420',
    change: '+892',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'budget_spent',
    label: 'Budget Spent',
    value: '2.8',
    unit: 'M',
    change: '+12%',
    status: 'warning' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'rsvp_rate',
    label: 'RSVP Rate',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const EVENT_TYPES = [
  { type: 'Corporate', count: 145, budget: 980000, color: '#3b82f6', icon: FileText },
  { type: 'Wedding', count: 92, budget: 1250000, color: '#8b5cf6', icon: Star },
  { type: 'Social', count: 75, budget: 420000, color: '#10b981', icon: Users },
  { type: 'Conference', count: 30, budget: 350000, color: '#f59e0b', icon: Calendar },
] as const

const EVENTS_DATA = [
  {
    id: 'event-001',
    title: 'Annual Tech Conference 2024',
    type: 'conference',
    date: '2024-03-15',
    location: 'San Francisco Convention Center',
    attendees: 500,
    confirmed: 425,
    budget: 150000,
    status: 'confirmed',
    organizer: 'Sarah Johnson',
    venue: 'Main Hall A'
  },
  {
    id: 'event-002',
    title: 'Product Launch Gala',
    type: 'corporate',
    date: '2024-02-20',
    location: 'Grand Ballroom NYC',
    attendees: 300,
    confirmed: 280,
    budget: 95000,
    status: 'planning',
    organizer: 'Michael Chen',
    venue: 'Grand Ballroom'
  },
  {
    id: 'event-003',
    title: 'Summer Garden Wedding',
    type: 'wedding',
    date: '2024-06-10',
    location: 'Botanical Gardens',
    attendees: 150,
    confirmed: 145,
    budget: 75000,
    status: 'confirmed',
    organizer: 'Emily Davis',
    venue: 'Rose Garden'
  },
  {
    id: 'event-004',
    title: 'Team Building Retreat',
    type: 'social',
    date: '2024-04-05',
    location: 'Mountain Resort',
    attendees: 80,
    confirmed: 72,
    budget: 28000,
    status: 'planning',
    organizer: 'David Miller',
    venue: 'Resort Lodge'
  },
] as const

const EVENT_STATUSES = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' },
] as const

const RSVP_TRENDS = [
  { month: 'Jan', invites: 850, confirmed: 720, declined: 95 },
  { month: 'Feb', invites: 920, confirmed: 785, declined: 102 },
  { month: 'Mar', invites: 1050, confirmed: 890, declined: 125 },
  { month: 'Apr', invites: 1180, confirmed: 1015, declined: 138 },
  { month: 'May', invites: 1320, confirmed: 1145, declined: 152 },
  { month: 'Jun', invites: 1450, confirmed: 1265, declined: 165 },
] as const

// ============================================================================
// Main Component
// ============================================================================

export default function EventPlanningPlatform() {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [showNewEventModal, setShowNewEventModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
      const matchesType = selectedType === 'all' || event.type === selectedType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchQuery, selectedStatus, selectedType])

  // Callbacks
  const handleEventClick = useCallback((eventId: string) => {
    setSelectedEvent(eventId)
  }, [])

  const getStatusColor = (status: string) => {
    return EVENT_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  const getRSVPPercentage = (confirmed: number, total: number) => {
    return Math.round((confirmed / total) * 100)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50/50'>
      {/* Header */}
      <header 
        data-template-section='header'
        className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Calendar className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>EventPro</h1>
                <p className='text-gray-600'>Professional event planning & management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button 
                onClick={() => setShowNewEventModal(true)}
                className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Event
              </Button>
              <Avatar className='cursor-pointer border-2 border-cyan-500'>
                <AvatarImage src='/avatars/user.png' alt='User' />
                <AvatarFallback>EP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Metrics Overview */}
        <section data-template-section='metrics' data-component-type='kpi-grid' data-metrics='events,guests,budget,rsvp'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {EVENT_METRICS.map((metric) => (
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

        {/* Analytics Dashboard */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Event Type Distribution */}
          <section data-template-section='event-distribution' data-chart-type='bar' data-metrics='count,budget'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Events by Type</CardTitle>
                    <CardDescription>Distribution and budget allocation</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-cyan-200 text-cyan-700'>
                    <FileText className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={EVENT_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Event Count' radius={[4, 4, 0, 0]}>
                      {EVENT_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* RSVP Trends */}
          <section data-template-section='rsvp-trends' data-chart-type='line' data-metrics='invites,confirmed,declined'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>RSVP Trends</CardTitle>
                    <CardDescription>Guest response tracking</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Response
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={RSVP_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line type='monotone' dataKey='invites' stroke='#3b82f6' strokeWidth={2} name='Invited' />
                    <Line type='monotone' dataKey='confirmed' stroke='#10b981' strokeWidth={2} name='Confirmed' />
                    <Line type='monotone' dataKey='declined' stroke='#ef4444' strokeWidth={2} name='Declined' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Events Dashboard */}
        <section data-template-section='events-dashboard' data-component-type='event-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Event Dashboard</CardTitle>
                  <CardDescription>Manage and track all events</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search events...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-64 border-gray-300'
                  />
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className='w-40 border-gray-300'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      {EVENT_STATUSES.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className='w-40 border-gray-300'>
                      <SelectValue placeholder='Type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='corporate'>Corporate</SelectItem>
                      <SelectItem value='wedding'>Wedding</SelectItem>
                      <SelectItem value='social'>Social</SelectItem>
                      <SelectItem value='conference'>Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <AnimatePresence>
                  {filteredEvents.map((event) => {
                    const rsvpPercentage = getRSVPPercentage(event.confirmed, event.attendees)
                    return (
                      <motion.div
                        key={event.id}
                        layoutId={`event-${event.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 bg-gradient-to-br from-white to-blue-50/50 border border-gray-200 rounded-xl hover:border-cyan-300 transition-colors cursor-pointer ${
                          selectedEvent === event.id ? 'ring-2 ring-cyan-500 ring-offset-2' : ''
                        }`}
                        onClick={() => handleEventClick(event.id)}
                      >
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <h4 className='font-bold text-gray-900 text-lg'>{event.title}</h4>
                            <Badge className={getStatusColor(event.status)}>
                              {EVENT_STATUSES.find(s => s.value === event.status)?.label}
                            </Badge>
                          </div>
                          <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                            <span className='flex items-center'>
                              <Calendar className='w-3 h-3 mr-1' />
                              {event.date}
                            </span>
                            <span className='flex items-center'>
                              <MapPin className='w-3 h-3 mr-1' />
                              {event.venue}
                            </span>
                            <span className='flex items-center'>
                              <Users className='w-3 h-3 mr-1' />
                              {event.confirmed}/{event.attendees} guests
                            </span>
                            <span className='flex items-center'>
                              <DollarSign className='w-3 h-3 mr-1' />
                              ${(event.budget / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between text-sm'>
                              <span className='text-gray-600'>RSVP Progress</span>
                              <span className='font-medium text-gray-900'>{rsvpPercentage}%</span>
                            </div>
                            <Progress value={rsvpPercentage} className='h-2' />
                          </div>
                          <Separator />
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                              <Avatar className='h-6 w-6'>
                                <AvatarFallback className='text-xs'>
                                  {event.organizer.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm text-gray-600'>{event.organizer}</span>
                            </div>
                            <div className='flex items-center space-x-1'>
                              <Button variant='ghost' size='sm'>
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='sm'>
                                <Edit className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='sm'>
                                <Send className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
