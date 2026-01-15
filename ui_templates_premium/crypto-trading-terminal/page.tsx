'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Bitcoin, ArrowUpRight,
  ArrowDownRight, Clock, Shield, Download, LineChart as LineChartIcon,
  BarChart3, PieChart, Filter, Search, Bell, Settings,
  RefreshCw, Wallet, Star, Eye, MoreVertical, Copy,
  ExternalLink, AlertTriangle, CheckCircle, Zap, Lock
} from 'lucide-react'

// Trading Metrics with 'as const'
const TRADING_METRICS = [
  {
    id: 'portfolio_value',
    label: 'Portfolio Value',
    value: '87,436',
    unit: '$',
    change: '+8.4%',
    status: 'increasing' as const,
    icon: Wallet,
    color: 'from-orange-500 to-amber-500',
    format: 'currency'
  },
  {
    id: 'daily_pnl',
    label: 'Daily P&L',
    value: '2,845',
    unit: '$',
    change: '+12.5%',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'open_orders',
    label: 'Open Orders',
    value: '8',
    change: '+2',
    status: 'increasing' as const,
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'win_rate',
    label: 'Win Rate',
    value: '68',
    unit: '%',
    change: '+4%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  }
] as const

const PRICE_DATA = [
  { time: '09:00', price: 45230, volume: 2450000, high: 45380, low: 45180 },
  { time: '10:00', price: 44850, volume: 1890000, high: 45120, low: 44780 },
  { time: '11:00', price: 45580, volume: 3120000, high: 45680, low: 44920 },
  { time: '12:00', price: 46210, volume: 2780000, high: 46350, low: 45650 },
  { time: '13:00', price: 45890, volume: 2010000, high: 46240, low: 45820 },
  { time: '14:00', price: 46350, volume: 3450000, high: 46480, low: 45950 },
  { time: '15:00', price: 46120, volume: 2980000, high: 46380, low: 46050 },
] as const

const ORDER_BOOK = {
  bids: [
    { price: 46180, amount: 1.24, total: 57263.2 },
    { price: 46175, amount: 0.86, total: 39710.5 },
    { price: 46170, amount: 2.15, total: 99265.5 },
    { price: 46165, amount: 1.08, total: 49858.2 },
    { price: 46160, amount: 0.95, total: 43852.0 },
  ],
  asks: [
    { price: 46185, amount: 1.42, total: 65582.7 },
    { price: 46190, amount: 0.78, total: 36028.2 },
    { price: 46195, amount: 2.34, total: 108096.3 },
    { price: 46200, amount: 1.56, total: 72072.0 },
    { price: 46205, amount: 0.91, total: 42046.55 },
  ]
} as const

const TRADING_PAIRS = [
  { 
    symbol: 'BTC/USD', 
    price: 46125.50, 
    change: '+2.4%', 
    volume: '24.5B', 
    color: 'from-orange-500 to-amber-500',
    high: 46480,
    low: 45180
  },
  { 
    symbol: 'ETH/USD', 
    price: 2450.80, 
    change: '+1.8%', 
    volume: '12.3B', 
    color: 'from-purple-500 to-blue-500',
    high: 2520,
    low: 2380
  },
  { 
    symbol: 'SOL/USD', 
    price: 98.45, 
    change: '+5.2%', 
    volume: '3.2B', 
    color: 'from-rose-500 to-pink-500',
    high: 102,
    low: 94
  },
  { 
    symbol: 'ADA/USD', 
    price: 0.52, 
    change: '-0.8%', 
    volume: '0.8B', 
    color: 'from-blue-500 to-cyan-500',
    high: 0.54,
    low: 0.51
  },
] as const

const PORTFOLIO = [
  { symbol: 'BTC', amount: 0.85, value: 39206.25, allocation: 45.2, change: '+12.4%' },
  { symbol: 'ETH', amount: 12.5, value: 30635.00, allocation: 35.1, change: '+8.2%' },
  { symbol: 'SOL', amount: 85.2, value: 8383.14, allocation: 9.6, change: '+25.3%' },
  { symbol: 'DOT', amount: 245.8, value: 2212.20, allocation: 2.5, change: '-2.1%' },
  { symbol: 'USDT', amount: 5000, value: 5000.00, allocation: 5.7, change: '0.0%' },
] as const

const TRADE_HISTORY = [
  { id: 'trade-001', pair: 'BTC/USD', type: 'buy' as const, amount: 0.25, price: 46120, time: '12:45:23', profit: 245.50 },
  { id: 'trade-002', pair: 'ETH/USD', type: 'sell' as const, amount: 5.2, price: 2445, time: '12:42:11', profit: -82.30 },
  { id: 'trade-003', pair: 'SOL/USD', type: 'buy' as const, amount: 42.5, price: 98.2, time: '12:38:05', profit: 125.80 },
  { id: 'trade-004', pair: 'BTC/USD', type: 'sell' as const, amount: 0.12, price: 46150, time: '12:35:47', profit: 58.20 },
  { id: 'trade-005', pair: 'ADA/USD', type: 'buy' as const, amount: 1250, price: 0.52, time: '12:30:22', profit: 15.00 },
] as const


export default function CryptoTradingTerminal() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('1h')
  const [selectedPair, setSelectedPair] = useState('BTC/USD')
  const [orderType, setOrderType] = useState('market')
  const [orderAmount, setOrderAmount] = useState('0.1')
  const [tradeTab, setTradeTab] = useState('buy')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  const totalValue = useMemo(() => 
    PORTFOLIO.reduce((sum, item) => sum + item.value, 0), 
    []
  )

  const handlePairSelect = useCallback((pair: string) => {
    setSelectedPair(pair)
  }, [])

  const handleOrderSubmit = useCallback(() => {
    // Order submission logic
    console.log('Order submitted:', { orderType, orderAmount, selectedPair, tradeTab })
  }, [orderType, orderAmount, selectedPair, tradeTab])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-lg'>
                <Bitcoin className='w-8 h-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>CryptoTerminal Pro</h1>
                <div className='flex items-center space-x-2'>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <Shield className='w-3 h-3 mr-1' />
                    Secure Trading
                  </Badge>
                  <span className='text-gray-400'>Professional trading platform</span>
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='outline' className='border-white/10'>
                <Wallet className='w-4 h-4 mr-2' />
                Connect Wallet
              </Button>
              <Button className='bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'>
                <Download className='w-4 h-4 mr-2' />
                Deposit Funds
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Trading Metrics */}
        <section data-template-section='trading-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {TRADING_METRICS.map((metric) => (
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
        <section data-template-section='market-overview'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='lg:col-span-2'
            >
              <Card className='border border-white/10 bg-white/5 backdrop-blur-sm' data-chart-type='line' data-metrics='price,volume'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg'>
                        <Bitcoin className='w-8 h-8' />
                      </div>
                      <div>
                        <h2 className='text-2xl font-bold'>{selectedPair}</h2>
                        <div className='flex items-center space-x-2'>
                          <span className='text-3xl font-bold'>$46,125.50</span>
                          <Badge className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30'>
                            <TrendingUp className='w-3 h-3 mr-1' />
                            +2.4%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className='w-32 bg-white/5 border-white/10'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-900 border-white/10'>
                        <SelectItem value='15m'>15m</SelectItem>
                        <SelectItem value='1h'>1h</SelectItem>
                        <SelectItem value='4h'>4h</SelectItem>
                        <SelectItem value='1d'>1d</SelectItem>
                        <SelectItem value='1w'>1w</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart data={PRICE_DATA}>
                        <defs>
                          <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='5%' stopColor='#f59e0b' stopOpacity={0.8}/>
                            <stop offset='95%' stopColor='#f59e0b' stopOpacity={0}/>
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
                        <Area 
                          type='monotone' 
                          dataKey='price' 
                          stroke='#f59e0b' 
                          fillOpacity={1} 
                          fill='url(#colorPrice)'
                        />
                        <ReferenceLine y={46000} stroke='#6b7280' strokeDasharray='3 3' />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trading Pairs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='lg:col-span-2'
            >
              <Card className='border border-white/10 bg-white/5 backdrop-blur-sm h-full' data-component-type='trading-pairs'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Trading Pairs</CardTitle>
                  <CardDescription>Real-time market prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <AnimatePresence>
                      {TRADING_PAIRS.map((pair) => (
                        <motion.div
                          key={pair.symbol}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center justify-between p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border cursor-pointer transition-colors ${
                            selectedPair === pair.symbol ? 'border-orange-500' : 'border-white/10 hover:border-orange-500/50'
                          }`}
                          onClick={() => handlePairSelect(pair.symbol)}
                        >
                          <div className='flex items-center space-x-4'>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pair.color} flex items-center justify-center`}>
                              {pair.symbol.startsWith('BTC') ? (
                                <Bitcoin className='w-5 h-5' />
                              ) : pair.symbol.startsWith('ETH') ? (
                                <Zap className='w-5 h-5' />
                              ) : (
                                <Star className='w-5 h-5' />
                              )}
                            </div>
                            <div>
                              <div className='font-bold'>{pair.symbol}</div>
                              <div className='text-sm text-gray-400'>${pair.price.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className={`flex items-center justify-end font-medium ${
                              pair.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {pair.change.startsWith('+') ? (
                                <TrendingUp className='w-4 h-4 mr-1' />
                              ) : (
                                <TrendingDown className='w-4 h-4 mr-1' />
                              )}
                              {pair.change}
                            </div>
                            <div className='text-sm text-gray-400'>Vol: {pair.volume}</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Trading Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Book */}
          <section data-template-section='order-book' data-component-type='order-book'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Order Book</CardTitle>
                <CardDescription>Real-time buy/sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Asks */}
                  <div>
                    <div className='flex justify-between text-sm text-gray-400 mb-2'>
                      <span>Price (USD)</span>
                      <span>Amount (BTC)</span>
                    </div>
                    <div className='space-y-1'>
                      <AnimatePresence>
                        {ORDER_BOOK.asks.map((ask, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className='flex justify-between p-2 hover:bg-rose-500/10 rounded'
                          >
                            <span className='text-rose-400'>{ask.price.toLocaleString()}</span>
                            <span>{ask.amount}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <Separator className='bg-white/10' />
                  
                  {/* Bids */}
                  <div>
                    <div className='space-y-1'>
                      <AnimatePresence>
                        {ORDER_BOOK.bids.map((bid, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className='flex justify-between p-2 hover:bg-emerald-500/10 rounded'
                          >
                            <span className='text-emerald-400'>{bid.price.toLocaleString()}</span>
                            <span>{bid.amount}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <div className='flex justify-between text-sm text-gray-400 mt-2'>
                      <span>Price (USD)</span>
                      <span>Amount (BTC)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Trade Panel */}
          <section data-template-section='trade-panel' data-component-type='order-form'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Trade</CardTitle>
                <CardDescription>Execute buy/sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={tradeTab} onValueChange={setTradeTab} className='w-full'>
                  <TabsList className='grid w-full grid-cols-2 bg-gray-800'>
                    <TabsTrigger 
                      value='buy' 
                      className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600'
                    >
                      Buy
                    </TabsTrigger>
                    <TabsTrigger 
                      value='sell'
                      className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600'
                    >
                      Sell
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value='buy' className='space-y-4 mt-4'>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Order Type
                        </label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger className='bg-white/5 border-white/10'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='bg-gray-900 border-white/10'>
                            <SelectItem value='market'>Market</SelectItem>
                            <SelectItem value='limit'>Limit</SelectItem>
                            <SelectItem value='stop'>Stop-Limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Amount (BTC)
                        </label>
                        <Input 
                          value={orderAmount}
                          onChange={(e) => setOrderAmount(e.target.value)}
                          className='bg-white/5 border-white/10'
                          placeholder='0.1'
                        />
                      </div>
                      <div className='grid grid-cols-4 gap-2'>
                        {['0.1', '0.5', '1', 'MAX'].map((amount) => (
                          <Button
                            key={amount}
                            variant='outline'
                            className='border-white/10 hover:border-orange-500/50'
                            onClick={() => setOrderAmount(amount === 'MAX' ? '0.85' : amount)}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                      <div className='pt-4 border-t border-white/10'>
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-400'>Total Cost</span>
                          <span className='font-bold'>${(parseFloat(orderAmount) * 46125.50).toFixed(2)}</span>
                        </div>
                        <Button 
                          className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                          onClick={handleOrderSubmit}
                        >
                          <ArrowUpRight className='w-4 h-4 mr-2' />
                          Buy BTC
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value='sell' className='space-y-4 mt-4'>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Order Type
                        </label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger className='bg-white/5 border-white/10'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='bg-gray-900 border-white/10'>
                            <SelectItem value='market'>Market</SelectItem>
                            <SelectItem value='limit'>Limit</SelectItem>
                            <SelectItem value='stop'>Stop-Limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Amount (BTC)
                        </label>
                        <Input 
                          value={orderAmount}
                          onChange={(e) => setOrderAmount(e.target.value)}
                          className='bg-white/5 border-white/10'
                          placeholder='0.1'
                        />
                      </div>
                      <div className='grid grid-cols-4 gap-2'>
                        {['0.1', '0.5', '1', 'MAX'].map((amount) => (
                          <Button
                            key={amount}
                            variant='outline'
                            className='border-white/10 hover:border-orange-500/50'
                            onClick={() => setOrderAmount(amount === 'MAX' ? '0.85' : amount)}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                      <div className='pt-4 border-t border-white/10'>
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-400'>Total Value</span>
                          <span className='font-bold'>${(parseFloat(orderAmount) * 46125.50).toFixed(2)}</span>
                        </div>
                        <Button 
                          className='w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'
                          onClick={handleOrderSubmit}
                        >
                          <ArrowDownRight className='w-4 h-4 mr-2' />
                          Sell BTC
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Portfolio Overview */}
          <section data-template-section='portfolio-overview' data-component-type='portfolio'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Portfolio</CardTitle>
                    <CardDescription>Total value: ${totalValue.toLocaleString()}</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +8.4%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {PORTFOLIO.map((asset) => (
                      <motion.div 
                        key={asset.symbol}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center justify-between p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center'>
                            <Bitcoin className='w-5 h-5 text-orange-400' />
                          </div>
                          <div>
                            <div className='font-bold'>{asset.symbol}</div>
                            <div className='text-sm text-gray-400'>{asset.amount} {asset.symbol}</div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-bold'>${asset.value.toLocaleString()}</div>
                          <div className={`text-sm font-medium ${
                            asset.change.startsWith('+') ? 'text-emerald-400' : 
                            asset.change === '0.0%' ? 'text-gray-400' : 'text-rose-400'
                          }`}>
                            {asset.change}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Recent Trades & Risk Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Recent Trades */}
          <section data-template-section='recent-trades' data-component-type='trade-history'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Recent Trades</CardTitle>
                <CardDescription>Latest market transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {TRADE_HISTORY.map((trade) => (
                      <motion.div 
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 4 }}
                        className='flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer'
                      >
                        <div className='flex items-center space-x-3'>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            trade.type === 'buy' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {trade.type === 'buy' ? 
                              <ArrowUpRight className='w-4 h-4' /> : 
                              <ArrowDownRight className='w-4 h-4' />
                            }
                          </div>
                          <div>
                            <div className='font-medium'>{trade.pair}</div>
                            <div className='text-sm text-gray-400'>{trade.time}</div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className={`font-bold ${
                            trade.type === 'buy' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {trade.type === 'buy' ? '+' : '-'}{trade.amount} {trade.pair.split('/')[0]}
                          </div>
                          <div className='text-sm text-gray-400'>${trade.price.toLocaleString()}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Risk Analytics */}
          <section data-template-section='risk-analytics' data-component-type='risk-metrics'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Risk Analytics</CardTitle>
                <CardDescription>Portfolio risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { label: 'Volatility Index', value: 'High', color: 'text-amber-400', icon: AlertTriangle },
                    { label: 'Sharpe Ratio', value: '2.4', color: 'text-emerald-400', icon: TrendingUp },
                    { label: 'Max Drawdown', value: '-8.2%', color: 'text-rose-400', icon: TrendingDown },
                    { label: 'VaR (95%)', value: '-$4,250', color: 'text-amber-400', icon: Shield },
                  ].map((metric, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'
                    >
                      <div className='flex items-center space-x-3 mb-3'>
                        <div className='p-2 bg-white/10 rounded-lg'>
                          <metric.icon className='w-5 h-5' />
                        </div>
                        <div>
                          <div className='text-sm text-gray-400'>{metric.label}</div>
                          <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
                        </div>
                      </div>
                    </div>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className='w-32 bg-white/5 border-white/10'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-900 border-white/10'>
                        <SelectItem value='15m'>15m</SelectItem>
                        <SelectItem value='1h'>1h</SelectItem>
                        <SelectItem value='4h'>4h</SelectItem>
                        <SelectItem value='1d'>1d</SelectItem>
                        <SelectItem value='1w'>1w</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={priceData}>
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
                        <Line 
                          type='monotone' 
                          dataKey='price' 
                          stroke='#f59e0b' 
                          strokeWidth={2}
                          dot={false}
                        />
                        <ReferenceLine y={46000} stroke='#6b7280' strokeDasharray='3 3' />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trading Pairs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='lg:col-span-2'
            >
              <Card className='border border-white/10 bg-white/5 backdrop-blur-sm h-full'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Trading Pairs</CardTitle>
                  <CardDescription>Real-time market prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {tradingPairs.map((pair) => (
                      <div
                        key={pair.symbol}
                        className='flex items-center justify-between p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 hover:border-orange-500/50 transition-colors cursor-pointer'
                        onClick={() => setSelectedPair(pair.symbol)}
                      >
                        <div className='flex items-center space-x-4'>
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pair.color} flex items-center justify-center`}>
                            {pair.symbol.startsWith('BTC') ? (
                              <Bitcoin className='w-5 h-5' />
                            ) : pair.symbol.startsWith('ETH') ? (
                              <Zap className='w-5 h-5' />
                            ) : (
                              <Star className='w-5 h-5' />
                            )}
                          </div>
                          <div>
                            <div className='font-bold'>{pair.symbol}</div>
                            <div className='text-sm text-gray-400'>${pair.price.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className={`flex items-center justify-end font-medium ${
                            pair.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {pair.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            )}
                            {pair.change}
                          </div>
                          <div className='text-sm text-gray-400'>Vol: {pair.volume}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Trading Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Book */}
          <section data-template-section='order-book'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Order Book</CardTitle>
                <CardDescription>Real-time buy/sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Asks */}
                  <div>
                    <div className='flex justify-between text-sm text-gray-400 mb-2'>
                      <span>Price (USD)</span>
                      <span>Amount (BTC)</span>
                    </div>
                    <div className='space-y-1'>
                      {orderBook.asks.map((ask, i) => (
                        <div key={i} className='flex justify-between p-2 hover:bg-rose-500/10 rounded'>
                          <span className='text-rose-400'>{ask.price.toLocaleString()}</span>
                          <span>{ask.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className='bg-white/10' />
                  
                  {/* Bids */}
                  <div>
                    <div className='space-y-1'>
                      {orderBook.bids.map((bid, i) => (
                        <div key={i} className='flex justify-between p-2 hover:bg-emerald-500/10 rounded'>
                          <span className='text-emerald-400'>{bid.price.toLocaleString()}</span>
                          <span>{bid.amount}</span>
                        </div>
                      ))}
                    </div>
                    <div className='flex justify-between text-sm text-gray-400 mt-2'>
                      <span>Price (USD)</span>
                      <span>Amount (BTC)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Trade Panel */}
          <section data-template-section='trade-panel'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Trade</CardTitle>
                <CardDescription>Execute buy/sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='buy' className='w-full'>
                  <TabsList className='grid w-full grid-cols-2 bg-gray-800'>
                    <TabsTrigger 
                      value='buy' 
                      className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600'
                    >
                      Buy
                    </TabsTrigger>
                    <TabsTrigger 
                      value='sell'
                      className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600'
                    >
                      Sell
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value='buy' className='space-y-4 mt-4'>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Order Type
                        </label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger className='bg-white/5 border-white/10'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='bg-gray-900 border-white/10'>
                            <SelectItem value='market'>Market</SelectItem>
                            <SelectItem value='limit'>Limit</SelectItem>
                            <SelectItem value='stop'>Stop-Limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Amount (BTC)
                        </label>
                        <Input 
                          value={orderAmount}
                          onChange={(e) => setOrderAmount(e.target.value)}
                          className='bg-white/5 border-white/10'
                          placeholder='0.1'
                        />
                      </div>
                      <div className='grid grid-cols-4 gap-2'>
                        {['0.1', '0.5', '1', 'MAX'].map((amount) => (
                          <Button
                            key={amount}
                            variant='outline'
                            className='border-white/10 hover:border-orange-500/50'
                            onClick={() => setOrderAmount(amount === 'MAX' ? '0.85' : amount)}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                      <div className='pt-4 border-t border-white/10'>
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-400'>Total Cost</span>
                          <span className='font-bold'>${(parseFloat(orderAmount) * 46125.50).toFixed(2)}</span>
                        </div>
                        <Button className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'>
                          <ArrowUpRight className='w-4 h-4 mr-2' />
                          Buy BTC
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Portfolio Overview */}
          <section data-template-section='portfolio-overview'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Portfolio</CardTitle>
                    <CardDescription>Total value: ${totalValue.toLocaleString()}</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +8.4%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {portfolio.map((asset) => (
                    <div key={asset.symbol} className='flex items-center justify-between p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center'>
                          <Bitcoin className='w-5 h-5 text-orange-400' />
                        </div>
                        <div>
                          <div className='font-bold'>{asset.symbol}</div>
                          <div className='text-sm text-gray-400'>{asset.amount} {asset.symbol}</div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold'>${asset.value.toLocaleString()}</div>
                        <div className={`text-sm font-medium ${
                          asset.change.startsWith('+') ? 'text-emerald-400' : 
                          asset.change === '0.0%' ? 'text-gray-400' : 'text-rose-400'
                        }`}>
                          {asset.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Recent Trades & Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Recent Trades */}
          <section data-template-section='recent-trades'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Recent Trades</CardTitle>
                <CardDescription>Latest market transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { id: 1, pair: 'BTC/USD', type: 'buy', amount: 0.25, price: 46120, time: '12:45:23' },
                    { id: 2, pair: 'ETH/USD', type: 'sell', amount: 5.2, price: 2445, time: '12:42:11' },
                    { id: 3, pair: 'SOL/USD', type: 'buy', amount: 42.5, price: 98.2, time: '12:38:05' },
                    { id: 4, pair: 'BTC/USD', type: 'sell', amount: 0.12, price: 46150, time: '12:35:47' },
                    { id: 5, pair: 'ADA/USD', type: 'buy', amount: 1250, price: 0.52, time: '12:30:22' },
                  ].map((trade) => (
                    <div key={trade.id} className='flex items-center justify-between p-3 hover:bg-white/5 rounded-lg'>
                      <div className='flex items-center space-x-3'>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          trade.type === 'buy' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {trade.type === 'buy' ? 
                            <ArrowUpRight className='w-4 h-4' /> : 
                            <ArrowDownRight className='w-4 h-4' />
                          }
                        </div>
                        <div>
                          <div className='font-medium'>{trade.pair}</div>
                          <div className='text-sm text-gray-400'>{trade.time}</div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className={`font-bold ${
                          trade.type === 'buy' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {trade.type === 'buy' ? '+' : '-'}{trade.amount} {trade.pair.split('/')[0]}
                        </div>
                        <div className='text-sm text-gray-400'>${trade.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Risk Analytics */}
          <section data-template-section='risk-analytics'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Risk Analytics</CardTitle>
                <CardDescription>Portfolio risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { label: 'Volatility Index', value: 'High', color: 'text-amber-400', icon: AlertTriangle },
                    { label: 'Sharpe Ratio', value: '2.4', color: 'text-emerald-400', icon: TrendingUp },
                    { label: 'Max Drawdown', value: '-8.2%', color: 'text-rose-400', icon: TrendingDown },
                    { label: 'VaR (95%)', value: '-$4,250', color: 'text-amber-400', icon: Shield },
                  ].map((metric, i) => (
                    <div key={i} className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <div className='p-2 bg-white/10 rounded-lg'>
                          <metric.icon className='w-5 h-5' />
                        </div>
                        <div>
                          <div className='text-sm text-gray-400'>{metric.label}</div>
                          <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}