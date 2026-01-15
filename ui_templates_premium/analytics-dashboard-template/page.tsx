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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, TrendingUp, TrendingDown, Activity, Target, Eye,
  UserPlus, Clock, Zap, BarChart3, PieChart as PieChartIcon,
  Filter, Download, Plus, Search, RefreshCw, Settings,
  Bell, MoreVertical, ArrowUpRight, CheckCircle, AlertCircle
} from 'lucide-react'

// Type-safe metrics with as const
const ANALYTICS_METRICS = [
  {
    id: 'total_users',
    label: 'Total Users',
    value: '12,450',
    change: '+15.3%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'active_sessions',
    label: 'Active Sessions',
    value: '3,842',
    change: '+8.2%',
    status: 'increasing' as const,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'engagement_rate',
    label: 'Engagement Rate',
    value: '68.4',
    unit: '%',
    change: '+4.1%',
    status: 'good' as const,
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'avg_session_time',
    label: 'Avg. Session Time',
    value: '8m 24s',
    change: '+45s',
    status: 'increasing' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  }
] as const

const USER_ENGAGEMENT_DATA = [
  { month: 'Jan', users: 1200, sessions: 3400, pageViews: 12500 },
  { month: 'Feb', users: 1450, sessions: 4100, pageViews: 14800 },
  { month: 'Mar', users: 1680, sessions: 4850, pageViews: 17200 },
  { month: 'Apr', users: 1920, sessions: 5600, pageViews: 19800 },
  { month: 'May', users: 2150, sessions: 6300, pageViews: 22400 },
  { month: 'Jun', users: 2450, sessions: 7200, pageViews: 25600 },
] as const

const TRAFFIC_SOURCES = [
  { source: 'Direct', visitors: 4250, percentage: 35, color: '#6D28D9' },
  { source: 'Organic Search', visitors: 3650, percentage: 30, color: '#3B82F6' },
  { source: 'Social Media', visitors: 2430, percentage: 20, color: '#10B981' },
  { source: 'Referral', visitors: 1820, percentage: 15, color: '#F59E0B' },
] as const

const RECENT_ACTIVITIES = [
  {
    id: 'activity-001',
    user: 'Alex Johnson',
    action: 'Completed onboarding',
    time: '2 minutes ago',
    type: 'success',
    avatar: 'AJ'
  },
  {
    id: 'activity-002',
    user: 'Sarah Chen',
    action: 'Started free trial',
    time: '15 minutes ago',
    type: 'info',
    avatar: 'SC'
  },
  {
    id: 'activity-003',
    user: 'Mike Rodriguez',
    action: 'Upgraded to Pro plan',
    time: '1 hour ago',
    type: 'success',
    avatar: 'MR'
  },
  {
    id: 'activity-004',
    user: 'Emma Wilson',
    action: 'Downloaded report',
    time: '3 hours ago',
    type: 'info',
    avatar: 'EW'
  },
] as const

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredActivities = useMemo(() => {
    return RECENT_ACTIVITIES.filter(activity => {
      const matchesSearch = searchQuery === '' || 
        activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterType === 'all' || activity.type === filterType
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <BarChart3 className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Analytics Pro</h1>
                <p className='text-gray-600'>Enterprise-grade metrics & insights</p>
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
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                <Download className='w-4 h-4 mr-2' />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* KPI Overview */}
        <section data-template-section='kpi-overview' data-component-type='kpi-grid'>
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
          {/* User Engagement Trends */}
          <section data-template-section='engagement-trends' data-chart-type='line' data-metrics='users,sessions,pageViews'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>User Engagement</CardTitle>
                    <CardDescription>Monthly user activity trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +28% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={USER_ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='users' 
                      stroke='#6D28D9' 
                      strokeWidth={2}
                      name='Users'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='sessions' 
                      stroke='#3B82F6' 
                      strokeWidth={2}
                      name='Sessions'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Traffic Sources */}
          <section data-template-section='traffic-sources' data-chart-type='bar' data-metrics='visitors,percentage'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Traffic Sources</CardTitle>
                    <CardDescription>Visitor distribution by channel</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
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
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='visitors' name='Visitors' radius={[4, 4, 0, 0]}>
                      {TRAFFIC_SOURCES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Activity Feed & Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Activity Feed */}
          <section data-template-section='activity-feed' data-component-type='activity-list' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Activities</CardTitle>
                    <CardDescription>Latest user actions and events</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search activities...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                    />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='success'>Success</SelectItem>
                        <SelectItem value='info'>Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <AnimatePresence>
                    {filteredActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-300 transition-colors'
                      >
                        <div className='flex items-center space-x-4'>
                          <Avatar>
                            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white'>
                              {activity.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-bold'>{activity.user}</div>
                            <div className='text-sm text-gray-600'>{activity.action}</div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-4'>
                          <span className='text-sm text-gray-600'>{activity.time}</span>
                          {activity.type === 'success' ? (
                            <CheckCircle className='w-5 h-5 text-emerald-500' />
                          ) : (
                            <AlertCircle className='w-5 h-5 text-blue-500' />
                          )}
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
                    { icon: Target, label: 'Set Goals', color: 'from-blue-500 to-cyan-500' },
                    { icon: RefreshCw, label: 'Refresh Data', color: 'from-purple-500 to-pink-500' },
                    { icon: Filter, label: 'Advanced Filters', color: 'from-emerald-500 to-teal-500' },
                    { icon: Download, label: 'Export CSV', color: 'from-amber-500 to-orange-500' },
                    { icon: Bell, label: 'Notifications', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-purple-300 h-14'
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
                      <span className='text-gray-600'>Goal Progress</span>
                      <span className='font-medium'>68% of target</span>
                    </div>
                    <Progress value={68} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Zap className='w-5 h-5 text-purple-600' />
                      <div>
                        <div className='font-medium'>System Status</div>
                        <div className='text-sm text-purple-600'>All systems operational</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Performance Analytics */}
        <section data-template-section='performance-analytics' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Performance Analytics</CardTitle>
                  <CardDescription>Detailed metrics and insights</CardDescription>
                </div>
                <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
                  <TabsList>
                    <TabsTrigger value='users'>Users</TabsTrigger>
                    <TabsTrigger value='engagement'>Engagement</TabsTrigger>
                    <TabsTrigger value='conversion'>Conversion</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'New Users', 
                    value: '1,234', 
                    trend: '+15.3%',
                    icon: UserPlus,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Page Views', 
                    value: '25,600', 
                    trend: '+12.8%',
                    icon: Eye,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Bounce Rate', 
                    value: '32.4%', 
                    trend: '-2.1%',
                    icon: Activity,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Goal Completion', 
                    value: '892', 
                    trend: '+24.5%',
                    icon: Target,
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
                    <div className='flex items-center text-sm text-emerald-600'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      {stat.trend}
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

export default AnalyticsDashboard
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>Active Users</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>876</span>
          </CardContent>
        </Card>

        <Card className='shadow-xl rounded-2xl overflow-hidden bg-gradient-to-tl from-indigo-600 via-peach-300 to-indigo-400 animate-morph'>
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>New Signups</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>123</span>
          </CardContent>
        </Card>

        <Card className='shadow-xl rounded-2xl overflow-hidden bg-gradient-to-tl from-indigo-600 via-peach-300 to-indigo-400 animate-morph'>
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>Churn Rate</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>5%</span>
          </CardContent>
        </Card>

        <Card className='col-span-full shadow-xl rounded-2xl overflow-hidden bg-white'>
          <CardHeader className='p-6'>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            {isLoading ? (
              <Skeleton className='h-20 w-full' />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice((currentPage - 1) * 5, currentPage * 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant='default'>Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='outline' disabled={currentPage === 1} onClick={handlePrevPage}>Previous</Button>
              <Button variant='outline' disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 z-50 bg-black opacity-50' />n          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-full p-6 shadow-xl rounded-2xl bg-white'>
            <Dialog.Title className='text-2xl font-bold'>Add New User</Dialog.Title>
            <form className='space-y-4 mt-4'>
              <Input placeholder='Name' required />
              <Input placeholder='Email' required />
              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button type='submit' className='w-full'>Submit</Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <footer className='p-4 text-center'>
        <p>&copy; 2023 Premium Analytics Inc.</p>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;