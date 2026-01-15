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
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code, Activity, TrendingUp, TrendingDown, Zap,
  CheckCircle, AlertTriangle, Clock, Search, Download,
  Settings, Bell, Terminal, Key, Book, FileCode,
  Globe, Lock, Users, Database, Server, GitBranch
} from 'lucide-react'

// API metrics with type-safe constants
const API_METRICS = [
  {
    id: 'total_endpoints',
    label: 'Total Endpoints',
    value: '247',
    change: '+12',
    status: 'increasing' as const,
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'api_calls',
    label: 'API Calls Today',
    value: '1.2M',
    change: '+18%',
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
    change: '+0.3%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'avg_response',
    label: 'Avg Response',
    value: '142',
    unit: 'ms',
    change: '-8ms',
    status: 'good' as const,
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  }
] as const

const ENDPOINT_CATEGORIES = [
  { category: 'Authentication', count: 45, requests: 450000, color: '#3b82f6', icon: Lock },
  { category: 'Users', count: 68, requests: 320000, color: '#8b5cf6', icon: Users },
  { category: 'Data', count: 82, requests: 280000, color: '#10b981', icon: Database },
  { category: 'Webhooks', count: 52, requests: 150000, color: '#f59e0b', icon: GitBranch },
] as const

const API_ENDPOINTS = [
  {
    id: 'ep-001',
    name: 'User Authentication',
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    calls: 45000,
    success: 99.8,
    avgTime: 125,
    status: 'active'
  },
  {
    id: 'ep-002',
    name: 'Get User Profile',
    endpoint: '/api/v1/users/:id',
    method: 'GET',
    calls: 38000,
    success: 99.5,
    avgTime: 95,
    status: 'active'
  },
  {
    id: 'ep-003',
    name: 'Create Resource',
    endpoint: '/api/v1/resources',
    method: 'POST',
    calls: 22000,
    success: 98.2,
    avgTime: 245,
    status: 'active'
  },
  {
    id: 'ep-004',
    name: 'Data Export',
    endpoint: '/api/v1/export',
    method: 'GET',
    calls: 5200,
    success: 96.8,
    avgTime: 1850,
    status: 'deprecated'
  },
] as const

const USAGE_DATA = [
  { hour: '00:00', requests: 8500, errors: 42, latency: 135 },
  { hour: '04:00', requests: 12000, errors: 58, latency: 142 },
  { hour: '08:00', requests: 45000, errors: 185, latency: 168 },
  { hour: '12:00', requests: 68000, errors: 245, latency: 195 },
  { hour: '16:00', requests: 52000, errors: 198, latency: 152 },
  { hour: '20:00', requests: 28000, errors: 98, latency: 138 },
] as const

export default function ApiDocDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMethod, setSelectedMethod] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'deprecated': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'inactive': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'POST': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'PUT': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'DELETE': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredEndpoints = useMemo(() => {
    return API_ENDPOINTS.filter(endpoint => {
      const matchesSearch = searchQuery === '' || 
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMethod = selectedMethod === 'all' || 
        endpoint.method === selectedMethod
      return matchesSearch && matchesMethod
    })
  }, [searchQuery, selectedMethod])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-blue-800 bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <Code className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>API Documentation Hub</h1>
                <p className='text-blue-200'>Comprehensive API documentation and monitoring</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-blue-700 bg-slate-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1h'>Last Hour</SelectItem>
                  <SelectItem value='24h'>Last 24 Hours</SelectItem>
                  <SelectItem value='7d'>Last 7 Days</SelectItem>
                  <SelectItem value='30d'>Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <Key className='w-4 h-4 mr-2' />
                Generate API Key
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* API Metrics */}
        <section data-template-section='api-overview' data-component-type='kpi-grid'>
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
                  <Card className='h-full border border-blue-800 bg-slate-800/50 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-blue-200'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-blue-300'>{metric.unit}</span>
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

        {/* API Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Endpoint Distribution */}
          <section data-template-section='endpoint-distribution' data-chart-type='bar' data-metrics='count,requests'>
            <Card className='border border-blue-800 bg-slate-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Endpoint Distribution</CardTitle>
                    <CardDescription className='text-blue-200'>Endpoints by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-600 text-blue-400'>
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={ENDPOINT_CATEGORIES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='category' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
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

          {/* API Usage Trends */}
          <section data-template-section='usage-trends' data-chart-type='line' data-metrics='requests,errors,latency'>
            <Card className='border border-blue-800 bg-slate-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>API Usage Trends</CardTitle>
                    <CardDescription className='text-blue-200'>Request patterns over time</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-600 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Traffic
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={USAGE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='hour' stroke='#94a3b8' />
                    <YAxis yAxisId='left' stroke='#94a3b8' />
                    <YAxis yAxisId='right' orientation='right' stroke='#94a3b8' />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='requests' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Requests'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='errors' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Errors'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Endpoint Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='endpoint-browser' data-component-type='endpoint-grid' className='lg:col-span-2'>
            <Card className='border border-blue-800 bg-slate-800/50 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>API Endpoints</CardTitle>
                    <CardDescription className='text-blue-200'>Available endpoints and their performance</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search endpoints...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-blue-700 bg-slate-900 text-white'
                    />
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger className='w-32 border-blue-700 bg-slate-900 text-white'>
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
                        className={`p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-800 rounded-xl hover:border-blue-600 transition-colors cursor-pointer ${
                          selectedEndpoint === endpoint.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''
                        }`}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <Badge className={getMethodColor(endpoint.method)}>
                                {endpoint.method}
                              </Badge>
                              <h4 className='font-bold text-white'>{endpoint.name}</h4>
                              <Badge className={getStatusColor(endpoint.status)}>
                                {endpoint.status}
                              </Badge>
                            </div>
                            <code className='text-sm text-blue-300 font-mono'>{endpoint.endpoint}</code>
                            <div className='grid grid-cols-3 gap-4 mt-3 text-sm'>
                              <div>
                                <span className='text-blue-200'>Calls Today</span>
                                <div className='text-white font-bold'>{(endpoint.calls / 1000).toFixed(1)}K</div>
                              </div>
                              <div>
                                <span className='text-blue-200'>Success Rate</span>
                                <div className='text-emerald-400 font-bold'>{endpoint.success}%</div>
                              </div>
                              <div>
                                <span className='text-blue-200'>Avg Response</span>
                                <div className='text-white font-bold'>{endpoint.avgTime}ms</div>
                              </div>
                            </div>
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
            <Card className='border border-blue-800 bg-slate-800/50 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Terminal, label: 'Test Endpoint', color: 'from-blue-500 to-cyan-500' },
                    { icon: Key, label: 'Manage Keys', color: 'from-purple-500 to-pink-500' },
                    { icon: Book, label: 'View Docs', color: 'from-emerald-500 to-teal-500' },
                    { icon: FileCode, label: 'Code Examples', color: 'from-amber-500 to-orange-500' },
                    { icon: Globe, label: 'Webhooks', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'API Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-blue-700 hover:border-blue-600 bg-slate-900 text-white h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-blue-800' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-blue-200'>Rate Limit</span>
                      <span className='font-medium text-white'>4,250 / 5,000</span>
                    </div>
                    <Progress value={85} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-900 to-cyan-900 border border-blue-700 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-400' />
                      <div>
                        <div className='font-medium text-white'>API Status</div>
                        <div className='text-sm text-emerald-400'>All systems operational</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* API Analytics Details */}
        <section data-template-section='api-analytics' data-component-type='analytics-grid'>
          <Card className='border border-blue-800 bg-slate-800/50 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>API Performance Insights</CardTitle>
                  <CardDescription className='text-blue-200'>Key metrics and performance data</CardDescription>
                </div>
                <Button variant='outline' className='border-blue-700 text-white'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Endpoint', 
                    value: 'User Auth', 
                    calls: '45K',
                    icon: Activity,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Peak Hour', 
                    value: '12:00 PM', 
                    traffic: '68K requests',
                    icon: Clock,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Fastest Endpoint', 
                    value: '95ms avg', 
                    endpoint: 'GET /users/:id',
                    icon: Zap,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Error Rate', 
                    value: '0.8%', 
                    status: 'Within limits',
                    icon: AlertTriangle,
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-800 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-blue-200'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg text-white mb-2'>{stat.value}</div>
                    <div className='text-sm text-blue-300'>
                      {stat.calls && stat.calls}
                      {stat.traffic && stat.traffic}
                      {stat.endpoint && stat.endpoint}
                      {stat.status && stat.status}
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