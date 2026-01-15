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
  BarChart, Bar, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gavel, Clock, TrendingUp, DollarSign, Users, Heart,
  Search, Filter, Plus, Eye, Star, Share2,
  Timer, Award, Zap, Crown, Sparkles, Bell,
  ArrowUp, ArrowDown, Tag, Calendar
} from 'lucide-react'

// Type-safe auction metrics
const AUCTION_METRICS = [
  {
    id: 'live_auctions',
    label: 'Live Auctions',
    value: '156',
    change: '+18',
    status: 'increasing' as const,
    icon: Gavel,
    color: 'from-lavender-400 to-lavender-600',
    format: 'count' as const
  },
  {
    id: 'total_bidders',
    label: 'Active Bidders',
    value: '892',
    change: '+124',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-mint-400 to-mint-600',
    format: 'count' as const
  },
  {
    id: 'ending_today',
    label: 'Ending Today',
    value: '34',
    change: '-8',
    status: 'warning' as const,
    icon: Timer,
    color: 'from-blue-400 to-blue-600',
    format: 'count' as const
  },
  {
    id: 'total_value',
    label: 'Auction Value',
    value: '1.2',
    unit: 'M',
    change: '+22%',
    status: 'good' as const,
    icon: DollarSign,
    color: 'from-purple-400 to-purple-600',
    format: 'currency' as const
  }
] as const

const AUCTION_CATEGORIES = [
  { category: 'Jewelry', count: 45, value: 380000, color: '#D8BFD8' },
  { category: 'Art', count: 38, value: 520000, color: '#E0FFF0' },
  { category: 'Collectibles', count: 52, value: 240000, color: '#ADD8E6' },
  { category: 'Watches', count: 21, value: 180000, color: '#DDA0DD' },
] as const

const PREMIUM_AUCTIONS = [
  {
    id: 'auction-001',
    title: 'Diamond Engagement Ring',
    category: 'jewelry',
    currentBid: 15800,
    minBid: 16000,
    bidCount: 52,
    timeRemaining: 4200,
    startPrice: 12000,
    estimatedValue: 20000,
    imageUrl: '💍',
    seller: { name: 'LuxuryJewels', rating: 4.9 },
    watchers: 234,
    featured: true,
    status: 'hot' as const
  },
  {
    id: 'auction-002',
    title: 'Vintage Oil Painting',
    category: 'art',
    currentBid: 28500,
    minBid: 29000,
    bidCount: 67,
    timeRemaining: 7800,
    startPrice: 18000,
    estimatedValue: 35000,
    imageUrl: '🖼️',
    seller: { name: 'ArtGalleryPro', rating: 5.0 },
    watchers: 412,
    featured: true,
    status: 'active' as const
  },
  {
    id: 'auction-003',
    title: 'Limited Edition Vinyl Record',
    category: 'collectibles',
    currentBid: 4200,
    minBid: 4500,
    bidCount: 89,
    timeRemaining: 1800,
    startPrice: 2500,
    estimatedValue: 6000,
    imageUrl: '🎵',
    seller: { name: 'VintageVault', rating: 4.7 },
    watchers: 178,
    featured: false,
    status: 'ending' as const
  },
  {
    id: 'auction-004',
    title: 'Swiss Automatic Watch',
    category: 'watches',
    currentBid: 8900,
    minBid: 9200,
    bidCount: 43,
    timeRemaining: 10800,
    startPrice: 7000,
    estimatedValue: 12000,
    imageUrl: '⌚',
    seller: { name: 'TimeKeepers', rating: 4.8 },
    watchers: 156,
    featured: true,
    status: 'active' as const
  },
  {
    id: 'auction-005',
    title: 'Antique Chinese Vase',
    category: 'art',
    currentBid: 12000,
    minBid: 12500,
    bidCount: 28,
    timeRemaining: 5400,
    startPrice: 9000,
    estimatedValue: 16000,
    imageUrl: '🏺',
    seller: { name: 'AsianAntiques', rating: 4.6 },
    watchers: 92,
    featured: false,
    status: 'reserve_not_met' as const
  },
  {
    id: 'auction-006',
    title: 'Rare Baseball Card',
    category: 'collectibles',
    currentBid: 3400,
    minBid: 3600,
    bidCount: 156,
    timeRemaining: 900,
    startPrice: 1800,
    estimatedValue: 5000,
    imageUrl: '🃏',
    seller: { name: 'SportsCards', rating: 4.9 },
    watchers: 567,
    featured: true,
    status: 'ending' as const
  },
] as const

const BID_TRENDS_DATA = [
  { time: '9AM', bids: 45, value: 125000 },
  { time: '12PM', bids: 78, value: 240000 },
  { time: '3PM', bids: 92, value: 310000 },
  { time: '6PM', bids: 134, value: 450000 },
  { time: '9PM', bids: 156, value: 520000 },
] as const

export default function PremiumAuctionSiteTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('ending_soon')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '🔥 Hot' }
      case 'ending': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: '⚡ Ending Soon' }
      case 'active': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: '✓ Active' }
      case 'reserve_not_met': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '⚠ Reserve Not Met' }
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Active' }
    }
  }

  const filteredAuctions = useMemo(() => {
    let filtered = [...PREMIUM_AUCTIONS].filter(auction => {
      const matchesSearch = searchQuery === '' || 
        auction.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        auction.category === selectedCategory
      const matchesFeatured = !showFeaturedOnly || auction.featured
      return matchesSearch && matchesCategory && matchesFeatured
    })

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
  }, [searchQuery, selectedCategory, sortBy, showFeaturedOnly])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-lavender-50/30 to-mint-50/30'>
      {/* Sidebar */}
      <aside className='fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 space-y-6'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-gradient-to-r from-lavender-500 to-mint-500 rounded-xl'>
            <Crown className='w-6 h-6 text-white' />
          </div>
          <div>
            <h2 className='font-bold text-lg'>Premium</h2>
            <p className='text-xs text-gray-600'>Auctions</p>
          </div>
        </div>
        
        <nav className='space-y-2'>
          {[
            { icon: Gavel, label: 'All Auctions', active: true },
            { icon: Star, label: 'Featured' },
            { icon: Heart, label: 'Watchlist' },
            { icon: Award, label: 'Won Items' },
            { icon: Users, label: 'My Bids' },
          ].map((item, i) => (
            <Button
              key={i}
              variant={item.active ? 'default' : 'ghost'}
              className={`w-full justify-start ${item.active ? 'bg-gradient-to-r from-lavender-500 to-mint-500' : ''}`}
            >
              <item.icon className='w-4 h-4 mr-3' />
              {item.label}
            </Button>
          ))}
        </nav>

        <Separator />

        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-gray-700'>Categories</h3>
          {['All', 'Jewelry', 'Art', 'Collectibles', 'Watches'].map((cat, i) => (
            <Button
              key={i}
              variant='ghost'
              size='sm'
              className='w-full justify-start text-sm'
            >
              {cat}
            </Button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className='ml-64'>
        {/* Header */}
        <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl'>
          <div className='px-8 py-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-lavender-600 to-mint-600 bg-clip-text text-transparent'>
                  Luxury Auctions
                </h1>
                <p className='text-gray-600'>Premium collectibles & fine items</p>
              </div>
              <div className='flex items-center space-x-4'>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className='w-40 border-gray-300'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='today'>Today</SelectItem>
                    <SelectItem value='week'>This Week</SelectItem>
                    <SelectItem value='month'>This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button className='bg-gradient-to-r from-lavender-500 to-mint-500 hover:from-lavender-600 hover:to-mint-600'>
                  <Plus className='w-4 h-4 mr-2' />
                  List Item
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className='p-8 space-y-8'>
          {/* Metrics */}
          <section data-template-section='metrics' data-component-type='kpi-grid'>
            <motion.div 
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <AnimatePresence>
                {AUCTION_METRICS.map((metric) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Card className='border border-gray-200 shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50'>
                      <CardContent className='p-6'>
                        <div className='flex items-start justify-between'>
                          <div className='space-y-2'>
                            <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                            <div className='flex items-baseline space-x-2'>
                              <span className='text-3xl font-bold text-gray-900'>{metric.value}</span>
                              {metric.unit && (
                                <span className='text-lg text-gray-500'>{metric.unit}</span>
                              )}
                            </div>
                            <div className={`flex items-center text-sm font-medium ${
                              metric.status === 'good' || metric.status === 'increasing' 
                                ? 'text-emerald-600' 
                                : 'text-orange-600'
                            }`}>
                              {metric.change.startsWith('+') ? (
                                <ArrowUp className='w-4 h-4 mr-1' />
                              ) : (
                                <ArrowDown className='w-4 h-4 mr-1' />
                              )}
                              {metric.change}
                            </div>
                          </div>
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
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
            <section data-template-section='category-stats' data-chart-type='bar' data-metrics='count,value'>
              <Card className='border border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Category Performance</CardTitle>
                  <CardDescription>Active listings by category</CardDescription>
                </CardHeader>
                <CardContent className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={AUCTION_CATEGORIES}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                      <XAxis dataKey='category' stroke='#6b7280' />
                      <YAxis stroke='#6b7280' />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey='count' name='Active Listings' radius={[8, 8, 0, 0]}>
                        {AUCTION_CATEGORIES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>

            <section data-template-section='bid-trends' data-chart-type='line' data-metrics='bids,value'>
              <Card className='border border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Bidding Activity</CardTitle>
                  <CardDescription>Real-time bid trends</CardDescription>
                </CardHeader>
                <CardContent className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={BID_TRENDS_DATA}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                      <XAxis dataKey='time' stroke='#6b7280' />
                      <YAxis stroke='#6b7280' />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey='bids' name='Total Bids' fill='#D8BFD8' radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Auctions Grid */}
          <section data-template-section='auction-listings' data-component-type='product-grid'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Premium Auctions</CardTitle>
                    <CardDescription>{filteredAuctions.length} active listings</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                      <Input
                        placeholder='Search auctions...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-10 w-56 border-gray-300'
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-40 border-gray-300'>
                        <SelectValue placeholder='Category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='jewelry'>Jewelry</SelectItem>
                        <SelectItem value='art'>Art</SelectItem>
                        <SelectItem value='collectibles'>Collectibles</SelectItem>
                        <SelectItem value='watches'>Watches</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-40 border-gray-300'>
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
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <AnimatePresence>
                    {filteredAuctions.map((auction) => {
                      const statusBadge = getStatusBadge(auction.status)
                      return (
                        <motion.div
                          key={auction.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -8 }}
                          className={`p-5 bg-white border rounded-2xl transition-all cursor-pointer ${
                            selectedAuction === auction.id 
                              ? 'border-lavender-400 ring-2 ring-lavender-400 ring-offset-2' 
                              : 'border-gray-200 hover:border-lavender-300 hover:shadow-lg'
                          }`}
                          onClick={() => setSelectedAuction(auction.id)}
                        >
                          <div className='space-y-4'>
                            <div className='flex items-start justify-between'>
                              <div className='text-5xl'>{auction.imageUrl}</div>
                              {auction.featured && (
                                <Badge className='bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0'>
                                  <Sparkles className='w-3 h-3 mr-1' />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <h3 className='font-bold text-lg text-gray-900 mb-1'>{auction.title}</h3>
                              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                                <Avatar className='w-5 h-5'>
                                  <AvatarFallback className='text-xs'>
                                    {auction.seller.name.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{auction.seller.name}</span>
                                <Star className='w-3 h-3 fill-amber-400 text-amber-400' />
                                <span>{auction.seller.rating}</span>
                              </div>
                            </div>

                            <Badge className={`${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
                              {statusBadge.label}
                            </Badge>

                            <Separator />

                            <div className='space-y-2'>
                              <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>Current Bid:</span>
                                <span className='font-bold text-lg text-emerald-600'>
                                  ${auction.currentBid.toLocaleString()}
                                </span>
                              </div>
                              <div className='flex justify-between items-center text-sm'>
                                <span className='text-gray-600'>Min. Next Bid:</span>
                                <span className='font-medium'>${auction.minBid.toLocaleString()}</span>
                              </div>
                              <div className='flex justify-between items-center text-sm'>
                                <span className='text-gray-600'>Time Left:</span>
                                <span className={`font-medium flex items-center ${
                                  auction.timeRemaining < 3600 ? 'text-orange-600' : 'text-gray-900'
                                }`}>
                                  <Clock className='w-3 h-3 mr-1' />
                                  {formatTimeRemaining(auction.timeRemaining)}
                                </span>
                              </div>
                            </div>

                            <div className='flex items-center justify-between text-sm text-gray-600 pt-2'>
                              <span>{auction.bidCount} bids</span>
                              <span className='flex items-center'>
                                <Eye className='w-3 h-3 mr-1' />
                                {auction.watchers} watching
                              </span>
                            </div>

                            <div className='flex space-x-2 pt-2'>
                              <Button className='flex-1 bg-gradient-to-r from-lavender-500 to-mint-500 hover:from-lavender-600 hover:to-mint-600'>
                                Place Bid
                              </Button>
                              <Button variant='outline' size='icon'>
                                <Heart className='w-4 h-4' />
                              </Button>
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
    </div>
  )
}
