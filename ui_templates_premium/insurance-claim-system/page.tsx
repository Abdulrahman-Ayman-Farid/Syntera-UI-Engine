'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Upload, Camera, CheckCircle, AlertCircle, Clock,
  DollarSign, Calendar, ArrowRight, ArrowLeft, Save, Send,
  User, Shield, AlertTriangle, X, Edit, Download, Phone,
  Mail, Plus, Search, Filter, TrendingUp, TrendingDown,
  Eye, Hash, Tag
} from 'lucide-react'

// ============================================================================
// TypeScript Constants - Insurance Claims Domain Data
// ============================================================================

const CLAIM_METRICS = [
  {
    id: 'total_claims',
    label: 'Total Claims',
    value: '1,247',
    change: '+89',
    status: 'increasing' as const,
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'pending_review',
    label: 'Pending Review',
    value: '156',
    change: '+12',
    status: 'warning' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'approved_claims',
    label: 'Approved',
    value: '892',
    change: '+67',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'claim_value',
    label: 'Total Value',
    value: '4.2',
    unit: 'M',
    change: '+18%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
    format: 'currency'
  }
] as const

const CLAIM_TYPES = [
  { type: 'Property', count: 485, amount: 1850000, color: '#3b82f6', icon: Shield },
  { type: 'Auto', count: 392, amount: 980000, color: '#8b5cf6', icon: FileText },
  { type: 'Health', count: 245, amount: 750000, color: '#10b981', icon: User },
  { type: 'Liability', count: 125, amount: 620000, color: '#f59e0b', icon: AlertTriangle },
] as const

const CLAIMS_DATA = [
  {
    id: 'claim-001',
    claimNumber: 'CLM-2024-001',
    claimant: 'John Doe',
    type: 'property',
    amount: 15000,
    status: 'under_review',
    submittedDate: '2024-01-10',
    incidentDate: '2024-01-05',
    adjuster: 'Sarah Johnson',
    evidence: 3,
    priority: 'high'
  },
  {
    id: 'claim-002',
    claimNumber: 'CLM-2024-002',
    claimant: 'Jane Smith',
    type: 'auto',
    amount: 8500,
    status: 'approved',
    submittedDate: '2024-01-08',
    incidentDate: '2024-01-03',
    adjuster: 'Michael Brown',
    evidence: 5,
    priority: 'medium'
  },
  {
    id: 'claim-003',
    claimNumber: 'CLM-2024-003',
    claimant: 'Robert Wilson',
    type: 'health',
    amount: 3200,
    status: 'submitted',
    submittedDate: '2024-01-12',
    incidentDate: '2024-01-10',
    adjuster: 'Emily Davis',
    evidence: 2,
    priority: 'low'
  },
  {
    id: 'claim-004',
    claimNumber: 'CLM-2024-004',
    claimant: 'Lisa Anderson',
    type: 'liability',
    amount: 22000,
    status: 'denied',
    submittedDate: '2024-01-09',
    incidentDate: '2024-01-01',
    adjuster: 'David Miller',
    evidence: 1,
    priority: 'high'
  },
] as const

const CLAIM_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'under_review', label: 'Under Review', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'denied', label: 'Denied', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-300' },
] as const

const TIMELINE_DATA = [
  { month: 'Jan', submitted: 120, approved: 95, denied: 15 },
  { month: 'Feb', submitted: 145, approved: 110, denied: 20 },
  { month: 'Mar', submitted: 158, approved: 125, denied: 18 },
  { month: 'Apr', submitted: 172, approved: 138, denied: 22 },
  { month: 'May', submitted: 195, approved: 155, denied: 25 },
  { month: 'Jun', submitted: 210, approved: 168, denied: 28 },
] as const

const WIZARD_STEPS = [
  { id: 1, title: 'Claimant Info', description: 'Personal details', icon: User },
  { id: 2, title: 'Incident Details', description: 'What happened', icon: AlertCircle },
  { id: 3, title: 'Evidence Upload', description: 'Documents & photos', icon: Upload },
  { id: 4, title: 'Review & Submit', description: 'Verify information', icon: CheckCircle },
] as const

// ============================================================================
// Main Component
// ============================================================================

export default function InsuranceClaimSystem() {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null)
  const [wizardStep, setWizardStep] = useState(1)
  const [showWizard, setShowWizard] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Memoized filtered claims
  const filteredClaims = useMemo(() => {
    return CLAIMS_DATA.filter(claim => {
      const matchesSearch = searchQuery === '' || 
        claim.claimant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus
      const matchesType = selectedType === 'all' || claim.type === selectedType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchQuery, selectedStatus, selectedType])

  // Callbacks
  const handleClaimClick = useCallback((claimId: string) => {
    setSelectedClaim(claimId)
  }, [])

  const handleWizardNext = useCallback(() => {
    if (wizardStep < 4) setWizardStep(wizardStep + 1)
  }, [wizardStep])

  const handleWizardPrev = useCallback(() => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1)
  }, [wizardStep])

  const getStatusColor = (status: string) => {
    return CLAIM_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type: string) => {
    const typeData = CLAIM_TYPES.find(t => t.type.toLowerCase() === type)
    return typeData?.icon || FileText
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'>
      {/* Header */}
      <header 
        data-template-section='header'
        className='sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-lg'>
                <Shield className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>ClaimFlow Pro</h1>
                <p className='text-gray-400'>Insurance claim management system</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button 
                onClick={() => setShowWizard(true)}
                className='bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg'
              >
                <Plus className='w-4 h-4 mr-2' />
                New Claim
              </Button>
              <Avatar className='cursor-pointer border-2 border-orange-600'>
                <AvatarImage src='/avatars/01.png' alt='User' />
                <AvatarFallback>VV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Metrics Overview */}
        <section data-template-section='metrics' data-component-type='kpi-grid' data-metrics='claims,value,status'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {CLAIM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-amber-400'
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

        {/* Analytics Dashboard */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Claim Type Distribution */}
          <section data-template-section='claim-distribution' data-chart-type='bar' data-metrics='count,amount'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Claims by Type</CardTitle>
                    <CardDescription className='text-gray-400'>Distribution across categories</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-orange-400 text-orange-400'>
                    <FileText className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={CLAIM_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='type' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Claim Count' radius={[4, 4, 0, 0]}>
                      {CLAIM_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Claims Timeline */}
          <section data-template-section='claim-timeline' data-chart-type='line' data-metrics='submitted,approved,denied'>
            <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Claims Timeline</CardTitle>
                    <CardDescription className='text-gray-400'>Monthly processing trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-400 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +15% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TIMELINE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='submitted' stroke='#3b82f6' strokeWidth={2} name='Submitted' />
                    <Line type='monotone' dataKey='approved' stroke='#10b981' strokeWidth={2} name='Approved' />
                    <Line type='monotone' dataKey='denied' stroke='#ef4444' strokeWidth={2} name='Denied' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Claims Management */}
        <section data-template-section='claims-management' data-component-type='table'>
          <Card className='border border-gray-700 bg-gray-800/50 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Claims Dashboard</CardTitle>
                  <CardDescription className='text-gray-400'>Manage and track all insurance claims</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search claims...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-64 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                  />
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className='w-40 bg-gray-700 border-gray-600 text-white'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='all'>All Status</SelectItem>
                      {CLAIM_STATUSES.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className='w-40 bg-gray-700 border-gray-600 text-white'>
                      <SelectValue placeholder='Type' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='property'>Property</SelectItem>
                      <SelectItem value='auto'>Auto</SelectItem>
                      <SelectItem value='health'>Health</SelectItem>
                      <SelectItem value='liability'>Liability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <AnimatePresence>
                  {filteredClaims.map((claim) => {
                    const TypeIcon = getTypeIcon(claim.type)
                    return (
                      <motion.div
                        key={claim.id}
                        layoutId={`claim-${claim.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600 rounded-xl hover:border-orange-500 transition-colors cursor-pointer ${
                          selectedClaim === claim.id ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                        onClick={() => handleClaimClick(claim.id)}
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start space-x-4 flex-1'>
                            <div className='p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg'>
                              <TypeIcon className='w-5 h-5 text-white' />
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between mb-2'>
                                <div>
                                  <h4 className='font-bold text-white text-lg'>{claim.claimNumber}</h4>
                                  <p className='text-gray-400 text-sm'>{claim.claimant}</p>
                                </div>
                                <Badge className={getStatusColor(claim.status)}>
                                  {CLAIM_STATUSES.find(s => s.value === claim.status)?.label}
                                </Badge>
                              </div>
                              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-3'>
                                <span className='flex items-center'>
                                  <Tag className='w-3 h-3 mr-1' />
                                  {claim.type}
                                </span>
                                <span className='flex items-center'>
                                  <DollarSign className='w-3 h-3 mr-1' />
                                  ${claim.amount.toLocaleString()}
                                </span>
                                <span className='flex items-center'>
                                  <Calendar className='w-3 h-3 mr-1' />
                                  {claim.submittedDate}
                                </span>
                                <span className='flex items-center'>
                                  <Upload className='w-3 h-3 mr-1' />
                                  {claim.evidence} files
                                </span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                  <Avatar className='h-6 w-6'>
                                    <AvatarFallback className='text-xs bg-gray-600'>
                                      {claim.adjuster.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm text-gray-400'>{claim.adjuster}</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <Button variant='ghost' size='sm' className='text-gray-400 hover:text-white'>
                                    <Eye className='w-4 h-4' />
                                  </Button>
                                  <Button variant='ghost' size='sm' className='text-gray-400 hover:text-white'>
                                    <Edit className='w-4 h-4' />
                                  </Button>
                                  <Button variant='ghost' size='sm' className='text-gray-400 hover:text-white'>
                                    <Download className='w-4 h-4' />
                                  </Button>
                                </div>
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
      </main>

      {/* Multi-Step Claim Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'
            onClick={() => setShowWizard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className='bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'
              onClick={(e) => e.stopPropagation()}
              data-template-section='claim-wizard'
              data-component-type='wizard'
            >
              <div className='p-6 border-b border-gray-700'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-white'>New Claim Submission</h2>
                  <Button variant='ghost' size='icon' onClick={() => setShowWizard(false)}>
                    <X className='w-5 h-5' />
                  </Button>
                </div>
                
                {/* Wizard Steps */}
                <div className='flex items-center justify-between'>
                  {WIZARD_STEPS.map((step, index) => (
                    <div key={step.id} className='flex items-center flex-1'>
                      <div className='flex flex-col items-center flex-1'>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                          wizardStep >= step.id 
                            ? 'bg-orange-600 border-orange-600 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-400'
                        }`}>
                          <step.icon className='w-5 h-5' />
                        </div>
                        <div className='mt-2 text-center'>
                          <div className={`text-sm font-medium ${wizardStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
                            {step.title}
                          </div>
                          <div className='text-xs text-gray-500'>{step.description}</div>
                        </div>
                      </div>
                      {index < WIZARD_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-4 transition-colors ${
                          wizardStep > step.id ? 'bg-orange-600' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className='p-6 overflow-y-auto max-h-[calc(90vh-280px)]'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className='space-y-4'
                  >
                    {wizardStep === 1 && (
                      <div className='space-y-4'>
                        <h3 className='text-lg font-semibold text-white'>Claimant Information</h3>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Label className='text-gray-300'>Full Name</Label>
                            <Input className='bg-gray-700 border-gray-600 text-white' placeholder='John Doe' />
                          </div>
                          <div>
                            <Label className='text-gray-300'>Policy Number</Label>
                            <Input className='bg-gray-700 border-gray-600 text-white' placeholder='POL-2024-001' />
                          </div>
                          <div>
                            <Label className='text-gray-300'>Email</Label>
                            <Input type='email' className='bg-gray-700 border-gray-600 text-white' placeholder='john@example.com' />
                          </div>
                          <div>
                            <Label className='text-gray-300'>Phone</Label>
                            <Input type='tel' className='bg-gray-700 border-gray-600 text-white' placeholder='(555) 123-4567' />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {wizardStep === 2 && (
                      <div className='space-y-4'>
                        <h3 className='text-lg font-semibold text-white'>Incident Details</h3>
                        <div className='space-y-4'>
                          <div>
                            <Label className='text-gray-300'>Claim Type</Label>
                            <Select>
                              <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                                <SelectValue placeholder='Select type' />
                              </SelectTrigger>
                              <SelectContent className='bg-gray-800 border-gray-700'>
                                <SelectItem value='property'>Property Damage</SelectItem>
                                <SelectItem value='auto'>Auto</SelectItem>
                                <SelectItem value='health'>Health</SelectItem>
                                <SelectItem value='liability'>Liability</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <Label className='text-gray-300'>Incident Date</Label>
                              <Input type='date' className='bg-gray-700 border-gray-600 text-white' />
                            </div>
                            <div>
                              <Label className='text-gray-300'>Claim Amount</Label>
                              <Input type='number' className='bg-gray-700 border-gray-600 text-white' placeholder='15000' />
                            </div>
                          </div>
                          <div>
                            <Label className='text-gray-300'>Description</Label>
                            <Textarea className='bg-gray-700 border-gray-600 text-white' rows={4} placeholder='Describe the incident...' />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {wizardStep === 3 && (
                      <div className='space-y-4'>
                        <h3 className='text-lg font-semibold text-white'>Evidence Upload</h3>
                        <div className='border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-700/30'>
                          <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                          <p className='text-gray-300 mb-2'>Drag and drop files here or click to browse</p>
                          <p className='text-sm text-gray-400'>Supported: Photos, Videos, Documents (Max 10MB each)</p>
                          <Button className='mt-4 bg-orange-600 hover:bg-orange-700'>
                            <Camera className='w-4 h-4 mr-2' />
                            Upload Files
                          </Button>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between p-3 bg-gray-700/50 rounded-lg'>
                            <div className='flex items-center space-x-3'>
                              <FileText className='w-5 h-5 text-blue-400' />
                              <span className='text-white'>incident_report.pdf</span>
                            </div>
                            <Button variant='ghost' size='sm'>
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {wizardStep === 4 && (
                      <div className='space-y-4'>
                        <h3 className='text-lg font-semibold text-white'>Review & Submit</h3>
                        <Card className='bg-gray-700/50 border-gray-600'>
                          <CardContent className='p-4 space-y-3'>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>Claimant:</span>
                              <span className='text-white font-medium'>John Doe</span>
                            </div>
                            <Separator className='bg-gray-600' />
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>Claim Type:</span>
                              <span className='text-white font-medium'>Property Damage</span>
                            </div>
                            <Separator className='bg-gray-600' />
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>Amount:</span>
                              <span className='text-white font-medium'>$15,000</span>
                            </div>
                            <Separator className='bg-gray-600' />
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>Evidence Files:</span>
                              <span className='text-white font-medium'>1 file</span>
                            </div>
                          </CardContent>
                        </Card>
                        <div className='p-4 bg-amber-900/30 border border-amber-700 rounded-lg'>
                          <div className='flex items-start space-x-3'>
                            <AlertTriangle className='w-5 h-5 text-amber-400 mt-0.5' />
                            <div>
                              <p className='text-amber-300 font-medium'>Important Notice</p>
                              <p className='text-amber-400/80 text-sm mt-1'>
                                By submitting this claim, you confirm that all information provided is accurate and complete.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className='p-6 border-t border-gray-700 flex items-center justify-between'>
                <Button
                  variant='outline'
                  onClick={handleWizardPrev}
                  disabled={wizardStep === 1}
                  className='border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Previous
                </Button>
                <div className='flex items-center space-x-2'>
                  <Button variant='outline' className='border-gray-600 text-gray-300 hover:bg-gray-700'>
                    <Save className='w-4 h-4 mr-2' />
                    Save Draft
                  </Button>
                  {wizardStep < 4 ? (
                    <Button onClick={handleWizardNext} className='bg-orange-600 hover:bg-orange-700'>
                      Next
                      <ArrowRight className='w-4 h-4 ml-2' />
                    </Button>
                  ) : (
                    <Button className='bg-emerald-600 hover:bg-emerald-700'>
                      <Send className='w-4 h-4 mr-2' />
                      Submit Claim
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}