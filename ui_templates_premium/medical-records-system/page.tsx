'use client'

import { useState, useEffect, useMemo } from 'react'
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
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Users, Activity, Heart, Thermometer, Pill,
  Calendar, Clock, FileText, Shield, Bell, Settings,
  Search, Filter, Plus, Eye, Edit, Download,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Stethoscope, Activity as ActivityIcon, Brain, Bone,
  Clipboard, Download as DownloadIcon, Printer, Share2,
  MessageSquare, Phone, Video, MapPin, Award
} from 'lucide-react'

const vitalsHistory = [
  { date: 'Jan 1', heartRate: 72, bloodPressure: '120/80', temperature: 98.6, oxygen: 98 },
  { date: 'Jan 8', heartRate: 68, bloodPressure: '118/78', temperature: 98.4, oxygen: 99 },
  { date: 'Jan 15', heartRate: 70, bloodPressure: '122/82', temperature: 98.7, oxygen: 97 },
  { date: 'Jan 22', heartRate: 75, bloodPressure: '125/85', temperature: 99.1, oxygen: 96 },
  { date: 'Jan 29', heartRate: 71, bloodPressure: '119/79', temperature: 98.5, oxygen: 98 },
]

export default function MedicalRecordsSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedPatient, setSelectedPatient] = useState('john-doe')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const patients = [
    {
      id: 'john-doe',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      lastVisit: '2024-01-22',
      nextAppointment: '2024-02-05',
      condition: 'Hypertension',
      status: 'stable',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'jane-smith',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-10',
      condition: 'Diabetes Type 2',
      status: 'improving',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'mike-johnson',
      name: 'Mike Johnson',
      age: 58,
      gender: 'Male',
      lastVisit: '2024-01-18',
      nextAppointment: '2024-01-30',
      condition: 'Arthritis',
      status: 'monitoring',
      color: 'from-emerald-500 to-teal-500'
    },
  ]

  const vitals = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', normal: '60-100', status: 'normal', icon: Heart, color: 'text-rose-500' },
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', normal: '<120/80', status: 'normal', icon: Activity, color: 'text-blue-500' },
    { label: 'Temperature', value: '98.6', unit: '°F', normal: '97.8-99.1', status: 'normal', icon: Thermometer, color: 'text-amber-500' },
    { label: 'Oxygen Saturation', value: '98', unit: '%', normal: '95-100', status: 'normal', icon: ActivityIcon, color: 'text-emerald-500' },
  ]

  const medications = [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribed: 'Dr. Chen', status: 'active' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribed: 'Dr. Smith', status: 'active' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', prescribed: 'Dr. Johnson', status: 'active' },
  ]

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
        {/* Patient Selection & Overview */}
        <section data-template-section='patient-overview'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Patient List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='lg:col-span-1'
            >
              <Card className='border border-slate-200 shadow-sm h-full'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Patients</CardTitle>
                  <CardDescription>Active patients list</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPatient === patient.id
                            ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50'
                            : 'border-slate-200 hover:border-blue-200'
                        }`}
                        onClick={() => setSelectedPatient(patient.id)}
                      >
                        <div className='flex items-center space-x-3'>
                          <Avatar>
                            <AvatarFallback className={`bg-gradient-to-br ${patient.color} text-white`}>
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-bold'>{patient.name}</div>
                            <div className='text-sm text-slate-600'>{patient.age} years, {patient.gender}</div>
                          </div>
                        </div>
                        <div className='mt-3 space-y-2'>
                          <Badge 
                            variant={
                              patient.status === 'stable' ? 'success' :
                              patient.status === 'improving' ? 'default' :
                              'secondary'
                            }
                            className='w-full justify-center'
                          >
                            {patient.condition}
                          </Badge>
                          <div className='text-xs text-slate-500 text-center'>
                            Next: {patient.nextAppointment}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Patient Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className='lg:col-span-3'
            >
              <Card className='border border-slate-200 shadow-sm h-full'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Avatar className='w-16 h-16'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl'>
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className='text-2xl font-bold'>John Doe</CardTitle>
                        <CardDescription>
                          <div className='flex items-center space-x-4'>
                            <span>45 years • Male • Patient ID: MED-2024-001</span>
                            <Badge variant='success'>
                              <CheckCircle className='w-3 h-3 mr-1' />
                              Stable
                            </Badge>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button variant='outline' size='icon' className='border-slate-300'>
                        <MessageSquare className='w-4 h-4' />
                      </Button>
                      <Button variant='outline' size='icon' className='border-slate-300'>
                        <Phone className='w-4 h-4' />
                      </Button>
                      <Button variant='outline' size='icon' className='border-slate-300'>
                        <Video className='w-4 h-4' />
                      </Button>
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
                    
                    <TabsContent value='overview' className='space-y-6'>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {vitals.map((vital) => (
                          <div key={vital.label} className='p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl'>
                            <div className='flex items-center justify-between mb-3'>
                              <div className={`p-2 rounded-lg ${vital.color.replace('text-', 'bg-')}/10`}>
                                <vital.icon className={`w-5 h-5 ${vital.color}`} />
                              </div>
                              <Badge variant='outline' className='border-slate-300'>
                                {vital.status}
                              </Badge>
                            </div>
                            <div className='text-2xl font-bold mb-1'>
                              {vital.value} <span className='text-sm text-slate-600'>{vital.unit}</span>
                            </div>
                            <div className='text-sm text-slate-600'>{vital.label}</div>
                            <div className='text-xs text-slate-500 mt-1'>Normal: {vital.normal}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Charts & Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Vitals History Chart */}
          <section data-template-section='vitals-history' data-chart-type='line'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Vitals History</CardTitle>
                    <CardDescription>30-day vital signs trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Stable
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={vitalsHistory}>
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
                      name='Oxygen Saturation (%)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Medications & Appointments */}
          <div className='space-y-8'>
            {/* Medications */}
            <section data-template-section='medications'>
              <Card className='border border-slate-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Current Medications</CardTitle>
                  <CardDescription>Active prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {medications.map((med, i) => (
                      <div key={i} className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl'>
                        <div className='flex items-center space-x-4'>
                          <div className='p-3 bg-blue-100 rounded-lg'>
                            <Pill className='w-5 h-5 text-blue-600' />
                          </div>
                          <div>
                            <h4 className='font-bold'>{med.name}</h4>
                            <div className='flex items-center space-x-4 text-sm text-slate-600'>
                              <span>{med.dosage}</span>
                              <span>•</span>
                              <span>{med.frequency}</span>
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <Badge variant='success'>{med.status}</Badge>
                          <div className='text-sm text-slate-600 mt-1'>Dr. {med.prescribed}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Upcoming Appointments */}
            <section data-template-section='appointments'>
              <Card className='border border-slate-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Upcoming Appointments</CardTitle>
                  <CardDescription>Scheduled patient visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[
                      { id: 1, patient: 'John Doe', type: 'Follow-up', date: '2024-02-05', time: '10:30 AM', doctor: 'Dr. Smith' },
                      { id: 2, patient: 'Jane Smith', type: 'Consultation', date: '2024-02-10', time: '2:00 PM', doctor: 'Dr. Chen' },
                      { id: 3, patient: 'Mike Johnson', type: 'Check-up', date: '2024-01-30', time: '9:00 AM', doctor: 'Dr. Johnson' },
                    ].map((appointment) => (
                      <div key={appointment.id} className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors'>
                        <div className='flex items-center space-x-4'>
                          <div className='p-3 bg-emerald-100 rounded-lg'>
                            <Calendar className='w-5 h-5 text-emerald-600' />
                          </div>
                          <div>
                            <h4 className='font-bold'>{appointment.patient}</h4>
                            <div className='flex items-center space-x-4 text-sm text-slate-600'>
                              <span className='flex items-center'>
                                <Calendar className='w-3 h-3 mr-1' />
                                {appointment.date}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <Badge variant='outline' className='border-blue-200'>
                            {appointment.type}
                          </Badge>
                          <div className='text-sm text-slate-600 mt-1'>{appointment.doctor}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        {/* Clinical Notes & Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Clinical Notes */}
          <section data-template-section='clinical-notes' className='lg:col-span-2'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Clinical Notes</CardTitle>
                <CardDescription>Recent observations and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {[
                    {
                      date: '2024-01-22',
                      author: 'Dr. Sarah Chen',
                      title: 'Follow-up Visit',
                      content: 'Patient reports improvement in blood pressure control. Medication appears effective. Advised to continue current regimen and schedule next follow-up in 2 weeks.',
                      tags: ['Hypertension', 'Follow-up', 'Stable']
                    },
                    {
                      date: '2024-01-15',
                      author: 'Dr. Michael Smith',
                      title: 'Initial Consultation',
                      content: 'Patient presents with elevated blood pressure readings. Started on Lisinopril 10mg daily. Recommended lifestyle modifications including reduced sodium intake and regular exercise.',
                      tags: ['Initial', 'Medication Start', 'Lifestyle']
                    },
                  ].map((note, i) => (
                    <div key={i} className='p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <h4 className='font-bold'>{note.title}</h4>
                          <div className='text-sm text-slate-600'>
                            {note.date} • {note.author}
                          </div>
                        </div>
                        <Button variant='outline' size='sm' className='border-slate-300'>
                          <Edit className='w-4 h-4' />
                        </Button>
                      </div>
                      <p className='text-slate-700 mb-4'>{note.content}</p>
                      <div className='flex flex-wrap gap-2'>
                        {note.tags.map((tag, j) => (
                          <Badge key={j} variant='outline' className='border-slate-300'>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section data-template-section='quick-actions'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: FileText, label: 'New Prescription', color: 'from-blue-500 to-cyan-500' },
                    { icon: Clipboard, label: 'Lab Order', color: 'from-purple-500 to-pink-500' },
                    { icon: DownloadIcon, label: 'Export Records', color: 'from-emerald-500 to-teal-500' },
                    { icon: Printer, label: 'Print Summary', color: 'from-amber-500 to-orange-500' },
                    { icon: Share2, label: 'Share with Patient', color: 'from-rose-500 to-red-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-slate-300 hover:border-blue-300 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                <Separator className='my-6' />
                <div className='text-center'>
                  <div className='text-sm text-slate-600 mb-2'>Security Status</div>
                  <Badge className='bg-gradient-to-r from-emerald-500 to-teal-500'>
                    <Shield className='w-3 h-3 mr-1' />
                    HIPAA Compliant
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}