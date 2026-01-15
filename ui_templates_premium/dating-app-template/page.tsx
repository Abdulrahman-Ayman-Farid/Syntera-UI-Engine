'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, MessageCircle, UserPlus, Search, Filter, Star, 
  TrendingUp, TrendingDown, Users, Clock, Zap, 
  MapPin, Sparkles, Activity, CheckCircle, X 
} from 'lucide-react'

// Match metrics with 'as const'
const MATCH_METRICS = [
  {
    id: 'total_matches',
    label: 'Total Matches',
    value: '142',
    change: '+18',
    status: 'increasing' as const,
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'active_chats',
    label: 'Active Chats',
    value: '24',
    change: '+8',
    status: 'increasing' as const,
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'compatibility_avg',
    label: 'Avg Compatibility',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'profile_views',
    label: 'Profile Views',
    value: '1,245',
    change: '+42%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  }
] as const

// Match statuses
const MATCH_STATUSES = {
  new_match: { label: 'New Match', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  chatting: { label: 'Chatting', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  liked: { label: 'Liked', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  super_like: { label: 'Super Like', color: 'bg-purple-100 text-purple-800 border-purple-300' }
} as const

// Profile data with 'as const'
const PROFILES_DATA = [
  { 
    id: 1, 
    name: 'Alice Johnson', 
    age: 28, 
    bio: 'Loves hiking and trying new foods. Adventure seeker 🏔️', 
    imageUrl: '/images/alice.jpg', 
    matchPercentage: 92,
    location: 'New York, NY',
    interests: ['Hiking', 'Food', 'Travel'],
    status: 'new_match' as const,
    lastActive: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Bob Smith', 
    age: 34, 
    bio: 'Musician by night, gamer by day. Let\'s jam! 🎸', 
    imageUrl: '/images/bob.jpg', 
    matchPercentage: 85,
    location: 'Los Angeles, CA',
    interests: ['Music', 'Gaming', 'Coffee'],
    status: 'chatting' as const,
    lastActive: '5 minutes ago'
  },
  { 
    id: 3, 
    name: 'Charlie Brown', 
    age: 22, 
    bio: 'Graphic designer with a passion for art and creativity.', 
    imageUrl: '/images/charlie.jpg', 
    matchPercentage: 78,
    location: 'Chicago, IL',
    interests: ['Art', 'Design', 'Photography'],
    status: 'liked' as const,
    lastActive: '1 day ago'
  },
  { 
    id: 4, 
    name: 'Diana Prince', 
    age: 26, 
    bio: 'Fitness enthusiast and yoga instructor. Namaste 🧘‍♀️', 
    imageUrl: '/images/diana.jpg', 
    matchPercentage: 88,
    location: 'Miami, FL',
    interests: ['Yoga', 'Fitness', 'Wellness'],
    status: 'super_like' as const,
    lastActive: '30 minutes ago'
  },
  { 
    id: 5, 
    name: 'Ethan Hunt', 
    age: 31, 
    bio: 'Software engineer who loves solving problems and cooking.', 
    imageUrl: '/images/ethan.jpg', 
    matchPercentage: 81,
    location: 'San Francisco, CA',
    interests: ['Tech', 'Cooking', 'Running'],
    status: 'new_match' as const,
    lastActive: '1 hour ago'
  },
  { 
    id: 6, 
    name: 'Fiona Green', 
    age: 29, 
    bio: 'Book lover and aspiring writer. Coffee dates? ☕', 
    imageUrl: '/images/fiona.jpg', 
    matchPercentage: 76,
    location: 'Seattle, WA',
    interests: ['Reading', 'Writing', 'Coffee'],
    status: 'chatting' as const,
    lastActive: '15 minutes ago'
  }
] as const

// Activity data for charts
const ACTIVITY_DATA = [
  { day: 'Mon', matches: 12, messages: 45, likes: 28 },
  { day: 'Tue', matches: 18, messages: 62, likes: 35 },
  { day: 'Wed', matches: 15, messages: 58, likes: 42 },
  { day: 'Thu', matches: 22, messages: 75, likes: 38 },
  { day: 'Fri', matches: 28, messages: 88, likes: 52 },
  { day: 'Sat', matches: 35, messages: 102, likes: 68 },
  { day: 'Sun', matches: 25, messages: 85, likes: 55 }
] as const

const COMPATIBILITY_TRENDS = [
  { month: 'Jan', avgScore: 72 },
  { month: 'Feb', avgScore: 75 },
  { month: 'Mar', avgScore: 78 },
  { month: 'Apr', avgScore: 82 },
  { month: 'May', avgScore: 85 },
  { month: 'Jun', avgScore: 87 }
] as const

export default function HomePage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState([...PROFILES_DATA])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterPercentage, setFilterPercentage] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState('week')
  const [activeTab, setActiveTab] = useState('discover')

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setProfiles([...PROFILES_DATA])
      setLoading(false)
    }, 800)
  }, [])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }, [])

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterPercentage === 'all' || 
                           profile.matchPercentage >= parseInt(filterPercentage)
      return matchesSearch && matchesFilter
    })
  }, [profiles, searchQuery, filterPercentage])

  const handleLike = useCallback((profileId: number) => {
    console.log('Liked profile:', profileId)
    // Add like logic here
  }, [])

  const handleMessage = useCallback((profileId: number) => {
    console.log('Message profile:', profileId)
    router.push(`/messages/${profileId}`)
  }, [router])

  const handleSuperLike = useCallback((profileId: number) => {
    console.log('Super liked profile:', profileId)
    // Add super like logic here
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50'>
        <div className='space-y-4'>
          <Skeleton className='w-96 h-64 animate-pulse rounded-2xl' />
          <Skeleton className='w-96 h-16 animate-pulse rounded-xl' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 text-red-500'>
        <Card className='p-8'>
          <CardContent>
            <X className='w-12 h-12 mx-auto mb-4 text-red-500' />
            <p className='text-lg font-semibold'>Error loading profiles: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' fill='white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>MatchMe</h1>
                <p className='text-gray-600'>Find your perfect match</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <Input
                  placeholder='Search profiles...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='w-64 pl-10 border-gray-300'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Match Metrics */}
        <section data-template-section='match-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {MATCH_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Activity Chart */}
          <section data-template-section='activity-chart' data-chart-type='bar' data-metrics='matches,messages,likes'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Weekly Activity</CardTitle>
                    <CardDescription>Matches, messages, and likes</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-pink-200 text-pink-700'>
                    <Activity className='w-3 h-3 mr-1' />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={ACTIVITY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='matches' fill='#ec4899' name='Matches' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='messages' fill='#3b82f6' name='Messages' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='likes' fill='#8b5cf6' name='Likes' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Compatibility Trends */}
          <section data-template-section='compatibility-trends' data-chart-type='line' data-metrics='avgScore'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Compatibility Score Trend</CardTitle>
                    <CardDescription>Your average match scores</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +15% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={COMPATIBILITY_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='avgScore' 
                      stroke='#8b5cf6' 
                      strokeWidth={3}
                      name='Compatibility Score'
                      dot={{ fill: '#8b5cf6', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Profile Browser */}
        <section data-template-section='profile-browser' data-component-type='profile-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Discover Matches</CardTitle>
                  <CardDescription>Profiles matched to your preferences</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Select value={filterPercentage} onValueChange={setFilterPercentage}>
                    <SelectTrigger className='w-48 border-gray-300'>
                      <SelectValue placeholder='Filter by match' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Matches</SelectItem>
                      <SelectItem value='90'>90%+ Match</SelectItem>
                      <SelectItem value='80'>80%+ Match</SelectItem>
                      <SelectItem value='70'>70%+ Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className='grid w-full grid-cols-3 mb-6'>
                  <TabsTrigger value='discover'>Discover</TabsTrigger>
                  <TabsTrigger value='matches'>My Matches</TabsTrigger>
                  <TabsTrigger value='liked'>Liked You</TabsTrigger>
                </TabsList>
                
                <TabsContent value='discover'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <AnimatePresence>
                      {filteredProfiles.map((profile, index) => (
                        <motion.div
                          key={profile.id}
                          layoutId={`profile-${profile.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className={`cursor-pointer ${
                            selectedProfile === profile.id ? 'ring-2 ring-pink-500 ring-offset-2' : ''
                          }`}
                          onClick={() => setSelectedProfile(profile.id)}
                        >
                          <Card className='h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden'>
                            <div className='relative h-64 bg-gradient-to-br from-gray-200 to-gray-300'>
                              <div className='absolute inset-0 flex items-center justify-center text-6xl'>
                                {profile.name.charAt(0)}
                              </div>
                              <Badge 
                                className={`absolute top-3 right-3 ${MATCH_STATUSES[profile.status].color}`}
                              >
                                {MATCH_STATUSES[profile.status].label}
                              </Badge>
                              <div className='absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-3'>
                                <div className='flex items-center justify-between mb-2'>
                                  <div>
                                    <h3 className='font-bold text-lg'>{profile.name}, {profile.age}</h3>
                                    <p className='text-sm text-gray-600 flex items-center'>
                                      <MapPin className='w-3 h-3 mr-1' />
                                      {profile.location}
                                    </p>
                                  </div>
                                  <div className='text-right'>
                                    <div className='flex items-center space-x-1'>
                                      <Sparkles className='w-4 h-4 text-purple-600' />
                                      <span className='text-2xl font-bold text-purple-600'>{profile.matchPercentage}%</span>
                                    </div>
                                    <p className='text-xs text-gray-500'>Match</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CardContent className='p-4'>
                              <p className='text-sm text-gray-700 mb-3 line-clamp-2'>{profile.bio}</p>
                              <div className='flex flex-wrap gap-2 mb-4'>
                                {profile.interests.map((interest, i) => (
                                  <Badge key={i} variant='outline' className='text-xs'>
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                              <Progress value={profile.matchPercentage} className='h-2 mb-4' />
                              <Separator className='my-3' />
                              <div className='flex items-center justify-between text-xs text-gray-500 mb-4'>
                                <span className='flex items-center'>
                                  <Clock className='w-3 h-3 mr-1' />
                                  {profile.lastActive}
                                </span>
                                <span className='flex items-center'>
                                  <Activity className='w-3 h-3 mr-1' />
                                  Active
                                </span>
                              </div>
                              <div className='grid grid-cols-3 gap-2'>
                                <Button 
                                  variant='outline' 
                                  size='sm' 
                                  className='border-gray-300'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLike(profile.id)
                                  }}
                                >
                                  <Heart className='w-4 h-4' />
                                </Button>
                                <Button 
                                  size='sm'
                                  className='bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMessage(profile.id)
                                  }}
                                >
                                  <MessageCircle className='w-4 h-4 mr-1' />
                                  Chat
                                </Button>
                                <Button 
                                  variant='outline' 
                                  size='sm'
                                  className='border-purple-300 text-purple-600'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSuperLike(profile.id)
                                  }}
                                >
                                  <Star className='w-4 h-4' />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </TabsContent>

                <TabsContent value='matches'>
                  <div className='text-center py-12'>
                    <CheckCircle className='w-16 h-16 mx-auto mb-4 text-emerald-500' />
                    <h3 className='text-xl font-semibold mb-2'>Your Matches</h3>
                    <p className='text-gray-600'>View all your successful matches here</p>
                  </div>
                </TabsContent>

                <TabsContent value='liked'>
                  <div className='text-center py-12'>
                    <Heart className='w-16 h-16 mx-auto mb-4 text-pink-500' />
                    <h3 className='text-xl font-semibold mb-2'>People Who Liked You</h3>
                    <p className='text-gray-600'>See who&apos;s interested in you</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}