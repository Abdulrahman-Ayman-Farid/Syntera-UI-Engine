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
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, ShieldAlert, Lock, Key, Eye, EyeOff, AlertTriangle,
  CheckCircle, XCircle, Users, Globe, Server, Network,
  TrendingUp, TrendingDown, Clock, Download, Filter, Search,
  Bell, Settings, RefreshCw, Plus, ExternalLink, Copy,
  ShieldCheck, FileWarning, Activity, Zap, Cpu, Database
} from 'lucide-react'

// Security metrics derived from data_types
const SECURITY_METRICS = [
  {
    id: 'threat_level',
    label: 'Threat Level',
    value: 'Medium',
    severity: 'warning' as const,
    change: 'Stable',
    icon: ShieldAlert,
    color: 'from-amber-500 to-orange-500',
    format: 'level'
  },
  {
    id: 'active_incidents',
    label: 'Active Incidents',
    value: '3',
    severity: 'warning' as const,
    change: '+1',
    icon: AlertTriangle,
    color: 'from-rose-500 to-red-500',
    format: 'count'
  },
  {
    id: 'vulnerabilities',
    label: 'Vulnerabilities',
    value: '42',
    severity: 'medium' as const,
    change: '-8',
    icon: FileWarning,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'security_score',
    label: 'Security Score',
    value: '88',
    severity: 'good' as const,
    change: '+2',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-500',
    format: 'score'
  }
]

const THREAT_DATA = [
  { hour: '00:00', attempts: 120, blocked: 118, severity: 2 },
  { hour: '04:00', attempts: 85, blocked: 84, severity: 1 },
  { hour: '08:00', attempts: 210, blocked: 208, severity: 3 },
  { hour: '12:00', attempts: 350, blocked: 348, severity: 4 },
  { hour: '16:00', attempts: 280, blocked: 278, severity: 3 },
  { hour: '20:00', attempts: 190, blocked: 189, severity: 2 },
]

const INCIDENT_DATA = [
  { id: 1, type: 'brute_force', severity: 'high', status: 'active', source: '192.168.1.45', timestamp: '10:30 AM' },
  { id: 2, type: 'malware', severity: 'critical', status: 'contained', source: 'External', timestamp: '09:15 AM' },
  { id: 3, type: 'data_exfiltration', severity: 'medium', status: 'investigating', source: 'Internal', timestamp: '08:45 AM' },
  { id: 4, type: 'phishing', severity: 'low', status: 'resolved', source: 'Email Server', timestamp: 'Yesterday' },
]

const ASSET_DATA = [
  { type: 'Servers', count: 42, vulnerabilities: 8, status: 'secure', color: '#3b82f6' },
  { type: 'Workstations', count: 245, vulnerabilities: 18, status: 'warning', color: '#8b5cf6' },
  { type: 'Network Devices', count: 28, vulnerabilities: 3, status: 'secure', color: '#10b981' },
  { type: 'Cloud Services', count: 15, vulnerabilities: 5, status: 'warning', color: '#f59e0b' },
]

export default function CybersecurityDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [viewMode, setViewMode] = useState('overview')
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [securityMode, setSecurityMode] = useState('active_monitoring')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
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

  const activeIncidents = useMemo(() => 
    INCIDENT_DATA.filter(incident => incident.status !== 'resolved'),
    []
  )

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
                    All Systems Secured
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
                        <div className={`p-3 rounded-lg ${metric.color} shadow-lg`}>
                          <metric.icon className='w-6 h-6' />
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
                    99.4% Blocked
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

          {/* Active Incidents */}
          <section data-template-section='active-incidents' data-component-type='incident-list'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Incidents</CardTitle>
                    <CardDescription>Real-time security incidents</CardDescription>
                  </div>
                  <Badge className='bg-gradient-to-r from-rose-500 to-red-500'>
                    <AlertTriangle className='w-3 h-3 mr-1' />
                    {activeIncidents.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {INCIDENT_DATA.map((incident) => (
                      <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 rounded-xl border cursor-pointer ${
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
                              <div className='font-medium'>{incident.type.replace('_', ' ')}</div>
                              <div className='text-sm text-gray-400'>{incident.source}</div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <div className='text-sm text-gray-400 mt-1'>{incident.timestamp}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Security Controls & Assets */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Security Controls */}
          <section data-template-section='security-controls' data-component-type='control-panel'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Security Controls</CardTitle>
                <CardDescription>Active security measures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-emerald-500/20 rounded-lg'>
                        <ShieldCheck className='w-5 h-5 text-emerald-400' />
                      </div>
                      <div>
                        <div className='font-medium'>Threat Prevention</div>
                        <div className='text-sm text-gray-400'>Active monitoring</div>
                      </div>
                    </div>
                    <Switch checked={securityMode === 'active_monitoring'} />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <Button 
                      variant='outline' 
                      className='border-white/10 hover:border-blue-500/50'
                    >
                      <Eye className='w-4 h-4 mr-2' />
                      Monitor
                    </Button>
                    <Button 
                      variant='outline' 
                      className='border-white/10 hover:border-emerald-500/50'
                    >
                      <Shield className='w-4 h-4 mr-2' />
                      Protect
                    </Button>
                    <Button 
                      variant='outline' 
                      className='border-white/10 hover:border-amber-500/50'
                    >
                      <Activity className='w-4 h-4 mr-2' />
                      Detect
                    </Button>
                    <Button 
                      variant='outline' 
                      className='border-white/10 hover:border-rose-500/50'
                    >
                      <AlertTriangle className='w-4 h-4 mr-2' />
                      Respond
                    </Button>
                  </div>

                  <Separator className='bg-white/10' />

                  <div className='space-y-3'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-400'>Firewall Rules</span>
                      <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                        245 Active
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-400'>IPS Signatures</span>
                      <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                        1,842 Updated
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-400'>Encryption Keys</span>
                      <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                        128-bit AES
                      </Badge>
                    </div>
                  </div>
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
            </Card>
          </section>

          {/* Compliance Status */}
          <section data-template-section='compliance-status' data-component-type='compliance-grid'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Compliance Status</CardTitle>
                <CardDescription>Security framework compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { standard: 'ISO 27001', status: 'compliant', score: 98, color: 'bg-emerald-500' },
                    { standard: 'GDPR', status: 'compliant', score: 96, color: 'bg-emerald-500' },
                    { standard: 'HIPAA', status: 'warning', score: 88, color: 'bg-amber-500' },
                    { standard: 'PCI DSS', status: 'non-compliant', score: 72, color: 'bg-rose-500' },
                    { standard: 'SOC 2', status: 'compliant', score: 94, color: 'bg-emerald-500' },
                    { standard: 'NIST', status: 'in-progress', score: 85, color: 'bg-blue-500' },
                  ].map((item, i) => (
                    <div key={i} className='p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='font-medium'>{item.standard}</div>
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      </div>
                      <div className='text-2xl font-bold'>{item.score}%</div>
                      <div className='text-sm text-gray-400'>{item.status}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Network Security & Logs */}
        <section data-template-section='network-security' data-component-type='analytics-grid'>
          <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Network Security</CardTitle>
                  <CardDescription>Network traffic and security events</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Button variant='outline' className='border-white/10'>
                    <Download className='w-4 h-4 mr-2' />
                    Export Logs
                  </Button>
                  <Button variant='outline' className='border-white/10'>
                    <RefreshCw className='w-4 h-4 mr-2' />
                    Refresh
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
                    description: 'Peak throughput'
                  },
                  { 
                    label: 'Security Events', 
                    value: '1,245', 
                    change: '-8%', 
                    icon: Activity,
                    description: 'Last 24h'
                  },
                  { 
                    label: 'Packet Inspection', 
                    value: '99.8%', 
                    change: '+0.2%', 
                    icon: Eye,
                    description: 'Success rate'
                  },
                  { 
                    label: 'Response Time', 
                    value: '42ms', 
                    change: '-15%', 
                    icon: Zap,
                    description: 'Avg. response'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg'>
                        <stat.icon className='w-5 h-5' />
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