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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, ShieldAlert, Lock, Key, Eye, AlertTriangle,
  CheckCircle, XCircle, Users, Globe, Server, Network,
  TrendingUp, TrendingDown, Clock, Download, Filter, Search,
  Bell, Settings, RefreshCw, Plus, ShieldCheck, FileWarning, 
  Activity, Zap, Cpu, Database, AlertCircle
} from 'lucide-react'

// Type-safe security metrics with 'as const' assertion
const SECURITY_METRICS = [
  {
    id: 'threat_level',
    label: 'Threat Level',
    value: 'Medium',
    severity: 'warning' as const,
    change: 'Stable',
    icon: ShieldAlert,
    color: 'from-amber-500 to-orange-500',
    format: 'level' as const
  },
  {
    id: 'active_incidents',
    label: 'Active Incidents',
    value: '3',
    severity: 'warning' as const,
    change: '+1',
    icon: AlertTriangle,
    color: 'from-rose-500 to-red-500',
    format: 'count' as const
  },
  {
    id: 'vulnerabilities',
    label: 'Vulnerabilities',
    value: '42',
    severity: 'medium' as const,
    change: '-8',
    icon: FileWarning,
    color: 'from-purple-500 to-pink-500',
    format: 'count' as const
  },
  {
    id: 'security_score',
    label: 'Security Score',
    value: '88',
    severity: 'good' as const,
    change: '+2',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-500',
    format: 'score' as const
  }
] as const

const THREAT_DATA = [
  { hour: '00:00', attempts: 120, blocked: 118, severity: 2 },
  { hour: '04:00', attempts: 85, blocked: 84, severity: 1 },
  { hour: '08:00', attempts: 210, blocked: 208, severity: 3 },
  { hour: '12:00', attempts: 350, blocked: 348, severity: 4 },
  { hour: '16:00', attempts: 280, blocked: 278, severity: 3 },
  { hour: '20:00', attempts: 190, blocked: 189, severity: 2 },
] as const

const INCIDENT_DATA = [
  { id: 1, type: 'Brute Force Attack', severity: 'high' as const, status: 'active' as const, source: '192.168.1.45', timestamp: '10:30 AM', affectedAssets: 'Web Server' },
  { id: 2, type: 'Malware Detection', severity: 'critical' as const, status: 'contained' as const, source: 'External', timestamp: '09:15 AM', affectedAssets: 'Workstation-42' },
  { id: 3, type: 'Data Exfiltration', severity: 'medium' as const, status: 'investigating' as const, source: 'Internal', timestamp: '08:45 AM', affectedAssets: 'Database Server' },
  { id: 4, type: 'Phishing Attempt', severity: 'low' as const, status: 'resolved' as const, source: 'Email Server', timestamp: 'Yesterday', affectedAssets: 'Multiple Users' },
  { id: 5, type: 'Unauthorized Access', severity: 'high' as const, status: 'active' as const, source: '10.0.0.125', timestamp: '11:20 AM', affectedAssets: 'Admin Panel' },
] as const

const ASSET_DATA = [
  { type: 'Servers', count: 42, vulnerabilities: 8, status: 'secure' as const, color: '#3b82f6' },
  { type: 'Workstations', count: 245, vulnerabilities: 18, status: 'warning' as const, color: '#8b5cf6' },
  { type: 'Network Devices', count: 28, vulnerabilities: 3, status: 'secure' as const, color: '#10b981' },
  { type: 'Cloud Services', count: 15, vulnerabilities: 5, status: 'warning' as const, color: '#f59e0b' },
] as const

const VULNERABILITY_TRENDS = [
  { month: 'Jan', critical: 5, high: 12, medium: 28, low: 45 },
  { month: 'Feb', critical: 3, high: 10, medium: 25, low: 42 },
  { month: 'Mar', critical: 2, high: 8, medium: 22, low: 38 },
  { month: 'Apr', critical: 1, high: 6, medium: 18, low: 35 },
  { month: 'May', critical: 2, high: 5, medium: 15, low: 30 },
  { month: 'Jun', critical: 1, high: 4, medium: 12, low: 25 },
] as const

export default function CybersecurityDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [viewMode, setViewMode] = useState('overview')
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [securityMode, setSecurityMode] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'good': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-rose-500'
      case 'contained': return 'bg-amber-500'
      case 'investigating': return 'bg-blue-500'
      case 'resolved': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  // useMemo for filtered incidents
  const filteredIncidents = useMemo(() => {
    return INCIDENT_DATA.filter(incident => {
      const matchesSearch = searchQuery === '' || 
        incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.source.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSeverity = filterSeverity === 'all' || 
        incident.severity === filterSeverity
      return matchesSearch && matchesSeverity
    })
  }, [searchQuery, filterSeverity])

  const activeIncidents = useMemo(() => 
    INCIDENT_DATA.filter(incident => incident.status !== 'resolved'),
    []
  )

  // Compute block rate
  const blockRate = useMemo(() => {
    const totalAttempts = THREAT_DATA.reduce((sum, item) => sum + item.attempts, 0)
    const totalBlocked = THREAT_DATA.reduce((sum, item) => sum + item.blocked, 0)
    return ((totalBlocked / totalAttempts) * 100).toFixed(1)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900/50 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <Shield className='w-8 h-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>CyberShield Pro</h1>
                <div className='flex items-center space-x-2'>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <Lock className='w-3 h-3 mr-1' />
                    {blockRate}% Blocked
                  </Badge>
                  <span className='text-gray-400'>Enterprise security operations</span>
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 bg-white/5 border-white/10'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-900 border-white/10'>
                  <SelectItem value='1h'>Last Hour</SelectItem>
                  <SelectItem value='24h'>Last 24 Hours</SelectItem>
                  <SelectItem value='7d'>Last 7 Days</SelectItem>
                  <SelectItem value='30d'>Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700'>
                <Plus className='w-4 h-4 mr-2' />
                New Scan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Security Overview */}
        <section data-template-section='security-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {SECURITY_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className='h-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold'>{metric.value}</span>
                            {metric.format === 'score' && (
                              <span className='text-gray-400'>/100</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.severity === 'good' ? 'text-emerald-400' :
                            metric.severity === 'warning' ? 'text-amber-400' :
                            'text-rose-400'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : metric.change.startsWith('-') ? (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            ) : (
                              <CheckCircle className='w-4 h-4 mr-1' />
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

        {/* Threat Intelligence */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Threat Activity */}
          <section data-template-section='threat-activity' data-chart-type='area' data-metrics='attempts,blocked,severity'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Threat Activity</CardTitle>
                    <CardDescription>Real-time attack attempts and blocks</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <Shield className='w-3 h-3 mr-1' />
                    {blockRate}% Blocked
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={THREAT_DATA}>
                    <defs>
                      <linearGradient id='colorAttempts' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#ef4444' stopOpacity={0.8} />
                        <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id='colorBlocked' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
                        <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='hour' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <TooltipProvider>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          color: 'white'
                        }}
                      />
                    </TooltipProvider>
                    <Legend />
                    <Area
                      type='monotone'
                      dataKey='attempts'
                      stroke='#ef4444'
                      fillOpacity={1}
                      fill='url(#colorAttempts)'
                      strokeWidth={2}
                      name='Attack Attempts'
                    />
                    <Area
                      type='monotone'
                      dataKey='blocked'
                      stroke='#10b981'
                      fillOpacity={1}
                      fill='url(#colorBlocked)'
                      strokeWidth={2}
                      name='Blocked Attacks'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Vulnerability Trends */}
          <section data-template-section='vulnerability-trends' data-chart-type='bar' data-metrics='critical,high,medium,low'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Vulnerability Trends</CardTitle>
                    <CardDescription>Monthly vulnerability tracking</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-500/30 text-blue-400'>
                    <TrendingDown className='w-3 h-3 mr-1' />
                    -42% Reduction
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={VULNERABILITY_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <TooltipProvider>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          color: 'white'
                        }}
                      />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='critical' stackId='a' fill='#ef4444' name='Critical' />
                    <Bar dataKey='high' stackId='a' fill='#f97316' name='High' />
                    <Bar dataKey='medium' stackId='a' fill='#f59e0b' name='Medium' />
                    <Bar dataKey='low' stackId='a' fill='#3b82f6' name='Low' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Incidents & Assets */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Active Incidents */}
          <section data-template-section='active-incidents' data-component-type='incident-list' className='lg:col-span-2'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Incidents</CardTitle>
                    <CardDescription>Real-time security incidents</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search incidents...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 bg-white/5 border-white/10'
                    />
                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                      <SelectTrigger className='w-32 bg-white/5 border-white/10'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-900 border-white/10'>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value='critical'>Critical</SelectItem>
                        <SelectItem value='high'>High</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='low'>Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredIncidents.map((incident) => (
                      <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedIncident === incident.id.toString()
                            ? 'border-blue-500/50 bg-blue-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedIncident(incident.id.toString())}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3'>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(incident.status)}`} />
                            <div>
                              <div className='font-medium'>{incident.type}</div>
                              <div className='text-sm text-gray-400'>{incident.source} • {incident.affectedAssets}</div>
                            </div>
                          </div>
                          <div className='text-right space-y-1'>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <div className='text-sm text-gray-400'>{incident.timestamp}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Asset Distribution */}
          <section data-template-section='asset-distribution' data-chart-type='pie' data-metrics='count,vulnerabilities'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Asset Distribution</CardTitle>
                <CardDescription>Managed assets by type</CardDescription>
              </CardHeader>
              <CardContent className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={ASSET_DATA}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='count'
                    >
                      {ASSET_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <TooltipProvider>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          color: 'white'
                        }}
                      />
                    </TooltipProvider>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <div className='w-full space-y-2'>
                  {ASSET_DATA.map((asset, i) => (
                    <div key={i} className='flex items-center justify-between text-sm'>
                      <span className='text-gray-400'>{asset.type}</span>
                      <Badge variant='outline' className='border-rose-500/30 text-rose-400'>
                        {asset.vulnerabilities} vulns
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </section>
        </div>

        {/* Security Controls & Network Stats */}
        <section data-template-section='security-controls' data-component-type='analytics-grid'>
          <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Security Controls & Network Stats</CardTitle>
                  <CardDescription>Real-time monitoring and protection status</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-gray-400'>Active Monitoring</span>
                    <Switch checked={securityMode} onCheckedChange={setSecurityMode} />
                  </div>
                  <Button variant='outline' className='border-white/10'>
                    <Download className='w-4 h-4 mr-2' />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Network Traffic', 
                    value: '4.2 Gbps', 
                    change: '+12%', 
                    icon: Network,
                    color: 'from-blue-500 to-cyan-500',
                    description: 'Peak throughput'
                  },
                  { 
                    label: 'Security Events', 
                    value: '1,245', 
                    change: '-8%', 
                    icon: Activity,
                    color: 'from-purple-500 to-pink-500',
                    description: 'Last 24h'
                  },
                  { 
                    label: 'Packet Inspection', 
                    value: '99.8%', 
                    change: '+0.2%', 
                    icon: Eye,
                    color: 'from-emerald-500 to-teal-500',
                    description: 'Success rate'
                  },
                  { 
                    label: 'Response Time', 
                    value: '42ms', 
                    change: '-15%', 
                    icon: Zap,
                    color: 'from-amber-500 to-orange-500',
                    description: 'Avg. response'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-400'>{stat.label}</div>
                    </div>
                    <div className='text-2xl font-bold mb-2'>{stat.value}</div>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm text-gray-400'>{stat.description}</div>
                      <div className={`flex items-center text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {stat.change.startsWith('+') ? (
                          <TrendingUp className='w-4 h-4 mr-1' />
                        ) : (
                          <TrendingDown className='w-4 h-4 mr-1' />
                        )}
                        {stat.change}
                      </div>
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
