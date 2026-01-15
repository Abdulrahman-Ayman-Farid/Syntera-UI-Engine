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
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  Activity, Eye, MousePointer, ShoppingCart, Search,
  Download, Settings, Bell, Filter, Calendar, FileText,
  PieChart as PieChartIcon, Target, Zap, Award
} from 'lucide-react'

// Analytics metrics with type-safe constants
const ANALYTICS_METRICS = [
  {
    id: 'total_users',
    label: 'Total Users',
    value: '54,320',
    change: '+12.5%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$2.4M',
    change: '+18.2%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
    format: 'currency'
  },
  {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    value: '3.24',
    unit: '%',
    change: '+0.8%',
    status: 'good' as const,
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'avg_session',
    label: 'Avg Session',
    value: '4',
    unit: 'm 32s',
    change: '+45s',
    status: 'good' as const,
    icon: Activity,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  }
] as const

const TRAFFIC_SOURCES = [
  { source: 'Organic Search', users: 18500, revenue: 925000, color: '#3b82f6' },
  { source: 'Direct', users: 12300, revenue: 615000, color: '#8b5cf6' },
  { source: 'Social Media', users: 9800, revenue: 490000, color: '#10b981' },
  { source: 'Referral', users: 7200, revenue: 360000, color: '#f59e0b' },
] as const

const MONTHLY_INSIGHTS = [
  { month: 'Aug', users: 42000, revenue: 1800000, sessions: 125000 },
  { month: 'Sep', users: 45500, revenue: 1950000, sessions: 138000 },
  { month: 'Oct', users: 48200, revenue: 2100000, sessions: 145000 },
  { month: 'Nov', users: 50800, revenue: 2250000, sessions: 152000 },
  { month: 'Dec', users: 52400, revenue: 2350000, sessions: 158000 },
  { month: 'Jan', users: 54320, revenue: 2400000, sessions: 165000 },
] as const

const REPORT_DATA = [
  {
    id: 'rpt-001',
    name: 'User Behavior Analysis',
    category: 'behavior',
    generated: '2 hours ago',
    insights: 12,
    status: 'ready',
    priority: 'high'
  },
  {
    id: 'rpt-002',
    name: 'Revenue Attribution Report',
    category: 'revenue',
    generated: '5 hours ago',
    insights: 8,
    status: 'ready',
    priority: 'high'
  },
  {
    id: 'rpt-003',
    name: 'Traffic Source Analysis',
    category: 'traffic',
    generated: '1 day ago',
    insights: 15,
    status: 'ready',
    priority: 'medium'
  },
  {
    id: 'rpt-004',
    name: 'Conversion Funnel Report',
    category: 'conversion',
    generated: '2 days ago',
    insights: 10,
    status: 'processing',
    priority: 'medium'
  },
] as const

export default function PremiumAnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'processing': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'error': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredReports = useMemo(() => {
    return REPORT_DATA.filter(report => {
      const matchesSearch = searchQuery === '' || 
        report.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        report.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-amber-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg'>
                <BarChart3 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Analytics Intelligence</h1>
                <p className='text-gray-600'>Enterprise-grade analytics and insights</p>
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
              <Button className='bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg'>
                <FileText className='w-4 h-4 mr-2' />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Analytics Metrics */}
        <section data-template-section='analytics-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {ANALYTICS_METRICS.map((metric) => (
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Traffic Sources */}
          <section data-template-section='traffic-sources' data-chart-type='bar' data-metrics='users,revenue'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Traffic Sources</CardTitle>
                    <CardDescription>User acquisition channels</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-200 text-amber-700'>
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={TRAFFIC_SOURCES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='source' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='users' name='Users' radius={[4, 4, 0, 0]}>
                      {TRAFFIC_SOURCES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Growth Trends */}
          <section data-template-section='growth-trends' data-chart-type='line' data-metrics='users,revenue,sessions'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Growth Trends</CardTitle>
                    <CardDescription>Monthly performance metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12.5% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={MONTHLY_INSIGHTS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='users' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Users'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='revenue' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Revenue'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Reports Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='reports-browser' data-component-type='report-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Custom Reports</CardTitle>
                    <CardDescription>Generated insights and analytics</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search reports...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='behavior'>Behavior</SelectItem>
                        <SelectItem value='revenue'>Revenue</SelectItem>
                        <SelectItem value='traffic'>Traffic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredReports.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-amber-300 transition-colors cursor-pointer ${
                          selectedReport === report.id ? 'ring-2 ring-amber-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <h4 className='font-bold text-lg'>{report.name}</h4>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                              <Badge className={getPriorityColor(report.priority)}>
                                {report.priority}
                              </Badge>
                            </div>
                            <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Calendar className='w-4 h-4 mr-2' />
                                {report.generated}
                              </span>
                              <span className='flex items-center'>
                                <Award className='w-4 h-4 mr-2' />
                                {report.insights} insights
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Button variant='outline' size='sm' className='h-8'>
                                <Eye className='w-3 h-3 mr-1' />
                                View
                              </Button>
                              <Button variant='outline' size='sm' className='h-8'>
                                <Download className='w-3 h-3 mr-1' />
                                Export
                              </Button>
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
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: FileText, label: 'New Report', color: 'from-blue-500 to-cyan-500' },
                    { icon: Target, label: 'Set Goals', color: 'from-purple-500 to-pink-500' },
                    { icon: Filter, label: 'Custom Filters', color: 'from-emerald-500 to-teal-500' },
                    { icon: PieChartIcon, label: 'Visualizations', color: 'from-amber-500 to-orange-500' },
                    { icon: Bell, label: 'Alerts', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-amber-300 h-14'
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
                      <span className='text-gray-600'>Data Processing</span>
                      <span className='font-medium'>92%</span>
                    </div>
                    <Progress value={92} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Zap className='w-5 h-5 text-amber-600' />
                      <div>
                        <div className='font-medium'>Real-time Active</div>
                        <div className='text-sm text-amber-600'>Live data streaming</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Insights Summary */}
        <section data-template-section='insights-summary' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Key Insights</CardTitle>
                  <CardDescription>Performance highlights and recommendations</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Top Source', 
                    value: 'Organic Search', 
                    metric: '18.5K users',
                    icon: Search,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Best Day', 
                    value: 'Thursday', 
                    traffic: '+24% avg',
                    icon: Calendar,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Peak Hour', 
                    value: '2:00 PM', 
                    sessions: '12.5K',
                    icon: Activity,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Cart Value', 
                    value: '$142', 
                    growth: '+8% MoM',
                    icon: ShoppingCart,
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
                      {stat.metric && stat.metric}
                      {stat.traffic && stat.traffic}
                      {stat.sessions && `${stat.sessions} sessions`}
                      {stat.growth && stat.growth}
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