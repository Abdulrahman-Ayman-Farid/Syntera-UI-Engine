'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, BookOpen, Award, TrendingUp, TrendingDown,
  Users, CheckCircle, AlertCircle, Star, FileText, Edit,
  Download, Upload, Settings, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'

const PREMIUM_METRICS = [
  {
    id: 'total_students',
    label: 'Total Students',
    value: '186',
    change: '+14',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-[#2D0C57] to-[#00BFFF]',
    format: 'count'
  },
  {
    id: 'class_average',
    label: 'Class Average',
    value: '87.2',
    unit: '%',
    change: '+2.1%',
    status: 'good' as const,
    icon: Award,
    color: 'from-[#00BFFF] to-[#2D0C57]',
    format: 'percent'
  },
  {
    id: 'excellence_rate',
    label: 'Excellence Rate',
    value: '38',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'improvement_trend',
    label: 'Improvement',
    value: '+6.8',
    unit: 'pts',
    change: '+1.2',
    status: 'increasing' as const,
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    format: 'points'
  }
] as const

const GRADE_BREAKDOWN = [
  { grade: 'A (90-100)', count: 71, percentage: 38, color: '#10b981' },
  { grade: 'B (80-89)', count: 65, percentage: 35, color: '#3b82f6' },
  { grade: 'C (70-79)', count: 35, percentage: 19, color: '#f59e0b' },
  { grade: 'D/F (<70)', count: 15, percentage: 8, color: '#ef4444' },
] as const

const PREMIUM_STUDENTS = [
  {
    id: 'pstd-001',
    name: 'Alexander Thompson',
    email: 'alex.t@premium.edu',
    score: 95,
    grade: 'A',
    assignments: 22,
    totalAssignments: 24,
    attendance: 98,
    participation: 95,
    status: 'excellent',
    avatar: 'AT',
    trend: 'up'
  },
  {
    id: 'pstd-002',
    name: 'Isabella Martinez',
    email: 'isabella.m@premium.edu',
    score: 92,
    grade: 'A',
    assignments: 23,
    totalAssignments: 24,
    attendance: 100,
    participation: 98,
    status: 'excellent',
    avatar: 'IM',
    trend: 'up'
  },
  {
    id: 'pstd-003',
    name: 'Ethan Williams',
    email: 'ethan.w@premium.edu',
    score: 88,
    grade: 'B+',
    assignments: 21,
    totalAssignments: 24,
    attendance: 96,
    participation: 90,
    status: 'good',
    avatar: 'EW',
    trend: 'stable'
  },
  {
    id: 'pstd-004',
    name: 'Sophia Garcia',
    email: 'sophia.g@premium.edu',
    score: 91,
    grade: 'A-',
    assignments: 22,
    totalAssignments: 24,
    attendance: 97,
    participation: 93,
    status: 'excellent',
    avatar: 'SG',
    trend: 'up'
  },
  {
    id: 'pstd-005',
    name: 'Benjamin Lee',
    email: 'benjamin.l@premium.edu',
    score: 84,
    grade: 'B',
    assignments: 20,
    totalAssignments: 24,
    attendance: 94,
    participation: 85,
    status: 'good',
    avatar: 'BL',
    trend: 'down'
  },
] as const

const PERFORMANCE_TIMELINE = [
  { period: 'Aug', average: 82, excellence: 32, improvement: 0 },
  { period: 'Sep', average: 83, excellence: 34, improvement: 1 },
  { period: 'Oct', average: 85, excellence: 35, improvement: 3 },
  { period: 'Nov', average: 86, excellence: 36, improvement: 4 },
  { period: 'Dec', average: 87, excellence: 38, improvement: 5 },
  { period: 'Jan', average: 87, excellence: 38, improvement: 5 },
] as const

export default function PremiumGradeBookPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('semester')
  const [filterGrade, setFilterGrade] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [students, setStudents] = useState(PREMIUM_STUDENTS)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGrade = filterGrade === 'all' || student.grade.startsWith(filterGrade)
      return matchesSearch && matchesGrade
    })
  }, [searchQuery, filterGrade, students])

  const getStatusColor = useCallback((status: string) => {
    const colors = {
      excellent: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      'needs-improvement': 'bg-amber-100 text-amber-800 border-amber-300',
    }
    return colors[status as keyof typeof colors] || colors.good
  }, [])

  const getTrendIcon = useCallback((trend: string) => {
    if (trend === 'up') return <TrendingUp className='w-4 h-4 text-emerald-500' />
    if (trend === 'down') return <TrendingDown className='w-4 h-4 text-rose-500' />
    return <span className='w-4 h-4' />
  }, [])

  return (
    <div className='min-h-screen bg-[#121212]'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-[#2D0C57]/50 bg-gradient-to-r from-[#2D0C57] to-[#00BFFF] shadow-2xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-white rounded-xl shadow-lg'>
                <BookOpen className='w-8 h-8 text-[#2D0C57]' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Premium Grade Book</h1>
                <p className='text-[#E0E0E0]'>Advanced student performance analytics</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-white/30 shadow-sm bg-white/10 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='semester'>This Semester</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>Academic Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-white text-[#2D0C57] hover:bg-[#E0E0E0] shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Student
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Premium Metrics */}
        <section data-template-section='premium-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PREMIUM_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className='h-full border border-[#2D0C57]/30 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-[#1a1a1a] to-[#2D0C57]/20'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-[#E0E0E0]'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-[#E0E0E0]'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : 'text-blue-400'
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
          {/* Grade Breakdown */}
          <section data-template-section='grade-breakdown' data-chart-type='bar' data-metrics='count,percentage'>
            <Card className='border border-[#2D0C57]/30 shadow-xl bg-gradient-to-br from-[#1a1a1a] to-[#2D0C57]/20'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Grade Breakdown</CardTitle>
                    <CardDescription className='text-[#E0E0E0]'>Distribution analysis</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-[#00BFFF] text-[#00BFFF]'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Analytics
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={GRADE_BREAKDOWN}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#2D0C57' opacity={0.3} />
                    <XAxis dataKey='grade' stroke='#E0E0E0' />
                    <YAxis stroke='#E0E0E0' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #2D0C57',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Students' radius={[8, 8, 0, 0]}>
                      {GRADE_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Performance Timeline */}
          <section data-template-section='performance-timeline' data-chart-type='line' data-metrics='average,excellence,improvement'>
            <Card className='border border-[#2D0C57]/30 shadow-xl bg-gradient-to-br from-[#1a1a1a] to-[#2D0C57]/20'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Performance Timeline</CardTitle>
                    <CardDescription className='text-[#E0E0E0]'>Monthly trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Improving
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PERFORMANCE_TIMELINE}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#2D0C57' opacity={0.3} />
                    <XAxis dataKey='period' stroke='#E0E0E0' />
                    <YAxis stroke='#E0E0E0' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #2D0C57',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='average' stroke='#00BFFF' strokeWidth={3} name='Class Average' />
                    <Line type='monotone' dataKey='excellence' stroke='#10b981' strokeWidth={3} name='Excellence %' />
                    <Line type='monotone' dataKey='improvement' stroke='#8b5cf6' strokeWidth={3} name='Improvement' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Student Performance Table */}
        <section data-template-section='student-performance' data-component-type='data-table'>
          <Card className='border border-[#2D0C57]/30 shadow-xl bg-gradient-to-br from-[#1a1a1a] to-[#2D0C57]/20'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-white'>Student Performance</CardTitle>
                  <CardDescription className='text-[#E0E0E0]'>Detailed academic records</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search students...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-[#2D0C57]/30 bg-[#1a1a1a] text-white placeholder:text-gray-500'
                  />
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className='w-32 border-[#2D0C57]/30 bg-[#1a1a1a] text-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Grades</SelectItem>
                      <SelectItem value='A'>A Grade</SelectItem>
                      <SelectItem value='B'>B Grade</SelectItem>
                      <SelectItem value='C'>C Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-[#2D0C57]/30'>
                    <TableHead className='text-[#E0E0E0]'>Student</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Score</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Grade</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Assignments</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Attendance</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Participation</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Trend</TableHead>
                    <TableHead className='text-[#E0E0E0]'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredStudents.map((student) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='border-[#2D0C57]/30 hover:bg-[#2D0C57]/10 transition-colors'
                      >
                        <TableCell>
                          <div className='flex items-center space-x-3'>
                            <Avatar className='bg-gradient-to-br from-[#2D0C57] to-[#00BFFF]'>
                              <AvatarFallback className='text-white'>{student.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className='font-medium text-white'>{student.name}</div>
                              <div className='text-sm text-[#E0E0E0]'>{student.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-white font-bold text-lg'>{student.score}%</TableCell>
                        <TableCell>
                          <Badge className='bg-gradient-to-r from-[#2D0C57] to-[#00BFFF] text-white'>
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-white'>{student.assignments}/{student.totalAssignments}</span>
                            <Progress value={(student.assignments / student.totalAssignments) * 100} className='w-16 h-2' />
                          </div>
                        </TableCell>
                        <TableCell className='text-white font-medium'>{student.attendance}%</TableCell>
                        <TableCell className='text-white font-medium'>{student.participation}%</TableCell>
                        <TableCell>
                          <div className='flex items-center justify-center'>
                            {getTrendIcon(student.trend)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant='ghost' size='icon' className='h-8 w-8 text-[#00BFFF] hover:text-white'>
                                    <Edit className='w-4 h-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Record</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant='ghost' size='icon' className='h-8 w-8 text-[#00BFFF] hover:text-white'>
                                    <FileText className='w-4 h-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
      </main>
    </div>
  )
}
