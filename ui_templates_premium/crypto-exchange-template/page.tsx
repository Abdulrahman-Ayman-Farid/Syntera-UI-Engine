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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Bitcoin, ArrowUpRight,
  ArrowDownRight, RefreshCw, Activity, Shield, Download,
  BarChart3, Wallet, Users, Clock, Star, Eye, Search, Filter
} from 'lucide-react'

// Exchange Metrics with 'as const'
const EXCHANGE_METRICS = [
  {
    id: 'total_volume',
    label: 'Total Volume',
    value: '84.5',
    unit: 'B',
    change: '+15.2%',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    format: 'currency'
  },
  {
    id: 'active_traders',
    label: 'Active Traders',
    value: '24,582',
    change: '+8.4%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'avg_price',
    label: 'Avg Price',
    value: '42,850',
    unit: '$',
    change: '+2.8%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'liquidity',
    label: 'Liquidity',
    value: '95',
    unit: '%',
    change: '+1.2%',
    status: 'good' as const,
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const CRYPTO_LIST = [
  { 
    id: 'btc-001', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    price: 45250.50, 
    change: 2.45, 
    marketCap: 885000000000,
    volume: '28.5B',
    color: '#f7931a'
  },
  { 
    id: 'eth-002', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    price: 2842.30, 
    change: -0.82, 
    marketCap: 342000000000,
    volume: '15.2B',
    color: '#627eea'
  },
  { 
    id: 'bnb-003', 
    name: 'Binance Coin', 
    symbol: 'BNB', 
    price: 312.45, 
    change: 1.85, 
    marketCap: 48000000000,
    volume: '2.1B',
    color: '#f3ba2f'
  },
  { 
    id: 'xrp-004', 
    name: 'Ripple', 
    symbol: 'XRP', 
    price: 0.64, 
    change: 3.15, 
    marketCap: 35000000000,
    volume: '1.2B',
    color: '#23292f'
  },
] as const

const TRANSACTIONS = [
  { 
    id: 'tx-001', 
    date: '2024-01-15T14:30:00Z', 
    crypto: 'Bitcoin', 
    symbol: 'BTC',
    amount: 12450.50, 
    type: 'buy' as const,
    status: 'completed' as const 
  },
  { 
    id: 'tx-002', 
    date: '2024-01-15T12:15:00Z', 
    crypto: 'Ethereum', 
    symbol: 'ETH',
    amount: 5240.80, 
    type: 'sell' as const,
    status: 'completed' as const 
  },
  { 
    id: 'tx-003', 
    date: '2024-01-15T09:45:00Z', 
    crypto: 'Ripple', 
    symbol: 'XRP',
    amount: 850.00, 
    type: 'buy' as const,
    status: 'pending' as const 
  },
  { 
    id: 'tx-004', 
    date: '2024-01-14T18:20:00Z', 
    crypto: 'Litecoin', 
    symbol: 'LTC',
    amount: 2240.25, 
    type: 'sell' as const,
    status: 'failed' as const 
  },
] as const

const MARKET_TRENDS = [
  { time: '00:00', volume: 42000, trades: 1250, liquidity: 82 },
  { time: '04:00', volume: 38500, trades: 1180, liquidity: 85 },
  { time: '08:00', volume: 51200, trades: 1450, liquidity: 88 },
  { time: '12:00', volume: 64800, trades: 1820, liquidity: 91 },
  { time: '16:00', volume: 58400, trades: 1680, liquidity: 89 },
  { time: '20:00', volume: 54200, trades: 1540, liquidity: 87 },
] as const


const CryptoExchangePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredCryptos = useMemo(() => {
    return CRYPTO_LIST.filter(crypto => 
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleCryptoSelect = useCallback((cryptoId: string) => {
    setSelectedCrypto(cryptoId)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'failed': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <Bitcoin className='w-8 h-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>Crypto Exchange</h1>
                <p className='text-gray-400'>Professional trading platform</p>
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
                </SelectContent>
              </Select>
              <Button variant='outline' className='border-white/10'>
                <RefreshCw className='w-4 h-4 mr-2' />
                Refresh
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Market Overview */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Crypto List */}
          <section data-template-section='crypto-list' data-component-type='trading-pairs'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Market Overview</CardTitle>
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
                          selectedCrypto === crypto.id ? 'border-purple-500' : 'border-white/10 hover:border-purple-500/50'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4'>
                            <Avatar className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500'>
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
                              {crypto.change > 0 ? <ArrowUpRight className='w-3 h-3 mr-1' /> : <ArrowDownRight className='w-3 h-3 mr-1' />}
                              {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <div className='mt-3'>
                          <Progress value={(crypto.change + 10) * 5} className='h-1.5' />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Market Trends Chart */}
          <section data-template-section='market-trends' data-chart-type='bar' data-metrics='volume,trades'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Market Trends</CardTitle>
                    <CardDescription>Trading volume and activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-500/30 text-purple-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Live Data
                  </Badge>
                </div>
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
                    <Bar dataKey='trades' name='Trades' fill='#3b82f6' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Transactions */}
        <section data-template-section='transactions' data-component-type='transaction-table'>
          <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recent Transactions</CardTitle>
                  <CardDescription>Latest trading activity</CardDescription>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className='w-auto'>
                  <TabsList className='bg-gray-800'>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='detailed'>Detailed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value='overview' className='mt-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-white/10'>
                      <TableHead className='text-gray-400'>Date</TableHead>
                      <TableHead className='text-gray-400'>Crypto</TableHead>
                      <TableHead className='text-gray-400'>Type</TableHead>
                      <TableHead className='text-gray-400'>Amount</TableHead>
                      <TableHead className='text-gray-400'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRANSACTIONS.map((tx) => (
                      <TableRow key={tx.id} className='border-white/10 hover:bg-white/5'>
                        <TableCell className='text-gray-300'>
                          {new Date(tx.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <Avatar className='w-6 h-6'>
                              <AvatarFallback className='text-xs'>{tx.symbol.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className='font-medium'>{tx.crypto}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={tx.type === 'buy' ? 'default' : 'secondary'}
                            className={tx.type === 'buy' 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}
                          >
                            {tx.type === 'buy' ? <ArrowUpRight className='w-3 h-3 mr-1' /> : <ArrowDownRight className='w-3 h-3 mr-1' />}
                            {tx.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className='font-medium'>${tx.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value='detailed' className='mt-0'>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {TRANSACTIONS.map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center space-x-3'>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'buy' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {tx.type === 'buy' ? <ArrowUpRight className='w-5 h-5' /> : <ArrowDownRight className='w-5 h-5' />}
                            </div>
                            <div>
                              <div className='font-bold'>{tx.crypto}</div>
                              <div className='text-sm text-gray-400'>{tx.symbol}</div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                        </div>
                        <Separator className='bg-white/10 my-3' />
                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div>
                            <div className='text-gray-400'>Amount</div>
                            <div className='font-bold'>${tx.amount.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className='text-gray-400'>Type</div>
                            <div className='font-bold uppercase'>{tx.type}</div>
                          </div>
                          <div>
                            <div className='text-gray-400'>Date</div>
                            <div className='font-bold'>
                              {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

export default CryptoExchangePage