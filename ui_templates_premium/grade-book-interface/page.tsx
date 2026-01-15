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
  Plus, Search, Filter, BookOpen, GraduationCap, Award,
  TrendingUp, TrendingDown, Users, Calendar, CheckCircle,
  AlertCircle, Star, FileText, Edit, Trash2, Download,
  Upload, Settings, Bell, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'

const GRADE_METRICS = [
  {
    id: 'enrolled_students',
    label: 'Enrolled Students',
    value: '124',
    change: '+8',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    format: 'count'
  },
  {
    id: 'class_average',
    label: 'Class Average',
    value: '86.8',
    unit: '%',
    change: '+1.5%',
    status: 'good' as const,
    icon: Award,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'passing_rate',
    label: 'Passing Rate',
    value: '94',
    unit: '%',
    change: '+3%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'at_risk_students',
    label: 'At Risk Students',
    value: '7',
    change: '-2',
    status: 'decreasing' as const,
    icon: AlertCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const GRADE_LEVELS = [
  { level: 'A+ (97-100)', count: 18, percentage: 15, color: '#10b981' },
  { level: 'A (93-96)', count: 24, percentage: 19, color: '#3b82f6' },
  { level: 'B (85-92)', count: 42, percentage: 34, color: '#8b5cf6' },
  { level: 'C (75-84)', count: 28, percentage: 23, color: '#f59e0b' },
  { level: 'D/F (<75)', count: 12, percentage: 9, color: '#ef4444' },
] as const

const STUDENTS_PERFORMANCE = [
  {
    id: 'std-001',
    name: 'Sarah Anderson',
    email: 'sarah.a@school.com',
    score: 94,
    grade: 'A',
    assignments: 18,
    totalAssignments: 20,
    attendance: 96,
    recentTests: [95, 92, 94],
    status: 'excellent',
    avatar: 'SA'
  },
  {
    id: 'std-002',
    name: 'Michael Brown',
    email: 'michael.b@school.com',
    score: 88,
    grade: 'B+',
    assignments: 17,
    totalAssignments: 20,
    attendance: 94,
    recentTests: [90, 85, 89],
    status: 'good',
    avatar: 'MB'
  },
  {
    id: 'std-003',
    name: 'Emily Chen',
    email: 'emily.c@school.com',
    score: 96,
    grade: 'A+',
    assignments: 20,
    totalAssignments: 20,
    attendance: 100,
    recentTests: [98, 95, 96],
    status: 'excellent',
    avatar: 'EC'
  },
  {
    id: 'std-004',
    name: 'David Martinez',
    email: 'david.m@school.com',
    score: 82,
    grade: 'B',
    assignments: 16,
    totalAssignments: 20,
    attendance: 89,
    recentTests: [80, 83, 84],
    status: 'good',
    avatar: 'DM'
  },
  {
    id: 'std-005',
    name: 'Jessica Taylor',
    email: 'jessica.t@school.com',
    score: 91,
    grade: 'A-',
    assignments: 19,
    totalAssignments: 20,
    attendance: 98,
    recentTests: [92, 90, 91],
    status: 'excellent',
    avatar: 'JT'
  },
] as const

const ASSESSMENT_TRENDS = [
  { week: 'Week 1', quiz: 78, test: 82, homework: 85 },
  { week: 'Week 2', quiz: 81, test: 84, homework: 88 },
  { week: 'Week 3', quiz: 83, test: 86, homework: 90 },
  { week: 'Week 4', quiz: 85, test: 88, homework: 89 },
  { week: 'Week 5', quiz: 87, test: 87, homework: 92 },
  { week: 'Week 6', quiz: 86, test: 90, homework: 91 },
] as const

export default function GradeBookInterfacePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('semester')
  const [filterGrade, setFilterGrade] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [students, setStudents] = useState(STUDENTS_PERFORMANCE)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGrade = filterGrade === 'all' || student.grade === filterGrade
      return matchesSearch && matchesGrade
    })
  }, [searchQuery, filterGrade, students])

  const getStatusBadge = useCallback((status: string) => {
    const styles = {
      excellent: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      'needs-attention': 'bg-amber-100 text-amber-800 border-amber-300',
    }
    return styles[status as keyof typeof styles] || styles.good
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-pink-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg'>
                <BookOpen className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                  Grade Book Interface
                </h1>
                <p className='text-gray-600'>Student assessment & grade management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-pink-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='semester'>This Semester</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>Academic Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Add Grade
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Metrics Overview */}
        <section data-template-section='grade-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {GRADE_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-pink-200 shadow-sm hover:shadow-lg transition-all bg-white'>
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
                              : 'text-blue-600'
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
          {/* Grade Distribution */}
          <section data-template-section='grade-distribution' data-chart-type='bar' data-metrics='count,percentage'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Grade Distribution</CardTitle>
                    <CardDescription>Student performance breakdown</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-pink-300 text-pink-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Analytics
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={GRADE_LEVELS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fce7f3' />
                    <XAxis dataKey='level' stroke='#666' angle={-15} textAnchor='end' height={80} />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='count' name='Students' radius={[8, 8, 0, 0]}>
                      {GRADE_LEVELS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Assessment Trends */}
          <section data-template-section='assessment-trends' data-chart-type='line' data-metrics='quiz,test,homework'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Assessment Trends</CardTitle>
                    <CardDescription>Weekly performance tracking</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-300 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    Improving
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={ASSESSMENT_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#fce7f3' />
                    <XAxis dataKey='week' stroke='#666' />
                    <YAxis stroke='#666' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='quiz' stroke='#ec4899' strokeWidth={2} name='Quiz Avg' />
                    <Line type='monotone' dataKey='test' stroke='#8b5cf6' strokeWidth={2} name='Test Avg' />
                    <Line type='monotone' dataKey='homework' stroke='#10b981' strokeWidth={2} name='Homework Avg' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Student Performance Table */}
        <section data-template-section='student-grades' data-component-type='data-table'>
          <Card className='border border-pink-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Student Grades</CardTitle>
                  <CardDescription>Comprehensive performance overview</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search students...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48 border-pink-300'
                  />
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className='w-32 border-pink-300'>
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
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                        className='hover:bg-pink-50 transition-colors'
                      >
                        <TableCell>
                          <div className='flex items-center space-x-3'>
                            <Avatar className='bg-gradient-to-br from-pink-500 to-purple-600'>
                              <AvatarFallback className='text-white'>{student.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className='font-medium'>{student.name}</div>
                              <div className='text-sm text-gray-500'>{student.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='font-bold text-lg'>{student.score}%</div>
                        </TableCell>
                        <TableCell>
                          <Badge className='bg-gradient-to-r from-pink-500 to-purple-600 text-white'>
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm'>{student.assignments}/{student.totalAssignments}</span>
                            <Progress value={(student.assignments / student.totalAssignments) * 100} className='w-16 h-2' />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className='font-medium'>{student.attendance}%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(student.status)}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                                    <Edit className='w-4 h-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Grade</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant='ghost' size='icon' className='h-8 w-8'>
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
