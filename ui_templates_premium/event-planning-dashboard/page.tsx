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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Users, MapPin, DollarSign, TrendingUp, TrendingDown,
  CheckCircle, Clock, AlertTriangle, Plus, Search, Download,
  Settings, Bell, MoreVertical, UserPlus, CalendarDays,
  Ticket, Star, Gift, Music, Utensils, Camera, Mail
} from 'lucide-react'

// Event metrics with type-safe constants
const EVENT_METRICS = [
  {
    id: 'total_events',
    label: 'Total Events',
    value: '48',
    change: '+12',
    status: 'increasing' as const,
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'total_attendees',
    label: 'Total Attendees',
    value: '3,245',
    change: '+18%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'active_events',
    label: 'Active Events',
    value: '12',
    change: '+4',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'budget_utilization',
    label: 'Budget Used',
    value: '78',
    unit: '%',
    change: '+5%',
    status: 'warning' as const,
    icon: DollarSign,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const EVENT_TYPES = [
  { type: 'Conferences', count: 15, budget: 450000, color: '#3b82f6', icon: Users },
  { type: 'Workshops', count: 18, budget: 180000, color: '#8b5cf6', icon: Calendar },
  { type: 'Webinars', count: 8, budget: 45000, color: '#10b981', icon: Ticket },
  { type: 'Networking', count: 7, budget: 125000, color: '#f59e0b', icon: Star },
] as const

const UPCOMING_EVENTS = [
  {
    id: 'evt-001',
    name: 'Tech Summit 2026',
    type: 'conference',
    date: '2026-02-15',
    venue: 'Convention Center',
    attendees: 450,
    budget: 85000,
    status: 'confirmed',
    completion: 85
  },
  {
    id: 'evt-002',
    name: 'Product Launch Workshop',
    type: 'workshop',
    date: '2026-02-20',
    venue: 'Grand Ballroom',
    attendees: 120,
    budget: 25000,
    status: 'planning',
    completion: 60
  },
  {
    id: 'evt-003',
    name: 'Annual Gala Dinner',
    type: 'networking',
    date: '2026-03-05',
    venue: 'Luxury Hotel',
    attendees: 300,
    budget: 65000,
    status: 'confirmed',
    completion: 92
  },
  {
    id: 'evt-004',
    name: 'Industry Webinar Series',
    type: 'webinar',
    date: '2026-02-25',
    venue: 'Online',
    attendees: 850,
    budget: 12000,
    status: 'planning',
    completion: 45
  },
] as const

const MONTHLY_DATA = [
  { month: 'Aug', events: 8, attendees: 520, revenue: 125000 },
  { month: 'Sep', events: 10, attendees: 680, revenue: 165000 },
  { month: 'Oct', events: 12, attendees: 845, revenue: 195000 },
  { month: 'Nov', events: 9, attendees: 620, revenue: 148000 },
  { month: 'Dec', events: 15, attendees: 920, revenue: 235000 },
  { month: 'Jan', events: 14, attendees: 860, revenue: 218000 },
] as const

export default function EventPlanningDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'planning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredEvents = useMemo(() => {
    return UPCOMING_EVENTS.filter(event => {
      const matchesSearch = searchQuery === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        event.type === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Calendar className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>EventFlow Pro</h1>
                <p className='text-gray-600'>Enterprise event management platform</p>
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
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Event Metrics */}
        <section data-template-section='event-overview' data-component-type='kpi-grid'>
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

        {/* Event Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Event Distribution */}
          <section data-template-section='event-distribution' data-chart-type='bar' data-metrics='count,budget'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Event Distribution</CardTitle>
                    <CardDescription>Events by type and budget</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
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

          {/* Attendance Trends */}
          <section data-template-section='attendance-trends' data-chart-type='line' data-metrics='events,attendees,revenue'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Attendance Trends</CardTitle>
                    <CardDescription>Monthly event activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +24% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='events' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Events'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='attendees' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Attendees'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Event Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='event-browser' data-component-type='event-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Upcoming Events</CardTitle>
                    <CardDescription>Scheduled events and their progress</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search events...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='conference'>Conference</SelectItem>
                        <SelectItem value='workshop'>Workshop</SelectItem>
                        <SelectItem value='webinar'>Webinar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedEvent === event.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold text-lg'>{event.name}</h4>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            </div>
                            <div className='grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <CalendarDays className='w-4 h-4 mr-2' />
                                {event.date}
                              </span>
                              <span className='flex items-center'>
                                <MapPin className='w-4 h-4 mr-2' />
                                {event.venue}
                              </span>
                              <span className='flex items-center'>
                                <Users className='w-4 h-4 mr-2' />
                                {event.attendees} attendees
                              </span>
                              <span className='flex items-center'>
                                <DollarSign className='w-4 h-4 mr-2' />
                                ${(event.budget / 1000).toFixed(0)}K budget
                              </span>
                            </div>
                            <div className='space-y-2'>
                              <div className='flex items-center justify-between text-sm'>
                                <span className='text-gray-600'>Planning Progress</span>
                                <span className='font-medium'>{event.completion}%</span>
                              </div>
                              <Progress value={event.completion} className='h-2' />
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
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'Create Event', color: 'from-blue-500 to-cyan-500' },
                    { icon: UserPlus, label: 'Invite Attendees', color: 'from-purple-500 to-pink-500' },
                    { icon: MapPin, label: 'Book Venue', color: 'from-emerald-500 to-teal-500' },
                    { icon: DollarSign, label: 'Manage Budget', color: 'from-amber-500 to-orange-500' },
                    { icon: Camera, label: 'Upload Media', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Event Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-blue-300 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Budget Utilization</span>
                      <span className='font-medium'>$892K / $1.2M</span>
                    </div>
                    <Progress value={74} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium'>All Systems Ready</div>
                        <div className='text-sm text-blue-600'>12 events confirmed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Event Analytics Details */}
        <section data-template-section='event-analytics' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Event Analytics</CardTitle>
                  <CardDescription>Performance insights and key metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Event', 
                    value: 'Tech Summit 2026', 
                    attendees: 450,
                    icon: Star,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Average Attendance', 
                    value: '270 per event', 
                    growth: '+15%',
                    icon: Users,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Next Event', 
                    value: 'In 8 days', 
                    time: 'Feb 15, 2026',
                    icon: Calendar,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Satisfaction', 
                    value: '4.8 / 5.0', 
                    rating: '96%',
                    icon: Gift,
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
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>
                      {stat.attendees && `${stat.attendees} registered`}
                      {stat.growth && `Growth ${stat.growth}`}
                      {stat.time && stat.time}
                      {stat.rating && `${stat.rating} positive`}
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