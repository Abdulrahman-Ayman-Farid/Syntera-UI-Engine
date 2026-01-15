'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pill, User, Clock, CheckCircle, AlertTriangle,
  Search, Filter, Plus, Download, Share2, Eye, Edit, Trash2,
  Star, Heart, TrendingUp, TrendingDown, Calendar,
  BarChart3, PieChart, RefreshCw, Settings, Bell, MoreVertical,
  FileText, Users, Activity, ShieldCheck, Tag, Package
} from 'lucide-react'

// Prescription metrics with type-safe constants
const PRESCRIPTION_METRICS = [
  {
    id: 'total_prescriptions',
    label: 'Total Prescriptions',
    value: '1,248',
    change: '+124',
    status: 'increasing' as const,
    icon: Pill,
    color: 'from-indigo-500 to-purple-500',
    format: 'count'
  },
  {
    id: 'active_prescriptions',
    label: 'Active',
    value: '892',
    change: '+12%',
    status: 'increasing' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'refills_due',
    label: 'Refills Due',
    value: '45',
    change: '+8',
    status: 'warning' as const,
    icon: AlertTriangle,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'patients',
    label: 'Active Patients',
    value: '456',
    change: '+24',
    status: 'good' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  }
] as const

const MEDICATION_CATEGORIES = [
  { category: 'Antibiotics', count: 285, refills: 142, color: '#6366f1', icon: '💊' },
  { category: 'Pain Relief', count: 245, refills: 187, color: '#ec4899', icon: '🩹' },
  { category: 'Cardiovascular', count: 198, refills: 156, color: '#10b981', icon: '❤️' },
  { category: 'Diabetes', count: 165, refills: 124, color: '#f59e0b', icon: '💉' },
] as const

const PRESCRIPTIONS_DATA = [
  {
    id: 'rx-001',
    patientName: 'John Doe',
    patientId: 'PT-1234',
    medication: 'Amoxicillin 500mg',
    dosage: '500mg',
    frequency: 'Three times daily',
    quantity: 30,
    refills: 2,
    refillsRemaining: 2,
    status: 'active',
    prescribedDate: '2026-01-10',
    expiryDate: '2026-07-10',
    prescribedBy: 'Dr. Sarah Smith'
  },
  {
    id: 'rx-002',
    patientName: 'Jane Smith',
    patientId: 'PT-1235',
    medication: 'Ibuprofen 200mg',
    dosage: '200mg',
    frequency: 'As needed',
    quantity: 60,
    refills: 1,
    refillsRemaining: 0,
    status: 'completed',
    prescribedDate: '2026-01-05',
    expiryDate: '2026-07-05',
    prescribedBy: 'Dr. Michael Chen'
  },
  {
    id: 'rx-003',
    patientName: 'Alice Johnson',
    patientId: 'PT-1236',
    medication: 'Lisinopril 10mg',
    dosage: '10mg',
    frequency: 'Once daily',
    quantity: 90,
    refills: 3,
    refillsRemaining: 1,
    status: 'active',
    prescribedDate: '2026-01-12',
    expiryDate: '2026-07-12',
    prescribedBy: 'Dr. Sarah Smith'
  },
  {
    id: 'rx-004',
    patientName: 'Bob Wilson',
    patientId: 'PT-1237',
    medication: 'Metformin 500mg',
    dosage: '500mg',
    frequency: 'Twice daily',
    quantity: 60,
    refills: 2,
    refillsRemaining: 0,
    status: 'refill-due',
    prescribedDate: '2025-12-20',
    expiryDate: '2026-06-20',
    prescribedBy: 'Dr. Emily Davis'
  },
] as const

const MONTHLY_DATA = [
  { month: 'Aug', prescribed: 185, refilled: 142, expired: 12 },
  { month: 'Sep', prescribed: 198, refilled: 156, expired: 8 },
  { month: 'Oct', prescribed: 212, refilled: 168, expired: 15 },
  { month: 'Nov', prescribed: 225, refilled: 189, expired: 10 },
  { month: 'Dec', prescribed: 238, refilled: 198, expired: 14 },
  { month: 'Jan', prescribed: 248, refilled: 205, expired: 9 },
] as const

export default function PrescriptionManagementTool() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'refill-due': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredPrescriptions = useMemo(() => {
    return PRESCRIPTIONS_DATA.filter(prescription => {
      const matchesSearch = searchQuery === '' || 
        prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || 
        prescription.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-indigo-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg'>
                <Pill className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>RxManager Pro</h1>
                <p className='text-gray-600'>Enterprise prescription management system</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='ghost' size='icon'>
                <Bell className='w-5 h-5' />
              </Button>
              <Button className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Prescription
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Prescription Overview */}
        <section data-template-section='prescription-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PRESCRIPTION_METRICS.map((metric) => (
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
                              : metric.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-gray-600'
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

        {/* Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Medication Distribution */}
          <section data-template-section='medication-distribution' data-chart-type='bar' data-metrics='count,refills'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Medication Categories</CardTitle>
                    <CardDescription>Distribution by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-indigo-200 text-indigo-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={MEDICATION_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='category' stroke='#666' angle={-15} textAnchor='end' height={80} />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Prescriptions' radius={[4, 4, 0, 0]}>
                      {MEDICATION_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Monthly Trends */}
          <section data-template-section='monthly-trends' data-chart-type='line' data-metrics='prescribed,refilled,expired'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Monthly Activity</CardTitle>
                    <CardDescription>Prescription trends over time</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='prescribed' 
                      stroke='#6366f1' 
                      strokeWidth={2}
                      name='Prescribed'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='refilled' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Refilled'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='expired' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Expired'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Prescription Browser & Controls */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Prescription Table */}
          <section data-template-section='prescription-browser' data-component-type='prescription-table' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Prescriptions</CardTitle>
                    <CardDescription>Manage patient prescriptions</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search prescriptions...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='completed'>Completed</SelectItem>
                        <SelectItem value='refill-due'>Refill Due</SelectItem>
                        <SelectItem value='cancelled'>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Refills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredPrescriptions.map((prescription) => (
                        <motion.tr
                          key={prescription.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='hover:bg-gray-50'
                        >
                          <TableCell>
                            <div>
                              <div className='font-medium'>{prescription.patientName}</div>
                              <div className='text-sm text-gray-500'>{prescription.patientId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='font-medium'>{prescription.medication}</div>
                            <div className='text-sm text-gray-500'>{prescription.frequency}</div>
                          </TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <span>{prescription.refillsRemaining}/{prescription.refills}</span>
                              <Progress value={(prescription.refillsRemaining / prescription.refills) * 100} className='w-16 h-2' />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(prescription.status)}>
                              {prescription.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Edit className='w-4 h-4' />
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Download className='w-4 h-4' />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Prescription', color: 'from-indigo-500 to-purple-500' },
                    { icon: RefreshCw, label: 'Process Refills', color: 'from-emerald-500 to-teal-500' },
                    { icon: Users, label: 'Patient Records', color: 'from-blue-500 to-cyan-500' },
                    { icon: Package, label: 'Drug Database', color: 'from-amber-500 to-orange-500' },
                    { icon: FileText, label: 'Reports', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-indigo-300 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <ShieldCheck className='w-5 h-5 text-indigo-600' />
                      <div>
                        <div className='font-medium'>Compliance</div>
                        <div className='text-sm text-indigo-600'>FDA Certified</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <AlertTriangle className='w-5 h-5 text-amber-600' />
                      <div>
                        <div className='font-medium'>Refills Due</div>
                        <div className='text-sm text-amber-600'>45 pending</div>
                      </div>
                    </div>
                    <Button variant='ghost' size='sm'>View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Recent Activity */}
        <section data-template-section='recent-activity' data-component-type='activity-feed'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recent Activity</CardTitle>
                  <CardDescription>Latest prescription updates</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  { 
                    action: 'New prescription created',
                    patient: 'John Doe',
                    medication: 'Amoxicillin 500mg',
                    time: '10 minutes ago',
                    icon: Plus,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    action: 'Refill processed',
                    patient: 'Alice Johnson',
                    medication: 'Lisinopril 10mg',
                    time: '1 hour ago',
                    icon: RefreshCw,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    action: 'Prescription completed',
                    patient: 'Jane Smith',
                    medication: 'Ibuprofen 200mg',
                    time: '3 hours ago',
                    icon: CheckCircle,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    action: 'Refill due soon',
                    patient: 'Bob Wilson',
                    medication: 'Metformin 500mg',
                    time: '5 hours ago',
                    icon: AlertTriangle,
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((activity, i) => (
                  <div key={i} className='flex items-center space-x-4 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg`}>
                      <activity.icon className='w-6 h-6 text-white' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>{activity.action}</div>
                      <div className='text-sm text-gray-600'>
                        {activity.patient} - {activity.medication}
                      </div>
                    </div>
                    <div className='text-sm text-gray-500'>{activity.time}</div>
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
