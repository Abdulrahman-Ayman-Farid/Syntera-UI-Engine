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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Building2, DollarSign, Users,
  Plus, Eye, Edit, Bath, Bed,
  BarChart3, TrendingUp, TrendingDown, Star,
  FileText, Download, Calendar, Clock, AlertTriangle, Wrench
} from 'lucide-react'

// Property metrics with as const
const PROPERTY_METRICS = [
  {
    id: 'total_properties',
    label: 'Total Properties',
    value: '24',
    change: '+3',
    status: 'increasing' as const,
    icon: Building2,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'monthly_revenue',
    label: 'Monthly Revenue',
    value: '$68,400',
    change: '+12%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'occupancy_rate',
    label: 'Occupancy Rate',
    value: '92%',
    change: '+4%',
    status: 'good' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'maintenance_requests',
    label: 'Maintenance Requests',
    value: '8',
    change: '-2',
    status: 'decreasing' as const,
    icon: Wrench,
    color: 'from-rose-500 to-red-500'
  }
] as const

const PROPERTY_LISTINGS = [
  {
    id: 'prop-001',
    address: '123 Luxury Avenue',
    type: 'Apartment',
    price: 4500,
    status: 'rented' as const,
    beds: 3,
    baths: 2,
    area: 1200,
    rating: 4.8,
    tenant: 'Michael Chen',
    leaseEnd: '2024-12-31',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'prop-002',
    address: '456 Modern Boulevard',
    type: 'House',
    price: 3200,
    status: 'available' as const,
    beds: 4,
    baths: 3,
    area: 1800,
    rating: 4.5,
    tenant: null,
    leaseEnd: null,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'prop-003',
    address: '789 Urban Street',
    type: 'Condo',
    price: 2800,
    status: 'maintenance' as const,
    beds: 2,
    baths: 2,
    area: 950,
    rating: 4.2,
    tenant: 'Sarah Johnson',
    leaseEnd: '2024-06-30',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'prop-004',
    address: '321 Garden View',
    type: 'Villa',
    price: 6500,
    status: 'rented' as const,
    beds: 5,
    baths: 4,
    area: 2400,
    rating: 4.9,
    tenant: 'David Wilson',
    leaseEnd: '2025-03-15',
    color: 'from-purple-500 to-pink-500'
  }
] as const

const REVENUE_DATA = [
  { month: 'Jan', revenue: 62000, expenses: 18000, occupancy: 88 },
  { month: 'Feb', revenue: 64500, expenses: 19500, occupancy: 90 },
  { month: 'Mar', revenue: 66000, expenses: 17000, occupancy: 92 },
  { month: 'Apr', revenue: 68400, expenses: 18500, occupancy: 92 },
  { month: 'May', revenue: 70000, expenses: 20000, occupancy: 94 },
  { month: 'Jun', revenue: 72500, expenses: 19000, occupancy: 96 }
] as const

const TENANT_LIST = [
  { 
    id: 'tenant-001', 
    name: 'Michael Chen', 
    property: '123 Luxury Avenue', 
    rent: 4500, 
    status: 'current' as const, 
    leaseEnd: '2024-12-31',
    paymentStatus: 'paid' as const
  },
  { 
    id: 'tenant-002', 
    name: 'Sarah Johnson', 
    property: '789 Urban Street', 
    rent: 2800, 
    status: 'current' as const, 
    leaseEnd: '2024-06-30',
    paymentStatus: 'pending' as const
  },
  { 
    id: 'tenant-003', 
    name: 'David Wilson', 
    property: '321 Garden View', 
    rent: 6500, 
    status: 'current' as const, 
    leaseEnd: '2025-03-15',
    paymentStatus: 'paid' as const
  }
] as const

const MAINTENANCE_REQUESTS = [
  { 
    id: 'maint-001', 
    property: '123 Luxury Avenue', 
    issue: 'AC Not Working', 
    priority: 'high' as const, 
    date: '2 hours ago',
    status: 'in_progress' as const
  },
  { 
    id: 'maint-002', 
    property: '456 Modern Boulevard', 
    issue: 'Leaky Faucet', 
    priority: 'medium' as const, 
    date: '1 day ago',
    status: 'pending' as const
  },
  { 
    id: 'maint-003', 
    property: '789 Urban Street', 
    issue: 'Broken Window', 
    priority: 'high' as const, 
    date: '2 days ago',
    status: 'completed' as const
  }
] as const

export default function RealEstateManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'rented': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'available': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getPriorityBadge = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredProperties = useMemo(() => {
    return PROPERTY_LISTINGS.filter(property => {
      const matchesSearch = searchQuery === '' || 
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30'>
      <header className='sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg'>
                <Home className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-stone-900'>PropertyPro</h1>
                <p className='text-stone-600'>Real estate management platform</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-stone-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Property
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        <section data-template-section='portfolio-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {PROPERTY_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='border border-stone-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-stone-600'>{metric.label}</p>
                          <div className='text-2xl font-bold text-stone-900'>{metric.value}</div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'increasing' || metric.status === 'good'
                              ? 'text-emerald-600' : 'text-rose-600'
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='revenue-trends' data-chart-type='line' data-metrics='revenue,expenses,occupancy'>
            <Card className='border border-stone-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Revenue Trends</CardTitle>
                    <CardDescription>Monthly financial performance</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <Legend />
                    <Line yAxisId='left' type='monotone' dataKey='revenue' stroke='#10b981' strokeWidth={2} name='Revenue ($)' />
                    <Line yAxisId='left' type='monotone' dataKey='expenses' stroke='#ef4444' strokeWidth={2} name='Expenses ($)' />
                    <Line yAxisId='right' type='monotone' dataKey='occupancy' stroke='#3b82f6' strokeWidth={2} name='Occupancy (%)' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='property-distribution' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-stone-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Property Distribution</CardTitle>
                    <CardDescription>By type and status</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-200 text-amber-700'>
                    <Building2 className='w-3 h-3 mr-1' />
                    24 Properties
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={[
                    { type: 'Apartment', count: 10, color: '#3b82f6' },
                    { type: 'House', count: 6, color: '#10b981' },
                    { type: 'Condo', count: 5, color: '#8b5cf6' },
                    { type: 'Villa', count: 3, color: '#f59e0b' }
                  ]}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Legend />
                    <Bar dataKey='count' name='Property Count' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        <section data-template-section='property-listings' data-component-type='property-grid'>
          <Card className='border border-stone-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Property Listings</CardTitle>
                  <CardDescription>Manage your real estate portfolio</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search properties...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-stone-300'
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className='w-32 border-stone-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      <SelectItem value='rented'>Rented</SelectItem>
                      <SelectItem value='available'>Available</SelectItem>
                      <SelectItem value='maintenance'>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Tabs value={viewMode} onValueChange={setViewMode}>
                    <TabsList>
                      <TabsTrigger value='grid'>Grid</TabsTrigger>
                      <TabsTrigger value='list'>List</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                <AnimatePresence>
                  {filteredProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layoutId={`property-${property.id}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedProperty(property.id)}
                      className={`cursor-pointer ${selectedProperty === property.id ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
                    >
                      <Card className='border border-stone-200 hover:shadow-xl transition-all'>
                        <div className={`h-32 bg-gradient-to-r ${property.color} rounded-t-xl relative`}>
                          <div className='absolute top-4 right-4'>
                            <Badge className='bg-white/90 text-stone-900 font-bold'>
                              ${property.price}/mo
                            </Badge>
                          </div>
                          <div className='absolute top-4 left-4'>
                            <Badge className={getStatusBadge(property.status)}>
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between mb-3'>
                            <div>
                              <h3 className='text-lg font-bold text-stone-900'>{property.address}</h3>
                              <p className='text-sm text-stone-600'>{property.type}</p>
                            </div>
                            <div className='flex items-center'>
                              <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
                              <span className='ml-1 text-sm font-medium'>{property.rating}</span>
                            </div>
                          </div>
                          <div className='grid grid-cols-3 gap-3 mb-4'>
                            <div className='bg-stone-50 p-2 rounded-lg text-center'>
                              <Bed className='w-4 h-4 text-stone-600 mx-auto mb-1' />
                              <div className='font-medium text-sm'>{property.beds}</div>
                            </div>
                            <div className='bg-stone-50 p-2 rounded-lg text-center'>
                              <Bath className='w-4 h-4 text-stone-600 mx-auto mb-1' />
                              <div className='font-medium text-sm'>{property.baths}</div>
                            </div>
                            <div className='bg-stone-50 p-2 rounded-lg text-center'>
                              <div className='font-medium text-sm'>{property.area}</div>
                              <div className='text-xs text-stone-500'>sqft</div>
                            </div>
                          </div>
                          {property.tenant && (
                            <div className='p-3 bg-stone-50 rounded-lg mb-3'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                  <Users className='w-4 h-4 text-stone-600' />
                                  <span className='text-sm font-medium'>{property.tenant}</span>
                                </div>
                                <div className='text-xs text-stone-500'>Until {property.leaseEnd}</div>
                              </div>
                            </div>
                          )}
                          <div className='flex space-x-2'>
                            <Button variant='outline' size='sm' className='flex-1 border-stone-300'>
                              <Eye className='w-4 h-4 mr-1' />
                              View
                            </Button>
                            <Button variant='outline' size='sm' className='flex-1 border-stone-300'>
                              <Edit className='w-4 h-4 mr-1' />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='tenant-management' data-component-type='tenant-list'>
            <Card className='border border-stone-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>Current Tenants</CardTitle>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    {TENANT_LIST.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {TENANT_LIST.map((tenant) => (
                      <motion.div
                        key={tenant.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='p-4 bg-stone-50 border border-stone-200 rounded-xl'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center space-x-3'>
                            <Avatar>
                              <AvatarFallback className='bg-amber-100 text-amber-800'>
                                {tenant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className='font-medium'>{tenant.name}</h4>
                              <p className='text-sm text-stone-600'>{tenant.property}</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='font-bold'>${tenant.rent}/mo</div>
                            <Badge className={tenant.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                              {tenant.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className='flex items-center text-sm text-stone-600'>
                          <Calendar className='w-3 h-3 mr-1' />
                          Lease ends: {tenant.leaseEnd}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='maintenance-requests' data-component-type='request-list'>
            <Card className='border border-stone-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>Maintenance Requests</CardTitle>
                  <Badge variant='outline' className='border-rose-200 text-rose-700'>
                    <AlertTriangle className='w-3 h-3 mr-1' />
                    {MAINTENANCE_REQUESTS.filter(r => r.priority === 'high').length} High Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {MAINTENANCE_REQUESTS.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='p-4 bg-stone-50 border border-stone-200 rounded-xl'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg'>
                              <Wrench className='w-4 h-4 text-white' />
                            </div>
                            <div>
                              <h4 className='font-medium'>{request.property}</h4>
                              <p className='text-sm text-stone-600'>{request.issue}</p>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <Badge className={getPriorityBadge(request.priority)}>{request.priority}</Badge>
                            <Badge variant='outline'>{request.status.replace('_', ' ')}</Badge>
                          </div>
                          <span className='text-sm text-stone-600'>{request.date}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section data-template-section='financial-summary' data-component-type='analytics-grid'>
          <Card className='border border-stone-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg font-semibold'>Financial Summary</CardTitle>
                <Button variant='outline' className='border-stone-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { label: 'Collected Rent', value: '$64,200', change: '+8%', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Operating Expenses', value: '$12,400', change: '-3%', icon: FileText, color: 'from-rose-500 to-red-500' },
                  { label: 'Net Income', value: '$51,800', change: '+15%', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Vacancy Loss', value: '$2,600', change: '-25%', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' }
                ].map((metric, i) => (
                  <div key={i} className='p-4 bg-stone-50 border border-stone-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-lg`}>
                        <metric.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-stone-600'>{metric.label}</div>
                    </div>
                    <div className='text-2xl font-bold mb-2'>{metric.value}</div>
                    <div className={`flex items-center text-sm font-medium ${
                      metric.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {metric.change.startsWith('+') ? <TrendingUp className='w-4 h-4 mr-1' /> : <TrendingDown className='w-4 h-4 mr-1' />}
                      {metric.change}
                    </div>
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
