'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, AlertTriangle, Activity, Server,
  CheckCircle, XCircle, Clock, TrendingUp, TrendingDown,
  BarChart3, Download, Eye, Settings, RefreshCw, Wifi
} from 'lucide-react'

// Monitoring metrics with as const
const MONITORING_METRICS = [
  {
    id: 'system_uptime',
    label: 'System Uptime',
    value: '99.2',
    unit: '%',
    status: 'good' as const,
    change: '+0.3%',
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'active_servers',
    label: 'Active Servers',
    value: '18',
    total: '20',
    status: 'good' as const,
    change: '+2',
    icon: Server,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'avg_response',
    label: 'Avg Response Time',
    value: '245',
    unit: 'ms',
    status: 'optimal' as const,
    change: '-15ms',
    icon: Activity,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'active_alerts',
    label: 'Active Alerts',
    value: '3',
    status: 'warning' as const,
    change: '+1',
    icon: AlertTriangle,
    color: 'from-amber-500 to-orange-500'
  }
] as const

const SERVER_LIST = [
  { 
    id: 'server-001', 
    name: 'Web Server 1', 
    status: 'active' as const, 
    uptime: 99.5, 
    cpu: 45, 
    memory: 68, 
    location: 'US-East'
  },
  { 
    id: 'server-002', 
    name: 'Database Server', 
    status: 'active' as const, 
    uptime: 99.8, 
    cpu: 72, 
    memory: 84, 
    location: 'US-West'
  },
  { 
    id: 'server-003', 
    name: 'API Server 1', 
    status: 'warning' as const, 
    uptime: 95.2, 
    cpu: 88, 
    memory: 92, 
    location: 'EU-Central'
  },
  { 
    id: 'server-004', 
    name: 'Cache Server', 
    status: 'active' as const, 
    uptime: 99.9, 
    cpu: 32, 
    memory: 54, 
    location: 'Asia-East'
  },
  { 
    id: 'server-005', 
    name: 'Backup Server', 
    status: 'maintenance' as const, 
    uptime: 70.0, 
    cpu: 15, 
    memory: 28, 
    location: 'US-East'
  }
] as const

const MONITORING_ALERTS = [
  { 
    id: 'alert-001', 
    type: 'cpu' as const, 
    severity: 'warning' as const, 
    server: 'API Server 1', 
    message: 'CPU usage above 85%', 
    timestamp: '10 min ago'
  },
  { 
    id: 'alert-002', 
    type: 'memory' as const, 
    severity: 'critical' as const, 
    server: 'Database Server', 
    message: 'Memory usage critical', 
    timestamp: '25 min ago'
  },
  { 
    id: 'alert-003', 
    type: 'network' as const, 
    severity: 'info' as const, 
    server: 'Web Server 1', 
    message: 'Network latency spike detected', 
    timestamp: '1 hour ago'
  }
] as const

const PERFORMANCE_DATA = [
  { time: '00:00', requests: 1200, responseTime: 230, errors: 5 },
  { time: '04:00', requests: 800, responseTime: 210, errors: 2 },
  { time: '08:00', requests: 2400, responseTime: 280, errors: 8 },
  { time: '12:00', requests: 3200, responseTime: 310, errors: 12 },
  { time: '16:00', requests: 2800, responseTime: 290, errors: 7 },
  { time: '20:00', requests: 1800, responseTime: 245, errors: 4 }
] as const

export default function MonitoringSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedServer, setSelectedServer] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'inactive': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getAlertBadge = useCallback((severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const filteredServers = useMemo(() => {
    return SERVER_LIST.filter(server => {
      const matchesSearch = searchQuery === '' || 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || server.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30'>
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg'>
                <Activity className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>MonitorHub Pro</h1>
                <p className='text-slate-600'>System monitoring & performance analytics</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1h'>Last Hour</SelectItem>
                  <SelectItem value='24h'>Last 24 Hours</SelectItem>
                  <SelectItem value='7d'>Last 7 Days</SelectItem>
                  <SelectItem value='30d'>Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Server
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        <section data-template-section='monitoring-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {MONITORING_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='border border-slate-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-slate-900'>{metric.value}</span>
                            {metric.unit && <span className='text-gray-500'>{metric.unit}</span>}
                            {'total' in metric && <span className='text-gray-500'>/ {metric.total}</span>}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'optimal' 
                              ? 'text-emerald-600' 
                              : metric.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}>
                            {metric.change.startsWith('+') || metric.change.startsWith('-') && !metric.change.includes('-') ? (
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
          <section data-template-section='performance-metrics' data-chart-type='line' data-metrics='requests,responseTime,errors'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Performance Metrics</CardTitle>
                    <CardDescription>24-hour system performance</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <CheckCircle className='w-3 h-3 mr-1' />
                    Healthy
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='time' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <Legend />
                    <Line yAxisId='left' type='monotone' dataKey='requests' stroke='#8b5cf6' strokeWidth={2} name='Requests' />
                    <Line yAxisId='right' type='monotone' dataKey='responseTime' stroke='#3b82f6' strokeWidth={2} name='Response Time (ms)' />
                    <Line yAxisId='left' type='monotone' dataKey='errors' stroke='#ef4444' strokeWidth={2} name='Errors' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='system-alerts' data-component-type='alert-feed'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>System Alerts</CardTitle>
                    <CardDescription>Recent monitoring alerts</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-200 text-amber-700'>
                    <AlertTriangle className='w-3 h-3 mr-1' />
                    {MONITORING_ALERTS.filter(a => a.severity !== 'info').length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {MONITORING_ALERTS.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border ${getAlertBadge(alert.severity)}`}
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center space-x-3'>
                            <AlertTriangle className='w-5 h-5' />
                            <div>
                              <div className='font-medium'>{alert.server}</div>
                              <div className='text-sm opacity-80'>{alert.message}</div>
                            </div>
                          </div>
                          <Badge className={getAlertBadge(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className='flex items-center text-sm text-slate-600'>
                          <Clock className='w-3 h-3 mr-1' />
                          {alert.timestamp}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section data-template-section='server-status' data-component-type='server-table'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Server Status</CardTitle>
                  <CardDescription>Real-time server monitoring</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search servers...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-slate-300'
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className='w-32 border-slate-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='warning'>Warning</SelectItem>
                      <SelectItem value='maintenance'>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredServers.map((server) => (
                      <motion.tr
                        key={server.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='hover:bg-slate-50 cursor-pointer'
                        onClick={() => setSelectedServer(server.id)}
                      >
                        <TableCell className='font-medium'>{server.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(server.status)}>
                            {server.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{server.uptime}%</TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <Progress value={server.cpu} className='w-16 h-2' />
                            <span className='text-sm'>{server.cpu}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <Progress value={server.memory} className='w-16 h-2' />
                            <span className='text-sm'>{server.memory}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{server.location}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end space-x-2'>
                            <Button variant='ghost' size='icon'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon'>
                              <Settings className='w-4 h-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section data-template-section='system-analytics' data-component-type='analytics-grid'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg font-semibold'>System Analytics</CardTitle>
                <Button variant='outline' className='border-slate-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { label: 'Total Requests', value: '2.4M', change: '+12%', icon: Activity, color: 'from-purple-500 to-indigo-500' },
                  { label: 'Avg Load Time', value: '245ms', change: '-8%', icon: Clock, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Success Rate', value: '99.4%', change: '+0.2%', icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Error Rate', value: '0.6%', change: '-0.1%', icon: XCircle, color: 'from-rose-500 to-red-500' }
                ].map((metric, i) => (
                  <div key={i} className='p-4 bg-slate-50 border border-slate-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-lg`}>
                        <metric.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-slate-600'>{metric.label}</div>
                    </div>
                    <div className='text-2xl font-bold mb-2'>{metric.value}</div>
                    <div className={`flex items-center text-sm font-medium ${
                      metric.change.startsWith('+') || !metric.change.startsWith('-') ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {metric.change.startsWith('+') || !metric.change.startsWith('-') ? <TrendingUp className='w-4 h-4 mr-1' /> : <TrendingDown className='w-4 h-4 mr-1' />}
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
