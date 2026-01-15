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
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, DollarSign, Calendar, AlertCircle,
  CheckCircle, TrendingDown, Plus, Search, Download,
  RefreshCw, Eye, Edit, FolderPlus, Info
} from 'lucide-react'

// Tax forms with 'as const'
const TAX_FORMS = [
  {
    id: 'form_1040',
    name: 'Form 1040',
    description: 'U.S. Individual Income Tax Return',
    status: 'completed' as const,
    dueDate: '2024-04-15',
    progress: 100
  },
  {
    id: 'schedule_c',
    name: 'Schedule C',
    description: 'Profit or Loss from Business',
    status: 'in_progress' as const,
    dueDate: '2024-04-15',
    progress: 65
  },
  {
    id: 'schedule_d',
    name: 'Schedule D',
    description: 'Capital Gains and Losses',
    status: 'pending' as const,
    dueDate: '2024-04-15',
    progress: 30
  },
  {
    id: 'form_8949',
    name: 'Form 8949',
    description: 'Sales and Dispositions of Capital Assets',
    status: 'pending' as const,
    dueDate: '2024-04-15',
    progress: 20
  }
] as const

const TAX_METRICS = [
  {
    id: 'total_income',
    label: 'Total Income',
    value: '$125,000',
    change: '+8%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-500',
    format: 'currency'
  },
  {
    id: 'deductions',
    label: 'Total Deductions',
    value: '$32,500',
    change: '+12%',
    status: 'increasing' as const,
    icon: TrendingDown,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'tax_due',
    label: 'Tax Due',
    value: '$18,450',
    change: '-5%',
    status: 'decreasing' as const,
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    format: 'currency'
  },
  {
    id: 'refund',
    label: 'Expected Refund',
    value: '$2,340',
    change: '+15%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'currency'
  }
] as const

const INCOME_BREAKDOWN = [
  { category: 'Salary', amount: 85000, percentage: 68, color: '#3b82f6' },
  { category: 'Business Income', amount: 28000, percentage: 22, color: '#8b5cf6' },
  { category: 'Investments', amount: 8000, percentage: 6, color: '#10b981' },
  { category: 'Other', amount: 4000, percentage: 4, color: '#f59e0b' }
] as const

const DEDUCTION_BREAKDOWN = [
  { category: 'Mortgage Interest', amount: 12000, color: '#3b82f6' },
  { category: 'Charitable', amount: 5500, color: '#10b981' },
  { category: 'Business Expenses', amount: 9000, color: '#8b5cf6' },
  { category: 'Medical', amount: 3500, color: '#f59e0b' },
  { category: 'Other', amount: 2500, color: '#6b7280' }
] as const

const TAX_YEARS = [
  { year: 2023, status: 'in_progress', income: 125000, tax: 18450 },
  { year: 2022, status: 'filed', income: 115000, tax: 16800 },
  { year: 2021, status: 'filed', income: 105000, tax: 15200 }
] as const


export default function TaxFilingInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState('2023')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedForm, setSelectedForm] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredForms = useMemo(() => {
    return TAX_FORMS.filter(form => 
      searchQuery === '' || 
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-tr from-magenta to-cyan'>
      {/* Sidebar */}
      <aside 
        className='fixed w-64 h-full bg-black p-6 space-y-8 shadow-2xl z-50'
        data-template-section='sidebar'
        data-component-type='navigation'
      >
        <div className='flex items-center justify-between'>
          <span className='font-bold text-2xl text-white'>Tax Filer Pro</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='hover:bg-gray-800 p-2 rounded-full'>
                  <Info size={24} className='text-white' aria-hidden='true' />
                </button>
              </TooltipTrigger>
              <TooltipContent>Help & Info</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <nav className='space-y-4'>
          <Button variant='ghost' className='w-full justify-start text-white hover:bg-gray-800'>
            <FileText className='mr-2' size={20} />
            Dashboard
          </Button>
          <Button variant='ghost' className='w-full justify-start text-white hover:bg-gray-800'>
            <FolderPlus className='mr-2' size={20} />
            New Filing
          </Button>
          <Button variant='ghost' className='w-full justify-start text-white hover:bg-gray-800'>
            <Calendar className='mr-2' size={20} />
            Tax Calendar
          </Button>
          <Button variant='ghost' className='w-full justify-start text-white hover:bg-gray-800'>
            <Download className='mr-2' size={20} />
            Reports
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='ml-64 p-6 space-y-8'>
        {/* Header */}
        <header data-template-section='header'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-white'>Tax Year {selectedYear}</h1>
              <p className='text-lg text-white/75'>Manage your tax filings efficiently</p>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className='w-40 bg-white/20 border-white/30 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAX_YEARS.map(year => (
                    <SelectItem key={year.year} value={year.year.toString()}>{year.year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant='outline'
                onClick={handleRefresh}
                className='bg-white/20 border-white/30 text-white'
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Tax Metrics */}
        <section data-template-section='tax-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {TAX_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-white/70'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                          </div>
                          <div className='flex items-center text-sm font-medium text-white/60'>
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

        {/* Income & Deductions */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='income-breakdown' data-chart-type='pie' data-metrics='income'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'>
              <CardHeader>
                <CardTitle className='text-white'>Income Breakdown</CardTitle>
                <CardDescription className='text-white/70'>Income by category</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={INCOME_BREAKDOWN}
                      dataKey='amount'
                      nameKey='category'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      label={(entry) => `${entry.category}: ${entry.percentage}%`}
                    >
                      {INCOME_BREAKDOWN.map((entry, index) => (
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

          <section data-template-section='deduction-breakdown' data-chart-type='bar' data-metrics='deductions'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'>
              <CardHeader>
                <CardTitle className='text-white'>Deductions</CardTitle>
                <CardDescription className='text-white/70'>Tax deductions by type</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={DEDUCTION_BREAKDOWN}>
                    <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.1)' />
                    <XAxis dataKey='category' stroke='#fff' />
                    <YAxis stroke='#fff' />
                    <RechartsTooltip />
                    <Bar dataKey='amount' radius={[4, 4, 0, 0]}>
                      {DEDUCTION_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Tax Forms */}
        <section data-template-section='tax-forms' data-component-type='forms-grid'>
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-white'>Tax Forms</CardTitle>
                  <CardDescription className='text-white/70'>Required forms for filing</CardDescription>
                </div>
                <Input
                  placeholder='Search forms...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-48 bg-white/20 border-white/30 text-white placeholder:text-white/50'
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <AnimatePresence>
                  {filteredForms.map((form) => (
                    <motion.div
                      key={form.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl cursor-pointer transition-all ${
                        selectedForm === form.id ? 'ring-2 ring-white ring-offset-2' : ''
                      }`}
                      onClick={() => setSelectedForm(form.id)}
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1'>
                          <h4 className='font-bold text-lg text-white'>{form.name}</h4>
                          <p className='text-sm text-white/70'>{form.description}</p>
                        </div>
                        <Badge className={getStatusColor(form.status)}>
                          {form.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Separator className='my-3 bg-white/20' />
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm text-white/70'>
                          <span>Progress</span>
                          <span>{form.progress}%</span>
                        </div>
                        <Progress value={form.progress} className='h-2' />
                        <div className='flex items-center justify-between text-sm text-white/70 mt-2'>
                          <span className='flex items-center'>
                            <Calendar className='w-4 h-4 mr-1' />
                            Due: {form.dueDate}
                          </span>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-white hover:bg-white/20'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-white hover:bg-white/20'>
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-white hover:bg-white/20'>
                              <Download className='w-4 h-4' />
                            </Button>
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

        {/* Tax Calculation Summary */}
        <section data-template-section='tax-calculation' data-component-type='summary-card'>
          <Card className='bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 border-0 shadow-2xl'>
            <CardHeader>
              <CardTitle className='text-white text-2xl'>Tax Calculation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
                  <div className='text-sm text-white/70 mb-2'>Gross Income</div>
                  <div className='text-3xl font-bold text-white'>$125,000</div>
                </div>
                <div className='p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
                  <div className='text-sm text-white/70 mb-2'>Total Deductions</div>
                  <div className='text-3xl font-bold text-emerald-400'>-$32,500</div>
                </div>
                <div className='p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
                  <div className='text-sm text-white/70 mb-2'>Taxable Income</div>
                  <div className='text-3xl font-bold text-white'>$92,500</div>
                </div>
              </div>
              <Separator className='my-6 bg-white/20' />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
                  <div className='text-sm text-white/70 mb-2'>Calculated Tax</div>
                  <div className='text-3xl font-bold text-amber-400'>$18,450</div>
                </div>
                <div className='p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
                  <div className='text-sm text-white/70 mb-2'>Refund/Amount Due</div>
                  <div className='text-3xl font-bold text-emerald-400'>$2,340 Refund</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Tax Year 2021</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex justify-between space-x-4'>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Income</p>
                        <p className='text-sm font-medium'>$45,000</p>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Expenses</p>
                        <p className='text-sm font-medium'>$18,000</p>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Tax Due</p>
                        <p className='text-sm font-medium'>$7,000</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='details'>
              <div className='space-y-4'>
                <Card className='bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>No payments made yet.</p>
                  </CardContent>
                </Card>
                <Card className='bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Refunds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>No refunds available.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Dialog.Root open={!!selectedUser} onOpenChange={handleCloseModal}>
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black bg-opacity-50 fixed inset-0' />
          <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-black p-6 shadow-2xl outline-none focus:outline-none animate-fadeIn'>
            <Dialog.Title className='text-2xl font-bold'>User Details</Dialog.Title>
            <Dialog.Description className='mt-2 mb-4'>View and manage details for selected user.</Dialog.Description>
            <div className='space-y-4'>
              {selectedUser && (
                <div className='flex items-center space-x-4'>
                  <Avatar className='h-16 w-16'>
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-xl'>{selectedUser.name}</p>
                    <p className='opacity-75'>{selectedUser.email}</p>
                  </div>
                </div>
              )}
              <div className='grid grid-cols-2 gap-4'>
                <Card className='bg-gradient-to-br from-cyan-900 via-blue-900 to-violet-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Income</CardTitle>
                  </CardHeader>
                  <CardContent>$10,000</CardContent>
                </Card>
                <Card className='bg-gradient-to-br from-pink-900 via-red-900 to-orange-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>$4,000</CardContent>
                </Card>
              </div>
              <Button className='w-full mt-4'>Edit User</Button>
            </div>
            <Dialog.Close className='absolute top-4 right-4 rounded-full opacity-70 transition-opacity hover:opacity-100'>×</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default TaxFilingInterface
