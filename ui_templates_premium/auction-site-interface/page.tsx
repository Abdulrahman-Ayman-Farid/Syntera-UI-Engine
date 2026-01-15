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
  Gavel, TrendingUp, Clock, Users, DollarSign, 
  Search, Filter, Plus, Eye, Heart, Share2,
  Star, AlertCircle, CheckCircle, Zap, Trophy,
  Tag, Calendar, Hash, Flame, Bell, Settings,
  ArrowUp, ArrowDown, MoreVertical, ExternalLink
} from 'lucide-react'

// Auction metrics with type-safe constants
const AUCTION_METRICS = [
  {
    id: 'active_auctions',
    label: 'Active Auctions',
    value: '342',
    change: '+28',
    status: 'increasing' as const,
    icon: Gavel,
    color: 'from-blue-500 to-cyan-500',
    format: 'count' as const
  },
  {
    id: 'total_bids',
    label: 'Total Bids Today',
    value: '1,847',
    change: '+156',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    format: 'count' as const
  },
  {
    id: 'ending_soon',
    label: 'Ending Soon',
    value: '24',
    change: '-5',
    status: 'warning' as const,
    icon: Clock,
    color: 'from-orange-500 to-red-500',
    format: 'count' as const
  },
  {
    id: 'total_value',
    label: 'Total Value',
    value: '284',
    unit: 'K',
    change: '+12%',
    status: 'good' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency' as const
  }
] as const

const AUCTION_CATEGORIES = [
  { name: 'Electronics', count: 89, trend: '+15%', color: '#3b82f6' },
  { name: 'Collectibles', count: 124, trend: '+22%', color: '#8b5cf6' },
  { name: 'Art & Antiques', count: 56, trend: '+8%', color: '#ec4899' },
  { name: 'Jewelry', count: 73, trend: '+18%', color: '#f59e0b' },
] as const

const LIVE_AUCTIONS = [
  {
    id: 'auction-001',
    title: 'Vintage Rolex Submariner',
    category: 'jewelry',
    currentBid: 12500,
    bidCount: 47,
    timeRemaining: 3600, // seconds
    startPrice: 8000,
    reserveMet: true,
    imageUrl: '⌚',
    seller: 'LuxuryDealer',
    watchers: 156,
    status: 'hot' as const
  },
  {
    id: 'auction-002',
    title: 'Original iPhone First Gen',
    category: 'electronics',
    currentBid: 4200,
    bidCount: 82,
    timeRemaining: 7200,
    startPrice: 1000,
    reserveMet: true,
    imageUrl: '📱',
    seller: 'TechCollector',
    watchers: 234,
    status: 'active' as const
  },
  {
    id: 'auction-003',
    title: 'Picasso Limited Edition Print',
    category: 'art',
    currentBid: 28000,
    bidCount: 34,
    timeRemaining: 1800,
    startPrice: 20000,
    reserveMet: true,
    imageUrl: '🖼️',
    seller: 'ArtGalleryNY',
    watchers: 89,
    status: 'ending' as const
  },
  {
    id: 'auction-004',
    title: 'Rare Pokemon Card Collection',
    category: 'collectibles',
    currentBid: 6800,
    bidCount: 125,
    timeRemaining: 10800,
    startPrice: 3000,
    reserveMet: true,
    imageUrl: '🃏',
    seller: 'CardMaster',
    watchers: 421,
    status: 'active' as const
  },
  {
    id: 'auction-005',
    title: 'Antique Persian Rug',
    category: 'antiques',
    currentBid: 3500,
    bidCount: 19,
    timeRemaining: 5400,
    startPrice: 2500,
    reserveMet: false,
    imageUrl: '🏺',
    seller: 'AntiqueWorld',
    watchers: 67,
    status: 'reserve_not_met' as const
  },
  {
    id: 'auction-006',
    title: 'Gaming PC RTX 4090',
    category: 'electronics',
    currentBid: 2800,
    bidCount: 94,
    timeRemaining: 900,
    startPrice: 2000,
    reserveMet: true,
    imageUrl: '💻',
    seller: 'PCBuilder',
    watchers: 312,
    status: 'ending' as const
  },
] as const

const BID_ACTIVITY_DATA = [
  { hour: '00:00', bids: 145, value: 28000 },
  { hour: '04:00', bids: 89, value: 18000 },
  { hour: '08:00', bids: 234, value: 42000 },
  { hour: '12:00', bids: 456, value: 78000 },
  { hour: '16:00', bids: 389, value: 65000 },
  { hour: '20:00', bids: 512, value: 92000 },
] as const

export default function IndustrialAuctionSiteInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('ending_soon')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-300'
      case 'ending': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'reserve_not_met': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    let filtered = [...LIVE_AUCTIONS].filter(auction => {
      const matchesSearch = searchQuery === '' || 
        auction.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        auction.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending_soon':
          return a.timeRemaining - b.timeRemaining
        case 'highest_bid':
          return b.currentBid - a.currentBid
        case 'most_bids':
          return b.bidCount - a.bidCount
        case 'most_watched':
          return b.watchers - a.watchers
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <Gavel className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>AuctionPro Industrial</h1>
                <p className='text-slate-400'>Premium live bidding platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-600 bg-slate-800 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                List Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Auction Metrics */}
        <section data-template-section='auction-metrics' data-component-type='kpi-grid'>
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
                  <Card className='h-full border border-slate-700 bg-slate-800/50 shadow-lg hover:shadow-xl transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-slate-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-orange-400'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <ArrowUp className='w-4 h-4 mr-1' />
                            ) : (
                              <ArrowDown className='w-4 h-4 mr-1' />
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

        {/* Analytics Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='count,trend'>
            <Card className='border border-slate-700 bg-slate-800/50 shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Category Performance</CardTitle>
                    <CardDescription className='text-slate-400'>Auctions by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-500 text-purple-400'>
                    <Trophy className='w-3 h-3 mr-1' />
                    Top 4
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={AUCTION_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='name' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Active Auctions' radius={[8, 8, 0, 0]}>
                      {AUCTION_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Bid Activity */}
          <section data-template-section='bid-activity' data-chart-type='line' data-metrics='bids,value'>
            <Card className='border border-slate-700 bg-slate-800/50 shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Bid Activity</CardTitle>
                    <CardDescription className='text-slate-400'>24-hour bidding trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +42% Today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={BID_ACTIVITY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='hour' stroke='#94a3b8' />
                    <YAxis yAxisId='left' stroke='#94a3b8' />
                    <YAxis yAxisId='right' orientation='right' stroke='#94a3b8' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='bids' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Total Bids'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='value' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Total Value ($)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Live Auctions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Auction Grid */}
          <section data-template-section='auction-grid' data-component-type='product-grid' className='lg:col-span-2'>
            <Card className='border border-slate-700 bg-slate-800/50 shadow-lg'>
              <CardHeader>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Live Auctions</CardTitle>
                    <CardDescription className='text-slate-400'>{filteredAuctions.length} active listings</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
                      <Input
                        placeholder='Search auctions...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-10 w-48 border-slate-600 bg-slate-700 text-white placeholder:text-slate-400'
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-36 border-slate-600 bg-slate-700 text-white'>
                        <SelectValue placeholder='Category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='electronics'>Electronics</SelectItem>
                        <SelectItem value='jewelry'>Jewelry</SelectItem>
                        <SelectItem value='art'>Art</SelectItem>
                        <SelectItem value='collectibles'>Collectibles</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-36 border-slate-600 bg-slate-700 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ending_soon'>Ending Soon</SelectItem>
                        <SelectItem value='highest_bid'>Highest Bid</SelectItem>
                        <SelectItem value='most_bids'>Most Bids</SelectItem>
                        <SelectItem value='most_watched'>Most Watched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredAuctions.map((auction) => (
                      <motion.div
                        key={auction.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -4 }}
                        className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border rounded-xl transition-all cursor-pointer ${
                          selectedAuction === auction.id 
                            ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900' 
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                        onClick={() => setSelectedAuction(auction.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-4xl'>{auction.imageUrl}</div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between mb-2'>
                              <h4 className='font-bold text-white truncate'>{auction.title}</h4>
                              <Badge className={getStatusColor(auction.status)} variant='outline'>
                                {auction.status === 'hot' && <Flame className='w-3 h-3 mr-1' />}
                                {auction.status === 'ending' && <Clock className='w-3 h-3 mr-1' />}
                                {auction.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className='space-y-3'>
                              <div className='flex items-center justify-between text-sm'>
                                <span className='text-slate-400'>Current Bid:</span>
                                <span className='font-bold text-emerald-400'>${auction.currentBid.toLocaleString()}</span>
                              </div>
                              
                              <div className='flex items-center justify-between text-sm'>
                                <span className='text-slate-400'>Time Left:</span>
                                <span className={`font-medium ${
                                  auction.timeRemaining < 3600 ? 'text-orange-400' : 'text-slate-300'
                                }`}>
                                  <Clock className='w-3 h-3 inline mr-1' />
                                  {formatTimeRemaining(auction.timeRemaining)}
                                </span>
                              </div>

                              <div className='flex items-center justify-between text-sm text-slate-400'>
                                <span>{auction.bidCount} bids</span>
                                <span className='flex items-center'>
                                  <Eye className='w-3 h-3 mr-1' />
                                  {auction.watchers} watching
                                </span>
                              </div>

                              <Separator className='bg-slate-700' />

                              <div className='flex items-center justify-between'>
                                <Button variant='ghost' size='sm' className='h-8 text-slate-400 hover:text-white'>
                                  <Heart className='w-4 h-4' />
                                </Button>
                                <Button size='sm' className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'>
                                  Place Bid
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

          {/* Sidebar - Quick Stats & Actions */}
          <section data-template-section='quick-info' data-component-type='info-panel'>
            <div className='space-y-4'>
              {/* Trending Now */}
              <Card className='border border-slate-700 bg-slate-800/50 shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold text-white flex items-center'>
                    <Flame className='w-5 h-5 mr-2 text-orange-500' />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {[
                    { title: 'Vintage Rolex', bids: 47, trending: '+12' },
                    { title: 'Pokemon Cards', bids: 125, trending: '+28' },
                    { title: 'Gaming PC', bids: 94, trending: '+19' }
                  ].map((item, i) => (
                    <div key={i} className='flex items-center justify-between p-3 bg-slate-900/50 rounded-lg'>
                      <div>
                        <div className='font-medium text-white'>{item.title}</div>
                        <div className='text-sm text-slate-400'>{item.bids} bids</div>
                      </div>
                      <div className='text-emerald-400 text-sm font-medium'>
                        <TrendingUp className='w-4 h-4 inline' /> {item.trending}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className='border border-slate-700 bg-slate-800/50 shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {[
                    { icon: Gavel, label: 'My Bids', color: 'from-blue-500 to-cyan-500' },
                    { icon: Eye, label: 'Watchlist', color: 'from-purple-500 to-pink-500' },
                    { icon: Trophy, label: 'Won Auctions', color: 'from-emerald-500 to-teal-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-slate-700 hover:border-slate-600 bg-slate-900/50 text-white h-12'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Bid Summary */}
              <Card className='border border-slate-700 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-lg'>
                <CardContent className='p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-slate-300'>Your Active Bids</span>
                    <span className='text-2xl font-bold text-white'>8</span>
                  </div>
                  <Separator className='bg-slate-700' />
                  <div className='flex items-center justify-between'>
                    <span className='text-slate-300'>Watchlist Items</span>
                    <span className='text-2xl font-bold text-white'>24</span>
                  </div>
                  <Separator className='bg-slate-700' />
                  <div className='flex items-center justify-between'>
                    <span className='text-slate-300'>Won This Month</span>
                    <span className='text-2xl font-bold text-emerald-400'>3</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}