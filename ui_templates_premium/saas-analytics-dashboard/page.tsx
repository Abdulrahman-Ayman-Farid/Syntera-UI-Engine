'use client'

import { useState, useEffect } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/ui/tooltip'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, Users, DollarSign, CreditCard,
  Activity, Zap, Globe, Smartphone, Download, Filter,
  MoreVertical, ChevronRight, Target, Shield, Clock,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react'
import { motion } from 'framer-motion'

const chartData = [
  { month: 'Jan', revenue: 42000, users: 1200, churn: 3.2 },
  { month: 'Feb', revenue: 48000, users: 1450, churn: 2.8 },
  { month: 'Mar', revenue: 52000, users: 1680, churn: 2.5 },
  { month: 'Apr', revenue: 61000, users: 1920, churn: 2.1 },
  { month: 'May', revenue: 72000, users: 2150, churn: 1.9 },
  { month: 'Jun', revenue: 85000, users: 2450, churn: 1.7 },
]

const pieData = [
  { name: 'Web', value: 65, color: '#8b5cf6' },
  { name: 'Mobile', value: 25, color: '#3b82f6' },
  { name: 'Tablet', value: 10, color: '#10b981' },
]

export default function SaasAnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [activeMetric, setActiveMetric] = useState('revenue')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const metrics = [
    { 
      label: 'Monthly Recurring Revenue', 
      value: '$85,240', 
      change: '+12.5%', 
      positive: true,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    { 
      label: 'Active Users', 
      value: '2,450', 
      change: '+8.2%', 
      positive: true,
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    { 
      label: 'Conversion Rate', 
      value: '4.8%', 
      change: '+0.3%', 
      positive: true,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-500'
    },
    { 
      label: 'Avg. Session', 
      value: '8m 24s', 
      change: '+45s', 
      positive: true,
      icon: Clock,
      color: 'bg-gradient-to-br from-amber-500 to-orange-500'
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <Activity className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  Analytics Pro
                </h1>
                <p className='text-gray-600'>Real-time SaaS metrics & insights</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='outline' className='border-gray-300 shadow-sm hover:shadow'>
                <Download className='w-4 h-4 mr-2' />
                Export
              </Button>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-32 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>Last Week</SelectItem>
                  <SelectItem value='month'>Last Month</SelectItem>
                  <SelectItem value='quarter'>Last Quarter</SelectItem>
                  <SelectItem value='year'>Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className='border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group'>
                <CardContent className='p-6 relative'>
                  <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${metric.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm text-gray-600 font-medium'>{metric.label}</p>
                      <h3 className='text-2xl font-bold mt-2'>{metric.value}</h3>
                      <div className={`flex items-center mt-2 ${metric.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {metric.positive ? (
                          <TrendingUp className='w-4 h-4 mr-1' />
                        ) : (
                          <TrendingDown className='w-4 h-4 mr-1' />
                        )}
                        <span className='text-sm font-medium'>{metric.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${metric.color} shadow-lg`}>
                      <metric.icon className='w-6 h-6 text-white' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className='border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-xl font-bold'>Revenue Growth</CardTitle>
                    <CardDescription>Monthly recurring revenue overview</CardDescription>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline' className='border-purple-200 text-purple-700'>
                      <LineChartIcon className='w-3 h-3 mr-1' />
                      Line Chart
                    </Badge>
                    <Button variant='ghost' size='icon'>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Legend />
                    </TooltipProvider>
                    <Line 
                      type='monotone' 
                      dataKey='revenue' 
                      stroke='#8b5cf6' 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Acquisition */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className='border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-xl font-bold'>User Acquisition</CardTitle>
                    <CardDescription>Platform distribution & growth</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <PieChartIcon className='w-3 h-3 mr-1' />
                    Pie Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <TooltipProvider />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='grid grid-cols-3 gap-4 mt-6'>
                  {pieData.map((platform, index) => (
                    <div key={index} className='text-center'>
                      <div className='text-2xl font-bold'>{platform.value}%</div>
                      <div className='text-sm text-gray-600'>{platform.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className='border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>Detailed Metrics</CardTitle>
              <Tabs defaultValue='performance' className='mt-4'>
                <TabsList className='bg-gray-100 p-1 rounded-lg'>
                  <TabsTrigger value='performance' className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow'>
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value='engagement' className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow'>
                    Engagement
                  </TabsTrigger>
                  <TabsTrigger value='monetization' className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow'>
                    Monetization
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[
                  { label: 'Churn Rate', value: '1.7%', target: '≤2%', status: 'good' },
                  { label: 'LTV/CAC Ratio', value: '4.2', target: '≥3', status: 'good' },
                  { label: 'ARPU', value: '$34.80', target: '$35+', status: 'warning' },
                  { label: 'NPS Score', value: '48', target: '50+', status: 'warning' },
                  { label: 'Support Tickets', value: '124', target: '≤100', status: 'bad' },
                  { label: 'Server Uptime', value: '99.98%', target: '99.9%', status: 'good' },
                ].map((metric, index) => (
                  <div key={index} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-200 transition-colors'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='font-medium text-gray-700'>{metric.label}</span>
                      <Badge variant={
                        metric.status === 'good' ? 'success' :
                        metric.status === 'warning' ? 'secondary' :
                        'destructive'
                      }>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className='text-2xl font-bold mb-2'>{metric.value}</div>
                    <div className='text-sm text-gray-600'>Target: {metric.target}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className='lg:col-span-2'
          >
            <Card className='border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>Recent Activity</CardTitle>
                <CardDescription>Latest user actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { user: 'Alex Johnson', action: 'Upgraded to Pro', time: '2 minutes ago', amount: '$49' },
                    { user: 'Sarah Chen', action: 'Cancelled subscription', time: '15 minutes ago', amount: '-$29' },
                    { user: 'Mike Rodriguez', action: 'Added team members', time: '1 hour ago', amount: '+$120' },
                    { user: 'Emma Wilson', action: 'Downloaded report', time: '3 hours ago', amount: 'Free' },
                  ].map((activity, index) => (
                    <div key={index} className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center space-x-4'>
                        <Avatar>
                          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white'>
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{activity.user}</div>
                          <div className='text-sm text-gray-600'>{activity.action}</div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>{activity.amount}</div>
                        <div className='text-sm text-gray-500'>{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className='border border-gray-200 shadow-lg hover:shadow-xl transition-shadow h-full'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Button className='w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                  <Target className='w-4 h-4 mr-2' />
                  Set Goals
                </Button>
                <Button variant='outline' className='w-full justify-start border-gray-300'>
                  <Shield className='w-4 h-4 mr-2' />
                  Security Settings
                </Button>
                <Button variant='outline' className='w-full justify-start border-gray-300'>
                  <Zap className='w-4 h-4 mr-2' />
                  Performance Boost
                </Button>
                <Button variant='outline' className='w-full justify-start border-gray-300'>
                  <Globe className='w-4 h-4 mr-2' />
                  Region Settings
                </Button>
                <Separator />
                <div className='text-center'>
                  <div className='text-sm text-gray-600 mb-2'>System Status</div>
                  <Badge className='bg-gradient-to-r from-emerald-500 to-teal-500'>
                    <Activity className='w-3 h-3 mr-1' />
                    All Systems Operational
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}