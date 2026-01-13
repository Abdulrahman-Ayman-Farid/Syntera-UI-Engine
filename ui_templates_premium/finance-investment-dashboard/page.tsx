'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart,
  CreditCard, Wallet, Target, BarChart3,
  Plus, Search, Filter, Download,
  Shield, Bell, Settings, ArrowUpRight
} from 'lucide-react'

export default function FinanceInvestmentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('month')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const portfolio = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, value: 4850.75, change: '+2.4%', color: 'bg-gray-800' },
    { symbol: 'GOOGL', name: 'Alphabet', shares: 10, value: 1425.60, change: '+1.8%', color: 'bg-blue-500' },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 15, value: 3187.35, change: '-0.8%', color: 'bg-red-500' },
    { symbol: 'MSFT', name: 'Microsoft', shares: 20, value: 7125.40, change: '+3.2%', color: 'bg-green-500' },
  ]

  const investments = [
    { type: 'Stocks', value: 16500, allocation: 45, color: 'bg-blue-500' },
    { type: 'Bonds', value: 7500, allocation: 20, color: 'bg-green-500' },
    { type: 'Crypto', value: 4200, allocation: 12, color: 'bg-purple-500' },
    { type: 'Real Estate', value: 8300, allocation: 23, color: 'bg-amber-500' },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex flex-col'>
      <header className='p-6 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg'>
              <TrendingUp className='w-8 h-8' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>WealthTrack</h1>
              <p className='text-gray-400'>Smart Investment Management</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='icon'>
              <Bell className='w-5 h-5' />
            </Button>
            <Button variant='ghost' size='icon'>
              <Settings className='w-5 h-5' />
            </Button>
            <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700'>
              <Plus className='w-4 h-4 mr-2' />
              Add Funds
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Portfolio Value & Stats */}
        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Card className='lg:col-span-2 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'>
            <CardContent className='p-8'>
              <div className='flex justify-between items-start mb-8'>
                <div>
                  <p className='text-gray-400'>Total Portfolio Value</p>
                  <h2 className='text-4xl font-bold mt-2'>$36,125.10</h2>
                  <div className='flex items-center mt-2 text-emerald-400'>
                    <TrendingUp className='w-4 h-4 mr-1' />
                    <span>+$1,245.32 (3.5%) today</span>
                  </div>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className='w-32 bg-gray-800 border-gray-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-800 border-gray-700'>
                    <SelectItem value='day'>Today</SelectItem>
                    <SelectItem value='week'>This Week</SelectItem>
                    <SelectItem value='month'>This Month</SelectItem>
                    <SelectItem value='year'>This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-3 gap-6'>
                {[
                  { label: 'Daily Gain', value: '+$245.32', change: 'positive' },
                  { label: 'Weekly Return', value: '+$845.10', change: 'positive' },
                  { label: 'Risk Level', value: 'Medium', change: 'neutral' },
                ].map((stat, i) => (
                  <div key={i} className='bg-gray-800/50 p-4 rounded-xl'>
                    <p className='text-gray-400 text-sm'>{stat.label}</p>
                    <p className={`text-xl font-bold mt-2 ${
                      stat.change === 'positive' ? 'text-emerald-400' :
                      stat.change === 'negative' ? 'text-red-400' : 'text-white'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-r from-blue-900/50 to-emerald-900/50 border-gray-700'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-blue-800 rounded-lg'>
                    <Wallet className='w-6 h-6' />
                  </div>
                  <div>
                    <p className='text-gray-400'>Available Balance</p>
                    <h3 className='text-2xl font-bold'>$8,245.50</h3>
                  </div>
                </div>
                <Button variant='ghost' size='icon'>
                  <ArrowUpRight className='w-4 h-4' />
                </Button>
              </div>
              <Button className='w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700'>
                <Plus className='w-4 h-4 mr-2' />
                Add Funds
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Portfolio Holdings */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>Portfolio Holdings</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search investments...'
                className='w-64 bg-gray-800 border-gray-700'
                startIcon={Search}
              />
              <Button variant='outline' className='border-gray-700'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className='space-y-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='h-20 bg-gray-800' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {portfolio.map((holding) => (
                <Card key={holding.symbol} className='bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className={`w-12 h-12 rounded-lg ${holding.color} flex items-center justify-center`}>
                          <span className='font-bold'>{holding.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className='font-bold'>{holding.symbol}</h4>
                          <p className='text-gray-400 text-sm'>{holding.name}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-xl font-bold'>${holding.value.toLocaleString()}</p>
                        <p className={`text-sm ${
                          holding.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {holding.change}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between mt-6 text-sm text-gray-400'>
                      <span>{holding.shares} shares</span>
                      <Button variant='ghost' size='sm' className='text-blue-400 hover:text-blue-300'>
                        Trade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Investment Allocation & Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Allocation */}
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <PieChart className='w-5 h-5 mr-2' />
                Investment Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {investments.map((investment) => (
                  <div key={investment.type} className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>{investment.type}</span>
                      <span>${investment.value.toLocaleString()} ({investment.allocation}%)</span>
                    </div>
                    <Progress 
                      value={investment.allocation} 
                      className='h-2 bg-gray-700'
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart3 className='w-5 h-5 mr-2' />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                {[
                  { label: 'YTD Return', value: '+12.4%', positive: true },
                  { label: 'Sharpe Ratio', value: '1.8', positive: true },
                  { label: 'Volatility', value: 'Medium', positive: null },
                  { label: 'Max Drawdown', value: '-8.2%', positive: false },
                ].map((metric, i) => (
                  <div key={i} className='bg-gray-900/50 p-4 rounded-xl'>
                    <p className='text-gray-400 text-sm'>{metric.label}</p>
                    <p className={`text-xl font-bold mt-2 ${
                      metric.positive === true ? 'text-emerald-400' :
                      metric.positive === false ? 'text-red-400' : 'text-white'
                    }`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Insights */}
        <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='bg-gradient-to-r from-blue-900/50 to-gray-800/50 border-gray-700'>
            <CardContent className='p-6'>
              <div className='flex items-center space-x-4'>
                <Shield className='w-8 h-8 text-blue-400' />
                <div>
                  <h4 className='font-bold'>Portfolio Protection</h4>
                  <p className='text-sm text-gray-400 mt-1'>Risk management activated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-r from-emerald-900/50 to-gray-800/50 border-gray-700'>
            <CardContent className='p-6'>
              <div className='flex items-center space-x-4'>
                <Target className='w-8 h-8 text-emerald-400' />
                <div>
                  <h4 className='font-bold'>Goals Progress</h4>
                  <p className='text-sm text-gray-400 mt-1'>65% of annual target</p>
                </div>
              </div>
              <Progress value={65} className='mt-4 bg-gray-700' />
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-r from-purple-900/50 to-gray-800/50 border-gray-700'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-bold'>Tax Report</h4>
                  <p className='text-sm text-gray-400 mt-1'>Ready for download</p>
                </div>
                <Button variant='ghost' size='icon'>
                  <Download className='w-4 h-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}