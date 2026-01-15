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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  Activity, Target, BarChart3, LineChart as LineChartIcon,
  Plus, Search, Filter, Download, Share2, RefreshCw,
  Eye, Edit, MoreVertical, ChevronRight, ArrowUpRight
} from 'lucide-react'

// Portfolio metrics with 'as const'
const PORTFOLIO_METRICS = [
  {
    id: 'total_value',
    label: 'Total Portfolio Value',
    value: '$1,247,850',
    change: '+12.5%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'total_return',
    label: 'Total Return',
    value: '+18.2%',
    change: '+2.3%',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    format: 'percent'
  },
  {
    id: 'annual_return',
    label: 'Annual Return',
    value: '15.8%',
    change: '+1.2%',
    status: 'good' as const,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'holdings',
    label: 'Total Holdings',
    value: '24',
    change: '+3',
    status: 'increasing' as const,
    icon: Target,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const HOLDINGS_DATA = [
  {
    id: 'AAPL',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    shares: 45,
    price: 178.45,
    value: 8030.25,
    change: 2.34,
    allocation: 18.5,
    color: '#3b82f6'
  },
  {
    id: 'MSFT',
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    shares: 28,
    price: 378.12,
    value: 10587.36,
    change: 1.82,
    allocation: 24.3,
    color: '#8b5cf6'
  },
  {
    id: 'GOOGL',
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    shares: 32,
    price: 142.67,
    value: 4565.44,
    change: -0.45,
    allocation: 10.5,
    color: '#10b981'
  },
  {
    id: 'AMZN',
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    shares: 18,
    price: 145.23,
    value: 2614.14,
    change: 3.12,
    allocation: 6.0,
    color: '#f59e0b'
  },
  {
    id: 'TSLA',
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    shares: 22,
    price: 248.98,
    value: 5477.56,
    change: 5.67,
    allocation: 12.6,
    color: '#ef4444'
  },
  {
    id: 'OTHER',
    name: 'Other Holdings',
    symbol: 'OTHER',
    shares: 0,
    price: 0,
    value: 12225.25,
    change: 1.15,
    allocation: 28.1,
    color: '#6b7280'
  }
] as const

const PERFORMANCE_DATA = [
  { month: 'Jan', value: 980500, return: 2.4 },
  { month: 'Feb', value: 1024300, return: 4.5 },
  { month: 'Mar', value: 1087200, return: 6.8 },
  { month: 'Apr', value: 1145600, return: 9.2 },
  { month: 'May', value: 1198400, return: 11.5 },
  { month: 'Jun', value: 1247850, return: 15.8 }
] as const

const TRANSACTION_HISTORY = [
  { id: 'txn-001', date: '2024-01-10', type: 'buy', symbol: 'AAPL', shares: 10, price: 175.23, total: 1752.30 },
  { id: 'txn-002', date: '2024-01-08', type: 'sell', symbol: 'TSLA', shares: 5, price: 245.67, total: 1228.35 },
  { id: 'txn-003', date: '2024-01-05', type: 'buy', symbol: 'MSFT', shares: 8, price: 372.45, total: 2979.60 },
  { id: 'txn-004', date: '2024-01-03', type: 'dividend', symbol: 'AAPL', shares: 0, price: 0, total: 45.50 }
] as const


export default function InvestmentPortfolioTracker() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedHolding, setSelectedHolding] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredHoldings = useMemo(() => {
    return HOLDINGS_DATA.filter(holding => {
      const matchesSearch = searchQuery === '' || 
        holding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterType === 'all' || 
        (filterType === 'gainers' && holding.change > 0) ||
        (filterType === 'losers' && holding.change < 0)
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  const totalValue = useMemo(() => {
    return HOLDINGS_DATA.reduce((sum, holding) => sum + holding.value, 0)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50'>
      {/* Header */}
      <header 
        className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'
        data-template-section='header'
        data-component-type='navigation'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <PieChartIcon className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Investment Portfolio</h1>
                <p className='text-gray-600'>Track and manage your investments</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1m'>1 Month</SelectItem>
                  <SelectItem value='3m'>3 Months</SelectItem>
                  <SelectItem value='6m'>6 Months</SelectItem>
                  <SelectItem value='1y'>1 Year</SelectItem>
                  <SelectItem value='all'>All Time</SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant='outline' 
                      size='icon'
                      onClick={handleRefresh}
                      className='border-gray-300'
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Investment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Portfolio Metrics */}
        <section data-template-section='portfolio-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PORTFOLIO_METRICS.map((metric) => (
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
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
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

        {/* Portfolio Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Performance Chart */}
          <section data-template-section='performance-chart' data-chart-type='line' data-metrics='value,return'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Portfolio Performance</CardTitle>
                    <CardDescription>6-month value trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +15.8% Return
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='value' 
                      stroke='#3b82f6' 
                      strokeWidth={3}
                      name='Portfolio Value ($)'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='return' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Return (%)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Asset Allocation */}
          <section data-template-section='asset-allocation' data-chart-type='pie' data-metrics='allocation'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Asset Allocation</CardTitle>
                    <CardDescription>Portfolio distribution by holding</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <PieChartIcon className='w-3 h-3 mr-1' />
                    Pie Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={HOLDINGS_DATA}
                      dataKey='allocation'
                      nameKey='symbol'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      label={(entry) => `${entry.symbol}: ${entry.allocation}%`}
                    >
                      {HOLDINGS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Holdings Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='holdings-browser' data-component-type='holdings-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Holdings</CardTitle>
                    <CardDescription>Your investment positions</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search holdings...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value='gainers'>Gainers</SelectItem>
                        <SelectItem value='losers'>Losers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredHoldings.map((holding) => (
                      <motion.div
                        key={holding.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedHolding === holding.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedHolding(holding.id)}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4'>
                            <div 
                              className='w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg'
                              style={{ backgroundColor: holding.color }}
                            >
                              {holding.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <h4 className='font-bold text-gray-900'>{holding.name}</h4>
                              <p className='text-sm text-gray-600'>{holding.symbol}</p>
                            </div>
                          </div>
                          <div className='text-right space-y-1'>
                            <div className='font-bold text-lg text-gray-900'>
                              ${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <div className='flex items-center justify-end space-x-2'>
                              <Badge className={holding.change >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}>
                                {holding.change >= 0 ? '+' : ''}{holding.change}%
                              </Badge>
                              <span className='text-sm text-gray-600'>{holding.allocation}%</span>
                            </div>
                          </div>
                        </div>
                        <Separator className='my-3' />
                        <div className='flex items-center justify-between text-sm text-gray-600'>
                          <span>{holding.shares} shares @ ${holding.price}</span>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <MoreVertical className='w-4 h-4' />
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

          {/* Transaction History & Quick Actions */}
          <section data-template-section='transactions-actions' data-component-type='action-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {TRANSACTION_HISTORY.map((txn) => (
                    <div 
                      key={txn.id}
                      className='p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <Badge className={
                          txn.type === 'buy' ? 'bg-blue-100 text-blue-800' :
                          txn.type === 'sell' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {txn.type.toUpperCase()}
                        </Badge>
                        <span className='text-sm text-gray-600'>{txn.date}</span>
                      </div>
                      <div className='font-bold'>{txn.symbol}</div>
                      <div className='text-sm text-gray-600'>
                        {txn.shares > 0 ? `${txn.shares} shares @ $${txn.price}` : 'Dividend'}
                      </div>
                      <div className='text-right font-medium mt-2'>
                        ${txn.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-3'>
                  <Button variant='outline' className='w-full justify-start border-gray-300 h-12'>
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 mr-3 flex items-center justify-center'>
                      <Plus className='w-5 h-5 text-white' />
                    </div>
                    Buy Stock
                  </Button>
                  <Button variant='outline' className='w-full justify-start border-gray-300 h-12'>
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mr-3 flex items-center justify-center'>
                      <ArrowUpRight className='w-5 h-5 text-white' />
                    </div>
                    Sell Stock
                  </Button>
                  <Button variant='outline' className='w-full justify-start border-gray-300 h-12'>
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 mr-3 flex items-center justify-center'>
                      <Download className='w-5 h-5 text-white' />
                    </div>
                    Export Report
                  </Button>
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Portfolio Diversity</span>
                      <span className='font-medium'>85%</span>
                    </div>
                    <Progress value={85} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <TrendingUp className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium'>Performance</div>
                        <div className='text-sm text-blue-600'>Above market average</div>
                      </div>
                    </div>
                    <ChevronRight className='w-5 h-5 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* P&L Summary */}
        <section data-template-section='pl-summary' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Profit & Loss Summary</CardTitle>
                  <CardDescription>Detailed performance breakdown</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export P&L
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Realized Gains', 
                    value: '$24,580', 
                    change: '+15.2%',
                    icon: TrendingUp,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Unrealized Gains', 
                    value: '$48,320', 
                    change: '+12.8%',
                    icon: Activity,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Dividend Income', 
                    value: '$3,240', 
                    change: '+8.5%',
                    icon: DollarSign,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Total P&L', 
                    value: '$76,140', 
                    change: '+13.4%',
                    icon: BarChart3,
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-2xl mb-2'>{stat.value}</div>
                    <div className='text-sm text-emerald-600 font-medium flex items-center'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      {stat.change}
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