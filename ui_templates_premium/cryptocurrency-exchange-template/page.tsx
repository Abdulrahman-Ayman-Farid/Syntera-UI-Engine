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
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Bitcoin, ArrowUp, ArrowDown,
  Users, BarChart2, Activity, Shield, Download, Wallet,
  RefreshCw, Search, Filter, Settings, Bell, Star, Eye
} from 'lucide-react'

// Exchange Metrics with 'as const'
const EXCHANGE_METRICS = [
  {
    id: 'total_balance',
    label: 'Total Balance',
    value: '50,000',
    unit: '$',
    change: '+15.2%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-500',
    format: 'currency'
  },
  {
    id: 'profit_growth',
    label: 'Profit Growth',
    value: '25',
    unit: '%',
    change: '+5%',
    status: 'increasing' as const,
    icon: ArrowUp,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'active_users',
    label: 'Active Users',
    value: '1,200',
    change: '+180',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'transaction_volume',
    label: 'Transaction Volume',
    value: '10',
    unit: 'M+',
    change: '+8.2%',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-amber-500 to-orange-500',
    format: 'currency'
  }
] as const

const CRYPTO_PRICES = [
  { 
    id: 'btc-001', 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    price: 45280.50, 
    change: 2.85,
    volume: '28.5B',
    marketCap: '885B',
    color: '#f7931a'
  },
  { 
    id: 'eth-002', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    price: 2845.30, 
    change: -1.24,
    volume: '15.2B',
    marketCap: '342B',
    color: '#627eea'
  },
  { 
    id: 'bnb-003', 
    symbol: 'BNB', 
    name: 'Binance Coin', 
    price: 315.80, 
    change: 3.42,
    volume: '2.1B',
    marketCap: '48B',
    color: '#f3ba2f'
  },
  { 
    id: 'sol-004', 
    symbol: 'SOL', 
    name: 'Solana', 
    price: 99.25, 
    change: 5.68,
    volume: '3.8B',
    marketCap: '42B',
    color: '#00d4aa'
  },
] as const

const MARKET_TRENDS = [
  { time: '00:00', volume: 42000, trades: 1250, price: 44850 },
  { time: '04:00', volume: 38500, trades: 1180, price: 45120 },
  { time: '08:00', volume: 51200, trades: 1450, price: 45580 },
  { time: '12:00', volume: 64800, trades: 1820, price: 46210 },
  { time: '16:00', volume: 58400, trades: 1680, price: 45890 },
  { time: '20:00', volume: 54200, trades: 1540, price: 46350 },
] as const

const RECENT_ACTIVITY = [
  { 
    id: 'act-001',
    type: 'buy' as const, 
    crypto: 'Bitcoin',
    symbol: 'BTC',
    amount: 0.25,
    value: 11320.00,
    time: '2 min ago',
    status: 'completed' as const
  },
  { 
    id: 'act-002',
    type: 'sell' as const, 
    crypto: 'Ethereum',
    symbol: 'ETH',
    amount: 5.2,
    value: 14795.00,
    time: '15 min ago',
    status: 'completed' as const
  },
  { 
    id: 'act-003',
    type: 'buy' as const, 
    crypto: 'Solana',
    symbol: 'SOL',
    amount: 42.5,
    value: 4218.00,
    time: '1 hour ago',
    status: 'pending' as const
  },
] as const


const CryptoExchangeDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredCryptos = useMemo(() => {
    return CRYPTO_PRICES.filter(crypto => 
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleCryptoSelect = useCallback((cryptoId: string) => {
    setSelectedCrypto(cryptoId)
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
                <h1 className='text-3xl font-bold'>Crypto Exchange</h1>
                <p className='text-gray-400'>Digital asset trading platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='outline' className='border-white/10'>
                <Bell className='w-4 h-4 mr-2' />
                Notifications
              </Button>
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'>
                <Wallet className='w-4 h-4 mr-2' />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Exchange Metrics */}
        <section data-template-section='exchange-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {EXCHANGE_METRICS.map((metric) => (
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
                      <Progress value={80} className='mt-4 h-2' />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Tabs Navigation */}
        <section data-template-section='main-tabs' data-component-type='tab-navigation'>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-3 bg-gray-800'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='trading'>Trading</TabsTrigger>
              <TabsTrigger value='activity'>Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value='overview' className='space-y-8 mt-8'>
              {/* Crypto Prices */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <Card className='border border-white/10 bg-white/5 backdrop-blur-sm' data-component-type='crypto-list'>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='text-lg font-semibold'>Market Prices</CardTitle>
                        <CardDescription>Live cryptocurrency prices</CardDescription>
                      </div>
                      <Input
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-48 bg-white/5 border-white/10'
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <AnimatePresence>
                        {filteredCryptos.map((crypto) => (
                          <motion.div
                            key={crypto.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ x: 4 }}
                            onClick={() => handleCryptoSelect(crypto.id)}
                            className={`p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border cursor-pointer transition-colors ${
                              selectedCrypto === crypto.id ? 'border-blue-500' : 'border-white/10 hover:border-blue-500/50'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-4'>
                                <Avatar className='w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500'>
                                  <AvatarFallback className='text-white font-bold'>
                                    {crypto.symbol.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className='font-bold'>{crypto.name}</div>
                                  <div className='text-sm text-gray-400'>{crypto.symbol}</div>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='font-bold'>${crypto.price.toLocaleString()}</div>
                                <div className={`text-sm font-medium flex items-center justify-end ${
                                  crypto.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                  {crypto.change > 0 ? <ArrowUp className='w-3 h-3 mr-1' /> : <ArrowDown className='w-3 h-3 mr-1' />}
                                  {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                            <Separator className='bg-white/10 my-3' />
                            <div className='grid grid-cols-2 gap-4 text-sm'>
                              <div>
                                <div className='text-gray-400'>24h Volume</div>
                                <div className='font-semibold'>{crypto.volume}</div>
                              </div>
                              <div>
                                <div className='text-gray-400'>Market Cap</div>
                                <div className='font-semibold'>{crypto.marketCap}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Trends Chart */}
                <Card className='border border-white/10 bg-white/5 backdrop-blur-sm' data-chart-type='area' data-metrics='price,volume'>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='text-lg font-semibold'>Market Trends</CardTitle>
                        <CardDescription>24-hour price movement</CardDescription>
                      </div>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className='w-32 bg-white/5 border-white/10'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-gray-900 border-white/10'>
                          <SelectItem value='1h'>1 Hour</SelectItem>
                          <SelectItem value='24h'>24 Hours</SelectItem>
                          <SelectItem value='7d'>7 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className='h-80'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart data={MARKET_TRENDS}>
                        <defs>
                          <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8}/>
                            <stop offset='95%' stopColor='#3b82f6' stopOpacity={0}/>
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
                          dataKey='price' 
                          stroke='#3b82f6' 
                          fillOpacity={1} 
                          fill='url(#colorPrice)'
                          name='Price'
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Volume Chart */}
              <Card className='border border-white/10 bg-white/5 backdrop-blur-sm' data-chart-type='bar' data-metrics='volume,trades'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Trading Volume</CardTitle>
                  <CardDescription>24-hour trading activity</CardDescription>
                </CardHeader>
                <CardContent className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={MARKET_TRENDS}>
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
                      <Bar dataKey='volume' name='Volume (K)' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
                      <Bar dataKey='trades' name='Trades' fill='#06b6d4' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trading Tab */}
            <TabsContent value='trading' className='mt-8'>
              <Card className='border border-white/10 bg-white/5 backdrop-blur-sm' data-component-type='trading-interface'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Trading Interface</CardTitle>
                  <CardDescription>Execute buy and sell orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Buy Panel */}
                    <div className='space-y-4'>
                      <h3 className='text-xl font-bold text-emerald-400'>Buy Orders</h3>
                      <div className='space-y-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-400 mb-2'>Select Crypto</label>
                          <Select>
                            <SelectTrigger className='bg-white/5 border-white/10'>
                              <SelectValue placeholder='Choose cryptocurrency' />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-900 border-white/10'>
                              {CRYPTO_PRICES.map(crypto => (
                                <SelectItem key={crypto.id} value={crypto.symbol}>{crypto.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-400 mb-2'>Amount</label>
                          <Input placeholder='0.0' className='bg-white/5 border-white/10' />
                        </div>
                        <Button className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'>
                          <ArrowUp className='w-4 h-4 mr-2' />
                          Place Buy Order
                        </Button>
                      </div>
                    </div>

                    {/* Sell Panel */}
                    <div className='space-y-4'>
                      <h3 className='text-xl font-bold text-rose-400'>Sell Orders</h3>
                      <div className='space-y-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-400 mb-2'>Select Crypto</label>
                          <Select>
                            <SelectTrigger className='bg-white/5 border-white/10'>
                              <SelectValue placeholder='Choose cryptocurrency' />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-900 border-white/10'>
                              {CRYPTO_PRICES.map(crypto => (
                                <SelectItem key={crypto.id} value={crypto.symbol}>{crypto.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-400 mb-2'>Amount</label>
                          <Input placeholder='0.0' className='bg-white/5 border-white/10' />
                        </div>
                        <Button className='w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'>
                          <ArrowDown className='w-4 h-4 mr-2' />
                          Place Sell Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value='activity' className='mt-8'>
              <Card className='border border-white/10 bg-white/5 backdrop-blur-sm' data-component-type='activity-feed'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Recent Activity</CardTitle>
                  <CardDescription>Your trading history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <AnimatePresence>
                      {RECENT_ACTIVITY.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center space-x-3'>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === 'buy' 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}>
                                {activity.type === 'buy' ? <ArrowUp className='w-5 h-5' /> : <ArrowDown className='w-5 h-5' />}
                              </div>
                              <div>
                                <div className='font-bold'>{activity.crypto}</div>
                                <div className='text-sm text-gray-400'>{activity.symbol}</div>
                              </div>
                            </div>
                            <Badge className={
                              activity.status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }>
                              {activity.status}
                            </Badge>
                          </div>
                          <Separator className='bg-white/10 my-3' />
                          <div className='grid grid-cols-3 gap-4 text-sm'>
                            <div>
                              <div className='text-gray-400'>Amount</div>
                              <div className='font-bold'>{activity.amount}</div>
                            </div>
                            <div>
                              <div className='text-gray-400'>Value</div>
                              <div className='font-bold'>${activity.value.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className='text-gray-400'>Time</div>
                              <div className='font-bold'>{activity.time}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}

export default CryptoExchangeDashboard
