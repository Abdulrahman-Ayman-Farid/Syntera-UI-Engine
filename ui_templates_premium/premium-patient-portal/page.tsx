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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Calendar, Activity, Heart, TrendingUp, TrendingDown,
  CheckCircle, AlertTriangle, Clock, Plus, Search, Video,
  FileText, Stethoscope, Pill, Bell, Settings, Download,
  BarChart3, UserCheck, PhoneCall, MessageSquare, Shield,
  AlertCircle, Zap, ClipboardList, Star, Filter, Syringe,
  HeartPulse, Upload, RefreshCw, Edit, Trash2, Eye,
  ExternalLink, Copy, Tag, Hash, FolderOpen, Database,
  Activity as ActivityIcon, Thermometer
} from 'lucide-react'

// Patient portal metrics derived from data_types
const PATIENT_METRICS = [
  {
    id: 'total_patients',
    label: 'Total Patients',
    value: '2,845',
    change: '+12.5%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'appointments_today',
    label: 'Appointments Today',
    value: '28',
    change: '+8',
    status: 'increasing' as const,
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'telemedicine',
    label: 'Telemedicine Active',
    value: '12',
    change: '+4',
    status: 'good' as const,
    icon: Video,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'patient_satisfaction',
    label: 'Satisfaction Rate',
    value: '94',
    unit: '%',
    change: '+2%',
    status: 'good' as const,
    icon: Heart,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const APPOINTMENT_TYPES = [
  { type: 'In-Person', count: 145, percentage: 48, color: '#3b82f6', icon: Stethoscope },
  { type: 'Telemedicine', count: 98, percentage: 32, color: '#8b5cf6', icon: Video },
  { type: 'Follow-up', count: 42, percentage: 14, color: '#10b981', icon: ClipboardList },
  { type: 'Urgent Care', count: 18, percentage: 6, color: '#f59e0b', icon: AlertCircle },
] as const

const RECENT_APPOINTMENTS = [
  {
    id: 'appt-001',
    patientName: 'Sarah Johnson',
    time: '09:00 AM',
    type: 'telemedicine',
    status: 'confirmed',
    provider: 'Dr. Smith',
    reason: 'Follow-up Consultation',
    healthSync: 'synced'
  },
  {
    id: 'appt-002',
    patientName: 'Michael Chen',
    time: '10:30 AM',
    type: 'in-person',
    status: 'checked-in',
    provider: 'Dr. Williams',
    reason: 'Annual Physical',
    healthSync: 'synced'
  },
  {
    id: 'appt-003',
    patientName: 'Emily Davis',
    time: '11:00 AM',
    type: 'in-person',
    status: 'scheduled',
    provider: 'Dr. Johnson',
    reason: 'Lab Results Review',
    healthSync: 'pending'
  },
  {
    id: 'appt-004',
    patientName: 'Robert Martinez',
    time: '02:00 PM',
    type: 'telemedicine',
    status: 'scheduled',
    provider: 'Dr. Brown',
    reason: 'Medication Review',
    healthSync: 'synced'
  },
  {
    id: 'appt-005',
    patientName: 'Jennifer Lee',
    time: '03:30 PM',
    type: 'in-person',
    status: 'confirmed',
    provider: 'Dr. Anderson',
    reason: 'Prescription Refill',
    healthSync: 'synced'
  },
] as const

const HEALTH_TRENDS_DATA = [
  { month: 'Jan', appointments: 420, patients: 285, satisfaction: 91 },
  { month: 'Feb', appointments: 480, patients: 310, satisfaction: 92 },
  { month: 'Mar', appointments: 520, patients: 340, satisfaction: 92 },
  { month: 'Apr', appointments: 580, patients: 380, satisfaction: 93 },
  { month: 'May', appointments: 640, patients: 420, satisfaction: 93 },
  { month: 'Jun', appointments: 720, patients: 465, satisfaction: 94 },
] as const

const PRESCRIPTION_DATA = [
  {
    id: 'rx-001',
    medication: 'Lisinopril 10mg',
    patient: 'Sarah Johnson',
    prescriber: 'Dr. Smith',
    status: 'active',
    refillsRemaining: 3,
    lastFilled: '5 days ago'
  },
  {
    id: 'rx-002',
    medication: 'Metformin 500mg',
    patient: 'Michael Chen',
    prescriber: 'Dr. Williams',
    status: 'active',
    refillsRemaining: 2,
    lastFilled: '12 days ago'
  },
  {
    id: 'rx-003',
    medication: 'Atorvastatin 20mg',
    patient: 'Emily Davis',
    prescriber: 'Dr. Johnson',
    status: 'pending',
    refillsRemaining: 0,
    lastFilled: '28 days ago'
  },
] as const

export default function PremiumPatientPortal() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'checked-in': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'scheduled': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getPrescriptionStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'expired': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'telemedicine': return Video
      case 'in-person': return Stethoscope
      case 'follow-up': return ClipboardList
      default: return Calendar
    }
  }, [])

  const filteredAppointments = useMemo(() => {
    return RECENT_APPOINTMENTS.filter(appointment => {
      const matchesSearch = searchQuery === '' || 
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.provider.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        appointment.type === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>HealthCare Portal Pro</h1>
                <p className='text-gray-600'>Premium patient management & telemedicine</p>
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
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Appointment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Patient Metrics Overview */}
        <section data-template-section='patient-overview' data-component-type='kpi-grid'>
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
                >
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
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
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color} shadow-lg`}>
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

        {/* Health Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Appointment Distribution */}
          <section data-template-section='appointment-distribution' data-chart-type='bar' data-metrics='count,percentage'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Appointment Distribution</CardTitle>
                    <CardDescription>By appointment type</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={APPOINTMENT_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Appointments' radius={[4, 4, 0, 0]}>
                      {APPOINTMENT_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Health Trends */}
          <section data-template-section='health-trends' data-chart-type='line' data-metrics='appointments,patients,satisfaction'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Health Trends</CardTitle>
                    <CardDescription>Monthly patient activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +16% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={HEALTH_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='appointments' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Appointments'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='patients' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Patients'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='satisfaction' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Satisfaction %'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Appointment Management & Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Appointment Browser */}
          <section data-template-section='appointment-browser' data-component-type='appointment-list' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Today&apos;s Appointments</CardTitle>
                    <CardDescription>Manage patient appointments</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search appointments...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='telemedicine'>Telemedicine</SelectItem>
                        <SelectItem value='in-person'>In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredAppointments.map((appointment) => {
                      const TypeIcon = getTypeIcon(appointment.type)
                      return (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                            selectedAppointment === appointment.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                          }`}
                          onClick={() => setSelectedAppointment(appointment.id)}
                        >
                          <div className='flex items-start space-x-4'>
                            <div className='p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg'>
                              <TypeIcon className='w-5 h-5 text-white' />
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between mb-2'>
                                <h4 className='font-bold text-gray-900'>{appointment.patientName}</h4>
                                <Badge className={getStatusColor(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className='grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3'>
                                <span className='flex items-center'>
                                  <Clock className='w-3 h-3 mr-1' />
                                  {appointment.time}
                                </span>
                                <span className='flex items-center'>
                                  <Stethoscope className='w-3 h-3 mr-1' />
                                  {appointment.provider}
                                </span>
                                <span className='flex items-center col-span-2'>
                                  <FileText className='w-3 h-3 mr-1' />
                                  {appointment.reason}
                                </span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                  <Button variant='ghost' size='sm' className='h-8'>
                                    <Video className='w-4 h-4 mr-1' />
                                    Join
                                  </Button>
                                  <Button variant='ghost' size='sm' className='h-8'>
                                    <MessageSquare className='w-4 h-4 mr-1' />
                                    Message
                                  </Button>
                                  <Button variant='ghost' size='sm' className='h-8'>
                                    <FileText className='w-4 h-4 mr-1' />
                                    Notes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
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
                    { icon: Calendar, label: 'Schedule Appointment', color: 'from-blue-500 to-cyan-500' },
                    { icon: Video, label: 'Start Telemedicine', color: 'from-purple-500 to-pink-500' },
                    { icon: Users, label: 'Add Patient', color: 'from-emerald-500 to-teal-500' },
                    { icon: FileText, label: 'Medical Records', color: 'from-amber-500 to-orange-500' },
                    { icon: Pill, label: 'Prescriptions', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Portal Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-blue-300 h-14'
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
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Appointments Today</span>
                      <span className='font-medium'>28 / 35</span>
                    </div>
                    <Progress value={80} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Shield className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium'>HIPAA Compliant</div>
                        <div className='text-sm text-blue-600'>All data encrypted</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Patient Analytics & Performance */}
        <section data-template-section='patient-analytics' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Patient Analytics</CardTitle>
                  <CardDescription>Performance and health insights</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Average Wait Time', 
                    value: '12 mins', 
                    improvement: '-18%',
                    icon: Clock,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Patient Check-ins', 
                    value: '245 Today', 
                    increase: '+12%',
                    icon: UserCheck,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Telemedicine Sessions', 
                    value: '142 This Week', 
                    hours: '85 hrs',
                    icon: Video,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Urgent Alerts', 
                    value: '3 Pending', 
                    priority: 'High',
                    icon: AlertCircle,
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
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>
                      {stat.improvement && `${stat.improvement} from last month`}
                      {stat.increase && `${stat.increase} vs. last week`}
                      {stat.hours && `${stat.hours} total duration`}
                      {stat.priority && `${stat.priority} priority items`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prescriptions & Health Data Sync */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='prescriptions-management' data-component-type='prescription-list'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Prescriptions</CardTitle>
                    <CardDescription>Active medication management</CardDescription>
                  </div>
                  <Button variant='outline' size='sm'>
                    <Pill className='w-4 h-4 mr-2' />
                    New Rx
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {PRESCRIPTION_DATA.map((prescription) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-start space-x-3'>
                          <div className='p-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-lg'>
                            <Pill className='w-4 h-4 text-white' />
                          </div>
                          <div>
                            <h4 className='font-bold text-sm'>{prescription.medication}</h4>
                            <p className='text-xs text-gray-600'>{prescription.patient}</p>
                          </div>
                        </div>
                        <Badge className={getPrescriptionStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </div>
                      <div className='flex items-center justify-between text-xs text-gray-600 mt-3'>
                        <span>{prescription.refillsRemaining} refills left</span>
                        <span>Filled {prescription.lastFilled}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' className='w-full'>
                  <FileText className='w-4 h-4 mr-2' />
                  View All Prescriptions
                </Button>
              </CardFooter>
            </Card>
          </section>

          <section data-template-section='health-sync' data-component-type='sync-status'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Health Data Sync</CardTitle>
                    <CardDescription>Device & wearable integration</CardDescription>
                  </div>
                  <Button variant='outline' size='sm'>
                    <RefreshCw className='w-4 h-4 mr-2' />
                    Sync Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { 
                      device: 'Apple Health', 
                      status: 'synced', 
                      lastSync: '2 mins ago',
                      icon: HeartPulse,
                      color: 'from-blue-500 to-cyan-500',
                      data: '1,245 steps today'
                    },
                    { 
                      device: 'Fitbit',
                      status: 'synced', 
                      lastSync: '15 mins ago',
                      icon: ActivityIcon,
                      color: 'from-emerald-500 to-teal-500',
                      data: '7.2 hrs sleep'
                    },
                    { 
                      device: 'Glucose Monitor',
                      status: 'pending', 
                      lastSync: '2 hours ago',
                      icon: Thermometer,
                      color: 'from-amber-500 to-orange-500',
                      data: 'Awaiting data'
                    },
                  ].map((sync, i) => (
                    <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center space-x-3'>
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${sync.color}`}>
                            <sync.icon className='w-4 h-4 text-white' />
                          </div>
                          <div>
                            <div className='font-semibold text-sm'>{sync.device}</div>
                            <div className='text-xs text-gray-600'>{sync.lastSync}</div>
                          </div>
                        </div>
                        <Badge className={sync.status === 'synced' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                          {sync.status}
                        </Badge>
                      </div>
                      <div className='text-sm text-gray-600 mt-2'>{sync.data}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className='flex-col items-stretch'>
                <Separator className='mb-4' />
                <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                  <div className='flex items-center space-x-3'>
                    <Database className='w-5 h-5 text-blue-600' />
                    <div>
                      <div className='font-medium text-sm'>Data Integrity</div>
                      <div className='text-xs text-blue-600'>All health data encrypted</div>
                    </div>
                  </div>
                  <CheckCircle className='w-5 h-5 text-emerald-500' />
                </div>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}