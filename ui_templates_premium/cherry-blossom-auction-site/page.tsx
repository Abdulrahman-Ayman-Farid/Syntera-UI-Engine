'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
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
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gavel, Clock, DollarSign, Heart, Search, Filter, Plus,
  UserCircle, FolderPlus, CheckCircle, XCircle, RefreshCw,
  TrendingUp, TrendingDown, Eye, Share2, Bell, Star,
  Users, AlertTriangle, Tag, Calendar, Timer, Award
} from 'lucide-react'

// Auction metrics with type-safe constants
const AUCTION_METRICS = [
  {
    id: 'active_auctions',
    label: 'Active Auctions',
    value: '127',
    change: '+18',
    status: 'increasing' as const,
    icon: Gavel,
    color: 'from-pink-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'total_bids',
    label: 'Total Bids Today',
    value: '1,432',
    change: '+24%',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-400',
    format: 'count'
  },
  {
    id: 'avg_bid_value',
    label: 'Avg. Bid Value',
    value: '$4,250',
    change: '+12%',
    status: 'good' as const,
    icon: DollarSign,
    color: 'from-rose-400 to-pink-500',
    format: 'currency'
  },
  {
    id: 'ending_soon',
    label: 'Ending Soon',
    value: '23',
    change: '-5',
    status: 'warning' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

// Cherry blossom themed auction items
const AUCTION_ITEMS = [
  {
    id: 'auction-001',
    name: 'Sakura Ceramic Tea Set',
    description: 'Handcrafted cherry blossom themed tea set',
    currentBid: 850,
    startingBid: 500,
    highestBidder: 'Yuki M.',
    images: ['🌸'],
    category: 'ceramics',
    endTime: '2026-01-15T18:00:00Z',
    status: 'live' as const,
    watchers: 42,
    totalBids: 28,
    thumbnail: '🌸'
  },
  {
    id: 'auction-002',
    name: 'Vintage Cherry Blossom Kimono',
    description: 'Authentic silk kimono with sakura pattern',
    currentBid: 2400,
    startingBid: 1800,
    highestBidder: 'Hana T.',
    images: ['👘'],
    category: 'fashion',
    endTime: '2026-01-15T20:30:00Z',
    status: 'live' as const,
    watchers: 67,
    totalBids: 45,
    thumbnail: '👘'
  },
  {
    id: 'auction-003',
    name: 'Japanese Garden Painting',
    description: 'Original watercolor cherry blossom scene',
    currentBid: 3200,
    startingBid: 2500,
    highestBidder: 'Kenji S.',
    images: ['🖼️'],
    category: 'art',
    endTime: '2026-01-16T14:00:00Z',
    status: 'live' as const,
    watchers: 89,
    totalBids: 62,
    thumbnail: '🖼️'
  },
  {
    id: 'auction-004',
    name: 'Sakura Bonsai Tree',
    description: 'Miniature flowering cherry tree',
    currentBid: 1500,
    startingBid: 1200,
    highestBidder: 'Akiko W.',
    images: ['🌳'],
    category: 'plants',
    endTime: '2026-01-14T22:00:00Z',
    status: 'live' as const,
    watchers: 34,
    totalBids: 19,
    thumbnail: '🌳'
  },
] as const

// Auction activity data for charts
const AUCTION_ACTIVITY = [
  { day: 'Mon', bids: 245, revenue: 58000, auctions: 32 },
  { day: 'Tue', bids: 312, revenue: 72000, auctions: 38 },
  { day: 'Wed', bids: 428, revenue: 95000, auctions: 45 },
  { day: 'Thu', bids: 385, revenue: 88000, auctions: 41 },
  { day: 'Fri', bids: 520, revenue: 125000, auctions: 52 },
  { day: 'Sat', bids: 680, revenue: 158000, auctions: 67 },
  { day: 'Sun', bids: 545, revenue: 132000, auctions: 58 },
] as const

// Category distribution
const AUCTION_CATEGORIES = [
  { category: 'Art & Antiques', count: 45, color: '#FFB3BA' },
  { category: 'Fashion', count: 32, color: '#FFDFDD' },
  { category: 'Ceramics', count: 28, color: '#FFF1D0' },
  { category: 'Jewelry', count: 22, color: '#FFE4E9' },
] as const

export default function CherryBlossomAuctionSite() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState('grid')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-pink-100 text-pink-800 border-pink-300'
    }
  }

  const getTimeRemaining = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const filteredAuctions = useMemo(() => {
    return AUCTION_ITEMS.filter(auction => {
      const matchesSearch = searchQuery === '' || 
        auction.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        auction.category === selectedCategory
      const matchesStatus = filterStatus === 'all' || 
        auction.status === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchQuery, selectedCategory, filterStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50/30'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-pink-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg'>
                <Gavel className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Cherry Blossom Auctions</h1>
                <p className='text-gray-600'>Premium Asian art & collectibles</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-pink-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Create Auction
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Auction Metrics Overview */}
        <section data-template-section='auction-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {AUCTION_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-pink-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : metric.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-rose-600'
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

        {/* Auction Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Auction Activity Chart */}
          <section data-template-section='auction-activity' data-chart-type='bar' data-metrics='bids,revenue'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Auction Activity</CardTitle>
                    <CardDescription>Bids and revenue trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-pink-200 text-pink-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={AUCTION_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='day' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='bids' name='Total Bids' fill='#FFB3BA' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='auctions' name='Auctions' fill='#FFDFDD' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Category Distribution</CardTitle>
                    <CardDescription>Auctions by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <Tag className='w-3 h-3 mr-1' />
                    4 Categories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={AUCTION_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='category' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Auctions' radius={[4, 4, 0, 0]}>
                      {AUCTION_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Auction Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Active Auctions */}
          <section data-template-section='auction-browser' data-component-type='auction-grid' className='lg:col-span-2'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Auctions</CardTitle>
                    <CardDescription>Live cherry blossom themed items</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search auctions...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-pink-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-pink-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value='art'>Art</SelectItem>
                        <SelectItem value='ceramics'>Ceramics</SelectItem>
                        <SelectItem value='fashion'>Fashion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredAuctions.map((auction) => (
                      <motion.div
                        key={auction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-xl hover:border-rose-300 transition-colors cursor-pointer ${
                          selectedAuction === auction.id ? 'ring-2 ring-pink-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedAuction(auction.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-5xl'>{auction.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold'>{auction.name}</h4>
                              <Badge className={getStatusColor(auction.status)}>
                                {auction.status}
                              </Badge>
                            </div>
                            <p className='text-sm text-gray-600 mb-3'>{auction.description}</p>
                            
                            <div className='space-y-2 mb-3'>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>Current Bid</span>
                                <span className='font-bold text-lg text-pink-600'>
                                  ${auction.currentBid.toLocaleString()}
                                </span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>
                                  <Clock className='w-3 h-3 inline mr-1' />
                                  Ends in
                                </span>
                                <span className='font-medium text-sm text-amber-600'>
                                  {getTimeRemaining(auction.endTime)}
                                </span>
                              </div>
                            </div>

                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Eye className='w-3 h-3 mr-1' />
                                {auction.watchers}
                              </span>
                              <span className='flex items-center'>
                                <Gavel className='w-3 h-3 mr-1' />
                                {auction.totalBids} bids
                              </span>
                            </div>

                            <div className='flex items-center justify-between'>
                              <Button size='sm' className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'>
                                <Gavel className='w-3 h-3 mr-1' />
                                Place Bid
                              </Button>
                              <div className='flex items-center space-x-2'>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Heart className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Share2 className='w-4 h-4' />
                                </Button>
                              </div>
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

          {/* Quick Actions & Stats */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-pink-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'Create Auction', color: 'from-pink-500 to-rose-500' },
                    { icon: Eye, label: 'My Watchlist', color: 'from-purple-500 to-pink-400' },
                    { icon: Gavel, label: 'My Bids', color: 'from-rose-400 to-pink-500' },
                    { icon: Award, label: 'Won Auctions', color: 'from-amber-500 to-orange-500' },
                    { icon: UserCircle, label: 'Seller Profile', color: 'from-blue-400 to-cyan-500' },
                    { icon: Bell, label: 'Notifications', color: 'from-indigo-500 to-purple-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-pink-300 hover:border-rose-300 h-14'
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
                      <span className='text-gray-600'>Active Bids</span>
                      <span className='font-medium'>12 / 20</span>
                    </div>
                    <Progress value={60} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Star className='w-5 h-5 text-pink-600' />
                      <div>
                        <div className='font-medium'>Seller Rating</div>
                        <div className='text-sm text-pink-600'>4.8 / 5.0</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Trending & Top Sellers */}
        <section data-template-section='trending-stats' data-component-type='stats-grid'>
          <Card className='border border-pink-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Auction Insights</CardTitle>
                  <CardDescription>Trending items and top performers</CardDescription>
                </div>
                <Button variant='outline' className='border-pink-300'>
                  <TrendingUp className='w-4 h-4 mr-2' />
                  View Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Highest Bid', 
                    value: '$12,500', 
                    item: 'Edo Period Scroll',
                    icon: Award,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Most Watched', 
                    value: '156 watchers', 
                    item: 'Sakura Porcelain Set',
                    icon: Eye,
                    color: 'from-pink-500 to-rose-500'
                  },
                  { 
                    label: 'Ending Soon', 
                    value: '2 hours', 
                    item: 'Cherry Wood Chest',
                    icon: Clock,
                    color: 'from-rose-400 to-pink-500'
                  },
                  { 
                    label: 'Top Seller', 
                    value: '42 sales', 
                    item: 'Hanami Gallery',
                    icon: Users,
                    color: 'from-purple-500 to-pink-400'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-1'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>{stat.item}</div>
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