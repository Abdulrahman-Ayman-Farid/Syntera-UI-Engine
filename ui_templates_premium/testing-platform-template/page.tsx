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
  CheckCircle2, XCircle, Clock, AlertTriangle, PlayCircle,
  TrendingUp, TrendingDown, Activity, Zap,
  Search, Download, Eye,
  BarChart3, Settings,
  TestTube2, Bug, Target, Layers, Shield, Terminal, Plus,
  Beaker, FlaskConical
} from 'lucide-react'

// Test platform metrics
const TEST_PLATFORM_METRICS = [
  {
    id: 'test_cases',
    label: 'Test Cases',
    value: '2,145',
    change: '+156',
    status: 'increasing' as const,
    icon: TestTube2,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'success_rate',
    label: 'Success Rate',
    value: '96.8',
    unit: '%',
    change: '+1.2%',
    status: 'good' as const,
    icon: CheckCircle2,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'test_suites',
    label: 'Test Suites',
    value: '48',
    change: '+6',
    status: 'increasing' as const,
    icon: Layers,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'avg_duration',
    label: 'Avg Duration',
    value: '4.2',
    unit: 's',
    change: '-0.8s',
    status: 'good' as const,
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  }
] as const

const TEST_EXECUTION = [
  { category: 'Unit', passed: 1524, failed: 28, skipped: 15 },
  { category: 'Integration', passed: 452, failed: 12, skipped: 8 },
  { category: 'E2E', passed: 189, failed: 6, skipped: 4 },
  { category: 'Load', passed: 98, failed: 3, skipped: 2 },
] as const

const TEST_TRENDS = [
  { day: 'Mon', passed: 185, failed: 12 },
  { day: 'Tue', passed: 198, failed: 8 },
  { day: 'Wed', passed: 212, failed: 15 },
  { day: 'Thu', passed: 195, failed: 9 },
  { day: 'Fri', passed: 208, failed: 7 },
  { day: 'Sat', passed: 176, failed: 11 },
  { day: 'Sun', passed: 165, failed: 6 },
] as const

const RECENT_TEST_RUNS = [
  {
    id: 'run-001',
    name: 'User Auth Suite',
    category: 'Integration',
    status: 'passed',
    duration: '3.2s',
    timestamp: '3 mins ago',
    cases: 45,
    passed: 45,
    failed: 0
  },
  {
    id: 'run-002',
    name: 'API Validation',
    category: 'Unit',
    status: 'passed',
    duration: '1.8s',
    timestamp: '7 mins ago',
    cases: 68,
    passed: 67,
    failed: 1
  },
  {
    id: 'run-003',
    name: 'Payment Processing',
    category: 'Integration',
    status: 'failed',
    duration: '5.4s',
    timestamp: '12 mins ago',
    cases: 32,
    passed: 28,
    failed: 4
  },
  {
    id: 'run-004',
    name: 'UI Components',
    category: 'E2E',
    status: 'passed',
    duration: '15.6s',
    timestamp: '18 mins ago',
    cases: 52,
    passed: 52,
    failed: 0
  },
  {
    id: 'run-005',
    name: 'Performance Tests',
    category: 'Load',
    status: 'warning',
    duration: '45.2s',
    timestamp: '25 mins ago',
    cases: 12,
    passed: 10,
    failed: 2
  },
] as const

export default function TestingPlatformTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRun, setSelectedRun] = useState<string | null>(null)

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
      case 'passed': return <CheckCircle2 className='w-4 h-4' />
      case 'failed': return <XCircle className='w-4 h-4' />
      case 'warning': return <AlertTriangle className='w-4 h-4' />
      case 'running': return <PlayCircle className='w-4 h-4' />
      default: return <Clock className='w-4 h-4' />
    }
  }, [])

  const filteredRuns = useMemo(() => {
    return RECENT_TEST_RUNS.filter(run => {
      const matchesSearch = searchQuery === '' || 
        run.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        run.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-blue-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg'>
                <FlaskConical className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Test Platform</h1>
                <p className='text-blue-600'>Comprehensive testing dashboard</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-blue-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='all'>All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg'>
                <PlayCircle className='w-4 h-4 mr-2' />
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
              {TEST_PLATFORM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-blue-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-blue-700'>{metric.label}</p>
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
                            {metric.change.startsWith('+') || metric.change.startsWith('-') ? (
                              metric.change.startsWith('+') ? <TrendingUp className='w-4 h-4 mr-1' /> : <TrendingDown className='w-4 h-4 mr-1' />
                            ) : null}
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
          {/* Test Execution */}
          <section data-template-section='test-execution' data-chart-type='bar' data-metrics='passed,failed,skipped'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Test Execution</CardTitle>
                    <CardDescription>Results by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-300 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={TEST_EXECUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e7ff' />
                    <XAxis dataKey='category' stroke='#6b7280' />
                    <YAxis stroke='#6b7280' />
                    <Legend />
                    <Bar dataKey='passed' name='Passed' fill='#10b981' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='failed' name='Failed' fill='#ef4444' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='skipped' name='Skipped' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Test Trends */}
          <section data-template-section='test-trends' data-chart-type='line' data-metrics='passed,failed'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Weekly Trends</CardTitle>
                    <CardDescription>Daily test results</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-300 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12% Success
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TEST_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e0e7ff' />
                    <XAxis dataKey='day' stroke='#6b7280' />
                    <YAxis stroke='#6b7280' />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='passed' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Passed'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='failed' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Failed'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Test Runs Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='test-runs' data-component-type='run-list' className='lg:col-span-2'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Test Runs</CardTitle>
                    <CardDescription>Latest execution results</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search runs...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-blue-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-blue-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='Unit'>Unit</SelectItem>
                        <SelectItem value='Integration'>Integration</SelectItem>
                        <SelectItem value='E2E'>E2E</SelectItem>
                        <SelectItem value='Load'>Load</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredRuns.map((run) => (
                      <motion.div
                        key={run.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer ${
                          selectedRun === run.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedRun(run.id)}
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-2'>
                              <h4 className='font-bold text-gray-900'>{run.name}</h4>
                              <Badge className={getStatusColor(run.status)}>
                                {getStatusIcon(run.status)}
                                <span className='ml-1'>{run.status}</span>
                              </Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600'>
                              <span className='flex items-center'>
                                <Layers className='w-3 h-3 mr-1' />
                                {run.category}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {run.duration}
                              </span>
                              <span className='flex items-center'>
                                <Activity className='w-3 h-3 mr-1' />
                                {run.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4 text-sm'>
                            <div className='flex items-center space-x-2'>
                              <span className='text-gray-600'>Cases:</span>
                              <span className='text-emerald-600 font-medium'>{run.passed}/{run.cases}</span>
                            </div>
                            <Progress value={(run.passed / run.cases) * 100} className='h-2 w-24' />
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <PlayCircle className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
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
            <Card className='border border-blue-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: PlayCircle, label: 'Run All Tests', color: 'from-emerald-500 to-teal-500' },
                    { icon: Plus, label: 'New Test Suite', color: 'from-blue-500 to-cyan-500' },
                    { icon: Terminal, label: 'Test Console', color: 'from-purple-500 to-pink-500' },
                    { icon: Download, label: 'Export Results', color: 'from-amber-500 to-orange-500' },
                    { icon: Bug, label: 'Report Bug', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-blue-300 hover:border-blue-400 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Success Rate</span>
                      <span className='font-medium'>96.8%</span>
                    </div>
                    <Progress value={96.8} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Shield className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium'>All Systems OK</div>
                        <div className='text-sm text-emerald-600'>2,145 test cases</div>
                      </div>
                    </div>
                    <CheckCircle2 className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Test Statistics */}
        <section data-template-section='test-statistics' data-component-type='stats-grid'>
          <Card className='border border-blue-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Test Statistics</CardTitle>
                  <CardDescription>Performance insights</CardDescription>
                </div>
                <Button variant='outline' className='border-blue-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Fastest Suite', 
                    value: '1.8s', 
                    detail: 'API Validation',
                    icon: Zap,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Most Reliable', 
                    value: '100%', 
                    detail: 'UI Components',
                    icon: Target,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Failed Tests', 
                    value: '7', 
                    detail: 'Last 24 hours',
                    icon: AlertTriangle,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Total Runtime', 
                    value: '1.8h', 
                    detail: 'Today',
                    icon: Clock,
                    color: 'from-purple-500 to-pink-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>{stat.detail}</div>
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

export default TestPlatformDashboard