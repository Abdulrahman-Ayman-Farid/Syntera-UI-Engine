'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
} from '@/components/ui/tooltip'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, ChevronRight, UserCircle2, AlertTriangle,
  CheckCircle2, Calendar, Clock, FileText, Pill, TestTube,
  MessageSquare, Phone, Video, Mail, MapPin, Award,
  TrendingUp, TrendingDown, Heart, Activity, Users,
  BarChart3, Download, Share2, Settings, Bell, Stethoscope,
  Clipboard, X
} from 'lucide-react'

// Patient portal metrics with TypeScript constants
const PATIENT_METRICS = [
  {
    id: 'total_patients',
    label: 'Total Patients',
    value: '3,248',
    change: '+184',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-purple-500 to-indigo-500',
    format: 'count'
  },
  {
    id: 'appointments_week',
    label: 'Weekly Appointments',
    value: '156',
    change: '+24',
    status: 'increasing' as const,
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'prescriptions',
    label: 'Active Prescriptions',
    value: '892',
    change: '+42',
    status: 'good' as const,
    icon: Pill,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'satisfaction',
    label: 'Satisfaction Rate',
    value: '94',
    unit: '%',
    change: '+3%',
    status: 'good' as const,
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    format: 'percent'
  }
] as const

const APPOINTMENT_TRENDS = [
  { month: 'Jan', scheduled: 420, completed: 385, cancelled: 35 },
  { month: 'Feb', scheduled: 480, completed: 445, cancelled: 35 },
  { month: 'Mar', scheduled: 520, completed: 488, cancelled: 32 },
  { month: 'Apr', scheduled: 560, completed: 525, cancelled: 35 },
  { month: 'May', scheduled: 620, completed: 585, cancelled: 35 },
  { month: 'Jun', scheduled: 680, completed: 645, cancelled: 35 },
] as const

const SERVICE_DISTRIBUTION = [
  { service: 'General Care', visits: 485, color: '#8b5cf6' },
  { service: 'Specialist', visits: 325, color: '#3b82f6' },
  { service: 'Lab Tests', visits: 245, color: '#10b981' },
  { service: 'Telehealth', visits: 180, color: '#f59e0b' },
] as const

const PATIENTS_DATA = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    status: 'Active' as const,
    lastVisit: '2024-02-01',
    nextAppointment: '2024-02-15',
    condition: 'Diabetes Management',
    priority: 'medium' as const,
    avatar: 'JD',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    status: 'Active' as const,
    lastVisit: '2024-01-28',
    nextAppointment: '2024-02-20',
    condition: 'Annual Checkup',
    priority: 'low' as const,
    avatar: 'JS',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    age: 58,
    status: 'Inactive' as const,
    lastVisit: '2023-12-15',
    nextAppointment: null,
    condition: 'Hypertension',
    priority: 'high' as const,
    avatar: 'AJ',
    email: 'alice.j@example.com',
    phone: '(555) 345-6789'
  },
  {
    id: 4,
    name: 'Robert Brown',
    age: 67,
    status: 'Active' as const,
    lastVisit: '2024-02-03',
    nextAppointment: '2024-02-18',
    condition: 'Cardiac Care',
    priority: 'high' as const,
    avatar: 'RB',
    email: 'robert.b@example.com',
    phone: '(555) 456-7890'
  },
] as const

const UPCOMING_APPOINTMENTS = [
  {
    id: 'apt-001',
    patient: 'John Doe',
    date: '2024-02-15',
    time: '10:30 AM',
    type: 'Follow-up',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed' as const
  },
  {
    id: 'apt-002',
    patient: 'Jane Smith',
    date: '2024-02-20',
    time: '2:00 PM',
    type: 'Annual Checkup',
    doctor: 'Dr. Michael Brown',
    status: 'scheduled' as const
  },
  {
    id: 'apt-003',
    patient: 'Robert Brown',
    date: '2024-02-18',
    time: '11:15 AM',
    type: 'Specialist Consultation',
    doctor: 'Dr. Emily Wang',
    status: 'confirmed' as const
  },
] as const

const TEST_RESULTS = [
  {
    id: 'test-001',
    patient: 'John Doe',
    test: 'Blood Glucose',
    date: '2024-02-01',
    result: 'Normal',
    value: '95 mg/dL',
    status: 'completed' as const
  },
  {
    id: 'test-002',
    patient: 'Robert Brown',
    test: 'Cholesterol Panel',
    date: '2024-02-03',
    result: 'Review Required',
    value: 'See details',
    status: 'pending' as const
  },
  {
    id: 'test-003',
    patient: 'Jane Smith',
    test: 'Complete Blood Count',
    date: '2024-01-28',
    result: 'Normal',
    value: 'All in range',
    status: 'completed' as const
  },
] as const

const PatientPortal = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [patients, setPatients] = useState(PATIENTS_DATA)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'border-rose-300 bg-rose-50'
      case 'medium': return 'border-amber-300 bg-amber-50'
      case 'low': return 'border-emerald-300 bg-emerald-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }, [])

  const getTestStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'urgent': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesStatus = filterStatus === 'All' || patient.status === filterStatus
      const matchesSearch = searchTerm === '' ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [patients, searchTerm, filterStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-purple-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg'>
                <Stethoscope className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Royal Healthcare Portal</h1>
                <p className='text-gray-600'>Comprehensive patient management system</p>
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
              <Button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Patient
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Patient Portal Metrics Overview */}
        <section data-template-section='portal-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PATIENT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMetric(metric.id)}
                >
                  <Card className={`h-full border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    selectedMetric === metric.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                  }`}>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-500'>{metric.unit}</span>
                            )}
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

        {/* Analytics & Trends */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Appointment Trends */}
          <section data-template-section='appointment-trends' data-chart-type='line' data-metrics='scheduled,completed,cancelled'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Appointment Trends</CardTitle>
                    <CardDescription>Monthly appointment statistics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={APPOINTMENT_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='scheduled' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Scheduled'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='completed' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Completed'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='cancelled' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Cancelled'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Service Distribution */}
          <section data-template-section='service-distribution' data-chart-type='bar' data-metrics='visits'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Service Distribution</CardTitle>
                    <CardDescription>Visits by service type</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={SERVICE_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='service' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='visits' name='Total Visits' radius={[4, 4, 0, 0]}>
                      {SERVICE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Patient Management & Details */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Patient List */}
          <section data-template-section='patient-list' data-component-type='patient-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Patient Directory</CardTitle>
                    <CardDescription>All registered patients</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search patients...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='All'>All Status</SelectItem>
                        <SelectItem value='Active'>Active</SelectItem>
                        <SelectItem value='Inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredPatients.map((patient) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border rounded-xl transition-all cursor-pointer ${getPriorityColor(patient.priority)} hover:border-purple-300`}
                      >
                        <div className='flex items-start space-x-3'>
                          <Avatar className='w-12 h-12'>
                            <AvatarFallback className='bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-bold'>
                              {patient.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-1'>
                              <h4 className='font-bold text-gray-900'>{patient.name}</h4>
                              {patient.priority === 'high' && (
                                <Badge variant='destructive' className='text-xs'>
                                  <AlertTriangle className='w-3 h-3 mr-1' />
                                  Priority
                                </Badge>
                              )}
                            </div>
                            <p className='text-sm text-gray-600'>{patient.age} years old</p>
                            <div className='text-xs text-gray-500 mt-1 space-y-1'>
                              <div className='flex items-center'>
                                <Mail className='w-3 h-3 mr-1' />
                                {patient.email}
                              </div>
                              <div className='flex items-center'>
                                <Phone className='w-3 h-3 mr-1' />
                                {patient.phone}
                              </div>
                            </div>
                            <div className='mt-3 space-y-2'>
                              <Badge className='text-xs bg-purple-100 text-purple-800 border-purple-300'>
                                {patient.condition}
                              </Badge>
                              <div className='flex items-center justify-between text-xs'>
                                <span className='text-gray-500'>
                                  Last visit: {patient.lastVisit}
                                </span>
                                <Badge className={getStatusColor(patient.status)}>
                                  {patient.status}
                                </Badge>
                              </div>
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

          {/* Quick Actions & Info */}
          <div className='space-y-8'>
            {/* Quick Actions */}
            <section data-template-section='quick-actions' data-component-type='action-panel'>
              <Card className='border border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {[
                      { icon: Calendar, label: 'Schedule Visit', color: 'from-purple-500 to-indigo-500' },
                      { icon: Pill, label: 'New Prescription', color: 'from-emerald-500 to-teal-500' },
                      { icon: TestTube, label: 'Order Lab Test', color: 'from-amber-500 to-orange-500' },
                      { icon: MessageSquare, label: 'Send Message', color: 'from-blue-500 to-cyan-500' },
                      { icon: Download, label: 'Export Records', color: 'from-rose-500 to-pink-500' },
                    ].map((action, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant='outline'
                          className='w-full justify-start border-gray-300 hover:border-purple-300 h-14'
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                            <action.icon className='w-5 h-5 text-white' />
                          </div>
                          {action.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* System Status */}
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Portal Activity</span>
                      <span className='font-medium'>94%</span>
                    </div>
                    <Progress value={94} className='h-2' />
                  </div>
                  
                  <Separator />
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle2 className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium text-sm'>All Systems Operational</div>
                        <div className='text-xs text-emerald-600'>Last updated: 2 min ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointments & Test Results */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Upcoming Appointments */}
          <section data-template-section='appointments' data-component-type='appointment-list'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Upcoming Appointments</CardTitle>
                    <CardDescription>Scheduled patient visits</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' className='border-gray-300'>
                    <Calendar className='w-4 h-4 mr-1' />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {UPCOMING_APPOINTMENTS.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileHover={{ scale: 1.01 }}
                        className='p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start space-x-3'>
                            <div className='p-2 bg-purple-100 rounded-lg mt-1'>
                              <Calendar className='w-5 h-5 text-purple-600' />
                            </div>
                            <div className='flex-1'>
                              <h4 className='font-bold text-gray-900'>{appointment.patient}</h4>
                              <div className='text-sm text-gray-600 space-y-1 mt-1'>
                                <div className='flex items-center space-x-3'>
                                  <span className='flex items-center'>
                                    <Calendar className='w-3 h-3 mr-1' />
                                    {appointment.date}
                                  </span>
                                  <span className='flex items-center'>
                                    <Clock className='w-3 h-3 mr-1' />
                                    {appointment.time}
                                  </span>
                                </div>
                                <div className='text-xs text-gray-500'>
                                  With {appointment.doctor}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={
                            appointment.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }>
                            {appointment.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Test Results */}
          <section data-template-section='test-results' data-component-type='results-list'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Test Results</CardTitle>
                    <CardDescription>Laboratory and diagnostic reports</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' className='border-gray-300'>
                    <FileText className='w-4 h-4 mr-1' />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {TEST_RESULTS.map((test) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className='p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-300 transition-colors'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start space-x-3'>
                            <div className='p-2 bg-emerald-100 rounded-lg mt-1'>
                              <TestTube className='w-5 h-5 text-emerald-600' />
                            </div>
                            <div className='flex-1'>
                              <h4 className='font-bold text-gray-900'>{test.test}</h4>
                              <div className='text-sm text-gray-600 space-y-1 mt-1'>
                                <div className='text-gray-600'>{test.patient}</div>
                                <div className='flex items-center space-x-3 text-xs'>
                                  <span className='flex items-center'>
                                    <Calendar className='w-3 h-3 mr-1' />
                                    {test.date}
                                  </span>
                                  <span className='font-medium'>{test.value}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getTestStatusColor(test.status)}>
                            {test.result}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PatientPortal;