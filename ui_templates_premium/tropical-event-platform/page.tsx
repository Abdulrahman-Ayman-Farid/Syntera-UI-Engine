'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  CalendarIcon, Users2, MapPin, Clock, Tag, Plus, Search,
  Filter, ChevronRight, Edit, Trash, Send, Download, Upload,
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft, TrendingUp,
  Heart, Share2, Eye, Star
} from 'lucide-react'

// ============================================================================
// TypeScript Constants - Tropical Event Platform Domain Data
// ============================================================================

const EVENT_METRICS = [
  {
    id: 'live_events',
    label: 'Live Events',
    value: '48',
    change: '+12',
    status: 'increasing' as const,
    icon: CalendarIcon,
    color: 'from-pink-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'total_attendees',
    label: 'Total Attendees',
    value: '12.8',
    unit: 'K',
    change: '+2.4K',
    status: 'increasing' as const,
    icon: Users2,
    color: 'from-purple-500 to-violet-500',
    format: 'count'
  },
  {
    id: 'engagement_rate',
    label: 'Engagement',
    value: '89',
    unit: '%',
    change: '+7%',
    status: 'good' as const,
    icon: Heart,
    color: 'from-green-500 to-emerald-500',
    format: 'percent'
  },
  {
    id: 'active_categories',
    label: 'Categories',
    value: '18',
    change: '+3',
    status: 'good' as const,
    icon: Tag,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const EVENT_CATEGORIES = [
  { category: 'Beach Party', count: 125, likes: 5420, color: '#ec4899', icon: Star },
  { category: 'Garden Event', count: 98, likes: 4280, color: '#8b5cf6', icon: CalendarIcon },
  { category: 'City Festival', count: 76, likes: 3850, color: '#10b981', icon: Users2 },
  { category: 'Tropical Gala', count: 52, likes: 2950, color: '#f59e0b', icon: Tag },
] as const

const EVENTS_DATA = [
  {
    id: 'trop-001',
    name: 'Sunset Beach Party 2024',
    category: 'beach',
    date: '2024-06-15',
    location: 'Sunset Beach',
    attendees: 850,
    likes: 342,
    shares: 124,
    status: 'live',
    organizer: 'Maria Santos',
    image: '🏖️',
    tags: ['beach', 'sunset', 'music']
  },
  {
    id: 'trop-002',
    name: 'Garden Wedding Celebration',
    category: 'garden',
    date: '2024-07-20',
    location: 'Green Garden Park',
    attendees: 200,
    likes: 456,
    shares: 89,
    status: 'upcoming',
    organizer: 'James Rodriguez',
    image: '🌺',
    tags: ['wedding', 'garden', 'romantic']
  },
  {
    id: 'trop-003',
    name: 'City Summer Festival',
    category: 'city',
    date: '2024-08-10',
    location: 'Downtown Plaza',
    attendees: 3000,
    likes: 1245,
    shares: 456,
    status: 'live',
    organizer: 'Lisa Chen',
    image: '🎉',
    tags: ['festival', 'music', 'food']
  },
  {
    id: 'trop-004',
    name: 'Tropical Gala Night',
    category: 'gala',
    date: '2024-09-05',
    location: 'Island Resort',
    attendees: 500,
    likes: 789,
    shares: 234,
    status: 'upcoming',
    organizer: 'Carlos Martinez',
    image: '🌴',
    tags: ['gala', 'elegant', 'tropical']
  },
] as const

const EVENT_STATUSES = [
  { value: 'live', label: 'Live', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'ended', label: 'Ended', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' },
] as const

const ENGAGEMENT_TRENDS = [
  { month: 'Jan', views: 12500, likes: 3200, shares: 850 },
  { month: 'Feb', views: 15800, likes: 4100, shares: 1050 },
  { month: 'Mar', views: 18200, likes: 4850, shares: 1280 },
  { month: 'Apr', views: 21500, likes: 5620, shares: 1520 },
  { month: 'May', views: 25800, likes: 6450, shares: 1820 },
  { month: 'Jun', views: 29500, likes: 7280, shares: 2150 },
] as const

// ============================================================================
// Main Component
// ============================================================================

export default function TropicalEventPlatform() {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      const matchesFilter = filter === 'all' || 
        event.name.toLowerCase().includes(filter.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      return matchesFilter && matchesCategory
    })
  }, [filter, selectedCategory])

  // Callbacks
  const handleEventClick = useCallback((eventId: string) => {
    setSelectedEvent(eventId)
  }, [])

  const handleLike = useCallback((eventId: string) => {
    setLikedEvents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }, [])

  const getStatusColor = (status: string) => {
    return EVENT_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-green-50'>
      {/* Header */}
      <header 
        data-template-section='header'
        className='sticky top-0 z-50 border-b border-pink-200 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg'>
                <CalendarIcon className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                  Eventify
                </h1>
                <p className='text-gray-600'>Tropical event discovery platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button 
                onClick={() => router.push('/create-event')}
                className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Event
              </Button>
              <Avatar className='cursor-pointer border-2 border-pink-500'>
                <AvatarImage src='/logo.png' alt='User' />
                <AvatarFallback>EV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Metrics Overview */}
        <section data-template-section='metrics' data-component-type='kpi-grid' data-metrics='events,attendees,engagement,categories'>
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
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-pink-200 bg-white shadow-sm hover:shadow-lg transition-all'>
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
          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='count,likes'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Events by Category</CardTitle>
                    <CardDescription>Popular event types and engagement</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-pink-400 text-pink-700'>
                    <Tag className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={EVENT_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fce7f3' />
                    <XAxis dataKey='category' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Event Count' radius={[8, 8, 0, 0]}>
                      {EVENT_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='line' data-metrics='views,likes,shares'>
            <Card className='border border-purple-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Engagement Trends</CardTitle>
                    <CardDescription>Platform activity metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-400 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ENGAGEMENT_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f3e8ff' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line type='monotone' dataKey='views' stroke='#ec4899' strokeWidth={2} name='Views' />
                    <Line type='monotone' dataKey='likes' stroke='#8b5cf6' strokeWidth={2} name='Likes' />
                    <Line type='monotone' dataKey='shares' stroke='#10b981' strokeWidth={2} name='Shares' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Event Feed - Infinite Scroll */}
        <section data-template-section='event-feed' data-component-type='infinite-scroll'>
          <Card className='border border-pink-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Upcoming Events</CardTitle>
                  <CardDescription>Discover and explore tropical events</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    type='text'
                    placeholder='Search events...'
                    onChange={handleSearchChange}
                    className='w-64 border-pink-200'
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className='w-40 border-pink-200'>
                      <SelectValue placeholder='Category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Categories</SelectItem>
                      <SelectItem value='beach'>Beach Party</SelectItem>
                      <SelectItem value='garden'>Garden Event</SelectItem>
                      <SelectItem value='city'>City Festival</SelectItem>
                      <SelectItem value='gala'>Tropical Gala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <AnimatePresence>
                  {filteredEvents.map((event) => {
                    const isLiked = likedEvents.has(event.id)
                    return (
                      <motion.div
                        key={event.id}
                        layoutId={`event-${event.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className='group relative'
                      >
                        <Card className='border border-pink-200 shadow-md hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30'>
                          <div className='relative h-48 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center'>
                            <div className='text-6xl'>{event.image}</div>
                            <Badge className={`absolute top-4 right-4 ${getStatusColor(event.status)}`}>
                              {EVENT_STATUSES.find(s => s.value === event.status)?.label}
                            </Badge>
                          </div>
                          <CardContent className='p-4 space-y-3'>
                            <div>
                              <h3 className='font-bold text-lg text-gray-900 mb-1'>{event.name}</h3>
                              <p className='text-sm text-gray-600 capitalize'>{event.category}</p>
                            </div>
                            <div className='space-y-2 text-sm text-gray-600'>
                              <div className='flex items-center'>
                                <MapPin className='w-4 h-4 mr-2 text-pink-500' />
                                {event.location}
                              </div>
                              <div className='flex items-center'>
                                <CalendarIcon className='w-4 h-4 mr-2 text-purple-500' />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className='flex items-center'>
                                <Users2 className='w-4 h-4 mr-2 text-green-500' />
                                {event.attendees} Attendees
                              </div>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                              {event.tags.map(tag => (
                                <Badge key={tag} variant='outline' className='border-pink-200 text-pink-700 text-xs'>
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <Separator />
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Avatar className='h-6 w-6'>
                                  <AvatarFallback className='text-xs bg-gradient-to-r from-pink-400 to-purple-500 text-white'>
                                    {event.organizer.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className='text-xs text-gray-600'>{event.organizer}</span>
                              </div>
                              <div className='flex items-center space-x-3'>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleLike(event.id)}
                                  className='flex items-center space-x-1'
                                >
                                  <Heart 
                                    className={`w-4 h-4 transition-colors ${
                                      isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-400'
                                    }`} 
                                  />
                                  <span className='text-xs text-gray-600'>{event.likes + (isLiked ? 1 : 0)}</span>
                                </motion.button>
                                <button className='flex items-center space-x-1'>
                                  <Share2 className='w-4 h-4 text-gray-400' />
                                  <span className='text-xs text-gray-600'>{event.shares}</span>
                                </button>
                                <Button 
                                  size='sm' 
                                  className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-7 text-xs'
                                  onClick={() => handleEventClick(event.id)}
                                >
                                  View
                                  <ChevronRight className='w-3 h-3 ml-1' />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
              
              {/* Load More Button */}
              <div className='flex justify-center mt-8'>
                <Button 
                  variant='outline'
                  className='border-pink-300 text-pink-700 hover:bg-pink-50'
                >
                  Load More Events
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

              className='border-t border-l rounded-2xl'
            />
            <Button onClick={handleCreateEvent} variant='default'>
              <Plus className='mr-2' /> Create Event
            </Button>
          </div>
        </nav>
      </header>
      <main className='p-6'>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Upcoming Events</h2>
          <Tabs defaultValue='all' className='max-w-[400px] w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='personal'>Personal</TabsTrigger>
              <TabsTrigger value='professional'>Professional</TabsTrigger>
            </TabsList>
            <TabsContent value='all'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className='aspect-video rounded-2xl' />
                  ))
                ) : error ? (
                  <div className='col-span-full text-center'>Error loading events</div>
                ) : (
                  filteredEvents.map((event) => (
                    <Card key={event.id} className='shadow-xl rounded-2xl overflow-hidden relative'>
                      <CardContent className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-br from-transparent to-black/30 z-10'></div>
                        <div className='relative z-20'>
                          <CardTitle>{event.name}</CardTitle>
                          <CardDescription className='mt-2'>
                            <div className='flex items-center space-x-2'>
                              <MapPin className='w-4 h-4' /> {event.location}
                            </div>
                            <div className='flex items-center space-x-2 mt-1'>
                              <CalendarIcon className='w-4 h-4' /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className='flex items-center space-x-2 mt-1'>
                              <Users2 className='w-4 h-4' /> {event.attendees} Attendees
                            </div>
                          </CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Event Statistics</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <Card className='shadow-xl rounded-2xl p-6'>
              <CardTitle>Total Events</CardTitle>
              <CardDescription className='mt-2'>150</CardDescription>
            </Card>
            <Card className='shadow-xl rounded-2xl p-6'>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription className='mt-2'>50</CardDescription>
            </Card>
            <Card className='shadow-xl rounded-2xl p-6'>
              <CardTitle>Past Events</CardTitle>
              <CardDescription className='mt-2'>100</CardDescription>
            </Card>
          </div>
        </section>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Recent Activity</h2>
          <ul className='space-y-4'>
            <li className='flex items-center space-x-4 bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-xl'>
              <Avatar className='border-t border-l'>
                <AvatarImage src='/avatars/jane-doe.jpg' alt='Jane Doe' />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold'>Jane Doe</p>
                <p className='text-sm'>Created a new event: Summer Picnic</p>
              </div>
            </li>
            <li className='flex items-center space-x-4 bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-xl'>
              <Avatar className='border-t border-l'>
                <AvatarImage src='/avatars/john-doe.jpg' alt='John Doe' />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold'>John Doe</p>
                <p className='text-sm'>Updated event details: City Gala</p>
              </div>
            </li>
          </ul>
        </section>
      </main>
      <footer className='p-6 bg-white/30 backdrop-blur-sm rounded-t-2xl'>
        <div className='flex items-center justify-between'>
          <p>&copy; 2023 Eventify. All rights reserved.</p>
          <div className='space-x-4'>
            <a href='#' className='hover:underline'>Privacy Policy</a>
            <a href='#' className='hover:underline'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}