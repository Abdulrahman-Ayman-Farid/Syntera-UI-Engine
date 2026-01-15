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
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, XCircle, Clock, AlertTriangle, Play,
  TrendingUp, TrendingDown, Activity, Zap,
  Search, Download, Eye,
  BarChart3, Settings,
  TestTube, Bug, Target, Layers, Shield, Terminal, Plus
} from 'lucide-react'

// Test metrics derived from data types
const TEST_METRICS = [
  {
    id: 'total_tests',
    label: 'Total Tests',
    value: '1,842',
    change: '+128',
    status: 'increasing' as const,
    icon: TestTube,
    color: 'from-cyan-500 to-blue-500',
    format: 'count'
  },
  {
    id: 'pass_rate',
    label: 'Pass Rate',
    value: '94.2',
    unit: '%',
    change: '+2.1%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'active_suites',
    label: 'Active Suites',
    value: '24',
    change: '+3',
    status: 'increasing' as const,
    icon: Layers,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'coverage',
    label: 'Code Coverage',
    value: '87',
    unit: '%',
    change: '+4%',
    status: 'good' as const,
    icon: Shield,
    color: 'from-fuchsia-500 to-purple-500',
    format: 'percent'
  }
] as const

const TEST_SUITES = [
  { suite: 'Unit Tests', passed: 1245, failed: 45, skipped: 12, color: '#06b6d4' },
  { suite: 'Integration', passed: 324, failed: 18, skipped: 5, color: '#8b5cf6' },
  { suite: 'E2E Tests', passed: 156, failed: 8, skipped: 3, color: '#ec4899' },
  { suite: 'Performance', passed: 89, failed: 4, skipped: 1, color: '#f59e0b' },
] as const

const RECENT_TESTS = [
  {
    id: 'test-001',
    name: 'User Authentication Flow',
    suite: 'Integration',
    status: 'passed',
    duration: '2.3s',
    timestamp: '2 mins ago',
    coverage: 95,
    assertions: 42
  },
  {
    id: 'test-002',
    name: 'API Response Validation',
    suite: 'Unit Tests',
    status: 'passed',
    duration: '0.8s',
    timestamp: '5 mins ago',
    coverage: 92,
    assertions: 28
  },
  {
    id: 'test-003',
    name: 'Database Transaction',
    suite: 'Integration',
    status: 'failed',
    duration: '4.2s',
    timestamp: '8 mins ago',
    coverage: 78,
    assertions: 35
  },
  {
    id: 'test-004',
    name: 'Checkout Process E2E',
    suite: 'E2E Tests',
    status: 'passed',
    duration: '12.5s',
    timestamp: '12 mins ago',
    coverage: 88,
    assertions: 58
  },
  {
    id: 'test-005',
    name: 'Load Testing - 1000 users',
    suite: 'Performance',
    status: 'warning',
    duration: '45.2s',
    timestamp: '15 mins ago',
    coverage: 85,
    assertions: 15
  },
] as const

const TEST_ACTIVITY = [
  { hour: '00:00', passed: 120, failed: 8 },
  { hour: '04:00', passed: 145, failed: 5 },
  { hour: '08:00', passed: 210, failed: 12 },
  { hour: '12:00', passed: 185, failed: 9 },
  { hour: '16:00', passed: 198, failed: 7 },
  { hour: '20:00', passed: 165, failed: 6 },
] as const

export default function CyberpunkTestingPlatform() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [selectedSuite, setSelectedSuite] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'passed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'failed': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className='w-4 h-4' />
      case 'failed': return <XCircle className='w-4 h-4' />
      case 'warning': return <AlertTriangle className='w-4 h-4' />
      case 'running': return <Play className='w-4 h-4' />
      default: return <Clock className='w-4 h-4' />
    }
  }, [])

  const filteredTests = useMemo(() => {
    return RECENT_TESTS.filter(test => {
      const matchesSearch = searchQuery === '' || 
        test.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSuite = selectedSuite === 'all' || 
        test.suite === selectedSuite
      return matchesSearch && matchesSuite
    })
  }, [searchQuery, selectedSuite])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-cyan-500/20 bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/50'>
                <TestTube className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Cyberpunk Testing Platform</h1>
                <p className='text-cyan-400'>Automated test execution & monitoring</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-cyan-500/30 bg-gray-800 text-white shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='all'>All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/50'>
                <Play className='w-4 h-4 mr-2' />
                Run Tests
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Test Metrics Overview */}
        <section data-template-section='test-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {TEST_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-cyan-500/20 hover:shadow-lg transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-cyan-400'>{metric.label}</p>
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

        {/* Test Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Test Suite Distribution */}
          <section data-template-section='test-distribution' data-chart-type='bar' data-metrics='passed,failed,skipped'>
            <Card className='border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Test Suite Distribution</CardTitle>
                    <CardDescription className='text-gray-400'>Test results by suite</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-cyan-400/30 text-cyan-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={TEST_SUITES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='suite' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <Legend />
                    <Bar dataKey='passed' name='Passed' fill='#10b981' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='failed' name='Failed' fill='#ef4444' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='skipped' name='Skipped' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Test Activity Trends */}
          <section data-template-section='test-activity' data-chart-type='line' data-metrics='passed,failed'>
            <Card className='border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Test Activity (24h)</CardTitle>
                    <CardDescription className='text-gray-400'>Hourly test execution trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-400/30 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +18% Activity
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TEST_ACTIVITY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                    <XAxis dataKey='hour' stroke='#94a3b8' />
                    <YAxis stroke='#94a3b8' />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='passed' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Passed Tests'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='failed' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Failed Tests'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Test Browser & Controls */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Test Browser */}
          <section data-template-section='test-browser' data-component-type='test-list' className='lg:col-span-2'>
            <Card className='border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Recent Test Runs</CardTitle>
                    <CardDescription className='text-gray-400'>Latest test execution results</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search tests...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-cyan-500/30 bg-gray-700 text-white placeholder:text-gray-400'
                    />
                    <Select value={selectedSuite} onValueChange={setSelectedSuite}>
                      <SelectTrigger className='w-32 border-cyan-500/30 bg-gray-700 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Suites</SelectItem>
                        <SelectItem value='Unit Tests'>Unit Tests</SelectItem>
                        <SelectItem value='Integration'>Integration</SelectItem>
                        <SelectItem value='E2E Tests'>E2E Tests</SelectItem>
                        <SelectItem value='Performance'>Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredTests.map((test) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-cyan-500/20 rounded-xl hover:border-cyan-400/40 transition-colors cursor-pointer ${
                          selectedTest === test.id ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                        onClick={() => setSelectedTest(test.id)}
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-2'>
                              <h4 className='font-bold text-white'>{test.name}</h4>
                              <Badge className={getStatusColor(test.status)}>
                                {getStatusIcon(test.status)}
                                <span className='ml-1'>{test.status}</span>
                              </Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-400'>
                              <span className='flex items-center'>
                                <Layers className='w-3 h-3 mr-1' />
                                {test.suite}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {test.duration}
                              </span>
                              <span className='flex items-center'>
                                <Activity className='w-3 h-3 mr-1' />
                                {test.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm'>
                            <div className='flex items-center space-x-2'>
                              <span className='text-gray-400'>Coverage:</span>
                              <Progress value={test.coverage} className='h-2 w-24' />
                              <span className='text-cyan-400 font-medium'>{test.coverage}%</span>
                            </div>
                            <div className='text-gray-400'>
                              {test.assertions} assertions
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                              <Play className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                              <Download className='w-4 h-4' />
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

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Play, label: 'Run All Tests', color: 'from-emerald-500 to-teal-500' },
                    { icon: Plus, label: 'New Test Suite', color: 'from-cyan-500 to-blue-500' },
                    { icon: Terminal, label: 'Debug Console', color: 'from-purple-500 to-pink-500' },
                    { icon: Download, label: 'Export Results', color: 'from-amber-500 to-orange-500' },
                    { icon: Bug, label: 'Report Issue', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Test Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-cyan-500/30 bg-gray-700/50 hover:bg-gray-700 hover:border-cyan-400/50 text-white h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-cyan-500/20' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-400'>Test Coverage</span>
                      <span className='font-medium text-white'>87% / 90%</span>
                    </div>
                    <Progress value={96.7} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Shield className='w-5 h-5 text-emerald-400' />
                      <div>
                        <div className='font-medium text-white'>All Tests Passing</div>
                        <div className='text-sm text-emerald-400'>1,842 of 1,954 tests</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-400' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Test Statistics */}
        <section data-template-section='test-statistics' data-component-type='stats-grid'>
          <Card className='border border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Test Statistics</CardTitle>
                  <CardDescription className='text-gray-400'>Performance and quality metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-cyan-500/30 text-white'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Fastest Test', 
                    value: '0.8s', 
                    detail: 'API Response Validation',
                    icon: Zap,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Most Reliable', 
                    value: '100%', 
                    detail: 'User Authentication Flow',
                    icon: Target,
                    color: 'from-cyan-500 to-blue-500'
                  },
                  { 
                    label: 'Recent Failures', 
                    value: '8', 
                    detail: 'Last 24 hours',
                    icon: AlertTriangle,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Total Runtime', 
                    value: '2.4h', 
                    detail: 'Today\'s executions',
                    icon: Clock,
                    color: 'from-purple-500 to-pink-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-cyan-500/20 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-400'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2 text-white'>{stat.value}</div>
                    <div className='text-sm text-gray-400'>{stat.detail}</div>
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