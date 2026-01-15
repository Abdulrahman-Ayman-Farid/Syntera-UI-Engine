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
import { Separator } from '@/components/ui/separator'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, DollarSign, TrendingUp, TrendingDown, Wallet,
  CreditCard, Receipt, ShoppingCart, Home, Car, Coffee,
  Film, Heart, Calendar, Download, Filter, Search
} from 'lucide-react'

// Expense metrics with type-safe constants
const EXPENSE_METRICS = [
  {
    id: 'total_expenses',
    label: 'Total Expenses',
    value: '$12,459',
    change: '+8.2%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-purple-500 to-violet-500',
    format: 'currency'
  },
  {
    id: 'monthly_budget',
    label: 'Monthly Budget',
    value: '$15,000',
    used: 83,
    change: 'On track',
    status: 'good' as const,
    icon: Wallet,
    color: 'from-cyan-500 to-blue-500',
    format: 'currency'
  },
  {
    id: 'pending_approval',
    label: 'Pending Approval',
    value: '18',
    change: '+5',
    status: 'warning' as const,
    icon: Receipt,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'reimbursed',
    label: 'Reimbursed',
    value: '$8,245',
    change: '+12.5%',
    status: 'good' as const,
    icon: CreditCard,
    color: 'from-emerald-500 to-green-500',
    format: 'currency'
  }
] as const

const EXPENSE_CATEGORIES = [
  { category: 'Groceries', amount: 2450, color: '#8b5cf6', icon: ShoppingCart, percentage: 20 },
  { category: 'Utilities', amount: 1850, color: '#10b981', icon: Home, percentage: 15 },
  { category: 'Transport', amount: 1250, color: '#f59e0b', icon: Car, percentage: 10 },
  { category: 'Entertainment', amount: 980, color: '#ec4899', icon: Film, percentage: 8 },
  { category: 'Food & Dining', amount: 2180, color: '#06b6d4', icon: Coffee, percentage: 18 },
  { category: 'Healthcare', amount: 1450, color: '#ef4444', icon: Heart, percentage: 12 }
] as const

const RECENT_TRANSACTIONS = [
  {
    id: 'txn-001',
    date: '2026-01-14',
    description: 'Whole Foods Market',
    category: 'groceries',
    amount: 145.50,
    status: 'approved' as const,
    receipt: true
  },
  {
    id: 'txn-002',
    date: '2026-01-13',
    description: 'Electric Bill - January',
    category: 'utilities',
    amount: 285.00,
    status: 'pending' as const,
    receipt: true
  },
  {
    id: 'txn-003',
    date: '2026-01-13',
    description: 'Uber Ride - Downtown',
    category: 'transport',
    amount: 28.50,
    status: 'approved' as const,
    receipt: false
  },
  {
    id: 'txn-004',
    description: 'Movie Tickets - IMAX',
    category: 'entertainment',
    amount: 45.00,
    date: '2026-01-12',
    status: 'approved' as const,
    receipt: true
  },
  {
    id: 'txn-005',
    date: '2026-01-11',
    description: 'Starbucks Coffee',
    category: 'food',
    amount: 12.75,
    status: 'reimbursed' as const,
    receipt: false
  }
] as const

const MONTHLY_TRENDS = [
  { month: 'Jul', expenses: 10200, budget: 15000 },
  { month: 'Aug', expenses: 11500, budget: 15000 },
  { month: 'Sep', expenses: 9800, budget: 15000 },
  { month: 'Oct', expenses: 12100, budget: 15000 },
  { month: 'Nov', expenses: 11800, budget: 15000 },
  { month: 'Dec', expenses: 13200, budget: 15000 },
  { month: 'Jan', expenses: 12459, budget: 15000 }
] as const

export default function ExpenseManagementApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'approved' | 'pending' | 'reimbursed'>('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'reimbursed': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'groceries': return ShoppingCart
      case 'utilities': return Home
      case 'transport': return Car
      case 'entertainment': return Film
      case 'food': return Coffee
      case 'healthcare': return Heart
      default: return Receipt
    }
  }

  const filteredTransactions = useMemo(() => {
    return RECENT_TRANSACTIONS.filter(txn => {
      const matchesSearch = searchQuery === '' || 
        txn.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus
      const matchesCategory = selectedCategory === 'all' || txn.category === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchQuery, selectedStatus, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-purple-500/20 bg-slate-900/95 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <motion.div 
                className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Wallet className='w-8 h-8 text-white' />
              </motion.div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Expense Manager</h1>
                <p className='text-purple-400 text-sm'>Track and manage your expenses</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-purple-500/30 bg-slate-800 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 border-purple-500/30'>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'>
                <Plus className='w-4 h-4 mr-2' />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Expense Overview */}
        <section data-template-section='expense-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {EXPENSE_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-purple-500/20 bg-slate-800/50 backdrop-blur-sm hover:border-purple-500/50 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-purple-300'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
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
                          {metric.used !== undefined && (
                            <Progress value={metric.used} className='h-2 mt-2' />
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

        {/* Analytics & Category Distribution */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Category Distribution */}
          <section data-template-section='budget-analytics' data-chart-type='pie' data-metrics='category,amount'>
            <Card className='border border-purple-500/20 bg-slate-800/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Expenses by Category</CardTitle>
                    <CardDescription className='text-purple-300'>Spending distribution</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-500/30 text-purple-300'>
                    6 Categories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={EXPENSE_CATEGORIES}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({category, percentage}) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      dataKey='amount'
                    >
                      {EXPENSE_CATEGORIES.map((entry, index) => (
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
          <section data-template-section='reports' data-chart-type='bar' data-metrics='expenses,budget'>
            <Card className='border border-purple-500/20 bg-slate-800/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Monthly Trends</CardTitle>
                    <CardDescription className='text-purple-300'>Expenses vs Budget</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-300'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Under Budget
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={MONTHLY_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Legend />
                    <Bar dataKey='expenses' name='Expenses' fill='#a855f7' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='budget' name='Budget' fill='#10b981' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Transactions Table */}
        <section data-template-section='transactions' data-component-type='table'>
          <Card className='border border-purple-500/20 bg-slate-800/50 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Recent Transactions</CardTitle>
                  <CardDescription className='text-purple-300'>Track your expense history</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-purple-500/30 bg-slate-700 text-white'
                  />
                  <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                    <SelectTrigger className='w-32 border-purple-500/30 bg-slate-700 text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-slate-800 border-purple-500/30'>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='approved'>Approved</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='reimbursed'>Reimbursed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-purple-500/20'>
                    <TableHead className='text-purple-300'>Date</TableHead>
                    <TableHead className='text-purple-300'>Description</TableHead>
                    <TableHead className='text-purple-300'>Category</TableHead>
                    <TableHead className='text-purple-300'>Amount</TableHead>
                    <TableHead className='text-purple-300'>Status</TableHead>
                    <TableHead className='text-purple-300'>Receipt</TableHead>
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
                          className='border-purple-500/10 hover:bg-slate-700/50'
                        >
                          <TableCell className='text-gray-300'>
                            <div className='flex items-center space-x-2'>
                              <Calendar className='w-4 h-4 text-purple-400' />
                              <span>{txn.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className='text-white font-medium'>{txn.description}</TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Icon className='w-4 h-4 text-purple-400' />
                              <span className='text-gray-300 capitalize'>{txn.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className='text-white font-semibold'>${txn.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(txn.status)}>
                              {txn.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {txn.receipt ? (
                              <Badge variant='outline' className='border-green-500/30 text-green-400'>
                                <Receipt className='w-3 h-3 mr-1' />
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant='outline' className='border-gray-500/30 text-gray-400'>
                                No
                              </Badge>
                            )}
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
