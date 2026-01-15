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
  FileCode, Book, Search, Filter, Plus, Download, Share2, Eye, 
  CheckCircle, AlertTriangle, Zap, Lock, Globe,
  BarChart3, TrendingUp, TrendingDown, Code, Terminal, Copy,
  ExternalLink, Clock, Users, Star, Activity, MessageSquare,
  Tag, Hash, RefreshCw, Settings, Bell
} from 'lucide-react'

// API Documentation metrics with TypeScript constants
const API_METRICS = [
  {
    id: 'total_endpoints',
    label: 'Total Endpoints',
    value: '248',
    change: '+18',
    status: 'increasing' as const,
    icon: FileCode,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'documentation_coverage',
    label: 'Documentation Coverage',
    value: '94',
    unit: '%',
    change: '+6%',
    status: 'good' as const,
    icon: Book,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'api_calls_today',
    label: 'API Calls Today',
    value: '12.4K',
    change: '+28%',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'success_rate',
    label: 'Success Rate',
    value: '99.2',
    unit: '%',
    change: '+0.4%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
] as const

const API_ENDPOINTS = [
  {
    id: 'ep-001',
    method: 'GET',
    endpoint: '/api/v1/users',
    description: 'Fetches list of all users with pagination support',
    category: 'Users',
    authenticated: true,
    status: 'stable',
    responseTime: '45ms',
    usage: 1250
  },
  {
    id: 'ep-002',
    method: 'POST',
    endpoint: '/api/v1/users',
    description: 'Creates a new user account with validation',
    category: 'Users',
    authenticated: true,
    status: 'stable',
    responseTime: '120ms',
    usage: 840
  },
  {
    id: 'ep-003',
    method: 'GET',
    endpoint: '/api/v1/products',
    description: 'Retrieves product catalog with filtering options',
    category: 'Products',
    authenticated: false,
    status: 'stable',
    responseTime: '35ms',
    usage: 2450
  },
  {
    id: 'ep-004',
    method: 'PUT',
    endpoint: '/api/v1/users/:id',
    description: 'Updates user profile information',
    category: 'Users',
    authenticated: true,
    status: 'stable',
    responseTime: '85ms',
    usage: 650
  },
  {
    id: 'ep-005',
    method: 'DELETE',
    endpoint: '/api/v1/users/:id',
    description: 'Soft delete user account with cleanup',
    category: 'Users',
    authenticated: true,
    status: 'deprecated',
    responseTime: '95ms',
    usage: 120
  },
  {
    id: 'ep-006',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    description: 'Authenticate user and generate JWT token',
    category: 'Authentication',
    authenticated: false,
    status: 'stable',
    responseTime: '180ms',
    usage: 3200
  },
  {
    id: 'ep-007',
    method: 'GET',
    endpoint: '/api/v1/orders',
    description: 'Fetches order history with status filters',
    category: 'Orders',
    authenticated: true,
    status: 'beta',
    responseTime: '65ms',
    usage: 980
  },
  {
    id: 'ep-008',
    method: 'POST',
    endpoint: '/api/v1/webhooks',
    description: 'Register webhook endpoints for event notifications',
    category: 'Webhooks',
    authenticated: true,
    status: 'beta',
    responseTime: '110ms',
    usage: 340
  },
] as const

const API_USAGE_DATA = [
  { month: 'Jan', calls: 280000, errors: 1200, avgResponseTime: 85 },
  { month: 'Feb', calls: 320000, errors: 980, avgResponseTime: 78 },
  { month: 'Mar', calls: 380000, errors: 1450, avgResponseTime: 82 },
  { month: 'Apr', calls: 450000, errors: 1100, avgResponseTime: 75 },
  { month: 'May', calls: 520000, errors: 890, avgResponseTime: 72 },
  { month: 'Jun', calls: 580000, errors: 720, avgResponseTime: 68 },
] as const

const ENDPOINT_CATEGORIES = [
  { name: 'Users', count: 24, color: '#3b82f6' },
  { name: 'Products', count: 32, color: '#8b5cf6' },
  { name: 'Orders', count: 18, color: '#10b981' },
  { name: 'Authentication', count: 12, color: '#f59e0b' },
  { name: 'Webhooks', count: 8, color: '#ef4444' },
] as const

const RECENT_API_CHANGES = [
  {
    id: 'change-001',
    title: 'New Pagination Parameters',
    endpoint: '/api/v1/users',
    type: 'enhancement',
    date: '2 hours ago',
    author: 'Sarah Chen',
    description: 'Added limit and offset parameters for better pagination control'
  },
  {
    id: 'change-002',
    title: 'Rate Limiting Updated',
    endpoint: '/api/v1/auth/login',
    type: 'security',
    date: '5 hours ago',
    author: 'Mike Johnson',
    description: 'Implemented stricter rate limiting to prevent brute force attacks'
  },
  {
    id: 'change-003',
    title: 'Webhook Signature Validation',
    endpoint: '/api/v1/webhooks',
    type: 'security',
    date: '1 day ago',
    author: 'Emily Zhang',
    description: 'Added HMAC signature validation for webhook payloads'
  },
  {
    id: 'change-004',
    title: 'Deprecated Legacy Endpoints',
    endpoint: '/api/v1/users/:id',
    type: 'deprecation',
    date: '2 days ago',
    author: 'David Kim',
    description: 'Marked old DELETE endpoint as deprecated, use v2 instead'
  },
] as const

export default function ApiDocumentationSite() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMethod, setSelectedMethod] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getMethodColor = useCallback((method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'POST': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'PUT': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'DELETE': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'PATCH': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'stable': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'beta': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'deprecated': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredEndpoints = useMemo(() => {
    return API_ENDPOINTS.filter(endpoint => {
      const matchesSearch = searchQuery === '' || 
        endpoint.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        endpoint.category === selectedCategory
      const matchesMethod = selectedMethod === 'all' || 
        endpoint.method === selectedMethod
      return matchesSearch && matchesCategory && matchesMethod
    })
  }, [searchQuery, selectedCategory, selectedMethod])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <FileCode className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>API Documentation Hub</h1>
                <p className='text-gray-600'>Complete API reference & integration guides</p>
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
                Add Endpoint
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* API Metrics Overview */}
        <section data-template-section='api-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {API_METRICS.map((metric) => (
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

        {/* API Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* API Usage Trends */}
          <section data-template-section='api-usage-trends' data-chart-type='line' data-metrics='calls,errors,responseTime'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>API Usage Trends</CardTitle>
                    <CardDescription>Monthly API calls and performance metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={API_USAGE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='calls' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='API Calls'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='errors' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Errors'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='avgResponseTime' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Avg Response (ms)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Endpoint Categories */}
          <section data-template-section='endpoint-categories' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Endpoint Categories</CardTitle>
                    <CardDescription>API endpoints by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={ENDPOINT_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='name' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Endpoint Count' radius={[4, 4, 0, 0]}>
                      {ENDPOINT_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* API Endpoints Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Endpoints List */}
          <section data-template-section='endpoints-browser' data-component-type='endpoint-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>API Endpoints</CardTitle>
                    <CardDescription>Browse and search available endpoints</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search endpoints...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-40 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='Users'>Users</SelectItem>
                        <SelectItem value='Products'>Products</SelectItem>
                        <SelectItem value='Orders'>Orders</SelectItem>
                        <SelectItem value='Authentication'>Authentication</SelectItem>
                        <SelectItem value='Webhooks'>Webhooks</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Methods</SelectItem>
                        <SelectItem value='GET'>GET</SelectItem>
                        <SelectItem value='POST'>POST</SelectItem>
                        <SelectItem value='PUT'>PUT</SelectItem>
                        <SelectItem value='DELETE'>DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredEndpoints.map((endpoint) => (
                      <motion.div
                        key={endpoint.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer ${
                          selectedEndpoint === endpoint.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-center space-x-3'>
                            <Badge className={getMethodColor(endpoint.method)}>
                              {endpoint.method}
                            </Badge>
                            <code className='text-sm font-mono text-gray-900'>{endpoint.endpoint}</code>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge className={getStatusColor(endpoint.status)}>
                              {endpoint.status}
                            </Badge>
                            {endpoint.authenticated && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Lock className='w-4 h-4 text-amber-600' />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Authentication Required</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                        <p className='text-sm text-gray-600 mb-3'>{endpoint.description}</p>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm text-gray-600'>
                            <span className='flex items-center'>
                              <Tag className='w-3 h-3 mr-1' />
                              {endpoint.category}
                            </span>
                            <span className='flex items-center'>
                              <Clock className='w-3 h-3 mr-1' />
                              {endpoint.responseTime}
                            </span>
                            <span className='flex items-center'>
                              <Activity className='w-3 h-3 mr-1' />
                              {endpoint.usage} calls/day
                            </span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Copy className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <ExternalLink className='w-4 h-4' />
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

          {/* Recent Changes & Quick Links */}
          <section data-template-section='recent-changes' data-component-type='change-log'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Recent Changes</CardTitle>
                <CardDescription>Latest API documentation updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {RECENT_API_CHANGES.map((change) => (
                    <div key={change.id} className='p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg'>
                      <div className='flex items-start justify-between mb-2'>
                        <h4 className='font-semibold text-sm'>{change.title}</h4>
                        <Badge variant='outline' className={
                          change.type === 'security' ? 'border-rose-300 text-rose-700' :
                          change.type === 'enhancement' ? 'border-emerald-300 text-emerald-700' :
                          'border-amber-300 text-amber-700'
                        }>
                          {change.type}
                        </Badge>
                      </div>
                      <code className='text-xs font-mono text-gray-600 block mb-2'>{change.endpoint}</code>
                      <p className='text-xs text-gray-600 mb-2'>{change.description}</p>
                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <span className='flex items-center'>
                          <Users className='w-3 h-3 mr-1' />
                          {change.author}
                        </span>
                        <span className='flex items-center'>
                          <Clock className='w-3 h-3 mr-1' />
                          {change.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className='my-6' />

                <div className='space-y-3'>
                  <h3 className='font-semibold text-sm'>Quick Links</h3>
                  {[
                    { icon: Book, label: 'Getting Started', color: 'from-blue-500 to-cyan-500' },
                    { icon: Terminal, label: 'API Reference', color: 'from-purple-500 to-pink-500' },
                    { icon: Zap, label: 'Code Examples', color: 'from-emerald-500 to-teal-500' },
                    { icon: MessageSquare, label: 'Support Forum', color: 'from-amber-500 to-orange-500' },
                  ].map((link, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-blue-300 h-12'
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${link.color} mr-3 flex items-center justify-center`}>
                        <link.icon className='w-4 h-4 text-white' />
                      </div>
                      {link.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Documentation Statistics */}
        <section data-template-section='doc-statistics' data-component-type='stats-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Documentation Statistics</CardTitle>
                  <CardDescription>API usage and documentation insights</CardDescription>
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
                    label: 'Most Used Endpoint', 
                    value: '/api/v1/auth/login', 
                    count: '3.2K calls/day',
                    icon: Star,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Avg Response Time', 
                    value: '68ms', 
                    trend: '-12% faster',
                    icon: Zap,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Active Developers', 
                    value: '1,284', 
                    growth: '+15% this month',
                    icon: Users,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Documentation Views', 
                    value: '24.8K', 
                    change: '+42% increase',
                    icon: Eye,
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
                      {stat.count || stat.trend || stat.growth || stat.change}
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