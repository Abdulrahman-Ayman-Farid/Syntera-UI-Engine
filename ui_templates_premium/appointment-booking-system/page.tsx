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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, User, MapPin, Phone, Mail,
  CheckCircle, XCircle, AlertCircle, TrendingUp,
  Users, CalendarCheck, Activity, Star, Plus,
  Search, Filter, Download, Settings, Bell
} from 'lucide-react'

// Appointment metrics derived from data_types
const APPOINTMENT_METRICS = [
  {
    id: 'total_appointments',
    label: 'Total Appointments',
    value: '1,245',
    change: '+12%',
    status: 'increasing' as const,
    icon: CalendarCheck,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'today_bookings',
    label: 'Today\'s Bookings',
    value: '28',
    change: '+5',
    status: 'good' as const,
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '94',
    unit: '%',
    change: '+2%',
    status: 'increasing' as const,
    icon: CheckCircle,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'avg_wait_time',
    label: 'Avg Wait Time',
    value: '12',
    unit: 'min',
    change: '-3 min',
    status: 'good' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  }
] as const

const APPOINTMENT_TYPES = [
  { type: 'General Checkup', count: 450, duration: '30 min', color: '#3b82f6' },
  { type: 'Specialist', count: 320, duration: '45 min', color: '#8b5cf6' },
  { type: 'Emergency', count: 180, duration: '60 min', color: '#ef4444' },
  { type: 'Follow-up', count: 295, duration: '20 min', color: '#10b981' },
] as const

const APPOINTMENTS_DATA = [
  {
    id: 'apt-001',
    patientName: 'Sarah Williams',
    patientId: 'P-1024',
    type: 'General Checkup',
    date: '2024-01-15',
    time: '09:00 AM',
    duration: '30 min',
    doctor: 'Dr. James Mitchell',
    status: 'confirmed',
    contact: '(555) 123-4567',
    notes: 'Annual physical examination'
  },
  {
    id: 'apt-002',
    patientName: 'Michael Chen',
    patientId: 'P-1025',
    type: 'Specialist',
    date: '2024-01-15',
    time: '10:30 AM',
    duration: '45 min',
    doctor: 'Dr. Emily Rodriguez',
    status: 'confirmed',
    contact: '(555) 234-5678',
    notes: 'Cardiology consultation'
  },
  {
    id: 'apt-003',
    patientName: 'Jennifer Davis',
    patientId: 'P-1026',
    type: 'Follow-up',
    date: '2024-01-15',
    time: '02:00 PM',
    duration: '20 min',
    doctor: 'Dr. James Mitchell',
    status: 'pending',
    contact: '(555) 345-6789',
    notes: 'Post-surgery check'
  },
  {
    id: 'apt-004',
    patientName: 'Robert Johnson',
    patientId: 'P-1027',
    type: 'Emergency',
    date: '2024-01-15',
    time: '03:30 PM',
    duration: '60 min',
    doctor: 'Dr. Sarah Thompson',
    status: 'urgent',
    contact: '(555) 456-7890',
    notes: 'Urgent care needed'
  },
] as const

const BOOKING_TRENDS = [
  { month: 'Jul', bookings: 820, completed: 780, cancelled: 40 },
  { month: 'Aug', bookings: 920, completed: 870, cancelled: 50 },
  { month: 'Sep', bookings: 1050, completed: 990, cancelled: 60 },
  { month: 'Oct', bookings: 1180, completed: 1110, cancelled: 70 },
  { month: 'Nov', bookings: 1220, completed: 1150, cancelled: 70 },
  { month: 'Dec', bookings: 1245, completed: 1175, cancelled: 70 },
] as const

export default function AppointmentBookingSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  
  // Wizard state for new appointment booking
  const [bookingStep, setBookingStep] = useState(1)
  const [newBooking, setNewBooking] = useState({
    patientName: '',
    patientId: '',
    type: '',
    date: '',
    time: '',
    doctor: '',
    contact: '',
    notes: ''
  })

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'urgent': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle
      case 'urgent': return AlertCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const filteredAppointments = useMemo(() => {
    return APPOINTMENTS_DATA.filter(appointment => {
      const matchesSearch = searchQuery === '' || 
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || 
        appointment.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg'>
                <CalendarCheck className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>MediBook Pro</h1>
                <p className='text-gray-600'>Healthcare appointment management system</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='all'>All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Appointment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Appointment Overview */}
        <section data-template-section='appointment-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {APPOINTMENT_METRICS.map((metric) => (
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
                            <TrendingUp className='w-4 h-4 mr-1' />
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

        {/* Appointment Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Appointment Types */}
          <section data-template-section='appointment-types' data-chart-type='bar' data-metrics='count,duration'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Appointment Types</CardTitle>
                    <CardDescription>Distribution by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-teal-200 text-teal-700'>
                    <Activity className='w-3 h-3 mr-1' />
                    4 Types
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={APPOINTMENT_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
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

          {/* Booking Trends */}
          <section data-template-section='booking-trends' data-chart-type='line' data-metrics='bookings,completed,cancelled'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Booking Trends</CardTitle>
                    <CardDescription>Monthly appointment statistics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={BOOKING_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='bookings' 
                      stroke='#14b8a6' 
                      strokeWidth={2}
                      name='Total Bookings'
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
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Cancelled'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Appointment Management */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Appointment List */}
          <section data-template-section='appointment-list' data-component-type='appointment-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Today\'s Appointments</CardTitle>
                    <CardDescription>Scheduled patient appointments</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search patients...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='confirmed'>Confirmed</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='urgent'>Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-teal-300 transition-colors cursor-pointer ${
                          selectedAppointment === appointment.id ? 'ring-2 ring-teal-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedAppointment(appointment.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <h4 className='font-bold text-lg'>{appointment.patientName}</h4>
                            <p className='text-sm text-gray-600'>{appointment.patientId}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className='grid grid-cols-2 gap-3 mb-3'>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Calendar className='w-4 h-4 mr-2 text-teal-600' />
                            {appointment.date}
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='w-4 h-4 mr-2 text-blue-600' />
                            {appointment.time}
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <User className='w-4 h-4 mr-2 text-purple-600' />
                            {appointment.doctor}
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Phone className='w-4 h-4 mr-2 text-emerald-600' />
                            {appointment.contact}
                          </div>
                        </div>
                        <Separator className='my-3' />
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full'>
                            {appointment.type}
                          </span>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='sm'>
                              View Details
                            </Button>
                            <Button variant='outline' size='sm'>
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
                    { icon: Plus, label: 'New Appointment', color: 'from-teal-500 to-blue-500' },
                    { icon: Users, label: 'Patient Records', color: 'from-purple-500 to-pink-500' },
                    { icon: Calendar, label: 'View Schedule', color: 'from-emerald-500 to-teal-500' },
                    { icon: Download, label: 'Export Reports', color: 'from-amber-500 to-orange-500' },
                    { icon: Bell, label: 'Notifications', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-teal-300 h-14'
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
                      <span className='text-gray-600'>Today\'s Capacity</span>
                      <span className='font-medium'>28 / 40</span>
                    </div>
                    <Progress value={70} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-teal-600' />
                      <div>
                        <div className='font-medium'>System Status</div>
                        <div className='text-sm text-teal-600'>All systems operational</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
