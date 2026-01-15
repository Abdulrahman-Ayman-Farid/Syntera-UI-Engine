'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Bitcoin, ArrowUpRight,
  ArrowDownRight, Clock, Shield, Download, LineChart as LineChartIcon,
  BarChart3, Filter, Search, Bell, Settings,
  RefreshCw, Wallet, Star, Eye, MoreVertical,
  Zap, Activity, AlertCircle
} from 'lucide-react'

// Crypto Metrics with 'as const'
const CRYPTO_METRICS = [
  {
    id: 'market_cap',
    label: 'Market Cap',
    value: '2.1',
    unit: 'T',
    change: '+5.2%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-500',
    format: 'currency'
  },
  {
    id: 'volume_24h',
    label: '24h Volume',
    value: '124',
    unit: 'B',
    change: '+12.4%',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    format: 'currency'
  },
  {
    id: 'active_pairs',
    label: 'Active Pairs',
    value: '245',
    change: '+8',
    status: 'increasing' as const,
    icon: Zap,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'avg_change',
    label: 'Avg Change',
    value: '2.8',
    unit: '%',
    change: '+0.4%',
    status: 'good' as const,
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const COINS_DATA = [
  { 
    id: 'btc-001', 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    price: 45250.50, 
    change: 2.45, 
    volume: '28.5B',
    marketCap: '885B',
    icon: '₿',
    color: '#f7931a'
  },
  { 
    id: 'eth-002', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    price: 2842.30, 
    change: -0.82, 
    volume: '15.2B',
    marketCap: '342B',
    icon: 'Ξ',
    color: '#627eea'
  },
  { 
    id: 'bnb-003', 
    symbol: 'BNB', 
    name: 'Binance Coin', 
    price: 312.45, 
    change: 1.85, 
    volume: '2.1B',
    marketCap: '48B',
    icon: 'BNB',
    color: '#f3ba2f'
  },
  { 
    id: 'sol-004', 
    symbol: 'SOL', 
    name: 'Solana', 
    price: 98.75, 
    change: 5.24, 
    volume: '3.8B',
    marketCap: '42B',
    icon: 'SOL',
    color: '#00d4aa'
  },
  { 
    id: 'ada-005', 
    symbol: 'ADA', 
    name: 'Cardano', 
    price: 0.52, 
    change: -1.25, 
    volume: '850M',
    marketCap: '18B',
    icon: 'ADA',
    color: '#0033ad'
  },
  { 
    id: 'xrp-006', 
    symbol: 'XRP', 
    name: 'Ripple', 
    price: 0.64, 
    change: 3.15, 
    volume: '1.2B',
    marketCap: '35B',
    icon: 'XRP',
    color: '#23292f'
  },
] as const

const PRICE_HISTORY = [
  { time: '00:00', btc: 44850, eth: 2820, sol: 94, volume: 2450000 },
  { time: '04:00', btc: 45120, eth: 2835, sol: 96, volume: 2180000 },
  { time: '08:00', btc: 44980, eth: 2810, sol: 95, volume: 2890000 },
  { time: '12:00', btc: 45380, eth: 2850, sol: 98, volume: 3120000 },
  { time: '16:00', btc: 45150, eth: 2840, sol: 97, volume: 2780000 },
  { time: '20:00', btc: 45250, eth: 2842, sol: 98, volume: 2950000 },
] as const


export default function CryptoExchangeFeed() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredCoins = useMemo(() => {
    return COINS_DATA.filter(coin => {
      const matchesSearch = searchQuery === '' || 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterType === 'all' || 
        (filterType === 'positive' && coin.change > 0) ||
        (filterType === 'negative' && coin.change < 0)
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  const handleCoinSelect = useCallback((coinId: string) => {
    setSelectedCoin(coinId)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Bitcoin className='w-8 h-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>CryptoExchange Feed</h1>
                <p className='text-gray-400'>Real-time cryptocurrency market data</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-32 border-white/10 bg-white/5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-900 border-white/10'>
                  <SelectItem value='1h'>1 Hour</SelectItem>
                  <SelectItem value='24h'>24 Hours</SelectItem>
                  <SelectItem value='7d'>7 Days</SelectItem>
                  <SelectItem value='30d'>30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'>
                <RefreshCw className='w-4 h-4 mr-2' />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Crypto Metrics */}
        <section data-template-section='crypto-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {CRYPTO_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-rose-400'
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

        {/* Price Chart */}
        <section data-template-section='price-chart' data-chart-type='area' data-metrics='price,volume'>
          <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Market Overview</CardTitle>
                  <CardDescription>Price trends across major cryptocurrencies</CardDescription>
                </div>
                <Badge variant='outline' className='border-blue-500/30 text-blue-400'>
                  <LineChartIcon className='w-3 h-3 mr-1' />
                  Live Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={PRICE_HISTORY}>
                  <defs>
                    <linearGradient id='colorBtc' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#f7931a' stopOpacity={0.8}/>
                      <stop offset='95%' stopColor='#f7931a' stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id='colorEth' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#627eea' stopOpacity={0.8}/>
                      <stop offset='95%' stopColor='#627eea' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                  <XAxis dataKey='time' stroke='#9ca3af' />
                  <YAxis stroke='#9ca3af' />
                  <TooltipProvider>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937',
                        borderColor: '#374151',
                        color: 'white'
                      }}
                    />
                  </TooltipProvider>
                  <Legend />
                  <Area 
                    type='monotone' 
                    dataKey='btc' 
                    stroke='#f7931a' 
                    fillOpacity={1} 
                    fill='url(#colorBtc)'
                    name='Bitcoin'
                  />
                  <Area 
                    type='monotone' 
                    dataKey='eth' 
                    stroke='#627eea' 
                    fillOpacity={1} 
                    fill='url(#colorEth)'
                    name='Ethereum'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Search & Filter */}
        <section data-template-section='search-controls' data-component-type='filter-bar'>
          <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-4'>
                <div className='flex-1'>
                  <Input
                    placeholder='Search cryptocurrencies...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='bg-white/5 border-white/10'
                  />
                </div>
                <Tabs value={filterType} onValueChange={setFilterType} className='w-auto'>
                  <TabsList className='bg-gray-800'>
                    <TabsTrigger value='all'>All</TabsTrigger>
                    <TabsTrigger value='positive'>Gainers</TabsTrigger>
                    <TabsTrigger value='negative'>Losers</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cryptocurrency List */}
        <section data-template-section='coin-list' data-component-type='crypto-grid'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <AnimatePresence>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className='border border-white/10 bg-white/5 animate-pulse'>
                    <CardContent className='p-6'>
                      <div className='h-24 bg-white/10 rounded' />
                    </CardContent>
                  </Card>
                ))
              ) : filteredCoins.length === 0 ? (
                <div className='col-span-full text-center py-16'>
                  <AlertCircle className='w-16 h-16 mx-auto mb-4 text-gray-500' />
                  <p className='text-gray-400'>No cryptocurrencies found</p>
                </div>
              ) : (
                filteredCoins.map((coin) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCoinSelect(coin.id)}
                  >
                    <Card className={`border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer ${
                      selectedCoin === coin.id ? 'ring-2 ring-blue-500' : ''
                    }`}>
                      <CardHeader className='border-b border-white/10'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3'>
                            <Avatar className='bg-gradient-to-br from-blue-500 to-cyan-500 p-1'>
                              <AvatarFallback className='text-white font-bold'>
                                {coin.icon}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className='text-lg'>{coin.name}</CardTitle>
                              <p className='text-sm text-gray-400'>{coin.symbol}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={coin.change > 0 ? 'default' : 'destructive'}
                            className={coin.change > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}
                          >
                            {coin.change > 0 ? <TrendingUp className='w-3 h-3 mr-1' /> : <TrendingDown className='w-3 h-3 mr-1' />}
                            {coin.change > 0 ? '+' : ''}{coin.change.toFixed(2)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className='p-6'>
                        <div className='space-y-4'>
                          <div>
                            <span className='text-3xl font-bold'>${coin.price.toLocaleString()}</span>
                          </div>
                          <Separator className='bg-white/10' />
                          <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                              <p className='text-gray-400'>24h Volume</p>
                              <p className='font-semibold'>{coin.volume}</p>
                            </div>
                            <div>
                              <p className='text-gray-400'>Market Cap</p>
                              <p className='font-semibold'>{coin.marketCap}</p>
                            </div>
                          </div>
                          <Button 
                            className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                          >
                            <Wallet className='w-4 h-4 mr-2' />
                            Trade {coin.symbol}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  )
}