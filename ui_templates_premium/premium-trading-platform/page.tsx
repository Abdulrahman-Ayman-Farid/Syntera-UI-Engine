'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Slider } from '@/components/ui/slider'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  Cell, Area, AreaChart
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Activity, Zap,
  Plus, Search, Download, RefreshCw, Settings, Bell,
  Eye, BarChart3, CandlestickChart, AlertTriangle
} from 'lucide-react'

// Trading metrics with 'as const'
const TRADING_METRICS = [
  {
    id: 'portfolio_value',
    label: 'Portfolio Value',
    value: '$245,850',
    change: '+$12,450',
    changePercent: '+5.3%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'daily_pl',
    label: 'Daily P&L',
    value: '+$2,840',
    change: '+1.2%',
    changePercent: '+1.2%',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    format: 'currency'
  },
  {
    id: 'win_rate',
    label: 'Win Rate',
    value: '68%',
    change: '+3%',
    changePercent: '+3%',
    status: 'good' as const,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'open_positions',
    label: 'Open Positions',
    value: '12',
    change: '+2',
    changePercent: '',
    status: 'active' as const,
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const TRADING_POSITIONS = [
  {
    id: 'pos-001',
    symbol: 'BTC/USD',
    type: 'long' as const,
    entryPrice: 45280.50,
    currentPrice: 46125.00,
    quantity: 0.5,
    pl: 422.25,
    plPercent: 1.86,
    leverage: '10x',
    margin: 2264.03
  },
  {
    id: 'pos-002',
    symbol: 'ETH/USD',
    type: 'long' as const,
    entryPrice: 2840.25,
    currentPrice: 2925.80,
    quantity: 5.0,
    pl: 427.75,
    plPercent: 3.01,
    leverage: '5x',
    margin: 2840.25
  },
  {
    id: 'pos-003',
    symbol: 'EUR/USD',
    type: 'short' as const,
    entryPrice: 1.0845,
    currentPrice: 1.0820,
    quantity: 10000,
    pl: 250.00,
    plPercent: 0.23,
    leverage: '20x',
    margin: 542.25
  }
] as const

const PRICE_DATA = [
  { time: '09:00', price: 45280, volume: 1250 },
  { time: '10:00', price: 45520, volume: 1580 },
  { time: '11:00', price: 45350, volume: 1320 },
  { time: '12:00', price: 45680, volume: 1890 },
  { time: '13:00', price: 45920, volume: 2150 },
  { time: '14:00', price: 46125, volume: 1950 },
  { time: '15:00', price: 46050, volume: 1680 },
  { time: '16:00', price: 46280, volume: 2020 }
] as const

const TRADING_HISTORY = [
  { id: 'trade-001', timestamp: '14:35:22', symbol: 'BTC/USD', type: 'buy', price: 45280, quantity: 0.5, total: 22640, status: 'filled' },
  { id: 'trade-002', timestamp: '13:22:18', symbol: 'ETH/USD', type: 'buy', price: 2840, quantity: 5.0, total: 14200, status: 'filled' },
  { id: 'trade-003', timestamp: '12:08:45', symbol: 'EUR/USD', type: 'sell', price: 1.0845, quantity: 10000, total: 10845, status: 'filled' }
] as const

const MARKET_WATCHLIST = [
  { symbol: 'BTC/USD', price: 46125.00, change: 1.86, volume: '2.5B', color: '#f59e0b' },
  { symbol: 'ETH/USD', price: 2925.80, change: 3.01, volume: '890M', color: '#8b5cf6' },
  { symbol: 'SOL/USD', price: 125.45, change: -1.24, volume: '450M', color: '#06b6d4' },
  { symbol: 'XRP/USD', price: 0.6234, change: 2.15, volume: '320M', color: '#10b981' }
] as const


export default function PremiumTradingPlatform() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD')
  const [timeframe, setTimeframe] = useState('1H')
  const [orderType, setOrderType] = useState('market')
  const [orderSide, setOrderSide] = useState('buy')
  const [orderAmount, setOrderAmount] = useState('')
  const [leverage, setLeverage] = useState([1])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const totalPL = useMemo(() => {
    return TRADING_POSITIONS.reduce((sum, pos) => sum + pos.pl, 0)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'>
      {/* Header */}
      <header 
        className='sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800'
        data-template-section='header'
        data-component-type='navigation'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl'>
                <BarChart3 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold'>Premium Trading Platform</h1>
                <p className='text-sm text-gray-400'>Real-time trading terminal</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant='ghost' 
                      size='icon'
                      onClick={handleRefresh}
                      className='text-gray-400 hover:text-white'
                    >
                      <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Market Data</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white relative'>
                      <Bell className='w-5 h-5' />
                      <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                      <Settings className='w-5 h-5' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Separator orientation='vertical' className='h-8 bg-gray-700' />
              <Avatar className='border-2 border-blue-500'>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-6'>
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
                  <Card className='bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : metric.status === 'decreasing'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : metric.change.startsWith('-') ? (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            ) : null}
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

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Trading Chart */}
          <section data-template-section='trading-chart' data-chart-type='line' data-metrics='price' className='lg:col-span-2'>
            <Card className='bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-white'>{selectedSymbol}</CardTitle>
                    <CardDescription className='text-gray-400'>Real-time price chart</CardDescription>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className='w-24 bg-gray-800 border-gray-700 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1M'>1M</SelectItem>
                        <SelectItem value='5M'>5M</SelectItem>
                        <SelectItem value='15M'>15M</SelectItem>
                        <SelectItem value='1H'>1H</SelectItem>
                        <SelectItem value='4H'>4H</SelectItem>
                        <SelectItem value='1D'>1D</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      +1.86%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='h-96'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={PRICE_DATA}>
                    <defs>
                      <linearGradient id='priceGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8}/>
                        <stop offset='95%' stopColor='#3b82f6' stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='time' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' domain={['dataMin - 200', 'dataMax + 200']} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type='monotone' 
                      dataKey='price' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill='url(#priceGradient)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Order Entry */}
          <section data-template-section='order-entry' data-component-type='trading-form'>
            <Card className='bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-white'>Place Order</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Tabs value={orderSide} onValueChange={setOrderSide}>
                  <TabsList className='grid grid-cols-2 w-full'>
                    <TabsTrigger value='buy' className='data-[state=active]:bg-emerald-600'>
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value='sell' className='data-[state=active]:bg-rose-600'>
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className='space-y-2'>
                  <Label className='text-gray-300'>Order Type</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger className='bg-gray-800 border-gray-700 text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='market'>Market</SelectItem>
                      <SelectItem value='limit'>Limit</SelectItem>
                      <SelectItem value='stop'>Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label className='text-gray-300'>Amount</Label>
                  <Input 
                    type='number'
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder='0.00'
                    className='bg-gray-800 border-gray-700 text-white'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-gray-300'>Leverage: {leverage[0]}x</Label>
                  <Slider 
                    value={leverage}
                    onValueChange={setLeverage}
                    min={1}
                    max={100}
                    step={1}
                    className='py-4'
                  />
                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                    <span>100x</span>
                  </div>
                </div>

                <Separator className='bg-gray-700' />

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between text-gray-400'>
                    <span>Available Balance:</span>
                    <span className='text-white'>$10,000.00</span>
                  </div>
                  <div className='flex justify-between text-gray-400'>
                    <span>Required Margin:</span>
                    <span className='text-white'>$250.00</span>
                  </div>
                  <div className='flex justify-between text-gray-400'>
                    <span>Est. Liquidation:</span>
                    <span className='text-rose-400'>$42,000.00</span>
                  </div>
                </div>

                <Button 
                  className={`w-full ${orderSide === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                >
                  {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Positions & Orders */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <section data-template-section='open-positions' data-component-type='positions-grid' className='lg:col-span-2'>
            <Card className='bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-white'>Open Positions</CardTitle>
                  <Badge className={totalPL >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}>
                    Total P&L: ${totalPL.toFixed(2)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {TRADING_POSITIONS.map((position) => (
                      <motion.div
                        key={position.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileHover={{ scale: 1.01 }}
                        className='p-4 bg-gray-800/50 border border-gray-700 rounded-xl'
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <div className='flex items-center space-x-2'>
                              <h4 className='font-bold text-lg text-white'>{position.symbol}</h4>
                              <Badge className={position.type === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}>
                                {position.type.toUpperCase()}
                              </Badge>
                              <Badge variant='outline' className='border-blue-500/30 text-blue-400'>
                                {position.leverage}
                              </Badge>
                            </div>
                            <div className='text-sm text-gray-400 mt-1'>
                              Qty: {position.quantity} @ ${position.entryPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className={`text-xl font-bold ${position.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {position.pl >= 0 ? '+' : ''}${position.pl.toFixed(2)}
                            </div>
                            <div className={`text-sm ${position.plPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {position.plPercent >= 0 ? '+' : ''}{position.plPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <Separator className='my-2 bg-gray-700' />
                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div>
                            <span className='text-gray-400'>Current:</span>
                            <div className='text-white font-medium'>${position.currentPrice.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className='text-gray-400'>Margin:</span>
                            <div className='text-white font-medium'>${position.margin.toFixed(2)}</div>
                          </div>
                          <div className='text-right'>
                            <Button size='sm' variant='destructive' className='h-7'>
                              Close
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Market Watchlist */}
          <section data-template-section='market-watchlist' data-component-type='watchlist'>
            <Card className='bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-white'>Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {MARKET_WATCHLIST.map((item) => (
                    <div 
                      key={item.symbol}
                      className='p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 cursor-pointer transition-colors'
                      onClick={() => setSelectedSymbol(item.symbol)}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center space-x-2'>
                          <div 
                            className='w-2 h-2 rounded-full'
                            style={{ backgroundColor: item.color }}
                          />
                          <span className='font-bold text-white'>{item.symbol}</span>
                        </div>
                        <Badge className={item.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}>
                          {item.change >= 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-white font-medium'>${item.price.toFixed(4)}</span>
                        <span className='text-gray-400'>{item.volume}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Trade History */}
        <section data-template-section='trade-history' data-component-type='history-table'>
          <Card className='bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-white'>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {TRADING_HISTORY.map((trade) => (
                  <div key={trade.id} className='flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg'>
                    <div className='flex items-center space-x-4'>
                      <span className='text-sm text-gray-400'>{trade.timestamp}</span>
                      <span className='font-medium text-white'>{trade.symbol}</span>
                      <Badge className={trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}>
                        {trade.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className='flex items-center space-x-6 text-sm'>
                      <div>
                        <span className='text-gray-400'>Price: </span>
                        <span className='text-white font-medium'>${trade.price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className='text-gray-400'>Qty: </span>
                        <span className='text-white font-medium'>{trade.quantity}</span>
                      </div>
                      <div>
                        <span className='text-gray-400'>Total: </span>
                        <span className='text-white font-medium'>${trade.total.toFixed(2)}</span>
                      </div>
                      <Badge className='bg-emerald-500/20 text-emerald-400'>
                        {trade.status}
                      </Badge>
                    </div>
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
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                      Enter the details of the transaction you want to add.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='currency' className='text-right'>
                        Currency
                      </Label>
                      <Select>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Select a currency...' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='usd'>USD</SelectItem>
                          <SelectItem value='eur'>EUR</SelectItem>
                          <SelectItem value='gbp'>GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='amount' className='text-right'>
                        Amount
                      </Label>
                      <Input id='amount' className='col-span-3' />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm text-muted-foreground'>
                <thead className='bg-accent'>
                  <tr>
                    <th scope='col' className='py-3 px-6'>ID</th>
                    <th scope='col' className='py-3 px-6'>Amount</th>
                    <th scope='col' className='py-3 px-6'>Currency</th>
                    <th scope='col' className='py-3 px-6'>Date</th>
                    <th scope='col' className='py-3 px-6'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className='border-b border-gray-700'>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className='border-b border-gray-700'>
                        <td className='whitespace-nowrap py-4 px-6'>{transaction.id}</td>
                        <td className='whitespace-nowrap py-4 px-6'>${transaction.amount.toLocaleString()}</td>
                        <td className='whitespace-nowrap py-4 px-6'>{transaction.currency}</td>
                        <td className='whitespace-nowrap py-4 px-6'>{transaction.date}</td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Badge className={`${transaction.status === 'success' && 'bg-green-500'} ${transaction.status === 'pending' && 'bg-yellow-500'} ${transaction.status === 'failed' && 'bg-red-500'}`}>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className='fixed bottom-0 w-full bg-primary p-4'>
        <div className='container mx-auto'>
          <p className='text-center text-sm'>© 2023 Premium Trading Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}