'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, FileText, Calendar, Clock, 
  Eye, Download, Share2, User, Heart, Activity,
  Pill, Thermometer, AlertCircle, CheckCircle,
  TrendingUp, TrendingDown, File, Clipboard
} from 'lucide-react'

// Patient Records Constants
const PATIENT_RECORDS = [
  {
    id: 1,
    mrn: 'MRN-2024-001',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    diagnosis: 'Type 2 Diabetes',
    status: 'active' as const,
    lastVisit: '2024-01-15',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    documents: 12
  },
  {
    id: 2,
    mrn: 'MRN-2024-002',
    name: 'Jane Smith',
    age: 30,
    gender: 'Female',
    diagnosis: 'Hypertension',
    status: 'active' as const,
    lastVisit: '2024-01-20',
    bloodType: 'A+',
    allergies: ['None'],
    documents: 8
  },
  {
    id: 3,
    mrn: 'MRN-2024-003',
    name: 'Sam Johnson',
    age: 50,
    gender: 'Male',
    diagnosis: 'Arthritis',
    status: 'inactive' as const,
    lastVisit: '2023-12-10',
    bloodType: 'B+',
    allergies: ['Aspirin', 'Latex'],
    documents: 15
  },
  {
    id: 4,
    mrn: 'MRN-2024-004',
    name: 'Emily Brown',
    age: 28,
    gender: 'Female',
    diagnosis: 'Asthma',
    status: 'active' as const,
    lastVisit: '2024-01-18',
    bloodType: 'AB+',
    allergies: ['Pollen'],
    documents: 6
  }
] as const

// Vitals Timeline Data
const VITALS_TIMELINE = [
  { date: 'Jan 1', bloodPressure: 120, heartRate: 72, temperature: 98.6 },
  { date: 'Jan 8', bloodPressure: 118, heartRate: 68, temperature: 98.4 },
  { date: 'Jan 15', bloodPressure: 122, heartRate: 70, temperature: 98.7 },
  { date: 'Jan 22', bloodPressure: 119, heartRate: 75, temperature: 99.1 },
  { date: 'Jan 29', bloodPressure: 121, heartRate: 71, temperature: 98.5 }
] as const

// Document Categories
const DOCUMENT_CATEGORIES = [
  { id: 'lab_results', name: 'Lab Results', count: 24, icon: Clipboard, color: 'from-blue-500 to-cyan-500' },
  { id: 'prescriptions', name: 'Prescriptions', count: 15, icon: Pill, color: 'from-purple-500 to-pink-500' },
  { id: 'imaging', name: 'Imaging', count: 8, icon: Activity, color: 'from-emerald-500 to-teal-500' },
  { id: 'reports', name: 'Reports', count: 18, icon: FileText, color: 'from-amber-500 to-orange-500' }
] as const

// Recent Documents
const RECENT_DOCUMENTS = [
  {
    id: 'doc-001',
    title: 'Blood Test Results',
    type: 'Lab Results',
    date: '2024-01-20',
    provider: 'Dr. Sarah Chen',
    status: 'reviewed' as const
  },
  {
    id: 'doc-002',
    title: 'Prescription - Metformin',
    type: 'Prescription',
    date: '2024-01-18',
    provider: 'Dr. Michael Smith',
    status: 'active' as const
  },
  {
    id: 'doc-003',
    title: 'X-Ray Report',
    type: 'Imaging',
    date: '2024-01-15',
    provider: 'Radiology Dept',
    status: 'pending' as const
  }
] as const

export default function MedicalRecordsViewer() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return PATIENT_RECORDS.filter(patient => {
      const matchesSearch = searchQuery === '' || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const handlePatientSelect = useCallback((patientId: number) => {
    setSelectedPatient(patientId)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'>
      {/* Header */}
      <header 
        data-template-section='header' 
        className='sticky top-0 z-50 border-b border-red-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg'>
                <FileText className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Medical Records Viewer</h1>
                <p className='text-gray-600'>Secure patient health information system</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='outline' className='border-gray-300'>
                <Download className='w-4 h-4 mr-2' />
                Export
              </Button>
              <Button className='bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg'>
                <Share2 className='w-4 h-4 mr-2' />
                Share Records
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='flex min-h-[calc(100vh-80px)]'>
        {/* Sidebar */}
        <aside 
          data-template-section='sidebar' 
          className='w-64 border-r border-red-200 bg-white/80 backdrop-blur-sm p-6 space-y-6'
        >
          <div>
            <h3 className='text-sm font-semibold text-gray-600 mb-4'>FILTERS</h3>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full border-gray-300'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h3 className='text-sm font-semibold text-gray-600 mb-4'>CATEGORIES</h3>
            <div className='space-y-2'>
              {DOCUMENT_CATEGORIES.map(category => (
                <motion.div
                  key={category.id}
                  whileHover={{ x: 4 }}
                  className='flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg cursor-pointer hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center space-x-3'>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                      <category.icon className='w-4 h-4 text-white' />
                    </div>
                    <span className='text-sm font-medium'>{category.name}</span>
                  </div>
                  <Badge variant='outline' className='border-gray-300'>
                    {category.count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className='text-sm font-semibold text-gray-600 mb-4'>QUICK STATS</h3>
            <div className='space-y-3'>
              <div className='p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Total Patients</p>
                <p className='text-2xl font-bold text-blue-600'>{PATIENT_RECORDS.length}</p>
              </div>
              <div className='p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Active Records</p>
                <p className='text-2xl font-bold text-emerald-600'>
                  {PATIENT_RECORDS.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main data-template-section='main' className='flex-1 p-6 space-y-8'>
          {/* Search & Controls */}
          <section data-template-section='search-controls' data-component-type='search-bar'>
            <Card className='border border-red-200 shadow-sm'>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-4'>
                  <div className='flex-1 relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <Input
                      placeholder='Search by name, MRN, or diagnosis...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='pl-10 border-gray-300'
                    />
                  </div>
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'cards')}>
                    <TabsList>
                      <TabsTrigger value='table'>Table</TabsTrigger>
                      <TabsTrigger value='cards'>Cards</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Rest of content simplified for space */}
          <Card className='border border-red-200 shadow-sm'>
            <CardHeader>
              <CardTitle>Patient Records - {filteredPatients.length} found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Enhanced record viewing with timeline and vitals tracking</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}