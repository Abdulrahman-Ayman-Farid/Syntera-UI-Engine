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
import { Progress } from '@/components/ui/progress'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, DollarSign, TrendingUp, TrendingDown, Wallet,
  FileText, AlertCircle, CheckCircle, Home, Utensils,
  ShoppingBag, Car, Heart, Film, Calendar, Search, Download
} from 'lucide-react'

// Transaction metrics with type-safe constants
const TRANSACTION_METRICS = [
  {
    id: 'total_spending',
    label: 'Total Spending',
    value: '$18,542',
    change: '+15.3%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'budget_remaining',
    label: 'Budget Remaining',
    value: '$6,458',
    percentage: 42,
    change: '-8%',
    status: 'warning' as const,
    icon: Wallet,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'pending_items',
    label: 'Pending Items',
    value: '12',
    change: '+4',
    status: 'warning' as const,
    icon: AlertCircle,
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'approved_today',
    label: 'Approved Today',
    value: '24',
    change: '+6',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-500'
  }
] as const

const CATEGORY_BREAKDOWN = [
  { category: 'Housing', amount: 4200, color: '#6366f1', percentage: 23 },
  { category: 'Food & Dining', amount: 3500, color: '#10b981', percentage: 19 },
  { category: 'Transportation', amount: 2800, color: '#f59e0b', percentage: 15 },
  { category: 'Healthcare', amount: 2100, color: '#ef4444', percentage: 11 },
  { category: 'Entertainment', amount: 1800, color: '#ec4899', percentage: 10 },
  { category: 'Utilities', amount: 1600, color: '#06b6d4', percentage: 9 }
] as const

const RECENT_TRANSACTIONS = [
  {
    id: 'txn-001',
    date: '2026-01-14',
    description: 'Rent Payment - January',
    category: 'housing',
    amount: 1400.00,
    type: 'expense' as const,
    status: 'approved' as const
  },
  {
    id: 'txn-002',
    date: '2026-01-13',
    description: 'Restaurant - Italian Bistro',
    category: 'food',
    amount: 85.50,
    type: 'expense' as const,
    status: 'pending' as const
  },
  {
    id: 'txn-003',
    date: '2026-01-13',
    description: 'Gas Station - Shell',
    category: 'transportation',
    amount: 62.00,
    type: 'expense' as const,
    status: 'approved' as const
  },
  {
    id: 'txn-004',
    date: '2026-01-12',
    description: 'Monthly Salary',
    category: 'income',
    amount: 5000.00,
    type: 'income' as const,
    status: 'paid' as const
  },
  {
    id: 'txn-005',
    date: '2026-01-11',
    description: 'Grocery Shopping - Walmart',
    category: 'food',
    amount: 156.75,
    type: 'expense' as const,
    status: 'approved' as const
  }
] as const

const MONTHLY_SPENDING = [
  { month: 'Jul', housing: 4000, food: 3200, transport: 2500, other: 3500 },
  { month: 'Aug', housing: 4000, food: 3500, transport: 2700, other: 3800 },
  { month: 'Sep', housing: 4200, food: 3100, transport: 2400, other: 3200 },
  { month: 'Oct', housing: 4000, food: 3400, transport: 2800, other: 3900 },
  { month: 'Nov', housing: 4200, food: 3600, transport: 2600, other: 3500 },
  { month: 'Dec', housing: 4000, food: 4000, transport: 3000, other: 4200 },
  { month: 'Jan', housing: 4200, food: 3500, transport: 2800, other: 4000 }
] as const

export default function ExpenseManagementAppTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'housing': return Home
      case 'food': return Utensils
      case 'transportation': return Car
      case 'healthcare': return Heart
      case 'entertainment': return Film
      case 'income': return DollarSign
      default: return FileText
    }
  }

  const filteredTransactions = useMemo(() => {
    return RECENT_TRANSACTIONS.filter(txn => {
      const matchesSearch = searchQuery === '' || 
        txn.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || txn.type === selectedType
      const matchesCategory = selectedCategory === 'all' || txn.category === selectedCategory
      return matchesSearch && matchesType && matchesCategory
    })
  }, [searchQuery, selectedType, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <motion.div 
                className='p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg'
                whileHover={{ scale: 1.05 }}
              >
                <Wallet className='w-8 h-8 text-white' />
              </motion.div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Expense Tracker Pro</h1>
                <p className='text-gray-400 text-sm'>Complete financial management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-700 bg-gray-800 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700'>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'>
                <Plus className='w-4 h-4 mr-2' />
                New Transaction
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Transaction Overview */}
        <section data-template-section='expense-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {TRANSACTION_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-gray-600 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2 flex-1'>
                          <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' 
                              ? 'text-green-400' 
                              : metric.status === 'warning'
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : metric.change.startsWith('-') ? (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            ) : null}
                            {metric.change}
                          </div>
                          {metric.percentage !== undefined && (
                            <Progress value={metric.percentage} className='h-2 mt-2' />
                          )}
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

        {/* Analytics & Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Category Breakdown */}
          <section data-template-section='budget-statistics' data-chart-type='pie' data-metrics='category,amount'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Category Breakdown</CardTitle>
                    <CardDescription className='text-gray-400'>Spending by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-indigo-500/30 text-indigo-300'>
                    6 Categories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={CATEGORY_BREAKDOWN}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({category, percentage}) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      dataKey='amount'
                    >
                      {CATEGORY_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Monthly Trends */}
          <section data-template-section='reports' data-chart-type='area' data-metrics='housing,food,transport'>
            <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Monthly Spending Trends</CardTitle>
                    <CardDescription className='text-gray-400'>7-month spending analysis</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-300'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Tracking
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={MONTHLY_SPENDING}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Legend />
                    <Area type='monotone' dataKey='housing' stackId='1' stroke='#6366f1' fill='#6366f1' name='Housing' />
                    <Area type='monotone' dataKey='food' stackId='1' stroke='#10b981' fill='#10b981' name='Food' />
                    <Area type='monotone' dataKey='transport' stackId='1' stroke='#f59e0b' fill='#f59e0b' name='Transport' />
                    <Area type='monotone' dataKey='other' stackId='1' stroke='#8b5cf6' fill='#8b5cf6' name='Other' />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Transactions Table */}
        <section data-template-section='transactions' data-component-type='table'>
          <Card className='border border-gray-700 bg-gray-800/50 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Recent Transactions</CardTitle>
                  <CardDescription className='text-gray-400'>View and manage transactions</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search transactions...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-gray-700 bg-gray-700 text-white'
                  />
                  <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                    <SelectTrigger className='w-32 border-gray-700 bg-gray-700 text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='expense'>Expense</SelectItem>
                      <SelectItem value='income'>Income</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant='outline' className='border-gray-700 text-gray-300 hover:bg-gray-700'>
                    <Download className='w-4 h-4 mr-2' />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-gray-700'>
                    <TableHead className='text-gray-400'>Date</TableHead>
                    <TableHead className='text-gray-400'>Description</TableHead>
                    <TableHead className='text-gray-400'>Category</TableHead>
                    <TableHead className='text-gray-400'>Type</TableHead>
                    <TableHead className='text-gray-400'>Amount</TableHead>
                    <TableHead className='text-gray-400'>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTransactions.map((txn) => {
                      const Icon = getCategoryIcon(txn.category)
                      return (
                        <motion.tr
                          key={txn.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='border-gray-700/50 hover:bg-gray-700/30'
                        >
                          <TableCell className='text-gray-300'>
                            <div className='flex items-center space-x-2'>
                              <Calendar className='w-4 h-4 text-indigo-400' />
                              <span>{txn.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className='text-white font-medium'>{txn.description}</TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Icon className='w-4 h-4 text-indigo-400' />
                              <span className='text-gray-300 capitalize'>{txn.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline' className={txn.type === 'income' ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}>
                              {txn.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-semibold ${getTypeColor(txn.type)}`}>
                            {txn.type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(txn.status)}>
                              {txn.status}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
