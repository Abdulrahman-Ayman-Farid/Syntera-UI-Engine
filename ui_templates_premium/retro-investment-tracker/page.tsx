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
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Target, Activity,
  BarChart3, Plus, Search, Filter, Download, RefreshCw,
  Eye, Edit, MoreVertical, Zap, Star
} from 'lucide-react'

// Investment metrics with 'as const'
const INVESTMENT_METRICS = [
  {
    id: 'portfolio_value',
    label: 'Portfolio Value',
    value: '$2,500,000',
    change: '+8.5%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-cyan-500 to-blue-500',
    format: 'currency'
  },
  {
    id: 'profit_loss',
    label: 'Profit/Loss',
    value: '+$50,000',
    change: '+12%',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-500',
    format: 'currency'
  },
  {
    id: 'annual_return',
    label: 'Annual Return',
    value: '10%',
    change: '+2%',
    status: 'good' as const,
    icon: Target,
    color: 'from-magenta-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'total_investments',
    label: 'Investments',
    value: '18',
    change: '+3',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-yellow-500 to-orange-500',
    format: 'count'
  }
] as const

const RETRO_INVESTMENTS = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', price: 178.45, change: 2.34, value: 8030.25, color: '#00ffff' },
  { id: 2, name: 'Microsoft Corporation', symbol: 'MSFT', price: 378.12, change: -1.23, value: 10587.36, color: '#ff00ff' },
  { id: 3, name: 'Tesla, Inc.', symbol: 'TSLA', price: 248.98, change: 5.67, value: 7474.40, color: '#ffff00' },
  { id: 4, name: 'Amazon.com Inc.', symbol: 'AMZN', price: 145.23, change: 1.89, value: 2904.60, color: '#00ff00' },
  { id: 5, name: 'Alphabet Inc.', symbol: 'GOOGL', price: 142.67, change: -0.45, value: 2853.40, color: '#ff6600' }
] as const

const PERFORMANCE_HISTORY = [
  { month: 'Jan', value: 2100000, return: 2.5 },
  { month: 'Feb', value: 2250000, return: 5.2 },
  { month: 'Mar', value: 2180000, return: 3.8 },
  { month: 'Apr', value: 2340000, return: 7.1 },
  { month: 'May', value: 2420000, return: 8.9 },
  { month: 'Jun', value: 2500000, return: 10.0 }
] as const

export default function RetroInvestmentTracker() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredInvestments = useMemo(() => {
    return RETRO_INVESTMENTS.filter(investment => {
      const matchesSearch = searchQuery === '' || 
        investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investment.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterType === 'all' || 
        (filterType === 'positive' && investment.change > 0) ||
        (filterType === 'negative' && investment.change < 0)
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-bl from-cyan-900 via-magenta-900 to-yellow-900'>
      {/* Header */}
      <header 
        className='sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-cyan-500/30'
        data-template-section='header'
        data-component-type='navigation'
      >
        <div className='px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-xl shadow-glow'>
                <BarChart3 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white' style={{ textShadow: '0 0 20px rgba(0,255,255,0.5)' }}>
                  Retro Investment Tracker
                </h1>
                <p className='text-cyan-300'>Classic portfolio management reimagined</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 bg-black/50 border-cyan-500/30 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1m'>1 Month</SelectItem>
                  <SelectItem value='3m'>3 Months</SelectItem>
                  <SelectItem value='6m'>6 Months</SelectItem>
                  <SelectItem value='1y'>1 Year</SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant='outline' 
                      size='icon'
                      onClick={handleRefresh}
                      className='bg-black/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button className='bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-700 hover:to-magenta-700 shadow-glow'>
                <Plus className='w-4 h-4 mr-2' />
                New Investment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-8 space-y-8'>
        {/* Investment Metrics */}
        <section data-template-section='investment-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {INVESTMENT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full bg-black/50 backdrop-blur-md border border-cyan-500/30 shadow-glow'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-cyan-300'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-amber-400'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            )}
                            {metric.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-glow`}>
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

        {/* Performance Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Performance Chart */}
          <section data-template-section='performance-chart' data-chart-type='line' data-metrics='value,return'>
            <Card className='bg-black/50 backdrop-blur-md border border-magenta-500/30 shadow-glow'>
              <CardHeader>
                <CardTitle className='text-white'>Portfolio Performance</CardTitle>
                <CardDescription className='text-magenta-300'>6-month value trends</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PERFORMANCE_HISTORY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                    <XAxis dataKey='month' stroke='#fff' />
                    <YAxis yAxisId='left' stroke='#fff' />
                    <YAxis yAxisId='right' orientation='right' stroke='#fff' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #0ff' }} />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='value' 
                      stroke='#00ffff' 
                      strokeWidth={3}
                      name='Value ($)'
                      dot={{ fill: '#00ffff', r: 5 }}
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='return' 
                      stroke='#ff00ff' 
                      strokeWidth={2}
                      name='Return (%)'
                      dot={{ fill: '#ff00ff', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Investment Distribution */}
          <section data-template-section='investment-distribution' data-chart-type='bar' data-metrics='value'>
            <Card className='bg-black/50 backdrop-blur-md border border-yellow-500/30 shadow-glow'>
              <CardHeader>
                <CardTitle className='text-white'>Investment Distribution</CardTitle>
                <CardDescription className='text-yellow-300'>Value by holding</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={RETRO_INVESTMENTS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                    <XAxis dataKey='symbol' stroke='#fff' />
                    <YAxis stroke='#fff' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #ff0' }} />
                    <Bar dataKey='value' radius={[8, 8, 0, 0]}>
                      {RETRO_INVESTMENTS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Investments List */}
        <section data-template-section='investments-list' data-component-type='investment-grid'>
          <Card className='bg-black/50 backdrop-blur-md border border-cyan-500/30 shadow-glow'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-white'>Investments</CardTitle>
                  <CardDescription className='text-cyan-300'>Your current holdings</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-400'
                  />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className='w-32 bg-black/50 border-cyan-500/30 text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      <SelectItem value='positive'>Gainers</SelectItem>
                      <SelectItem value='negative'>Losers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <AnimatePresence>
                  {filteredInvestments.map((investment) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${investment.color}` }}
                      className={`p-4 bg-gradient-to-r from-black/70 to-gray-900/50 border rounded-xl transition-all cursor-pointer ${
                        selectedInvestment === investment.id 
                          ? 'ring-2 ring-offset-2' 
                          : 'border-gray-700/50'
                      }`}
                      style={{ 
                        borderColor: selectedInvestment === investment.id ? investment.color : undefined,
                        ringColor: investment.color 
                      }}
                      onClick={() => setSelectedInvestment(investment.id)}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                          <div 
                            className='w-14 h-14 rounded-lg flex items-center justify-center font-bold text-xl shadow-glow'
                            style={{ 
                              backgroundColor: investment.color,
                              boxShadow: `0 0 15px ${investment.color}`
                            }}
                          >
                            {investment.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <h4 className='font-bold text-white text-lg'>{investment.name}</h4>
                            <p className='text-sm' style={{ color: investment.color }}>{investment.symbol}</p>
                          </div>
                        </div>
                        <div className='text-right space-y-2'>
                          <div className='font-bold text-2xl text-white'>
                            ${investment.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className='flex items-center justify-end space-x-2'>
                            <Badge className={investment.change >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}>
                              {investment.change >= 0 ? '+' : ''}{investment.change}%
                            </Badge>
                            <span className='text-sm text-gray-400'>${investment.price}</span>
                          </div>
                        </div>
                      </div>
                      <Separator className='my-3 bg-gray-700/50' />
                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-400'>
                          Price per share: ${investment.price}
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-cyan-400 hover:bg-cyan-500/20'>
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-magenta-400 hover:bg-magenta-500/20'>
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-yellow-400 hover:bg-yellow-500/20'>
                            <Star className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
            <CardFooter className='flex items-center justify-between border-t border-gray-700/50 pt-4'>
              <div className='text-sm text-gray-400'>
                Showing {filteredInvestments.length} of {RETRO_INVESTMENTS.length} investments
              </div>
              <Button variant='outline' className='bg-gradient-to-r from-cyan-900 to-magenta-900 border-cyan-500/30 text-white hover:from-cyan-800 hover:to-magenta-800'>
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className='bg-black/50 backdrop-blur-md border-t border-cyan-500/30 py-4 px-8 mt-auto'>
        <div className='flex justify-between items-center'>
          <span className='text-cyan-400'>© 2026 Retro Investment Tracker</span>
          <div className='flex space-x-4'>
            <a href='#' className='text-magenta-400 hover:text-magenta-300 transition-colors'>Terms</a>
            <a href='#' className='text-yellow-400 hover:text-yellow-300 transition-colors'>Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
