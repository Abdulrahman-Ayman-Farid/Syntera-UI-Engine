'use client'

import { useState, useEffect, useMemo } from 'react'
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
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Activity, Wallet,
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
  ArrowUpRight, ArrowDownRight, Plus, Search, Filter,
  Star, AlertCircle, CheckCircle, Clock, Target,
  RefreshCw, Settings, Bell, MoreVertical, Download
} from 'lucide-react'

// Trading metrics derived from data_types
const TRADING_METRICS = [
  {
    id: 'portfolio_value',
    label: 'Portfolio Value',
    value: '$125,840',
    change: '+$8,240',
    percentage: '+7.0%',
    status: 'increasing' as const,
    icon: Wallet,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'daily_pnl',
    label: 'Daily P&L',
    value: '$2,450',
    change: '+$450',
    percentage: '+22.5%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-500',
    format: 'currency'
  },
  {
    id: 'win_rate',
    label: 'Win Rate',
    value: '68%',
    change: '+5%',
    status: 'increasing' as const,
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'active_positions',
    label: 'Active Positions',
    value: '12',
    change: '+3',
    status: 'neutral' as const,
    icon: Activity,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const STOCK_POSITIONS = [
  { symbol: 'AAPL', shares: 250, value: 45000, pnl: 5200, pnlPercent: 13.1, color: '#3b82f6' },
  { symbol: 'GOOGL', shares: 100, value: 28000, pnl: 3800, pnlPercent: 15.7, color: '#8b5cf6' },
  { symbol: 'MSFT', shares: 180, value: 32000, pnl: -1200, pnlPercent: -3.6, color: '#10b981' },
  { symbol: 'TSLA', shares: 85, value: 20840, pnl: 840, pnlPercent: 4.2, color: '#f59e0b' },
] as const

const RECENT_TRADES = [
  {
    id: 'trade-001',
    symbol: 'AAPL',
    type: 'buy',
    shares: 50,
    price: 178.45,
    total: 8922.50,
    time: '2 hours ago',
    status: 'executed',
    emoji: ''
  },
  {
    id: 'trade-002',
    symbol: 'TSLA',
    type: 'sell',
    shares: 25,
    price: 245.20,
    total: 6130.00,
    time: '5 hours ago',
    status: 'executed',
    emoji: ''
  },
  {
    id: 'trade-003',
    symbol: 'NVDA',
    type: 'buy',
    shares: 40,
    price: 485.30,
    total: 19412.00,
    time: '1 day ago',
    status: 'executed',
    emoji: ''
  },
  {
    id: 'trade-004',
    symbol: 'AMD',
    type: 'buy',
    shares: 100,
    price: 142.80,
    total: 14280.00,
    time: '2 days ago',
    status: 'executed',
    emoji: ''
  },
] as const

const MARKET_DATA = [
  { time: '09:30', value: 122500, volume: 1250000 },
  { time: '10:30', value: 123200, volume: 1420000 },
  { time: '11:30', value: 122800, volume: 1180000 },
  { time: '12:30', value: 124100, volume: 1650000 },
  { time: '13:30', value: 125200, volume: 1890000 },
  { time: '14:30', value: 124900, volume: 1720000 },
  { time: '15:30', value: 125840, volume: 2100000 },
] as const

export default function TradingDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('day')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getTradeTypeColor = (type: string) => {
    return type === 'buy'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : 'bg-rose-100 text-rose-800 border-rose-300'
  }

  const filteredTrades = useMemo(() => {
    return RECENT_TRADES.filter(trade => {
      const matchesSearch = searchQuery === '' ||
        trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' ||
        trade.type === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg'>
                <TrendingUp className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>TradeHub Pro</h1>
                <p className='text-gray-600'>Advanced trading platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Trade
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        <section data-template-section='trading-overview' data-component-type='kpi-grid'>
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
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'increasing' ? 'text-emerald-600' : metric.status === 'decreasing' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {metric.status === 'increasing' ? (
                              <ArrowUpRight className='w-4 h-4 mr-1' />
                            ) : metric.status === 'decreasing' ? (
                              <ArrowDownRight className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            )}
                            {metric.change} {metric.percentage && `(${metric.percentage})`}
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='portfolio-distribution' data-chart-type='bar' data-metrics='value,pnl'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Portfolio Distribution</CardTitle>
                    <CardDescription>Holdings by stock and P&L</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={STOCK_POSITIONS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='symbol' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='value' name='Value ($)' radius={[4, 4, 0, 0]}>
                      {STOCK_POSITIONS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='market-trends' data-chart-type='line' data-metrics='value,volume'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Intraday Performance</CardTitle>
                    <CardDescription>Real-time portfolio value</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +7.0% Today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MARKET_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='time' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line yAxisId='left' type='monotone' dataKey='value' stroke='#10b981' strokeWidth={3} name='Portfolio Value' dot={false} />
                    <Line yAxisId='right' type='monotone' dataKey='volume' stroke='#3b82f6' strokeWidth={2} name='Volume' dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='recent-trades' data-component-type='trade-list' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Trades</CardTitle>
                    <CardDescription>Latest executed orders</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input placeholder='Search symbols...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-48 border-gray-300' startIcon={Search} />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='buy'>Buy Orders</SelectItem>
                        <SelectItem value='sell'>Sell Orders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredTrades.map((trade) => (
                      <motion.div key={trade.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors cursor-pointer ${selectedTrade === trade.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`} onClick={() => setSelectedTrade(trade.id)}>
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{trade.emoji}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold text-lg'>{trade.symbol}</h4>
                              <Badge className={getTradeTypeColor(trade.type)}>{trade.type.toUpperCase()}</Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'><Activity className='w-3 h-3 mr-1' />{trade.shares} shares</span>
                              <span className='flex items-center'><DollarSign className='w-3 h-3 mr-1' />${trade.price.toFixed(2)}</span>
                              <span className='flex items-center'><Clock className='w-3 h-3 mr-1' />{trade.time}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='text-sm'><span className='text-gray-600'>Total: </span><span className='font-bold'>${trade.total.toFixed(2)}</span></div>
                              <CheckCircle className='w-4 h-4 text-emerald-500' />
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

          <section data-template-section='market-stats' data-component-type='stats-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Market Overview</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {STOCK_POSITIONS.map((position, i) => (
                  <div key={i}>
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <div className='font-bold'>{position.symbol}</div>
                        <div className='text-sm text-gray-600'>{position.shares} shares</div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold'>${position.value.toLocaleString()}</div>
                        <div className={`text-sm font-medium ${position.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%</div>
                      </div>
                    </div>
                    <Progress value={Math.abs(position.pnlPercent) * 5} className={`h-2 ${position.pnl >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
