'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, MessageCircle, MapPin, Star, Search, Filter,
  TrendingUp, TrendingDown, Users, Activity, Clock,
  Sparkles, CheckCircle, Eye, User, Zap, Award,
  ThumbsUp, MessageSquare, Calendar, Phone
} from 'lucide-react'

// Premium dating metrics
const MATCH_METRICS = [
  {
    id: 'quality_matches',
    label: 'Quality Matches',
    value: '186',
    change: '+24',
    status: 'increasing' as const,
    icon: Award,
    color: 'from-amber-500 to-yellow-500',
    format: 'count'
  },
  {
    id: 'verified_profiles',
    label: 'Verified Profiles',
    value: '142',
    change: '+18',
    status: 'increasing' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-500',
    format: 'count'
  },
  {
    id: 'compatibility',
    label: 'Avg Compatibility',
    value: '91',
    unit: '%',
    change: '+6%',
    status: 'good' as const,
    icon: Sparkles,
    color: 'from-purple-500 to-violet-500',
    format: 'percent'
  },
  {
    id: 'response_rate',
    label: 'Response Rate',
    value: '78',
    unit: '%',
    change: '+12%',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    format: 'percent'
  }
] as const

// Match statuses
const MATCH_STATUSES = {
  verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  premium: { label: 'Premium', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  featured: { label: 'Featured', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  new: { label: 'New', color: 'bg-blue-100 text-blue-800 border-blue-300' }
} as const

// Premium profile data
const PROFILES_DATA = [
  { 
    id: 1, 
    name: 'Alice Johnson', 
    age: 28, 
    location: 'New York, NY', 
    bio: 'Coffee lover, outdoor enthusiast, and adventure seeker 🏔️', 
    image: '/alice.jpg',
    matchPercentage: 95,
    verified: true,
    interests: ['Coffee', 'Hiking', 'Travel', 'Photography'],
    status: 'verified' as const,
    distance: '2 miles away',
    lastActive: 'Active now',
    premium: true
  },
  { 
    id: 2, 
    name: 'Bob Smith', 
    age: 34, 
    location: 'Los Angeles, CA', 
    bio: 'Musician, foodie, and life enthusiast. Let\'s create memories! 🎸', 
    image: '/bob.jpg',
    matchPercentage: 92,
    verified: true,
    interests: ['Music', 'Dining', 'Art', 'Concerts'],
    status: 'premium' as const,
    distance: '5 miles away',
    lastActive: '2 hours ago',
    premium: true
  },
  { 
    id: 3, 
    name: 'Charlie Brown', 
    age: 22, 
    location: 'Chicago, IL', 
    bio: 'Tech geek, sports fan, and fitness enthusiast 💪', 
    image: '/charlie.jpg',
    matchPercentage: 88,
    verified: true,
    interests: ['Tech', 'Sports', 'Fitness', 'Gaming'],
    status: 'featured' as const,
    distance: '1 mile away',
    lastActive: '30 min ago',
    premium: false
  },
  { 
    id: 4, 
    name: 'Diana Prince', 
    age: 29, 
    location: 'Miami, FL', 
    bio: 'Yoga instructor, wellness coach, beach lover 🧘‍♀️', 
    image: '/diana.jpg',
    matchPercentage: 94,
    verified: true,
    interests: ['Yoga', 'Wellness', 'Beach', 'Meditation'],
    status: 'verified' as const,
    distance: '3 miles away',
    lastActive: 'Active now',
    premium: true
  },
  { 
    id: 5, 
    name: 'Ethan Clark', 
    age: 31, 
    location: 'Seattle, WA', 
    bio: 'Software engineer, coffee snob, hiking enthusiast ☕', 
    image: '/ethan.jpg',
    matchPercentage: 89,
    verified: true,
    interests: ['Coding', 'Coffee', 'Hiking', 'Reading'],
    status: 'new' as const,
    distance: '4 miles away',
    lastActive: '1 hour ago',
    premium: false
  },
  { 
    id: 6, 
    name: 'Fiona Green', 
    age: 27, 
    location: 'Austin, TX', 
    bio: 'Marketing professional, wine lover, travel addict 🍷', 
    image: '/fiona.jpg',
    matchPercentage: 90,
    verified: true,
    interests: ['Marketing', 'Wine', 'Travel', 'Food'],
    status: 'premium' as const,
    distance: '2 miles away',
    lastActive: '15 min ago',
    premium: true
  }
] as const

// Activity data for charts
const ACTIVITY_DATA = [
  { week: 'W1', matches: 28, messages: 85, likes: 42 },
  { week: 'W2', matches: 35, messages: 102, likes: 58 },
  { week: 'W3', matches: 32, messages: 98, likes: 52 },
  { week: 'W4', matches: 42, messages: 125, likes: 68 },
  { week: 'W5', matches: 38, messages: 115, likes: 62 },
  { week: 'W6', matches: 45, messages: 135, likes: 75 }
] as const

const COMPATIBILITY_TRENDS = [
  { month: 'Jan', score: 82 },
  { month: 'Feb', score: 85 },
  { month: 'Mar', score: 87 },
  { month: 'Apr', score: 89 },
  { month: 'May', score: 90 },
  { month: 'Jun', score: 91 }
] as const

export default function Home() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProfiles, setFilteredProfiles] = useState([...PROFILES_DATA])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [filterDistance, setFilterDistance] = useState('all')
  const [activeTab, setActiveTab] = useState('discover')
  const [timeRange, setTimeRange] = useState('month')

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      setFilteredProfiles([...PROFILES_DATA])
    }, 800)
    return () => {}
  }, [])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return filteredProfiles
    }
    return filteredProfiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, filteredProfiles])

  const handleLike = useCallback((profileId: number) => {
    console.log('Liked profile:', profileId)
  }, [])

  const handleMessage = useCallback((profileId: number) => {
    console.log('Message profile:', profileId)
    router.push(`/messages/${profileId}`)
  }, [router])

  const handleSuperLike = useCallback((profileId: number) => {
    console.log('Super liked profile:', profileId)
  }, [])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50'>
        <div className='space-y-4'>
          <Skeleton className='w-96 h-80 animate-pulse rounded-3xl' />
          <Skeleton className='w-96 h-20 animate-pulse rounded-2xl' />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50'>
      {/* Premium Header */}
      <header className='sticky top-0 z-50 border-b border-amber-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' fill='white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent'>
                  Premium Match
                </h1>
                <p className='text-gray-600 text-sm'>Find Your Perfect Match</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <Input
                  type='text'
                  placeholder='Search profiles...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='w-72 pl-10 border-amber-300 focus:border-amber-500 rounded-full'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-amber-300 rounded-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Badge className='bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-2 text-sm font-semibold'>
                <Award className='w-4 h-4 mr-1' />
                Premium
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8 max-w-7xl mx-auto'>
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
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className='h-full border border-amber-200 shadow-sm hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-3xl font-bold text-gray-900'>{metric.value}</span>
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
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}>
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
            <Card className='border border-amber-200 shadow-sm bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Weekly Activity</CardTitle>
                    <CardDescription>Your engagement metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-300 text-amber-700'>
                    <Activity className='w-3 h-3 mr-1' />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={ACTIVITY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='week' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='matches' fill='#f59e0b' name='Matches' radius={[8, 8, 0, 0]} />
                    <Bar dataKey='messages' fill='#3b82f6' name='Messages' radius={[8, 8, 0, 0]} />
                    <Bar dataKey='likes' fill='#ec4899' name='Likes' radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Compatibility Trends */}
          <section data-template-section='compatibility-trends' data-chart-type='line' data-metrics='score'>
            <Card className='border border-amber-200 shadow-sm bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Compatibility Score</CardTitle>
                    <CardDescription>Your match quality over time</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-300 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +11% Growth
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
                      dataKey='score' 
                      stroke='#8b5cf6' 
                      strokeWidth={3}
                      name='Compatibility Score'
                      dot={{ fill: '#8b5cf6', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Profile Browser */}
        <section data-template-section='profile-browser' data-component-type='profile-grid'>
          <Card className='border border-amber-200 shadow-sm bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-2xl font-bold'>Featured Matches</CardTitle>
                  <CardDescription>Premium profiles matched to your preferences</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Select value={filterDistance} onValueChange={setFilterDistance}>
                    <SelectTrigger className='w-48 border-amber-300 rounded-full'>
                      <SelectValue placeholder='Distance' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Distances</SelectItem>
                      <SelectItem value='5'>Within 5 miles</SelectItem>
                      <SelectItem value='10'>Within 10 miles</SelectItem>
                      <SelectItem value='25'>Within 25 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className='grid w-full grid-cols-3 mb-6'>
                  <TabsTrigger value='discover'>Discover</TabsTrigger>
                  <TabsTrigger value='verified'>Verified</TabsTrigger>
                  <TabsTrigger value='premium'>Premium</TabsTrigger>
                </TabsList>
                
                <TabsContent value='discover'>
                  {error ? (
                    <div className='text-center py-12 text-red-500'>
                      <p className='text-lg font-semibold'>{error}</p>
                    </div>
                  ) : filteredData.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      <AnimatePresence>
                        {filteredData.map((profile, index) => (
                          <motion.div
                            key={profile.id}
                            layoutId={`profile-${profile.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`cursor-pointer ${
                              selectedProfile === profile.id ? 'ring-2 ring-amber-500 ring-offset-2' : ''
                            }`}
                            onClick={() => setSelectedProfile(profile.id)}
                          >
                            <Card className='h-full border border-amber-200 shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white'>
                              <div className='relative h-72 bg-gradient-to-br from-amber-100 to-rose-100'>
                                <div className='absolute inset-0 flex items-center justify-center text-7xl font-bold text-white'>
                                  {profile.name.charAt(0)}
                                </div>
                                <Badge 
                                  className={`absolute top-4 right-4 ${MATCH_STATUSES[profile.status].color} font-semibold`}
                                >
                                  {MATCH_STATUSES[profile.status].label}
                                </Badge>
                                {profile.verified && (
                                  <div className='absolute top-4 left-4 bg-emerald-500 text-white rounded-full p-2'>
                                    <CheckCircle className='w-5 h-5' />
                                  </div>
                                )}
                                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
                                  <div className='flex items-center justify-between text-white'>
                                    <div>
                                      <h3 className='text-xl font-bold'>{profile.name}, {profile.age}</h3>
                                      <p className='text-sm flex items-center'>
                                        <MapPin className='w-3 h-3 mr-1' />
                                        {profile.location}
                                      </p>
                                    </div>
                                    <div className='text-right'>
                                      <div className='flex items-center space-x-1 justify-end'>
                                        <Sparkles className='w-5 h-5 text-amber-300' />
                                        <span className='text-2xl font-bold'>{profile.matchPercentage}%</span>
                                      </div>
                                      <p className='text-xs'>Match</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <CardContent className='p-5 space-y-4'>
                                <p className='text-sm text-gray-700 line-clamp-2'>{profile.bio}</p>
                                <div className='flex flex-wrap gap-2'>
                                  {profile.interests.slice(0, 3).map((interest, i) => (
                                    <Badge 
                                      key={i} 
                                      variant='outline' 
                                      className='text-xs border-amber-300 text-amber-700'
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                                <Progress value={profile.matchPercentage} className='h-2' />
                                <Separator />
                                <div className='flex items-center justify-between text-xs text-gray-500'>
                                  <span className='flex items-center'>
                                    <MapPin className='w-3 h-3 mr-1' />
                                    {profile.distance}
                                  </span>
                                  <span className='flex items-center'>
                                    <Clock className='w-3 h-3 mr-1' />
                                    {profile.lastActive}
                                  </span>
                                </div>
                                <div className='grid grid-cols-3 gap-2 pt-2'>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='border-rose-300 text-rose-600 hover:bg-rose-50'
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleLike(profile.id)
                                    }}
                                  >
                                    <Heart className='w-4 h-4' />
                                  </Button>
                                  <Button 
                                    size='sm'
                                    className='bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white'
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
                                    className='border-amber-300 text-amber-600 hover:bg-amber-50'
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSuperLike(profile.id)
                                    }}
                                  >
                                    <Star className='w-4 h-4' />
                                  </Button>
                                </div>
                                <Button 
                                  variant='ghost' 
                                  className='w-full mt-2' 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/profile/${profile.id}`)
                                  }}
                                >
                                  View Full Profile
                                  <Eye className='w-4 h-4 ml-2' />
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <Users className='w-16 h-16 mx-auto mb-4 text-gray-400' />
                      <p className='text-gray-600'>No matches found.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value='verified'>
                  <div className='text-center py-12'>
                    <CheckCircle className='w-16 h-16 mx-auto mb-4 text-emerald-500' />
                    <h3 className='text-xl font-semibold mb-2'>Verified Profiles</h3>
                    <p className='text-gray-600'>Browse authentic, verified members</p>
                  </div>
                </TabsContent>

                <TabsContent value='premium'>
                  <div className='text-center py-12'>
                    <Award className='w-16 h-16 mx-auto mb-4 text-amber-500' />
                    <h3 className='text-xl font-semibold mb-2'>Premium Members</h3>
                    <p className='text-gray-600'>Connect with exclusive premium profiles</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials Section */}
        <section data-template-section='testimonials' data-component-type='testimonial-grid' className='mb-12'>
          <Card className='border border-amber-200 bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>Success Stories</CardTitle>
              <CardDescription>Real couples who found love with us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card className='border border-amber-100 bg-gradient-to-br from-amber-50 to-rose-50'>
                  <CardHeader>
                    <CardTitle className='text-lg'>Jane &amp; Michael</CardTitle>
                    <CardDescription>Matched 6 months ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-700'>&quot;Finding my soulmate was easier than ever with this app. Highly recommended!&quot;</p>
                    <div className='flex items-center mt-4 text-amber-500'>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className='w-4 h-4 fill-current' />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className='border border-amber-100 bg-gradient-to-br from-rose-50 to-amber-50'>
                  <CardHeader>
                    <CardTitle className='text-lg'>Sarah &amp; David</CardTitle>
                    <CardDescription>Married 1 year ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-700'>&quot;We met here and now we&apos;re building a life together. Thank you!&quot;</p>
                    <div className='flex items-center mt-4 text-amber-500'>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className='w-4 h-4 fill-current' />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className='py-8 text-center bg-gradient-to-r from-amber-500 to-rose-500 text-white mt-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <p className='font-semibold'>&copy; 2024 Premium Dating App. All rights reserved.</p>
          <p className='text-sm mt-2 opacity-90'>Find Your Perfect Match Today</p>
        </div>
      </footer>
    </div>
  )
}