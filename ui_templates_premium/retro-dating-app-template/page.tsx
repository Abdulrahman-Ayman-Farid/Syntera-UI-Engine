'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Users, Heart, MessageCircle, Settings, HelpCircle,
  Search, Filter, Star, Zap, TrendingUp, Activity,
  Clock, MapPin, Sparkles, CheckCircle, Eye
} from 'lucide-react'

// Match metrics with retro theme
const MATCH_METRICS = [
  {
    id: 'online_matches',
    label: 'Online Matches',
    value: '89',
    change: '+12',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-[#00FFFF] to-[#00AAAA]',
    format: 'count'
  },
  {
    id: 'messages_today',
    label: 'Messages Today',
    value: '156',
    change: '+28',
    status: 'increasing' as const,
    icon: MessageCircle,
    color: 'from-[#FF00FF] to-[#AA00AA]',
    format: 'count'
  },
  {
    id: 'avg_match_score',
    label: 'Avg Match Score',
    value: '84',
    unit: '%',
    change: '+7%',
    status: 'good' as const,
    icon: Sparkles,
    color: 'from-[#FFFF00] to-[#AAAA00]',
    format: 'percent'
  },
  {
    id: 'super_likes',
    label: 'Super Likes',
    value: '24',
    change: '+5',
    status: 'increasing' as const,
    icon: Star,
    color: 'from-[#FF6600] to-[#AA4400]',
    format: 'count'
  }
] as const

// Match status types
const MATCH_STATUSES = {
  online: { label: 'Online', color: 'bg-[#00FF00] text-black border-[#00FF00]', bgColor: '#00FF00' },
  offline: { label: 'Offline', color: 'bg-gray-500 text-white border-gray-500', bgColor: '#808080' },
  away: { label: 'Away', color: 'bg-[#FFFF00] text-black border-[#FFFF00]', bgColor: '#FFFF00' },
  busy: { label: 'Busy', color: 'bg-[#FF0000] text-white border-[#FF0000]', bgColor: '#FF0000' }
} as const

// Profile data with retro styling
const PROFILES_DATA = [
  { 
    id: 1, 
    name: 'John Doe', 
    age: 29,
    bio: 'Retro gamer and synthwave enthusiast 🎮',
    image: 'https://via.placeholder.com/150', 
    status: 'online' as const,
    matchScore: 88,
    location: 'Neon City',
    interests: ['Gaming', 'Music', 'Art'],
    lastActive: 'Online now'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    age: 27,
    bio: 'Digital artist exploring the metaverse ✨',
    image: 'https://via.placeholder.com/150', 
    status: 'offline' as const,
    matchScore: 92,
    location: 'Cyber District',
    interests: ['Art', 'VR', 'Design'],
    lastActive: '2 hours ago'
  },
  { 
    id: 3, 
    name: 'Alice Johnson', 
    age: 25,
    bio: 'Synthwave producer and pixel artist 🎵',
    image: 'https://via.placeholder.com/150', 
    status: 'away' as const,
    matchScore: 85,
    location: 'Electric Avenue',
    interests: ['Music', 'Pixel Art', 'Coding'],
    lastActive: '30 min ago'
  },
  { 
    id: 4, 
    name: 'Bob Williams', 
    age: 31,
    bio: 'VR developer and arcade collector 🕹️',
    image: 'https://via.placeholder.com/150', 
    status: 'online' as const,
    matchScore: 79,
    location: 'Virtual Plaza',
    interests: ['VR', 'Gaming', 'Tech'],
    lastActive: 'Online now'
  },
  { 
    id: 5, 
    name: 'Eve Anderson', 
    age: 26,
    bio: 'Cyberpunk fashion designer 👗',
    image: 'https://via.placeholder.com/150', 
    status: 'busy' as const,
    matchScore: 91,
    location: 'Neon Heights',
    interests: ['Fashion', 'Design', 'Photography'],
    lastActive: '5 min ago'
  },
  { 
    id: 6, 
    name: 'Charlie Brown', 
    age: 28,
    bio: 'Retro tech collector and DJ 🎧',
    image: 'https://via.placeholder.com/150', 
    status: 'online' as const,
    matchScore: 86,
    location: 'Chrome City',
    interests: ['Music', 'Tech', 'Collecting'],
    lastActive: 'Online now'
  }
] as const

// Activity data for charts
const ACTIVITY_DATA = [
  { day: 'Mon', matches: 15, chats: 42, likes: 28 },
  { day: 'Tue', matches: 22, chats: 58, likes: 35 },
  { day: 'Wed', matches: 18, chats: 52, likes: 41 },
  { day: 'Thu', matches: 25, chats: 68, likes: 38 },
  { day: 'Fri', matches: 32, chats: 85, likes: 52 },
  { day: 'Sat', matches: 40, chats: 98, likes: 65 },
  { day: 'Sun', matches: 28, chats: 72, likes: 48 }
] as const

const MATCH_SCORE_TREND = [
  { week: 'W1', score: 75 },
  { week: 'W2', score: 78 },
  { week: 'W3', score: 81 },
  { week: 'W4', score: 84 },
  { week: 'W5', score: 82 },
  { week: 'W6', score: 87 }
] as const

const RetroDatingAppTemplate = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProfiles, setFilteredProfiles] = useState([...PROFILES_DATA])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('matches')
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    setTimeout(() => {
      try {
        setFilteredProfiles([...PROFILES_DATA])
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load profiles')
        setIsLoading(false)
      }
    }, 800)
  }, [])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredData = useMemo(() => {
    return filteredProfiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || profile.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [filteredProfiles, searchTerm, filterStatus])

  const handleLike = useCallback((userId: number) => {
    console.log('Liked user:', userId)
  }, [])

  const handleMessage = useCallback((userId: number) => {
    console.log('Message user:', userId)
    router.push(`/messages/${userId}`)
  }, [router])

  const openUserDetails = useCallback((userId: number) => {
    setSelectedProfile(userId)
    router.push(`/users/${userId}`)
  }, [router])

  return (
    <div className='bg-[#121212] text-white min-h-screen flex flex-col'>
      {/* Retro Header */}
      <header className='sticky top-0 z-50 p-6 bg-[#00FFFF] bg-radial-gradient-from-center via-transparent to-black text-black border-b-4 border-[#FF00FF]'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] rounded-lg shadow-lg animate-pulse'>
              <Heart className='w-8 h-8 text-black' />
            </div>
            <div>
              <h1 className='text-4xl font-bold drop-shadow-[2px_2px_0_#FF00FF] [text-shadow:2px_2px_0_#FF00FF,4px_4px_0_#00FFFF]'>
                MatchMaker
              </h1>
              <p className='text-sm font-semibold'>Retro Dating Experience</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-40 bg-[#1E1E1E] border-2 border-[#00FFFF] text-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='week'>This Week</SelectItem>
                <SelectItem value='month'>This Month</SelectItem>
                <SelectItem value='year'>This Year</SelectItem>
              </SelectContent>
            </Select>
            <button className='bg-[#FF00FF] hover:bg-[#FF80FF] px-6 py-2 rounded-xl transition-colors duration-300 font-bold'>
              Messages
            </button>
            <button className='bg-[#FFFF00] hover:bg-[#FFFF80] px-6 py-2 rounded-xl transition-colors duration-300 font-bold text-black'>
              Notifications
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className='border-b-2 border-t-2 border-[#00FFFF] bg-[#1E1E1E]'>
        <div className='container mx-auto p-4'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full md:w-fit gap-2 bg-transparent'>
              <TabsTrigger 
                value='matches' 
                className='data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black'
              >
                Matches
              </TabsTrigger>
              <TabsTrigger 
                value='analytics'
                className='data-[state=active]:bg-[#FF00FF] data-[state=active]:text-black'
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value='messages'
                className='data-[state=active]:bg-[#FFFF00] data-[state=active]:text-black'
              >
                Messages
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      <main className='flex-1 p-6 space-y-8'>
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className='cursor-pointer'
                >
                  <Card className='h-full bg-[#1E1E1E] border-2 border-[#00FFFF] shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-bold text-[#00FFFF] uppercase'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-3xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-[#FFFF00]'>{metric.unit}</span>
                            )}
                          </div>
                          <div className='flex items-center text-sm font-bold text-[#00FF00]'>
                            <TrendingUp className='w-4 h-4 mr-1' />
                            {metric.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg animate-pulse`}>
                          <metric.icon className='w-6 h-6 text-black' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Tabs Content */}
        <TabsContent value='matches' className='space-y-6'>
          <Card className='bg-[#1E1E1E] border-2 border-[#00FFFF]'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-2xl font-bold text-[#00FFFF]'>Discover Matches</CardTitle>
                  <CardDescription className='text-gray-400'>Find your perfect retro match</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='relative'>
                    <Input
                      id='search'
                      placeholder='Search matches...'
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className='w-64 bg-[#1E1E1E] border-2 border-[#00FFFF] focus:border-[#FF00FF] focus:outline-none focus:ring-2 focus:ring-[#FF00FF] rounded-xl text-white pl-10'
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#00FFFF]' />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className='w-40 bg-[#1E1E1E] border-2 border-[#00FFFF] text-white'>
                      <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='online'>Online</SelectItem>
                      <SelectItem value='offline'>Offline</SelectItem>
                      <SelectItem value='away'>Away</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {[1, 2, 3].map(skeletonId => (
                    <Skeleton key={skeletonId} className='h-80 animate-pulse rounded-xl bg-[#2A2A2A]' />
                  ))}
                </div>
              ) : error ? (
                <div className='text-[#FF00FF] text-center py-12'>{error}</div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                  <AnimatePresence>
                    {filteredData.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        layoutId={`profile-${profile.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        className='cursor-pointer'
                        onClick={() => openUserDetails(profile.id)}
                      >
                        <Card className='h-full bg-[#1E1E1E] border-2 border-[#FF00FF] hover:border-[#00FFFF] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all'>
                          <CardContent className='relative p-0'>
                            <div className='absolute inset-0 bg-gradient-to-br from-[#FF00FF]/20 to-[#00FFFF]/20 rounded-t-xl'></div>
                            <div className='relative h-48 bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] rounded-t-xl flex items-center justify-center'>
                              <Avatar className='w-32 h-32 border-4 border-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.8)]'>
                                <AvatarImage src={profile.image} alt={`${profile.name}'s avatar`} />
                                <AvatarFallback className='text-3xl bg-[#00FFFF] text-black'>
                                  {profile.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <Badge 
                                className={`absolute top-3 right-3 ${MATCH_STATUSES[profile.status].color} font-bold px-3 py-1`}
                              >
                                {MATCH_STATUSES[profile.status].label}
                              </Badge>
                            </div>
                            <div className='p-4 space-y-3'>
                              <div className='flex justify-between items-start'>
                                <div>
                                  <h3 className='font-bold text-xl text-white'>{profile.name}, {profile.age}</h3>
                                  <p className='text-sm text-[#00FFFF] flex items-center'>
                                    <MapPin className='w-3 h-3 mr-1' />
                                    {profile.location}
                                  </p>
                                </div>
                                <div className='text-right'>
                                  <div className='flex items-center space-x-1'>
                                    <Sparkles className='w-5 h-5 text-[#FFFF00]' />
                                    <span className='text-2xl font-bold text-[#FFFF00]'>{profile.matchScore}%</span>
                                  </div>
                                  <p className='text-xs text-gray-400'>Match</p>
                                </div>
                              </div>
                              <p className='text-sm text-gray-400 line-clamp-2'>{profile.bio}</p>
                              <div className='flex flex-wrap gap-2'>
                                {profile.interests.map((interest, i) => (
                                  <Badge 
                                    key={i} 
                                    variant='outline' 
                                    className='text-xs border-[#00FFFF] text-[#00FFFF]'
                                  >
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                              <Progress 
                                value={profile.matchScore} 
                                className='h-2 bg-[#2A2A2A]'
                              />
                              <Separator className='bg-[#00FFFF]' />
                              <div className='flex items-center justify-between text-xs text-gray-400'>
                                <span className='flex items-center'>
                                  <Clock className='w-3 h-3 mr-1 text-[#00FFFF]' />
                                  {profile.lastActive}
                                </span>
                                <span className='flex items-center'>
                                  <Activity className='w-3 h-3 mr-1 text-[#00FF00]' />
                                  Active
                                </span>
                              </div>
                              <div className='grid grid-cols-3 gap-2 pt-2'>
                                <Button 
                                  variant='outline' 
                                  size='sm' 
                                  className='border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLike(profile.id)
                                  }}
                                >
                                  <Heart className='w-4 h-4' />
                                </Button>
                                <Button 
                                  size='sm'
                                  className='bg-[#00FFFF] text-black hover:bg-[#00AAAA] font-bold'
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
                                  className='border-2 border-[#FFFF00] text-[#FFFF00] hover:bg-[#FFFF00] hover:text-black'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                >
                                  <Star className='w-4 h-4' />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='analytics' className='space-y-6'>
          {/* Activity Chart */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <section data-template-section='activity-chart' data-chart-type='bar' data-metrics='matches,chats,likes'>
              <Card className='bg-[#1E1E1E] border-2 border-[#00FFFF]'>
                <CardHeader>
                  <CardTitle className='text-xl font-bold text-[#00FFFF]'>Weekly Activity</CardTitle>
                  <CardDescription className='text-gray-400'>Your dating activity breakdown</CardDescription>
                </CardHeader>
                <CardContent className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={ACTIVITY_DATA}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#2A2A2A' />
                      <XAxis dataKey='day' stroke='#00FFFF' />
                      <YAxis stroke='#00FFFF' />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E1E1E', 
                          border: '2px solid #00FFFF',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey='matches' fill='#FF00FF' name='Matches' radius={[8, 8, 0, 0]} />
                      <Bar dataKey='chats' fill='#00FFFF' name='Chats' radius={[8, 8, 0, 0]} />
                      <Bar dataKey='likes' fill='#FFFF00' name='Likes' radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>

            <section data-template-section='match-score-trend' data-chart-type='line' data-metrics='score'>
              <Card className='bg-[#1E1E1E] border-2 border-[#FF00FF]'>
                <CardHeader>
                  <CardTitle className='text-xl font-bold text-[#FF00FF]'>Match Score Trend</CardTitle>
                  <CardDescription className='text-gray-400'>Your compatibility progression</CardDescription>
                </CardHeader>
                <CardContent className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={MATCH_SCORE_TREND}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#2A2A2A' />
                      <XAxis dataKey='week' stroke='#FF00FF' />
                      <YAxis stroke='#FF00FF' />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E1E1E', 
                          border: '2px solid #FF00FF',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type='monotone' 
                        dataKey='score' 
                        stroke='#00FFFF' 
                        strokeWidth={3}
                        name='Match Score'
                        dot={{ fill: '#FFFF00', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>
          </div>
        </TabsContent>

        <TabsContent value='messages'>
          <Card className='bg-[#1E1E1E] border-2 border-[#FFFF00]'>
            <CardHeader>
              <CardTitle className='text-xl font-bold text-[#FFFF00]'>Messages</CardTitle>
              <CardDescription className='text-gray-400'>Your conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='mb-4'>
                <Input
                  placeholder='Search conversations...'
                  className='w-full bg-[#1E1E1E] border-2 border-[#00FFFF] focus:border-[#FF00FF] text-white'
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className='border-b-2 border-[#00FFFF]'>
                    <TableHead className='text-[#00FFFF] font-bold'>ID</TableHead>
                    <TableHead className='text-[#00FFFF] font-bold'>Name</TableHead>
                    <TableHead className='text-[#00FFFF] font-bold'>Status</TableHead>
                    <TableHead className='text-[#00FFFF] font-bold'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PROFILES_DATA.slice(0, 4).map(profile => (
                    <TableRow key={profile.id} className='border-b border-[#2A2A2A] hover:bg-[#2A2A2A]'>
                      <TableCell className='font-medium text-white'>{profile.id}</TableCell>
                      <TableCell className='text-white'>{profile.name}</TableCell>
                      <TableCell>
                        <Badge className={MATCH_STATUSES[profile.status].color}>
                          {MATCH_STATUSES[profile.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size='sm' 
                          variant='ghost'
                          className='text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black'
                          aria-label='Message'
                        >
                          <MessageCircle className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </main>

      <footer className='p-6 bg-[#00FFFF] bg-radial-gradient-from-center via-transparent to-black text-black border-t-4 border-[#FF00FF]'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center'>
            <span className='font-bold'>&copy; 2024 MatchMaker Inc. - Retro Edition</span>
            <div className='flex items-center space-x-6'>
              <HelpCircle 
                className='cursor-pointer hover:text-[#FF00FF] transition-colors' 
                size={28} 
                aria-label='Help' 
              />
              <Settings 
                className='cursor-pointer hover:text-[#FF00FF] transition-colors' 
                size={28} 
                aria-label='Settings' 
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RetroDatingAppTemplate;