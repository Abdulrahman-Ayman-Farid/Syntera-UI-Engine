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
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserPlus, Briefcase, Calendar, Award, TrendingUp,
  Clock, DollarSign, Shield, Heart, FileText, Mail,
  Search, Filter, Plus, MoreVertical, ChevronRight,
  Download, Eye, Edit, Trash2, Bell, Settings,
  PieChart as PieChartIcon, BarChart as BarChartIcon, 
  TrendingDown, CheckCircle, AlertCircle
} from 'lucide-react'

const departmentData = [
  { name: 'Engineering', employees: 42, openPositions: 3, attrition: 0.08, color: '#3b82f6' },
  { name: 'Marketing', employees: 18, openPositions: 2, attrition: 0.12, color: '#8b5cf6' },
  { name: 'Sales', employees: 24, openPositions: 4, attrition: 0.15, color: '#10b981' },
  { name: 'Design', employees: 12, openPositions: 1, attrition: 0.05, color: '#f59e0b' },
  { name: 'HR', employees: 8, openPositions: 0, attrition: 0.03, color: '#ef4444' },
]

const leaveTrends = [
  { month: 'Jan', sick: 12, vacation: 45, unpaid: 3 },
  { month: 'Feb', sick: 8, vacation: 38, unpaid: 2 },
  { month: 'Mar', sick: 15, vacation: 52, unpaid: 4 },
  { month: 'Apr', sick: 10, vacation: 40, unpaid: 3 },
  { month: 'May', sick: 7, vacation: 35, unpaid: 1 },
  { month: 'Jun', sick: 5, vacation: 28, unpaid: 2 },
]

export default function EnterpriseHRDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('quarter')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [viewMode, setViewMode] = useState('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const kpiMetrics = [
    {
      id: 'total_employees',
      label: 'Total Employees',
      value: '246',
      change: '+12',
      changeType: 'positive',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      format: 'number'
    },
    {
      id: 'open_positions',
      label: 'Open Positions',
      value: '18',
      change: '-3',
      changeType: 'positive',
      icon: UserPlus,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      format: 'number'
    },
    {
      id: 'avg_tenure',
      label: 'Avg. Tenure',
      value: '3.8',
      change: '+0.4',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      format: 'years'
    },
    {
      id: 'attrition_rate',
      label: 'Attrition Rate',
      value: '8.2',
      change: '-1.5',
      changeType: 'positive',
      icon: TrendingDown,
      color: 'bg-gradient-to-br from-amber-500 to-orange-500',
      format: 'percent'
    },
    {
      id: 'engagement_score',
      label: 'Engagement Score',
      value: '86',
      change: '+4',
      changeType: 'positive',
      icon: Heart,
      color: 'bg-gradient-to-br from-rose-500 to-red-500',
      format: 'score'
    },
    {
      id: 'training_hours',
      label: 'Training Hours',
      value: '1,240',
      change: '+156',
      changeType: 'positive',
      icon: Award,
      color: 'bg-gradient-to-br from-violet-500 to-purple-500',
      format: 'hours'
    },
  ]

  const upcomingEvents = [
    { id: 1, title: 'Quarterly Review', date: '2024-01-25', type: 'meeting', participants: 24 },
    { id: 2, title: 'Diversity Workshop', date: '2024-01-28', type: 'training', participants: 18 },
    { id: 3, title: 'Performance Appraisal', date: '2024-02-01', type: 'deadline', participants: 246 },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>HR Insight Pro</h1>
                <p className='text-slate-600'>Enterprise workforce analytics</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='month'>Last Month</SelectItem>
                  <SelectItem value='quarter'>Last Quarter</SelectItem>
                  <SelectItem value='year'>Last Year</SelectItem>
                  <SelectItem value='custom'>Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* KPI Metrics Grid */}
        <section data-template-section='kpi-metrics'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {kpiMetrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-slate-900'>{metric.value}</span>
                            {metric.format === 'percent' && (
                              <span className='text-sm text-slate-500'>%</span>
                            )}
                            {metric.format === 'years' && (
                              <span className='text-sm text-slate-500'>years</span>
                            )}
                            {metric.format === 'score' && (
                              <span className='text-sm text-slate-500'>/100</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {metric.changeType === 'positive' ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            )}
                            {metric.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${metric.color} shadow-lg`}>
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

        {/* Charts & Visualizations */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Department Distribution */}
          <section data-template-section='department-chart' data-chart-type='pie'>
            <Card className='h-full border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Department Distribution</CardTitle>
                    <CardDescription>Employee count by department</CardDescription>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline' className='border-blue-200 text-blue-700'>
                      <PieChartIcon className='w-3 h-3 mr-1' />
                      Pie Chart
                    </Badge>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className='w-32 border-slate-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Departments</SelectItem>
                        <SelectItem value='engineering'>Engineering</SelectItem>
                        <SelectItem value='marketing'>Marketing</SelectItem>
                        <SelectItem value='sales'>Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='employees'
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Leave Trends */}
          <section data-template-section='leave-trends' data-chart-type='stacked-bar'>
            <Card className='h-full border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Leave Trends</CardTitle>
                    <CardDescription>Monthly leave patterns analysis</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChartIcon className='w-3 h-3 mr-1' />
                    Stacked Bar
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={leaveTrends}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='vacation' stackId='a' fill='#10b981' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='sick' stackId='a' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='unpaid' stackId='a' fill='#ef4444' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Talent Management */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Upcoming Events */}
          <section data-template-section='upcoming-events'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Upcoming Events</CardTitle>
                <CardDescription>Calendar of HR activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors'>
                      <div className='flex items-center space-x-4'>
                        <div className={`p-3 rounded-lg ${
                          event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                          event.type === 'training' ? 'bg-purple-100 text-purple-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {event.type === 'meeting' ? <Users className='w-5 h-5' /> :
                           event.type === 'training' ? <Award className='w-5 h-5' /> :
                           <FileText className='w-5 h-5' />}
                        </div>
                        <div>
                          <h4 className='font-medium'>{event.title}</h4>
                          <div className='flex items-center space-x-4 text-sm text-slate-600 mt-1'>
                            <span className='flex items-center'>
                              <Calendar className='w-3 h-3 mr-1' />
                              {event.date}
                            </span>
                            <span className='flex items-center'>
                              <Users className='w-3 h-3 mr-1' />
                              {event.participants}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant='ghost' size='icon'>
                        <ChevronRight className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Performance Ratings */}
          <section data-template-section='performance-ratings' data-chart-type='radar'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Performance Ratings</CardTitle>
                <CardDescription>Quarterly performance distribution</CardDescription>
              </CardHeader>
              <CardContent className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <RadarChart data={[
                    { subject: 'Quality', A: 86, B: 80 },
                    { subject: 'Productivity', A: 92, B: 85 },
                    { subject: 'Collaboration', A: 78, B: 75 },
                    { subject: 'Innovation', A: 88, B: 82 },
                    { subject: 'Leadership', A: 84, B: 78 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey='subject' />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name='Q4 2023' dataKey='A' stroke='#3b82f6' fill='#3b82f6' fillOpacity={0.6} />
                    <Radar name='Q3 2023' dataKey='B' stroke='#8b5cf6' fill='#8b5cf6' fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section data-template-section='quick-actions'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: UserPlus, label: 'Onboard New Hire', color: 'from-blue-500 to-cyan-500' },
                    { icon: FileText, label: 'Generate Reports', color: 'from-purple-500 to-pink-500' },
                    { icon: Mail, label: 'Send Announcements', color: 'from-emerald-500 to-teal-500' },
                    { icon: Shield, label: 'Update Policies', color: 'from-amber-500 to-orange-500' },
                    { icon: Download, label: 'Export Data', color: 'from-rose-500 to-red-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-slate-300 hover:border-blue-300'
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-4 h-4 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Employee Directory Preview */}
        <section data-template-section='employee-directory'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recent Hires</CardTitle>
                  <CardDescription>New employees in the last 30 days</CardDescription>
                </div>
                <Button variant='outline' className='border-slate-300'>
                  View All
                  <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { name: 'Alex Johnson', role: 'Senior Engineer', department: 'Engineering', startDate: '2024-01-15' },
                  { name: 'Sarah Chen', role: 'Marketing Lead', department: 'Marketing', startDate: '2024-01-10' },
                  { name: 'Mike Rodriguez', role: 'Sales Executive', department: 'Sales', startDate: '2024-01-05' },
                  { name: 'Emma Wilson', role: 'UI Designer', department: 'Design', startDate: '2024-01-02' },
                ].map((employee, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors'>
                    <div className='flex items-center space-x-4 mb-4'>
                      <Avatar className='w-12 h-12'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-cyan-500 text-white'>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className='font-bold'>{employee.name}</h4>
                        <p className='text-sm text-slate-600'>{employee.role}</p>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-slate-600'>Department</span>
                        <Badge variant='outline' className='border-slate-300'>
                          {employee.department}
                        </Badge>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-slate-600'>Start Date</span>
                        <span className='font-medium'>{employee.startDate}</span>
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