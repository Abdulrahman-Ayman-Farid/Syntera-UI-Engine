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
  Activity as ActivityIcon, Thermometer, Smartphone
} from 'lucide-react'

// Patient portal metrics derived from data_types
const PATIENT_METRICS = [
  {
    id: 'total_patients',
    label: 'Active Patients',
    value: '1,842',
    change: '+18.2%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-cyan-500 to-blue-500',
    format: 'count'
  },
  {
    id: 'appointments_today',
    label: 'Today\'s Visits',
    value: '34',
    change: '+12',
    status: 'increasing' as const,
    icon: Calendar,
    color: 'from-lime-500 to-emerald-500',
    format: 'count'
  },
  {
    id: 'telemedicine',
    label: 'Telemedicine Live',
    value: '16',
    change: '+6',
    status: 'good' as const,
    icon: Video,
    color: 'from-pink-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'patient_satisfaction',
    label: 'Patient Happiness',
    value: '96',
    unit: '%',
    change: '+4%',
    status: 'good' as const,
    icon: Heart,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const APPOINTMENT_TYPES = [
  { type: 'Wellness Check', count: 156, percentage: 42, color: '#06b6d4', icon: Stethoscope },
  { type: 'Virtual Visit', count: 118, percentage: 32, color: '#ec4899', icon: Video },
  { type: 'Follow-Up', count: 64, percentage: 17, color: '#84cc16', icon: ClipboardList },
  { type: 'Emergency', count: 32, percentage: 9, color: '#f59e0b', icon: AlertCircle },
] as const

const RECENT_APPOINTMENTS = [
  {
    id: 'appt-001',
    patientName: 'Maria Rodriguez',
    time: '08:30 AM',
    type: 'telemedicine',
    status: 'confirmed',
    provider: 'Dr. Patel',
    reason: 'Wellness Consultation',
    healthSync: 'synced'
  },
  {
    id: 'appt-002',
    patientName: 'James Wilson',
    time: '09:45 AM',
    type: 'in-person',
    status: 'checked-in',
    provider: 'Dr. Martinez',
    reason: 'Tropical Medicine Review',
    healthSync: 'synced'
  },
  {
    id: 'appt-003',
    patientName: 'Sophia Chang',
    time: '11:15 AM',
    type: 'telemedicine',
    status: 'scheduled',
    provider: 'Dr. Kim',
    reason: 'Prescription Refill',
    healthSync: 'synced'
  },
  {
    id: 'appt-004',
    patientName: 'David Brown',
    time: '01:30 PM',
    type: 'in-person',
    status: 'scheduled',
    provider: 'Dr. Thompson',
    reason: 'Health Screening',
    healthSync: 'pending'
  },
  {
    id: 'appt-005',
    patientName: 'Isabella Santos',
    time: '03:00 PM',
    type: 'telemedicine',
    status: 'confirmed',
    provider: 'Dr. Garcia',
    reason: 'Follow-up Care',
    healthSync: 'synced'
  },
] as const

const HEALTH_TRENDS_DATA = [
  { month: 'Jan', appointments: 380, patients: 245, satisfaction: 93 },
  { month: 'Feb', appointments: 425, patients: 272, satisfaction: 94 },
  { month: 'Mar', appointments: 485, patients: 298, satisfaction: 94 },
  { month: 'Apr', appointments: 540, patients: 325, satisfaction: 95 },
  { month: 'May', appointments: 620, patients: 365, satisfaction: 95 },
  { month: 'Jun', appointments: 685, patients: 410, satisfaction: 96 },
] as const

const PRESCRIPTION_DATA = [
  {
    id: 'rx-001',
    medication: 'Vitamin D 2000 IU',
    patient: 'Maria Rodriguez',
    prescriber: 'Dr. Patel',
    status: 'active',
    refillsRemaining: 5,
    lastFilled: '3 days ago'
  },
  {
    id: 'rx-002',
    medication: 'Omega-3 Fish Oil',
    patient: 'James Wilson',
    prescriber: 'Dr. Martinez',
    status: 'active',
    refillsRemaining: 4,
    lastFilled: '8 days ago'
  },
  {
    id: 'rx-003',
    medication: 'Allergy Relief 10mg',
    patient: 'Sophia Chang',
    prescriber: 'Dr. Kim',
    status: 'pending',
    refillsRemaining: 0,
    lastFilled: '25 days ago'
  },
] as const

export default function TropicalVibrantPatientPortal() {
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
      case 'checked-in': return 'bg-cyan-100 text-cyan-800 border-cyan-300'
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
    <div className='min-h-screen bg-gradient-to-br from-sky-100 via-lime-50 to-coral-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-cyan-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-lg'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'>Tropical Health Portal</h1>
                <p className='text-gray-600'>Vibrant wellness & telemedicine hub</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-cyan-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Book Appointment
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
                  <Card className='h-full border-2 border-cyan-200 shadow-md hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm'>
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
            <Card className='border-2 border-cyan-200 shadow-md bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Visit Types</CardTitle>
                    <CardDescription>Distribution by appointment category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-cyan-300 text-cyan-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={APPOINTMENT_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Appointments' radius={[8, 8, 0, 0]}>
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
            <Card className='border-2 border-lime-200 shadow-md bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Wellness Trends</CardTitle>
                    <CardDescription>Monthly health activity patterns</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +22% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={HEALTH_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='appointments' 
                      stroke='#06b6d4' 
                      strokeWidth={3}
                      name='Appointments'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='patients' 
                      stroke='#ec4899' 
                      strokeWidth={3}
                      name='Patients'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='satisfaction' 
                      stroke='#84cc16' 
                      strokeWidth={3}
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
            <Card className='border-2 border-cyan-200 shadow-md bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Today&apos;s Schedule</CardTitle>
                    <CardDescription>Manage patient visits & consultations</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-cyan-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-cyan-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='telemedicine'>Virtual</SelectItem>
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
                          layoutId={`appointment-${appointment.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`p-4 bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-200 rounded-2xl hover:border-cyan-400 transition-all cursor-pointer ${
                            selectedAppointment === appointment.id ? 'ring-4 ring-cyan-300 ring-offset-2' : ''
                          }`}
                          onClick={() => setSelectedAppointment(appointment.id)}
                        >
                          <div className='flex items-start space-x-4'>
                            <div className='p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg'>
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
                                  <Button variant='ghost' size='sm' className='h-8 text-cyan-700 hover:text-cyan-900 hover:bg-cyan-100'>
                                    <Video className='w-4 h-4 mr-1' />
                                    Join
                                  </Button>
                                  <Button variant='ghost' size='sm' className='h-8 text-lime-700 hover:text-lime-900 hover:bg-lime-100'>
                                    <MessageSquare className='w-4 h-4 mr-1' />
                                    Chat
                                  </Button>
                                  <Button variant='ghost' size='sm' className='h-8 text-pink-700 hover:text-pink-900 hover:bg-pink-100'>
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
            <Card className='border-2 border-lime-200 shadow-md h-full bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-gray-900'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Calendar, label: 'New Appointment', color: 'from-cyan-500 to-blue-500' },
                    { icon: Video, label: 'Start Video Call', color: 'from-pink-500 to-rose-500' },
                    { icon: Users, label: 'Patient Directory', color: 'from-lime-500 to-emerald-500' },
                    { icon: FileText, label: 'Medical Records', color: 'from-amber-500 to-orange-500' },
                    { icon: Pill, label: 'Prescriptions', color: 'from-purple-500 to-pink-500' },
                    { icon: Settings, label: 'Portal Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-2 border-cyan-200 hover:border-cyan-400 h-14 bg-gradient-to-r from-white to-cyan-50'
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center shadow-lg`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-cyan-200' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Daily Capacity</span>
                      <span className='font-medium'>34 / 40</span>
                    </div>
                    <Progress value={85} className='h-3 bg-cyan-100' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-lime-50 to-emerald-50 border-2 border-lime-300 rounded-xl'>
                    <div className='flex items-center space-x-3'>
                      <Shield className='w-5 h-5 text-lime-600' />
                      <div>
                        <div className='font-medium text-sm'>HIPAA Secure</div>
                        <div className='text-xs text-lime-700'>End-to-end encrypted</div>
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
          <Card className='border-2 border-pink-200 shadow-md bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-gray-900'>Patient Insights</CardTitle>
                  <CardDescription>Performance & wellness analytics</CardDescription>
                </div>
                <Button variant='outline' className='border-pink-300 text-pink-700 hover:bg-pink-50'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Avg Response Time', 
                    value: '8 mins', 
                    improvement: '-24%',
                    icon: Clock,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Daily Check-ins', 
                    value: '198 Today', 
                    increase: '+15%',
                    icon: UserCheck,
                    color: 'from-pink-500 to-rose-500'
                  },
                  { 
                    label: 'Virtual Visits', 
                    value: '124 This Week', 
                    hours: '62 hrs',
                    icon: Video,
                    color: 'from-cyan-500 to-blue-500'
                  },
                  { 
                    label: 'Active Alerts', 
                    value: '2 Pending', 
                    priority: 'Medium',
                    icon: Bell,
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-200 rounded-2xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>
                      {stat.improvement && `${stat.improvement} from last month`}
                      {stat.increase && `${stat.increase} vs. last week`}
                      {stat.hours && `${stat.hours} total duration`}
                      {stat.priority && `${stat.priority} priority level`}
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
            <Card className='border-2 border-pink-200 shadow-md bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Active Prescriptions</CardTitle>
                    <CardDescription>Medication tracking & refills</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' className='border-pink-300 text-pink-700'>
                    <Pill className='w-4 h-4 mr-2' />
                    Add Rx
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
                      className='p-4 bg-gradient-to-br from-white to-pink-50 border-2 border-pink-200 rounded-2xl'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-start space-x-3'>
                          <div className='p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg'>
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
                        <span>{prescription.refillsRemaining} refills remaining</span>
                        <span>Last: {prescription.lastFilled}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' className='w-full text-pink-700 hover:text-pink-900 hover:bg-pink-50'>
                  <FileText className='w-4 h-4 mr-2' />
                  View Complete Rx History
                </Button>
              </CardFooter>
            </Card>
          </section>

          <section data-template-section='health-sync' data-component-type='sync-status'>
            <Card className='border-2 border-lime-200 shadow-md bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-gray-900'>Device Sync</CardTitle>
                    <CardDescription>Wearables & health trackers</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' className='border-lime-300 text-lime-700'>
                    <RefreshCw className='w-4 h-4 mr-2' />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { 
                      device: 'Fitbit Charge 5', 
                      status: 'synced', 
                      lastSync: '1 min ago',
                      icon: ActivityIcon,
                      color: 'from-lime-500 to-emerald-500',
                      data: '8,420 steps today'
                    },
                    { 
                      device: 'Apple Watch',
                      status: 'synced', 
                      lastSync: '10 mins ago',
                      icon: HeartPulse,
                      color: 'from-pink-500 to-rose-500',
                      data: 'Heart rate: 72 bpm'
                    },
                    { 
                      device: 'Samsung Health',
                      status: 'synced', 
                      lastSync: '45 mins ago',
                      icon: Smartphone,
                      color: 'from-cyan-500 to-blue-500',
                      data: '8.5 hrs sleep tracked'
                    },
                  ].map((sync, i) => (
                    <div key={i} className='p-4 bg-gradient-to-br from-white to-lime-50 border-2 border-lime-200 rounded-2xl'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center space-x-3'>
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${sync.color} shadow-lg`}>
                            <sync.icon className='w-4 h-4 text-white' />
                          </div>
                          <div>
                            <div className='font-semibold text-sm'>{sync.device}</div>
                            <div className='text-xs text-gray-600'>{sync.lastSync}</div>
                          </div>
                        </div>
                        <Badge className={sync.status === 'synced' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800'}>
                          {sync.status}
                        </Badge>
                      </div>
                      <div className='text-sm text-gray-700 mt-2 font-medium'>{sync.data}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className='flex-col items-stretch'>
                <Separator className='mb-4 bg-lime-200' />
                <div className='flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-xl'>
                  <div className='flex items-center space-x-3'>
                    <Database className='w-5 h-5 text-cyan-600' />
                    <div>
                      <div className='font-medium text-sm'>Secure Storage</div>
                      <div className='text-xs text-cyan-700'>256-bit encryption active</div>
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