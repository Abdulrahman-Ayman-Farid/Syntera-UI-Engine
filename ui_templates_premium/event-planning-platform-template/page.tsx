'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarIcon, Users, MapPin, Clock, Plus, Search, Filter,
  ChevronRight, Edit, Trash, Download, Upload, CheckCircle,
  AlertCircle, ArrowRight, ArrowLeft, Send, TrendingUp, Tag, Star
} from 'lucide-react'

// ============================================================================
// TypeScript Constants - Event Planning Template Domain Data
// ============================================================================

const EVENT_METRICS = [
  {
    id: 'upcoming_events',
    label: 'Upcoming Events',
    value: '28',
    change: '+8',
    status: 'increasing' as const,
    icon: CalendarIcon,
    color: 'from-red-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'registered_guests',
    label: 'Registered Guests',
    value: '3,425',
    change: '+285',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-amber-500 to-yellow-500',
    format: 'count'
  },
  {
    id: 'active_venues',
    label: 'Active Venues',
    value: '12',
    change: '+2',
    status: 'good' as const,
    icon: MapPin,
    color: 'from-gray-600 to-gray-700',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '94',
    unit: '%',
    change: '+6%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-red-600 to-orange-600',
    format: 'percent'
  }
] as const

const EVENT_CATEGORIES = [
  { category: 'Corporate', count: 85, registrations: 2450, color: '#dc2626', icon: Star },
  { category: 'Social', count: 62, registrations: 1850, color: '#f59e0b', icon: Users },
  { category: 'Educational', count: 48, registrations: 1320, color: '#6b7280', icon: CalendarIcon },
  { category: 'Cultural', count: 35, registrations: 980, color: '#b91c1c', icon: Tag },
] as const

const EVENTS_DATA = [
  {
    id: 'evt-001',
    title: 'Annual Business Summit 2024',
    category: 'corporate',
    date: '2024-04-15',
    time: '09:00 AM',
    location: 'Convention Center',
    attendees: 450,
    registered: 385,
    status: 'open',
    organizer: 'Jennifer Taylor',
    image: '🏢'
  },
  {
    id: 'evt-002',
    title: 'Summer Music Festival',
    category: 'social',
    date: '2024-07-20',
    time: '06:00 PM',
    location: 'Central Park',
    attendees: 2000,
    registered: 1845,
    status: 'open',
    organizer: 'Michael Rodriguez',
    image: '🎵'
  },
  {
    id: 'evt-003',
    title: 'Tech Workshop Series',
    category: 'educational',
    date: '2024-05-10',
    time: '02:00 PM',
    location: 'Tech Hub',
    attendees: 150,
    registered: 142,
    status: 'almost_full',
    organizer: 'Sarah Chen',
    image: '💻'
  },
  {
    id: 'evt-004',
    title: 'Art Gallery Exhibition',
    category: 'cultural',
    date: '2024-06-05',
    time: '05:00 PM',
    location: 'City Art Museum',
    attendees: 300,
    registered: 175,
    status: 'open',
    organizer: 'David Kim',
    image: '🎨'
  },
] as const

const EVENT_STATUSES = [
  { value: 'open', label: 'Open', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'almost_full', label: 'Almost Full', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'sold_out', label: 'Sold Out', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800 border-gray-300' },
] as const

const REGISTRATION_TRENDS = [
  { month: 'Jan', registrations: 420, events: 18 },
  { month: 'Feb', registrations: 580, events: 22 },
  { month: 'Mar', registrations: 745, events: 28 },
  { month: 'Apr', registrations: 890, events: 32 },
  { month: 'May', registrations: 1020, events: 35 },
  { month: 'Jun', registrations: 1180, events: 38 },
] as const

const WIZARD_STEPS = [
  { id: 1, title: 'Event Details', description: 'Basic information', icon: CalendarIcon },
  { id: 2, title: 'Venue & Schedule', description: 'Location & timing', icon: MapPin },
  { id: 3, title: 'Attendees', description: 'Guest management', icon: Users },
  { id: 4, title: 'Review', description: 'Confirm & publish', icon: CheckCircle },
] as const

// ============================================================================
// Main Component
// ============================================================================

export default function EventPlanningPage() {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [wizardStep, setWizardStep] = useState(1)
  const [showWizard, setShowWizard] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, selectedCategory, selectedStatus])

  // Callbacks
  const handleEventClick = useCallback((eventId: string) => {
    setSelectedEvent(eventId)
  }, [])

  const handleWizardNext = useCallback(() => {
    if (wizardStep < 4) setWizardStep(wizardStep + 1)
  }, [wizardStep])

  const handleWizardPrev = useCallback(() => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1)
  }, [wizardStep])

  const getStatusColor = (status: string) => {
    return EVENT_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  const getRegistrationPercentage = (registered: number, total: number) => {
    return Math.round((registered / total) * 100)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'>
      {/* Header */}
      <header 
        data-template-section='header'
        className='sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg'>
                <CalendarIcon className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Event Planner Pro</h1>
                <p className='text-gray-400'>Industrial event management platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button 
                onClick={() => setShowWizard(true)}
                className='bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Event
              </Button>
              <Avatar className='cursor-pointer border-2 border-red-600'>
                <AvatarImage src='/avatars/user.png' alt='User' />
                <AvatarFallback>EP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Metrics Overview */}
        <section data-template-section='metrics' data-component-type='kpi-grid' data-metrics='events,guests,venues,completion'>
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
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
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

        {/* Analytics Dashboard */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Event Categories */}
          <section data-template-section='event-categories' data-chart-type='bar' data-metrics='count,registrations'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Events by Category</CardTitle>
                    <CardDescription className='text-gray-400'>Distribution and registrations</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-red-400 text-red-400'>
                    <CalendarIcon className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={EVENT_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='category' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Event Count' radius={[4, 4, 0, 0]}>
                      {EVENT_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Registration Trends */}
          <section data-template-section='registration-trends' data-chart-type='line' data-metrics='registrations,events'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Registration Trends</CardTitle>
                    <CardDescription className='text-gray-400'>Monthly growth tracking</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-400 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +22% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={REGISTRATION_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='registrations' stroke='#dc2626' strokeWidth={2} name='Registrations' />
                    <Line type='monotone' dataKey='events' stroke='#f59e0b' strokeWidth={2} name='Events' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Events Dashboard */}
        <section data-template-section='events-dashboard' data-component-type='event-cards'>
          <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Event Dashboard</CardTitle>
                  <CardDescription className='text-gray-400'>Browse and manage events</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search events...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-64 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className='w-40 bg-gray-700 border-gray-600 text-white'>
                      <SelectValue placeholder='Category' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='all'>All Categories</SelectItem>
                      <SelectItem value='corporate'>Corporate</SelectItem>
                      <SelectItem value='social'>Social</SelectItem>
                      <SelectItem value='educational'>Educational</SelectItem>
                      <SelectItem value='cultural'>Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className='w-40 bg-gray-700 border-gray-600 text-white'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='all'>All Status</SelectItem>
                      {EVENT_STATUSES.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <AnimatePresence>
                  {filteredEvents.map((event) => {
                    const regPercentage = getRegistrationPercentage(event.registered, event.attendees)
                    return (
                      <motion.div
                        key={event.id}
                        layoutId={`event-${event.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600 rounded-xl hover:border-red-500 transition-colors cursor-pointer ${
                          selectedEvent === event.id ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                        onClick={() => handleEventClick(event.id)}
                      >
                        <div className='space-y-3'>
                          <div className='flex items-start justify-between'>
                            <div className='flex items-start space-x-3'>
                              <div className='text-3xl'>{event.image}</div>
                              <div>
                                <h4 className='font-bold text-white text-lg'>{event.title}</h4>
                                <p className='text-gray-400 text-sm capitalize'>{event.category}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(event.status)}>
                              {EVENT_STATUSES.find(s => s.value === event.status)?.label}
                            </Badge>
                          </div>
                          <div className='grid grid-cols-2 gap-2 text-sm text-gray-400'>
                            <span className='flex items-center'>
                              <CalendarIcon className='w-3 h-3 mr-1' />
                              {event.date}
                            </span>
                            <span className='flex items-center'>
                              <Clock className='w-3 h-3 mr-1' />
                              {event.time}
                            </span>
                            <span className='flex items-center'>
                              <MapPin className='w-3 h-3 mr-1' />
                              {event.location}
                            </span>
                            <span className='flex items-center'>
                              <Users className='w-3 h-3 mr-1' />
                              {event.registered}/{event.attendees}
                            </span>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between text-sm'>
                              <span className='text-gray-400'>Registration</span>
                              <span className='font-medium text-white'>{regPercentage}%</span>
                            </div>
                            <Progress value={regPercentage} className='h-2' />
                          </div>
                          <Separator className='bg-gray-700' />
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                              <Avatar className='h-6 w-6'>
                                <AvatarFallback className='text-xs bg-gray-600'>
                                  {event.organizer.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm text-gray-400'>{event.organizer}</span>
                            </div>
                            <div className='flex items-center space-x-1'>
                              <Button variant='ghost' size='sm' className='text-gray-400 hover:text-white'>
                                <Edit className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='sm' className='text-gray-400 hover:text-white'>
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

      {/* Event Creation Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'
            onClick={() => setShowWizard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className='bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'
              onClick={(e) => e.stopPropagation()}
              data-template-section='event-wizard'
              data-component-type='wizard'
            >
              <div className='p-6 border-b border-gray-700'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-white'>Create New Event</h2>
                  <Button variant='ghost' size='icon' onClick={() => setShowWizard(false)}>
                    <ChevronRight className='w-5 h-5' />
                  </Button>
                </div>
                
                {/* Wizard Steps */}
                <div className='flex items-center justify-between'>
                  {WIZARD_STEPS.map((step, index) => (
                    <div key={step.id} className='flex items-center flex-1'>
                      <div className='flex flex-col items-center flex-1'>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                          wizardStep >= step.id 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-400'
                        }`}>
                          <step.icon className='w-5 h-5' />
                        </div>
                        <div className='mt-2 text-center'>
                          <div className={`text-sm font-medium ${wizardStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
                            {step.title}
                          </div>
                          <div className='text-xs text-gray-500'>{step.description}</div>
                        </div>
                      </div>
                      {index < WIZARD_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-4 transition-colors ${
                          wizardStep > step.id ? 'bg-red-600' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className='p-6 border-t border-gray-700 flex items-center justify-between'>
                <Button
                  variant='outline'
                  onClick={handleWizardPrev}
                  disabled={wizardStep === 1}
                  className='border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Previous
                </Button>
                {wizardStep < 4 ? (
                  <Button onClick={handleWizardNext} className='bg-red-600 hover:bg-red-700'>
                    Next
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </Button>
                ) : (
                  <Button className='bg-emerald-600 hover:bg-emerald-700'>
                    <Send className='w-4 h-4 mr-2' />
                    Publish Event
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
                <Select>
                  <SelectTrigger className='w-full max-w-xs'>
                    <SelectValue placeholder='Filter by...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='location'>Location</SelectItem>
                    <SelectItem value='date'>Date</SelectItem>
                    <SelectItem value='attendees'>Attendees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className='aspect-video rounded-xl' />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredEvents.map((event) => (
                  <Card key={event.id} className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                    <CardContent className='p-4'>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className='mt-2'>
                        <div className='flex items-center gap-2'>
                          <Clock size={16} /> {formatDate(event.date)}
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <MapPin size={16} /> {event.location}
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <Users size={16} /> {event.attendees} Attendees
                        </div>
                      </CardDescription>
                    </CardContent>
                    <CardFooter className='flex justify-end'>
                      <Button onClick={() => router.push(`/event/${event.id}`)}>View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <h3 className='text-xl font-medium'>No events found</h3>
                <p className='mt-2 text-gray-400'>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
          <div className='bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 p-8'>
            <h2 className='text-2xl font-semibold mb-4'>Quick Stats</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Card className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                <CardContent className='p-4'>
                  <CardTitle>Total Events</CardTitle>
                  <CardDescription className='mt-2'>
                    <span className='text-3xl'>{events.length}</span>
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                <CardContent className='p-4'>
                  <CardTitle>Active Events</CardTitle>
                  <CardDescription className='mt-2'>
                    <span className='text-3xl'>{events.length}</span>
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                <CardContent className='p-4'>
                  <CardTitle>Completed Events</CardTitle>
                  <CardDescription className='mt-2'>
                    <span className='text-3xl'>0</span>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className='p-4 bg-gray-800 shadow-xl shadow-black/50'>
        <div className='container mx-auto text-center'>
          <p>&copy; 2023 Event Planner Inc. All rights reserved.</p>
        </div>
      </footer>
      <Dialog>
        <DialogContent className='max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50'>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>Create a new event here.</DialogDescription>
          </DialogHeader>
          <Form>
            <FormField
              control={{}}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Event Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder='Event Location' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name='attendees'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Attendees</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          <DialogFooter className='flex justify-between'>
            <Button type='submit'>Save</Button>
            <Button variant='outline' onClick={() => console.log('Cancel')}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}