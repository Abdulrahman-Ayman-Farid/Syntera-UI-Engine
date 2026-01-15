'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, ChevronRight, ArrowUpRight, CreditCard, DollarSign, Users, TrendingUp, TrendingDown, Download, Bell, Settings } from 'lucide-react'

const BANKING_METRICS = [
  { id: 'total_balance', label: 'Total Balance', value: '$23,456.78', change: '+15%', changeType: 'positive' as const, icon: DollarSign, color: 'from-emerald-500 to-teal-500', format: 'currency' as const },
  { id: 'active_accounts', label: 'Active Accounts', value: '15', change: '+2', changeType: 'positive' as const, icon: CreditCard, color: 'from-blue-500 to-cyan-500', format: 'number' as const },
  { id: 'transactions', label: 'Transactions', value: '1,248', change: '+8%', changeType: 'positive' as const, icon: ArrowUpRight, color: 'from-purple-500 to-pink-500', format: 'count' as const },
  { id: 'customers', label: 'Total Customers', value: '3,842', change: '+125', changeType: 'positive' as const, icon: Users, color: 'from-amber-500 to-orange-500', format: 'count' as const }
] as const

const ACCOUNT_DATA = [
  { type: 'Checking', count: 8, balance: 12450, color: '#10b981' },
  { type: 'Savings', count: 4, balance: 8900, color: '#3b82f6' },
  { type: 'Investment', count: 2, balance: 45600, color: '#8b5cf6' },
  { type: 'Credit', count: 1, balance: -2500, color: '#ef4444' }
] as const

const TRANSACTION_TRENDS = [
  { month: 'Jan', income: 4200, expenses: 2800, savings: 1400 },
  { month: 'Feb', income: 4500, expenses: 3000, savings: 1500 },
  { month: 'Mar', income: 4800, expenses: 3200, savings: 1600 },
  { month: 'Apr', income: 5100, expenses: 3400, savings: 1700 },
  { month: 'May', income: 5400, expenses: 3600, savings: 1800 },
  { month: 'Jun', income: 5700, expenses: 3800, savings: 1900 }
] as const

const RECENT_TRANSACTIONS = [
  { id: 1, description: 'Amazon Purchase', amount: -123.45, date: '2024-01-20', category: 'Shopping', status: 'completed' as const },
  { id: 2, description: 'Salary Deposit', amount: 5000, date: '2024-01-15', category: 'Income', status: 'completed' as const },
  { id: 3, description: 'Electric Bill', amount: -85.50, date: '2024-01-12', category: 'Utilities', status: 'completed' as const },
  { id: 4, description: 'Restaurant', amount: -42.30, date: '2024-01-10', category: 'Dining', status: 'pending' as const },
  { id: 5, description: 'Transfer to Savings', amount: -500, date: '2024-01-08', category: 'Transfer', status: 'completed' as const }
] as const

const CUSTOMERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', balance: 12450.56, accounts: 3, status: 'active' as const },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', balance: 8900.90, accounts: 2, status: 'active' as const },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', balance: 45600.00, accounts: 4, status: 'premium' as const },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', balance: 5670.25, accounts: 1, status: 'active' as const }
] as const

export default function BankingDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [timeRange, setTimeRange] = useState('month')
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  useEffect(() => { setTimeout(() => setIsLoading(false), 600) }, [])

  const filteredTransactions = useMemo(() => {
    return RECENT_TRANSACTIONS.filter(tx => {
      const matchesSearch = searchTerm === '' || tx.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || tx.category.toLowerCase() === filterCategory.toLowerCase()
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, filterCategory])

  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter(customer => {
      return searchTerm === '' || customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [searchTerm])

  const totalBalance = useMemo(() => ACCOUNT_DATA.reduce((sum, acc) => sum + acc.balance, 0), [])
  const totalAccounts = useMemo(() => ACCOUNT_DATA.reduce((sum, acc) => sum + acc.count, 0), [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/30'>
      <header className='sticky top-0 z-50 border-b border-emerald-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg'>
                <DollarSign className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Luxury Banking</h1>
                <p className='text-gray-600'>Premium wealth management dashboard</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-emerald-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Transaction
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        <section data-template-section='banking-overview' data-component-type='kpi-grid'>
          <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
            <AnimatePresence>
              {BANKING_METRICS.map((metric) => (
                <motion.div key={metric.id} layoutId={`metric-${metric.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                  <Card className='h-full border border-emerald-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${metric.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {metric.changeType === 'positive' ? <TrendingUp className='w-4 h-4 mr-1' /> : <TrendingDown className='w-4 h-4 mr-1' />}
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='account-distribution' data-chart-type='pie' data-metrics='balance,count'>
            <Card className='h-full border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Account Distribution</CardTitle>
                    <CardDescription>Balance by account type</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    ${(totalBalance / 1000).toFixed(1)}K Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie data={ACCOUNT_DATA} cx='50%' cy='50%' labelLine={false} label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill='#8884d8' dataKey='balance'>
                      {ACCOUNT_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <TooltipProvider />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='transaction-trends' data-chart-type='line' data-metrics='income,expenses,savings'>
            <Card className='h-full border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Transaction Trends</CardTitle>
                    <CardDescription>Monthly financial overview</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TRANSACTION_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider />
                    <Legend />
                    <Line type='monotone' dataKey='income' stroke='#10b981' strokeWidth={2} name='Income' />
                    <Line type='monotone' dataKey='expenses' stroke='#ef4444' strokeWidth={2} name='Expenses' />
                    <Line type='monotone' dataKey='savings' stroke='#3b82f6' strokeWidth={2} name='Savings' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='recent-transactions' data-component-type='transaction-list' className='lg:col-span-2'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Transactions</CardTitle>
                    <CardDescription>Latest account activity</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input placeholder='Search transactions...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-48 border-emerald-300' />
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className='w-32 border-emerald-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value='shopping'>Shopping</SelectItem>
                        <SelectItem value='dining'>Dining</SelectItem>
                        <SelectItem value='utilities'>Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredTransactions.map((tx) => (
                      <motion.div key={tx.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className='p-4 bg-gradient-to-r from-emerald-50/50 to-white border border-emerald-200 rounded-xl hover:border-emerald-300 transition-colors'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4'>
                            <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {tx.amount > 0 ? <ArrowUpRight className='w-5 h-5' /> : <TrendingDown className='w-5 h-5' />}
                            </div>
                            <div>
                              <h4 className='font-medium'>{tx.description}</h4>
                              <div className='flex items-center space-x-4 text-sm text-gray-600 mt-1'>
                                <span>{tx.date}</span>
                                <Badge variant='outline' className='border-gray-300'>{tx.category}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className={`text-lg font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                            </div>
                            <Badge className={tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-emerald-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Transaction', color: 'from-emerald-500 to-teal-500' },
                    { icon: ArrowUpRight, label: 'Transfer Funds', color: 'from-blue-500 to-cyan-500' },
                    { icon: CreditCard, label: 'Manage Cards', color: 'from-purple-500 to-pink-500' },
                    { icon: Download, label: 'Download Statement', color: 'from-amber-500 to-orange-500' },
                    { icon: Settings, label: 'Account Settings', color: 'from-gray-500 to-slate-500' }
                  ].map((action, i) => (
                    <Button key={i} variant='outline' className='w-full justify-start border-emerald-300 hover:border-emerald-400 h-14'>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section data-template-section='customer-list' data-component-type='customer-grid'>
          <Card className='border border-emerald-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Top Customers</CardTitle>
                  <CardDescription>Premium account holders</CardDescription>
                </div>
                <Button variant='outline' className='border-emerald-300'>
                  View All
                  <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <AnimatePresence>
                  {filteredCustomers.map((customer) => (
                    <motion.div key={customer.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className='p-4 bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200 rounded-xl hover:border-emerald-300 transition-colors'>
                      <div className='flex items-center space-x-4 mb-4'>
                        <Avatar className='w-12 h-12'>
                          <AvatarFallback className='bg-gradient-to-br from-emerald-500 to-teal-500 text-white'>
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className='font-bold'>{customer.name}</h4>
                          <p className='text-sm text-gray-600'>{customer.email}</p>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-gray-600'>Balance</span>
                          <span className='font-bold text-emerald-600'>${customer.balance.toFixed(2)}</span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-gray-600'>Accounts</span>
                          <Badge variant='outline' className='border-emerald-300'>{customer.accounts}</Badge>
                        </div>
                        <Badge className={customer.status === 'premium' ? 'bg-amber-100 text-amber-800 w-full justify-center' : 'bg-emerald-100 text-emerald-800 w-full justify-center'}>
                          {customer.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
