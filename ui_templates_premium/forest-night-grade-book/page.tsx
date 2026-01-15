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
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, BookOpen, GraduationCap, Award,
  TrendingUp, TrendingDown, Users, Calendar, CheckCircle,
  AlertTriangle, Star, FileText, Edit, Trash2, Download,
  Upload, Settings, Bell, MoreVertical, BarChart3
} from 'lucide-react'

// Student performance metrics
const STUDENT_METRICS = [
  {
    id: 'total_students',
    label: 'Total Students',
    value: '156',
    change: '+12',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'average_grade',
    label: 'Average Grade',
    value: '85.4',
    unit: '%',
    change: '+2.3%',
    status: 'good' as const,
    icon: Award,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  },
  {
    id: 'assignments_due',
    label: 'Assignments Due',
    value: '8',
    change: '-3',
    status: 'decreasing' as const,
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '92',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  }
] as const

const GRADE_DISTRIBUTION = [
  { grade: 'A', count: 42, percentage: 27, color: '#10b981' },
  { grade: 'B', count: 58, percentage: 37, color: '#3b82f6' },
  { grade: 'C', count: 36, percentage: 23, color: '#f59e0b' },
  { grade: 'D', count: 15, percentage: 10, color: '#ef4444' },
  { grade: 'F', count: 5, percentage: 3, color: '#dc2626' },
] as const

const STUDENTS_DATA = [
  {
    id: 'student-001',
    name: 'Emma Wilson',
    email: 'emma.wilson@school.edu',
    grade: 'A',
    score: 94,
    attendance: 98,
    assignments: { completed: 18, total: 20 },
    status: 'excellent',
    avatar: '👩‍🎓'
  },
  {
    id: 'student-002',
    name: 'James Chen',
    email: 'james.chen@school.edu',
    grade: 'B+',
    score: 88,
    attendance: 95,
    assignments: { completed: 17, total: 20 },
    status: 'good',
    avatar: '👨‍🎓'
  },
  {
    id: 'student-003',
    name: 'Sofia Rodriguez',
    email: 'sofia.r@school.edu',
    grade: 'A-',
    score: 91,
    attendance: 100,
    assignments: { completed: 19, total: 20 },
    status: 'excellent',
    avatar: '👩‍🎓'
  },
  {
    id: 'student-004',
    name: 'Marcus Johnson',
    email: 'marcus.j@school.edu',
    grade: 'B',
    score: 85,
    attendance: 92,
    assignments: { completed: 16, total: 20 },
    status: 'good',
    avatar: '👨‍🎓'
  },
  {
    id: 'student-005',
    name: 'Aisha Patel',
    email: 'aisha.patel@school.edu',
    grade: 'A',
    score: 96,
    attendance: 100,
    assignments: { completed: 20, total: 20 },
    status: 'excellent',
    avatar: '👩‍🎓'
  },
] as const

const PERFORMANCE_TRENDS = [
  { month: 'Sep', average: 78, attendance: 92, completion: 85 },
  { month: 'Oct', average: 81, attendance: 94, completion: 88 },
  { month: 'Nov', average: 83, attendance: 93, completion: 90 },
  { month: 'Dec', average: 85, attendance: 95, completion: 92 },
  { month: 'Jan', average: 84, attendance: 96, completion: 91 },
  { month: 'Feb', average: 86, attendance: 95, completion: 93 },
] as const

const ASSIGNMENT_STATUSES = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  graded: { label: 'Graded', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  late: { label: 'Late', color: 'bg-rose-100 text-rose-800 border-rose-300' },
} as const

export default function ForestNightGradeBookPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('semester')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [students, setStudents] = useState(STUDENTS_DATA)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGrade = selectedGrade === 'all' || 
        student.grade === selectedGrade
      return matchesSearch && matchesGrade
    })
  }, [searchQuery, selectedGrade, students])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'needs-improvement': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0F1A0F] via-[#1B5E20] to-[#0F1A0F]'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-[#BDBD7A]/20 bg-[#0F1A0F]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0F1A0F]/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg'>
                <GraduationCap className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Forest Night Grade Book</h1>
                <p className='text-gray-400'>Academic performance management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-[#BDBD7A]/30 shadow-sm bg-[#1B5E20]/50 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='semester'>This Semester</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-[#FFD700] to-[#E0C200] text-black hover:from-[#E0C200] hover:to-[#FFD700] shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Student
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Student Metrics Overview */}
        <section data-template-section='student-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {STUDENT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-[#BDBD7A]/30 shadow-sm hover:shadow-md transition-all bg-[#1B5E20]/30 backdrop-blur-sm'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-300'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-400'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-400' 
                              : metric.status === 'decreasing'
                              ? 'text-blue-400'
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

        {/* Analytics Dashboard */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Grade Distribution */}
          <section data-template-section='grade-distribution' data-chart-type='bar' data-metrics='count,percentage'>
            <Card className='border border-[#BDBD7A]/30 shadow-sm bg-[#1B5E20]/30 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Grade Distribution</CardTitle>
                    <CardDescription className='text-gray-400'>Current semester breakdown</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-400 text-emerald-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={GRADE_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#BDBD7A' opacity={0.1} />
                    <XAxis dataKey='grade' stroke='#BDBD7A' />
                    <YAxis stroke='#BDBD7A' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1B5E20', 
                        border: '1px solid #BDBD7A',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Students' radius={[8, 8, 0, 0]}>
                      {GRADE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Performance Trends */}
          <section data-template-section='performance-trends' data-chart-type='line' data-metrics='average,attendance,completion'>
            <Card className='border border-[#BDBD7A]/30 shadow-sm bg-[#1B5E20]/30 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Performance Trends</CardTitle>
                    <CardDescription className='text-gray-400'>Monthly class metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-400 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +8% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PERFORMANCE_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#BDBD7A' opacity={0.1} />
                    <XAxis dataKey='month' stroke='#BDBD7A' />
                    <YAxis stroke='#BDBD7A' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1B5E20', 
                        border: '1px solid #BDBD7A',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='average' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Average Grade'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='attendance' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Attendance %'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='completion' 
                      stroke='#f59e0b' 
                      strokeWidth={2}
                      name='Completion %'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Student List & Management */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Student Browser */}
          <section data-template-section='student-browser' data-component-type='student-grid' className='lg:col-span-2'>
            <Card className='border border-[#BDBD7A]/30 shadow-sm bg-[#1B5E20]/30 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Student Roster</CardTitle>
                    <CardDescription className='text-gray-400'>Manage and track student performance</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search students...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-[#BDBD7A]/30 bg-[#0F1A0F]/50 text-white placeholder:text-gray-500'
                    />
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className='w-32 border-[#BDBD7A]/30 bg-[#0F1A0F]/50 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Grades</SelectItem>
                        <SelectItem value='A'>A</SelectItem>
                        <SelectItem value='B'>B</SelectItem>
                        <SelectItem value='C'>C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredStudents.map((student) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 bg-gradient-to-br from-[#0F1A0F]/50 to-[#1B5E20]/30 border border-[#BDBD7A]/20 rounded-xl hover:border-[#FFD700] transition-colors cursor-pointer ${
                          selectedStudent === student.id ? 'ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#0F1A0F]' : ''
                        }`}
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{student.avatar}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <div>
                                <h4 className='font-bold text-white'>{student.name}</h4>
                                <p className='text-sm text-gray-400'>{student.email}</p>
                              </div>
                              <Badge className={getStatusColor(student.status)}>
                                {student.grade}
                              </Badge>
                            </div>
                            <div className='grid grid-cols-3 gap-4 mb-3'>
                              <div>
                                <div className='text-xs text-gray-400'>Score</div>
                                <div className='text-lg font-bold text-white'>{student.score}%</div>
                              </div>
                              <div>
                                <div className='text-xs text-gray-400'>Attendance</div>
                                <div className='text-lg font-bold text-white'>{student.attendance}%</div>
                              </div>
                              <div>
                                <div className='text-xs text-gray-400'>Assignments</div>
                                <div className='text-lg font-bold text-white'>{student.assignments.completed}/{student.assignments.total}</div>
                              </div>
                            </div>
                            <div className='flex items-center justify-between'>
                              <Progress value={(student.assignments.completed / student.assignments.total) * 100} className='flex-1 mr-4' />
                              <div className='flex items-center space-x-2'>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant='ghost' size='icon' className='h-8 w-8 text-white hover:text-[#FFD700]'>
                                        <Edit className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Student</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant='ghost' size='icon' className='h-8 w-8 text-white hover:text-[#FFD700]'>
                                        <Star className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
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

          {/* Quick Actions Panel */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-[#BDBD7A]/30 shadow-sm h-full bg-[#1B5E20]/30 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Upload, label: 'Import Grades', color: 'from-blue-500 to-cyan-500' },
                    { icon: Download, label: 'Export Report', color: 'from-emerald-500 to-teal-500' },
                    { icon: Calendar, label: 'Schedule Test', color: 'from-purple-500 to-pink-500' },
                    { icon: FileText, label: 'View Assignments', color: 'from-amber-500 to-orange-500' },
                    { icon: Users, label: 'Class Analytics', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'Grade Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-[#BDBD7A]/30 hover:border-[#FFD700] h-14 bg-[#0F1A0F]/30 text-white'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6 bg-[#BDBD7A]/20' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-400'>Semester Progress</span>
                      <span className='font-medium text-white'>Week 12 / 16</span>
                    </div>
                    <Progress value={75} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-400' />
                      <div>
                        <div className='font-medium text-white'>All Caught Up</div>
                        <div className='text-sm text-emerald-400'>No pending tasks</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
