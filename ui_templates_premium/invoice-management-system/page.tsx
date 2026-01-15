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
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, FileText, DollarSign, TrendingUp, TrendingDown,
  CheckCircle, Clock, XCircle, AlertTriangle, Calendar,
  Users, Download, Send, Eye, Edit, Trash2, MoreVertical,
  Filter, Search, Printer
} from 'lucide-react'

// Invoice metrics with type-safe constants
const INVOICE_METRICS = [
  {
    id: 'total_invoices',
    label: 'Total Invoices',
    value: '248',
    change: '+18',
    status: 'increasing' as const,
    icon: FileText,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'total_revenue',
    label: 'Total Revenue',
    value: '$124,580',
    change: '+24.5%',
    status: 'good' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'pending_invoices',
    label: 'Pending Invoices',
    value: '42',
    change: '+8',
    status: 'warning' as const,
    icon: Clock,
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'overdue_invoices',
    label: 'Overdue Invoices',
    value: '12',
    change: '-3',
    status: 'good' as const,
    icon: AlertTriangle,
    color: 'from-rose-500 to-red-500'
  }
] as const

const INVOICE_STATUS_BREAKDOWN = [
  { status: 'Paid', count: 158, color: '#10b981', percentage: 64 },
  { status: 'Pending', count: 42, color: '#f59e0b', percentage: 17 },
  { status: 'Overdue', count: 12, color: '#ef4444', percentage: 5 },
  { status: 'Draft', count: 36, color: '#6b7280', percentage: 14 }
] as const

const RECENT_INVOICES = [
  {
    id: 'INV-2026-001',
    customerName: 'Acme Corporation',
    amount: 15420.00,
    status: 'paid' as const,
    date: '2026-01-10',
    dueDate: '2026-01-25',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'INV-2026-002',
    customerName: 'Tech Solutions Inc',
    amount: 8950.00,
    status: 'pending' as const,
    date: '2026-01-12',
    dueDate: '2026-01-27',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-2026-003',
    customerName: 'Global Enterprises',
    amount: 12340.00,
    status: 'overdue' as const,
    date: '2025-12-15',
    dueDate: '2025-12-30',
    paymentMethod: 'Check'
  },
  {
    id: 'INV-2026-004',
    customerName: 'Innovation Labs',
    amount: 6780.00,
    status: 'paid' as const,
    date: '2026-01-08',
    dueDate: '2026-01-23',
    paymentMethod: 'Wire Transfer'
  },
  {
    id: 'INV-2026-005',
    customerName: 'Digital Dynamics',
    amount: 9450.00,
    status: 'pending' as const,
    date: '2026-01-11',
    dueDate: '2026-01-26',
    paymentMethod: 'PayPal'
  },
  {
    id: 'INV-2026-006',
    customerName: 'Smart Systems Co',
    amount: 5230.00,
    status: 'draft' as const,
    date: '2026-01-14',
    dueDate: '2026-01-29',
    paymentMethod: 'Not Set'
  }
] as const

const REVENUE_TRENDS = [
  { month: 'Jul', revenue: 82400, invoices: 32 },
  { month: 'Aug', revenue: 95200, invoices: 38 },
  { month: 'Sep', revenue: 88600, invoices: 35 },
  { month: 'Oct', revenue: 102500, invoices: 41 },
  { month: 'Nov', revenue: 98300, invoices: 39 },
  { month: 'Dec', revenue: 115400, invoices: 46 },
  { month: 'Jan', revenue: 124580, invoices: 50 }
] as const

const PAYMENT_STATUS_DATA = [
  { month: 'Jul', onTime: 28, late: 4, pending: 5 },
  { month: 'Aug', onTime: 32, late: 3, pending: 6 },
  { month: 'Sep', onTime: 30, late: 2, pending: 5 },
  { month: 'Oct', onTime: 35, late: 3, pending: 7 },
  { month: 'Nov', onTime: 33, late: 2, pending: 6 },
  { month: 'Dec', onTime: 40, late: 3, pending: 8 },
  { month: 'Jan', onTime: 42, late: 2, pending: 10 }
] as const

export default function InvoiceManagementSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'draft'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'overdue': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle
      case 'pending': return Clock
      case 'overdue': return AlertTriangle
      case 'draft': return FileText
      default: return FileText
    }
  }

  const filteredInvoices = useMemo(() => {
    return RECENT_INVOICES.filter(invoice => {
      const matchesSearch = searchQuery === '' || 
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-blue-200 bg-white/95 backdrop-blur-xl shadow-sm'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <motion.div 
                className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FileText className='w-8 h-8 text-white' />
              </motion.div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                  Invoice Manager Pro
                </h1>
                <p className='text-blue-600 text-sm'>Streamline your billing & payments</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-blue-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Create Invoice
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Invoice Overview */}
        <section data-template-section='invoice-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {INVOICE_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-blue-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-blue-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : metric.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-rose-600'
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

        {/* Analytics & Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Revenue Trends */}
          <section data-template-section='reports' data-chart-type='line' data-metrics='revenue,invoices' className='lg:col-span-2'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue and invoice count</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +21% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={REVENUE_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                    <XAxis dataKey='month' stroke='#6b7280' />
                    <YAxis yAxisId='left' stroke='#6b7280' />
                    <YAxis yAxisId='right' orientation='right' stroke='#6b7280' />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='revenue' 
                      stroke='#0ea5e9' 
                      strokeWidth={2}
                      name='Revenue ($)'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='invoices' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Invoices'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Status Breakdown */}
          <section data-template-section='payment-status' data-chart-type='pie' data-metrics='status,count'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Status Breakdown</CardTitle>
                    <CardDescription>Invoice distribution</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    248 Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={INVOICE_STATUS_BREAKDOWN}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({status, percentage}) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      dataKey='count'
                    >
                      {INVOICE_STATUS_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Payment Status Timeline */}
        <section data-template-section='client-management' data-chart-type='bar' data-metrics='onTime,late,pending'>
          <Card className='border border-blue-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Payment Status Timeline</CardTitle>
                  <CardDescription>Payment patterns over time</CardDescription>
                </div>
                <Badge variant='outline' className='border-blue-200 text-blue-700'>
                  7 Months
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={PAYMENT_STATUS_DATA}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis dataKey='month' stroke='#6b7280' />
                  <YAxis stroke='#6b7280' />
                  <Legend />
                  <Bar dataKey='onTime' name='On Time' fill='#10b981' radius={[4, 4, 0, 0]} />
                  <Bar dataKey='late' name='Late' fill='#ef4444' radius={[4, 4, 0, 0]} />
                  <Bar dataKey='pending' name='Pending' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Invoice List */}
        <section data-template-section='invoice-list' data-component-type='table'>
          <Card className='border border-blue-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recent Invoices</CardTitle>
                  <CardDescription>Manage your billing documents</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search invoices...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-blue-300'
                  />
                  <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                    <SelectTrigger className='w-32 border-blue-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='paid'>Paid</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='overdue'>Overdue</SelectItem>
                      <SelectItem value='draft'>Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant='outline' className='border-blue-300'>
                    <Download className='w-4 h-4 mr-2' />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-blue-200'>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredInvoices.map((invoice) => {
                      const StatusIcon = getStatusIcon(invoice.status)
                      return (
                        <motion.tr
                          key={invoice.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='border-blue-100 hover:bg-blue-50/50'
                        >
                          <TableCell className='font-medium text-blue-600'>{invoice.id}</TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Users className='w-4 h-4 text-blue-500' />
                              <span className='font-medium'>{invoice.customerName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Calendar className='w-4 h-4 text-gray-500' />
                              <span>{invoice.date}</span>
                            </div>
                          </TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell className='font-semibold text-gray-900'>
                            ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className='text-gray-600'>{invoice.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invoice.status)}>
                              <StatusIcon className='w-3 h-3 mr-1' />
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Send className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Printer className='w-4 h-4' />
                              </Button>
                            </div>
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
