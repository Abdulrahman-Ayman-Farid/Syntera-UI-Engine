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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Users, Activity, Heart, Thermometer, Pill,
  Calendar, Clock, FileText, Shield, Bell, Settings,
  Search, Filter, Plus, Eye, Edit, Download,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Stethoscope, Activity as ActivityIcon, Brain, Bone,
  Clipboard, Download as DownloadIcon, Printer, Share2,
  MessageSquare, Phone, Video, MapPin, Award, UserPlus,
  BarChart3, Hospital, Syringe, TestTube
} from 'lucide-react'

// Medical metrics derived from template data_types
const MEDICAL_METRICS = [
  {
    id: 'total_patients',
    label: 'Total Patients',
    value: '1,248',
    change: '+48',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'active_records',
    label: 'Active Records',
    value: '856',
    change: '+12%',
    status: 'good' as const,
    icon: FileText,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'appointments_today',
    label: 'Appointments Today',
    value: '24',
    change: '+6',
    status: 'increasing' as const,
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'critical_alerts',
    label: 'Critical Alerts',
    value: '3',
    change: '-2',
    status: 'warning' as const,
    icon: AlertTriangle,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const VITALS_HISTORY = [
  { date: 'Jan 1', heartRate: 72, bloodPressure: 120, temperature: 98.6, oxygen: 98 },
  { date: 'Jan 8', heartRate: 68, bloodPressure: 118, temperature: 98.4, oxygen: 99 },
  { date: 'Jan 15', heartRate: 70, bloodPressure: 122, temperature: 98.7, oxygen: 97 },
  { date: 'Jan 22', heartRate: 75, bloodPressure: 125, temperature: 99.1, oxygen: 96 },
  { date: 'Jan 29', heartRate: 71, bloodPressure: 119, temperature: 98.5, oxygen: 98 },
  { date: 'Feb 5', heartRate: 69, bloodPressure: 117, temperature: 98.3, oxygen: 99 },
] as const

const DEPARTMENT_STATS = [
  { department: 'Cardiology', patients: 245, capacity: 85, color: '#ef4444' },
  { department: 'Neurology', patients: 180, capacity: 72, color: '#8b5cf6' },
  { department: 'Orthopedics', patients: 210, capacity: 78, color: '#3b82f6' },
  { department: 'Pediatrics', patients: 195, capacity: 68, color: '#10b981' },
] as const

const PATIENTS_DATA = [
  {
    id: 'john-doe',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    mrn: 'MED-2024-001',
    lastVisit: '2024-01-22',
    nextAppointment: '2024-02-05',
    condition: 'Hypertension',
    status: 'stable' as const,
    priority: 'medium' as const,
    avatar: 'JD',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    mrn: 'MED-2024-002',
    lastVisit: '2024-01-20',
    nextAppointment: '2024-02-10',
    condition: 'Diabetes Type 2',
    status: 'improving' as const,
    priority: 'low' as const,
    avatar: 'JS',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    age: 58,
    gender: 'Male',
    mrn: 'MED-2024-003',
    lastVisit: '2024-01-18',
    nextAppointment: '2024-01-30',
    condition: 'Arthritis',
    status: 'monitoring' as const,
    priority: 'high' as const,
    avatar: 'MJ',
    color: 'from-emerald-500 to-teal-500'
  },
] as const

const CURRENT_VITALS = [
  { 
    label: 'Heart Rate', 
    value: '72', 
    unit: 'bpm', 
    normal: '60-100', 
    status: 'normal' as const, 
    icon: Heart, 
    color: 'text-rose-500',
    bgColor: 'bg-rose-500'
  },
  { 
    label: 'Blood Pressure', 
    value: '120/80', 
    unit: 'mmHg', 
    normal: '<120/80', 
    status: 'normal' as const, 
    icon: Activity, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  { 
    label: 'Temperature', 
    value: '98.6', 
    unit: '°F', 
    normal: '97.8-99.1', 
    status: 'normal' as const, 
    icon: Thermometer, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500'
  },
  { 
    label: 'Oxygen', 
    value: '98', 
    unit: '%', 
    normal: '95-100', 
    status: 'normal' as const, 
    icon: ActivityIcon, 
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500'
  },
] as const

const MEDICATIONS = [
  { 
    id: 'med-001',
    name: 'Lisinopril', 
    dosage: '10mg', 
    frequency: 'Once daily', 
    prescribed: 'Dr. Chen', 
    status: 'active' as const,
    startDate: '2024-01-01',
    refills: 3
  },
  { 
    id: 'med-002',
    name: 'Metformin', 
    dosage: '500mg', 
    frequency: 'Twice daily', 
    prescribed: 'Dr. Smith', 
    status: 'active' as const,
    startDate: '2024-01-15',
    refills: 2
  },
  { 
    id: 'med-003',
    name: 'Atorvastatin', 
    dosage: '20mg', 
    frequency: 'Once daily', 
    prescribed: 'Dr. Johnson', 
    status: 'active' as const,
    startDate: '2024-01-08',
    refills: 5
  },
] as const

const APPOINTMENTS = [
  { 
    id: 'apt-001',
    patient: 'John Doe', 
    type: 'Follow-up', 
    date: '2024-02-05', 
    time: '10:30 AM', 
    doctor: 'Dr. Smith',
    status: 'scheduled' as const
  },
  { 
    id: 'apt-002',
    patient: 'Jane Smith', 
    type: 'Consultation', 
    date: '2024-02-10', 
    time: '2:00 PM', 
    doctor: 'Dr. Chen',
    status: 'confirmed' as const
  },
  { 
    id: 'apt-003',
    patient: 'Mike Johnson', 
    type: 'Check-up', 
    date: '2024-01-30', 
    time: '9:00 AM', 
    doctor: 'Dr. Johnson',
    status: 'scheduled' as const
  },
] as const

const CLINICAL_NOTES = [
  {
    id: 'note-001',
    date: '2024-01-22',
    author: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    title: 'Follow-up Visit',
    content: 'Patient reports improvement in blood pressure control. Medication appears effective. Advised to continue current regimen and schedule next follow-up in 2 weeks.',
    tags: ['Hypertension', 'Follow-up', 'Stable'] as const,
    priority: 'normal' as const
  },
  {
    id: 'note-002',
    date: '2024-01-15',
    author: 'Dr. Michael Smith',
    specialty: 'Internal Medicine',
    title: 'Initial Consultation',
    content: 'Patient presents with elevated blood pressure readings. Started on Lisinopril 10mg daily. Recommended lifestyle modifications including reduced sodium intake and regular exercise.',
    tags: ['Initial', 'Medication Start', 'Lifestyle'] as const,
    priority: 'high' as const
  },
] as const

export default function MedicalRecordsSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedPatient, setSelectedPatient] = useState('john-doe')
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'stable': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'improving': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'monitoring': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-300'
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

  const filteredPatients = useMemo(() => {
    return PATIENTS_DATA.filter(patient => {
      const matchesSearch = searchQuery === '' || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [searchQuery])

  const selectedPatientData = useMemo(() => {
    return PATIENTS_DATA.find(p => p.id === selectedPatient) || PATIENTS_DATA[0]
  }, [selectedPatient])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <Stethoscope className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>MediCare Pro</h1>
                <p className='text-slate-600'>Electronic Health Records System</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>Last Week</SelectItem>
                  <SelectItem value='month'>Last Month</SelectItem>
                  <SelectItem value='quarter'>Last Quarter</SelectItem>
                  <SelectItem value='year'>Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Patient
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Medical Metrics Overview */}
        <section data-template-section='medical-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {MEDICAL_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMetric(metric.id)}
                >
                  <Card className={`h-full border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    selectedMetric === metric.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-slate-900'>{metric.value}</span>
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

        {/* Patient Management & Details */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Patient List */}
          <section data-template-section='patient-list' data-component-type='patient-selector' className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className='border border-slate-200 shadow-sm h-full'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Patients</CardTitle>
                  <CardDescription>Active patients list</CardDescription>
                  <div className='pt-2'>
                    <Input
                      placeholder='Search patients...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='border-slate-300'
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <AnimatePresence>
                      {filteredPatients.map((patient) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedPatient === patient.id
                              ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md'
                              : `border-slate-200 hover:border-blue-200 ${getPriorityColor(patient.priority)}`
                          }`}
                          onClick={() => setSelectedPatient(patient.id)}
                        >
                          <div className='flex items-center space-x-3'>
                            <Avatar>
                              <AvatarFallback className={`bg-gradient-to-br ${patient.color} text-white font-bold`}>
                                {patient.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <div className='font-bold flex items-center justify-between'>
                                {patient.name}
                                {patient.priority === 'high' && (
                                  <Badge variant='destructive' className='text-xs'>
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <div className='text-xs text-slate-600'>{patient.mrn}</div>
                              <div className='text-sm text-slate-600'>{patient.age} yrs • {patient.gender}</div>
                            </div>
                          </div>
                          <div className='mt-3 space-y-2'>
                            <Badge className={getStatusColor(patient.status)}>
                              {patient.condition}
                            </Badge>
                            <div className='text-xs text-slate-500'>
                              Next: {patient.nextAppointment}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Patient Details */}
          <section data-template-section='patient-details' data-component-type='patient-dashboard' className='lg:col-span-3'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className='border border-slate-200 shadow-sm h-full'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Avatar className='w-16 h-16'>
                        <AvatarFallback className={`bg-gradient-to-br ${selectedPatientData.color} text-white text-2xl font-bold`}>
                          {selectedPatientData.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className='text-2xl font-bold'>{selectedPatientData.name}</CardTitle>
                        <CardDescription>
                          <div className='flex items-center space-x-4'>
                            <span>{selectedPatientData.age} years • {selectedPatientData.gender} • {selectedPatientData.mrn}</span>
                            <Badge className={getStatusColor(selectedPatientData.status)}>
                              <CheckCircle className='w-3 h-3 mr-1' />
                              {selectedPatientData.status}
                            </Badge>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant='outline' size='icon' className='border-slate-300'>
                              <MessageSquare className='w-4 h-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send Message</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant='outline' size='icon' className='border-slate-300'>
                              <Phone className='w-4 h-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Call Patient</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant='outline' size='icon' className='border-slate-300'>
                              <Video className='w-4 h-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Video Consultation</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                    <TabsList className='grid w-full grid-cols-4'>
                      <TabsTrigger value='overview'>Overview</TabsTrigger>
                      <TabsTrigger value='vitals'>Vitals</TabsTrigger>
                      <TabsTrigger value='medications'>Medications</TabsTrigger>
                      <TabsTrigger value='history'>History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value='overview' className='space-y-6 mt-6'>
                      <motion.div 
                        className='grid grid-cols-2 md:grid-cols-4 gap-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AnimatePresence>
                          {CURRENT_VITALS.map((vital) => (
                            <motion.div 
                              key={vital.label}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              className='p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl'
                            >
                              <div className='flex items-center justify-between mb-3'>
                                <div className={`p-2 rounded-lg ${vital.color.replace('text-', 'bg-')}/10`}>
                                  <vital.icon className={`w-5 h-5 ${vital.color}`} />
                                </div>
                                <Badge variant='outline' className='border-slate-300 text-xs'>
                                  {vital.status}
                                </Badge>
                              </div>
                              <div className='text-2xl font-bold mb-1'>
                                {vital.value} <span className='text-sm text-slate-600'>{vital.unit}</span>
                              </div>
                              <div className='text-sm text-slate-700 font-medium'>{vital.label}</div>
                              <div className='text-xs text-slate-500 mt-1'>Normal: {vital.normal}</div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value='vitals' className='space-y-4 mt-6'>
                      <div className='text-sm text-slate-600'>Detailed vital signs history and trends</div>
                    </TabsContent>

                    <TabsContent value='medications' className='space-y-4 mt-6'>
                      <div className='text-sm text-slate-600'>Active prescriptions and medication history</div>
                    </TabsContent>

                    <TabsContent value='history' className='space-y-4 mt-6'>
                      <div className='text-sm text-slate-600'>Complete medical history and procedures</div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </div>


        {/* Charts & Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Vitals History Chart */}
          <section data-template-section='vitals-history' data-chart-type='line' data-metrics='heartRate,bloodPressure,oxygen'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Vitals History</CardTitle>
                    <CardDescription>30-day vital signs trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Stable Trend
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={VITALS_HISTORY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='date' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='heartRate' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Heart Rate (bpm)'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='oxygen' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Oxygen (%)'
                    />
                    <ReferenceLine y={60} stroke='#666' strokeDasharray='3 3' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Department Statistics */}
          <section data-template-section='department-stats' data-chart-type='bar' data-metrics='patients,capacity'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Department Statistics</CardTitle>
                    <CardDescription>Patient distribution by department</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={DEPARTMENT_STATS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='department' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='patients' name='Active Patients' radius={[4, 4, 0, 0]}>
                      {DEPARTMENT_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Medications & Clinical Information */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Medications */}
          <section data-template-section='medications' data-component-type='medication-list'>
            <Card className='border border-slate-200 shadow-sm h-full'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Medications</CardTitle>
                    <CardDescription>Current prescriptions</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' className='border-slate-300'>
                    <Plus className='w-4 h-4 mr-1' />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {MEDICATIONS.map((med) => (
                      <motion.div 
                        key={med.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileHover={{ scale: 1.02 }}
                        className='p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start space-x-3'>
                            <div className='p-2 bg-blue-100 rounded-lg mt-1'>
                              <Pill className='w-5 h-5 text-blue-600' />
                            </div>
                            <div className='flex-1'>
                              <h4 className='font-bold text-slate-900'>{med.name}</h4>
                              <div className='text-sm text-slate-600 space-y-1 mt-1'>
                                <div className='flex items-center space-x-2'>
                                  <span className='font-medium'>{med.dosage}</span>
                                  <span>•</span>
                                  <span>{med.frequency}</span>
                                </div>
                                <div className='text-xs'>
                                  Prescribed by {med.prescribed}
                                </div>
                                <div className='text-xs text-slate-500'>
                                  Started: {med.startDate} • {med.refills} refills left
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className='bg-emerald-100 text-emerald-800 border-emerald-300'>
                            {med.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Appointments */}
          <section data-template-section='appointments' data-component-type='appointment-list'>
            <Card className='border border-slate-200 shadow-sm h-full'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Upcoming Appointments</CardTitle>
                    <CardDescription>Scheduled visits</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' className='border-slate-300'>
                    <Calendar className='w-4 h-4 mr-1' />
                    Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {APPOINTMENTS.map((appointment) => (
                      <motion.div 
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className='p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start space-x-3'>
                            <div className='p-2 bg-emerald-100 rounded-lg mt-1'>
                              <Calendar className='w-5 h-5 text-emerald-600' />
                            </div>
                            <div className='flex-1'>
                              <h4 className='font-bold text-slate-900'>{appointment.patient}</h4>
                              <div className='text-sm text-slate-600 space-y-1 mt-1'>
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
                                <div className='text-xs text-slate-500'>
                                  {appointment.doctor}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant='outline' className='border-blue-200 text-blue-700'>
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

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-slate-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: FileText, label: 'New Prescription', color: 'from-blue-500 to-cyan-500' },
                    { icon: Clipboard, label: 'Lab Order', color: 'from-purple-500 to-pink-500' },
                    { icon: TestTube, label: 'Request Test', color: 'from-emerald-500 to-teal-500' },
                    { icon: DownloadIcon, label: 'Export Records', color: 'from-amber-500 to-orange-500' },
                    { icon: Printer, label: 'Print Summary', color: 'from-rose-500 to-red-500' },
                    { icon: Share2, label: 'Share Records', color: 'from-indigo-500 to-blue-500' },
                  ].map((action, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant='outline'
                        className='w-full justify-start border-slate-300 hover:border-blue-300 h-14'
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                          <action.icon className='w-5 h-5 text-white' />
                        </div>
                        {action.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Separator className='my-6' />
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Shield className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium text-sm'>HIPAA Compliant</div>
                        <div className='text-xs text-emerald-600'>All data encrypted</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>


        {/* Clinical Notes */}
        <section data-template-section='clinical-notes' data-component-type='notes-list'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Clinical Notes</CardTitle>
                  <CardDescription>Recent observations and assessments</CardDescription>
                </div>
                <Button variant='outline' className='border-slate-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <AnimatePresence>
                  {CLINICAL_NOTES.map((note) => (
                    <motion.div 
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.01 }}
                      className='p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-start space-x-3'>
                          <Avatar>
                            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold'>
                              {note.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className='font-bold text-slate-900'>{note.title}</h4>
                            <div className='text-sm text-slate-600 mt-1'>
                              {note.author} • {note.specialty}
                            </div>
                            <div className='text-xs text-slate-500 mt-1'>
                              {note.date}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          {note.priority === 'high' && (
                            <Badge variant='destructive' className='text-xs'>
                              <AlertTriangle className='w-3 h-3 mr-1' />
                              Priority
                            </Badge>
                          )}
                          <Button variant='outline' size='sm' className='border-slate-300'>
                            <Edit className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                      <p className='text-slate-700 mb-4 leading-relaxed'>{note.content}</p>
                      <div className='flex flex-wrap gap-2'>
                        {note.tags.map((tag, j) => (
                          <Badge key={j} variant='outline' className='border-slate-300'>
                            {tag}
                          </Badge>
                        ))}
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