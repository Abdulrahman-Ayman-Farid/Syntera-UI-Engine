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
  CartesianGrid, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Building2, DollarSign, Users, MapPin,
  Search, Filter, Plus, Eye, Edit, Phone, Trash2,
  Calendar, Wifi, Car, Snowflake, Bath, Bed,
  BarChart3, TrendingUp, TrendingDown, Shield, Star, MessageSquare,
  FileText, Settings, Download, Upload, Key, Tag,
  Clock, CheckCircle, AlertTriangle, Building, Wrench
} from 'lucide-react'

// Property metrics derived from real estate data
const PROPERTY_METRICS = [
  {
    id: 'total_properties',
    label: 'Total Properties',
    value: '24',
    change: '+3',
    status: 'increasing' as const,
    icon: Building2,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  },
  {
    id: 'monthly_revenue',
    label: 'Monthly Revenue',
    value: '68,400',
    unit: '$',
    change: '+12%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'occupancy_rate',
    label: 'Occupancy Rate',
    value: '92',
    unit: '%',
    change: '+4%',
    status: 'good' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'percent'
  },
  {
    id: 'maintenance_requests',
    label: 'Maintenance Requests',
    value: '8',
    change: '-2',
    status: 'decreasing' as const,
    icon: Wrench,
    color: 'from-rose-500 to-red-500',
    format: 'count'
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
    color: 'from-amber-500 to-orange-500',
    image: '🏢'
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
    color: 'from-emerald-500 to-teal-500',
    image: '🏠'
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
    color: 'from-blue-500 to-cyan-500',
    image: '🏘️'
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
    color: 'from-purple-500 to-pink-500',
    image: '🏡'
  },
] as const

const REVENUE_DATA = [
  { month: 'Jan', revenue: 62000, expenses: 18000, occupancy: 88 },
  { month: 'Feb', revenue: 64500, expenses: 19500, occupancy: 90 },
  { month: 'Mar', revenue: 66000, expenses: 17000, occupancy: 92 },
  { month: 'Apr', revenue: 68400, expenses: 18500, occupancy: 92 },
  { month: 'May', revenue: 70000, expenses: 20000, occupancy: 94 },
  { month: 'Jun', revenue: 72500, expenses: 19000, occupancy: 96 },
] as const

const TENANT_LIST = [
  { 
    id: 'tenant-001', 
    name: 'Michael Chen', 
    property: '123 Luxury Avenue', 
    rent: 4500, 
    status: 'current' as const, 
    leaseEnd: '2024-12-31',
    paymentStatus: 'paid' as const,
    moveIn: '2023-01-15'
  },
  { 
    id: 'tenant-002', 
    name: 'Sarah Johnson', 
    property: '789 Urban Street', 
    rent: 2800, 
    status: 'current' as const, 
    leaseEnd: '2024-06-30',
    paymentStatus: 'pending' as const,
    moveIn: '2023-07-01'
  },
  { 
    id: 'tenant-003', 
    name: 'David Wilson', 
    property: '321 Garden View', 
    rent: 6500, 
    status: 'current' as const, 
    leaseEnd: '2025-03-15',
    paymentStatus: 'paid' as const,
    moveIn: '2023-03-20'
  },
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
  },
] as const

const PROPERTY_TYPES = [
  { type: 'Apartment', count: 10, revenue: 45000, color: '#3b82f6' },
  { type: 'House', count: 6, revenue: 19200, color: '#10b981' },
  { type: 'Condo', count: 5, revenue: 14000, color: '#8b5cf6' },
  { type: 'Villa', count: 3, revenue: 19500, color: '#f59e0b' },
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
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
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
        {/* Portfolio Overview */}
        <section data-template-section='portfolio-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PROPERTY_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-stone-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-stone-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            {metric.unit === '$' && <span className='text-gray-500'>$</span>}
                            <span className='text-2xl font-bold text-stone-900'>{metric.value}</span>
                            {metric.unit && metric.unit !== '$' && (
                              <span className='text-gray-500'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'increasing' || metric.status === 'good'
                              ? 'text-emerald-600' 
                              : metric.status === 'decreasing'
                              ? 'text-rose-600'
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

        {/* Properties Grid */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-stone-900'>Properties</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search properties...'
                className='w-64 border-stone-300 focus:border-amber-500'
                startIcon={Search}
              />
              <Select defaultValue='all'>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='available'>Available</SelectItem>
                  <SelectItem value='rented'>Rented</SelectItem>
                  <SelectItem value='maintenance'>Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-96 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {properties.map((property) => (
                <Card 
                  key={property.id}
                  className='border border-stone-200 hover:shadow-xl transition-all duration-300 group cursor-pointer'
                  onClick={() => setActiveProperty(property)}
                >
                  <div className={`h-48 bg-gradient-to-r ${property.color} rounded-t-xl relative overflow-hidden`}>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Home className='w-16 h-16 text-white/40' />
                    </div>
                    <div className='absolute top-4 right-4'>
                      <Badge className='bg-white/90 text-stone-900'>
                        ${property.price}/mo
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-bold text-stone-900 group-hover:text-amber-600'>
                          {property.address}
                        </h3>
                        <p className='text-sm text-stone-600 mt-1'>{property.type}</p>
                      </div>
                      <div className='flex items-center'>
                        <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
                        <span className='ml-1 text-sm font-medium'>{property.rating}</span>
                      </div>
                    </div>
                    
                    <div className='space-y-4'>
                      <div className='grid grid-cols-3 gap-4 text-center'>
                        <div className='bg-stone-50 p-3 rounded-lg'>
                          <Bed className='w-4 h-4 text-stone-600 mx-auto mb-1' />
                          <div className='font-medium'>{property.beds}</div>
                          <div className='text-xs text-stone-500'>Beds</div>
                        </div>
                        <div className='bg-stone-50 p-3 rounded-lg'>
                          <Bath className='w-4 h-4 text-stone-600 mx-auto mb-1' />
                          <div className='font-medium'>{property.baths}</div>
                          <div className='text-xs text-stone-500'>Baths</div>
                        </div>
                        <div className='bg-stone-50 p-3 rounded-lg'>
                          <div className='font-medium'>{property.area} sqft</div>
                          <div className='text-xs text-stone-500'>Area</div>
                        </div>
                      </div>
                      
                      <div className='flex items-center justify-between pt-4 border-t border-stone-100'>
                        <Badge variant={
                          property.status === 'Rented' ? 'success' :
                          property.status === 'Available' ? 'default' :
                          'secondary'
                        }>
                          {property.status}
                        </Badge>
                        <div className='flex space-x-2'>
                          <Button variant='ghost' size='icon'>
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon'>
                            <Edit className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Tenants & Finances */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Current Tenants */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Users className='w-5 h-5 mr-2 text-amber-600' />
                Current Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {tenants.map((tenant) => (
                  <div key={tenant.id} className='flex items-center justify-between p-4 bg-stone-50 rounded-lg'>
                    <div className='flex items-center space-x-4'>
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
                      <Badge variant={tenant.status === 'Current' ? 'success' : 'secondary'} className='mt-1'>
                        {tenant.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-stone-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add New Tenant
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart3 className='w-5 h-5 mr-2 text-emerald-600' />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Monthly Revenue</span>
                    <span>$68,400 / $75,000</span>
                  </div>
                  <Progress value={91} className='h-2' />
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { label: 'Collected Rent', value: '$64,200', change: '+8%' },
                    { label: 'Expenses', value: '$12,400', change: '-3%' },
                    { label: 'Net Income', value: '$51,800', change: '+15%' },
                    { label: 'Vacancy Loss', value: '$2,600', change: '-25%' },
                  ].map((metric, i) => (
                    <div key={i} className='bg-stone-50 p-4 rounded-lg'>
                      <p className='text-sm text-stone-600'>{metric.label}</p>
                      <p className='text-xl font-bold mt-2'>{metric.value}</p>
                      <div className={`flex items-center text-sm mt-1 ${
                        metric.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <TrendingUp className='w-3 h-3 mr-1' />
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance & Amenities */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Maintenance Requests */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Shield className='w-5 h-5 mr-2 text-blue-600' />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  { id: 1, property: '123 Luxury Ave', issue: 'AC Not Working', priority: 'High', date: '2 hours ago' },
                  { id: 2, property: '456 Modern Blvd', issue: 'Leaky Faucet', priority: 'Medium', date: '1 day ago' },
                  { id: 3, property: '789 Urban St', issue: 'Broken Window', priority: 'High', date: '2 days ago' },
                ].map((request) => (
                  <div key={request.id} className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
                    <div>
                      <h4 className='font-medium'>{request.property}</h4>
                      <p className='text-sm text-blue-600'>{request.issue}</p>
                    </div>
                    <div className='text-right'>
                      <Badge variant={request.priority === 'High' ? 'destructive' : 'secondary'}>
                        {request.priority}
                      </Badge>
                      <p className='text-sm text-blue-600 mt-1'>{request.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Amenities */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Star className='w-5 h-5 mr-2 text-amber-600' />
                Amenities Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                  { icon: Wifi, label: 'WiFi', count: 22 },
                  { icon: Car, label: 'Parking', count: 18 },
                  { icon: Snowflake, label: 'AC', count: 24 },
                  { icon: '🏊', label: 'Pool', count: 8 },
                ].map((amenity, i) => (
                  <div key={i} className='text-center p-4 bg-amber-50 rounded-xl'>
                    {typeof amenity.icon === 'string' ? (
                      <div className='text-2xl mb-2'>{amenity.icon}</div>
                    ) : (
                      <amenity.icon className='w-6 h-6 text-amber-600 mx-auto mb-2' />
                    )}
                    <h4 className='font-bold text-stone-900'>{amenity.label}</h4>
                    <p className='text-sm text-stone-600'>{amenity.count} properties</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}