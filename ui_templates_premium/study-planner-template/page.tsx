'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Calendar, CheckCircle, XCircle, Clock,
  TrendingUp, TrendingDown, BookOpen, FileText, Edit,
  Trash2, RefreshCw, Filter, AlertTriangle, Award,
  BarChart3, PieChart as PieChartIcon, Target
} from 'lucide-react'

const STUDY_METRICS = [
  {
    id: 'total_tasks',
    label: 'Total Tasks',
    value: '24',
    change: '+5',
    status: 'increasing' as const,
    icon: FileText,
    color: 'from-cyan-500 to-blue-600',
    format: 'count'
  },
  {
    id: 'completed_tasks',
    label: 'Completed',
    value: '18',
    unit: '',
    change: '+4',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-600',
    format: 'count'
  },
  {
    id: 'completion_rate',
    label: 'Completion Rate',
    value: '75',
    unit: '%',
    change: '+8%',
    status: 'good' as const,
    icon: Target,
    color: 'from-purple-500 to-pink-600',
    format: 'percent'
  },
  {
    id: 'upcoming_deadlines',
    label: 'Due This Week',
    value: '6',
    change: '-2',
    status: 'decreasing' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    format: 'count'
  }
] as const

const SUBJECT_DISTRIBUTION = [
  { subject: 'Mathematics', count: 8, completed: 6, color: '#3b82f6' },
  { subject: 'Biology', count: 6, completed: 5, color: '#10b981' },
  { subject: 'History', count: 5, completed: 4, color: '#f59e0b' },
  { subject: 'English', count: 5, completed: 3, color: '#8b5cf6' },
] as const

const TASKS_DATA = [
  {
    id: 'task-001',
    title: 'Calculus Problem Set',
    subject: 'Mathematics',
    dueDate: '2024-02-20',
    completed: false,
    priority: 'high',
    estimatedTime: '2 hours',
    progress: 60
  },
  {
    id: 'task-002',
    title: 'Biology Lab Report',
    subject: 'Biology',
    dueDate: '2024-02-22',
    completed: true,
    priority: 'medium',
    estimatedTime: '3 hours',
    progress: 100
  },
  {
    id: 'task-003',
    title: 'History Essay Draft',
    subject: 'History',
    dueDate: '2024-02-18',
    completed: false,
    priority: 'high',
    estimatedTime: '4 hours',
    progress: 40
  },
  {
    id: 'task-004',
    title: 'English Literature Review',
    subject: 'English',
    dueDate: '2024-02-25',
    completed: false,
    priority: 'low',
    estimatedTime: '2 hours',
    progress: 20
  },
  {
    id: 'task-005',
    title: 'Statistics Homework',
    subject: 'Mathematics',
    dueDate: '2024-02-21',
    completed: true,
    priority: 'medium',
    estimatedTime: '1.5 hours',
    progress: 100
  },
] as const

const WEEKLY_PROGRESS = [
  { week: 'Week 1', completed: 4, pending: 2, total: 6 },
  { week: 'Week 2', completed: 5, pending: 3, total: 8 },
  { week: 'Week 3', completed: 3, pending: 2, total: 5 },
  { week: 'Week 4', completed: 6, pending: 1, total: 7 },
] as const

const PRIORITY_COLORS = {
  high: 'bg-rose-100 text-rose-800 border-rose-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
} as const

export default function StudyPlannerPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [filterSubject, setFilterSubject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [tasks, setTasks] = useState(TASKS_DATA)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSubject = filterSubject === 'all' || task.subject === filterSubject
      return matchesSearch && matchesSubject
    })
  }, [searchQuery, filterSubject, tasks])

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : task.progress }
          : task
      )
    )
  }, [])

  const getPriorityBadge = useCallback((priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.low
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/50'>
                <BookOpen className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>Study Planner</h1>
                <p className='text-cyan-400'>Task management & academic planning</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-cyan-500/30 shadow-sm bg-slate-900/50 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='semester'>This Semester</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/50 text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Study Metrics */}
        <section data-template-section='study-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {STUDY_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-cyan-500/30 shadow-lg hover:shadow-xl transition-all bg-slate-900/50 backdrop-blur-sm'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-cyan-400'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-white'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-cyan-400'>{metric.unit}</span>
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
          {/* Subject Distribution */}
          <section data-template-section='subject-distribution' data-chart-type='bar' data-metrics='count,completed'>
            <Card className='border border-cyan-500/30 shadow-lg bg-slate-900/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Subject Distribution</CardTitle>
                    <CardDescription className='text-cyan-400'>Tasks by subject area</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-cyan-500 text-cyan-400'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Analytics
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={SUBJECT_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#0ea5e9' opacity={0.1} />
                    <XAxis dataKey='subject' stroke='#22d3ee' />
                    <YAxis stroke='#22d3ee' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid #0ea5e9',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey='count' name='Total Tasks' radius={[8, 8, 0, 0]}>
                      {SUBJECT_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey='completed' name='Completed' radius={[8, 8, 0, 0]} fill='#10b981' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Weekly Progress */}
          <section data-template-section='weekly-progress' data-chart-type='line' data-metrics='completed,pending,total'>
            <Card className='border border-cyan-500/30 shadow-lg bg-slate-900/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Weekly Progress</CardTitle>
                    <CardDescription className='text-cyan-400'>Task completion trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500 text-emerald-400'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    On Track
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={WEEKLY_PROGRESS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#0ea5e9' opacity={0.1} />
                    <XAxis dataKey='week' stroke='#22d3ee' />
                    <YAxis stroke='#22d3ee' />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid #0ea5e9',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='completed' stroke='#10b981' strokeWidth={2} name='Completed' />
                    <Line type='monotone' dataKey='pending' stroke='#f59e0b' strokeWidth={2} name='Pending' />
                    <Line type='monotone' dataKey='total' stroke='#3b82f6' strokeWidth={2} name='Total' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Task Management */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Task List */}
          <section data-template-section='task-list' data-component-type='task-grid' className='lg:col-span-2'>
            <Card className='border border-cyan-500/30 shadow-lg bg-slate-900/50 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold text-white'>Task List</CardTitle>
                    <CardDescription className='text-cyan-400'>Your study assignments</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search tasks...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-cyan-500/30 bg-slate-950/50 text-white placeholder:text-gray-500'
                    />
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className='w-32 border-cyan-500/30 bg-slate-950/50 text-white'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Subjects</SelectItem>
                        <SelectItem value='Mathematics'>Mathematics</SelectItem>
                        <SelectItem value='Biology'>Biology</SelectItem>
                        <SelectItem value='History'>History</SelectItem>
                        <SelectItem value='English'>English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 bg-gradient-to-br from-slate-950/50 to-slate-900/30 border ${
                          task.completed ? 'border-emerald-500/30' : 'border-cyan-500/20'
                        } rounded-xl hover:border-cyan-500 transition-colors cursor-pointer ${
                          selectedTask === task.id ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-950' : ''
                        }`}
                        onClick={() => setSelectedTask(task.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-start space-x-3'>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleTaskCompletion(task.id)
                              }}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                task.completed
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'border-cyan-500 hover:border-cyan-400'
                              }`}
                            >
                              {task.completed && <CheckCircle className='w-4 h-4 text-white' />}
                            </button>
                            <div>
                              <h4 className={`font-bold text-white ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h4>
                              <div className='flex items-center space-x-2 mt-1'>
                                <Badge variant='outline' className='border-cyan-500/50 text-cyan-400 text-xs'>
                                  {task.subject}
                                </Badge>
                                <Badge className={getPriorityBadge(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between text-sm text-cyan-400 mb-2'>
                          <div className='flex items-center space-x-4'>
                            <span className='flex items-center'>
                              <Calendar className='w-3 h-3 mr-1' />
                              {task.dueDate}
                            </span>
                            <span className='flex items-center'>
                              <Clock className='w-3 h-3 mr-1' />
                              {task.estimatedTime}
                            </span>
                          </div>
                          <span className='font-medium'>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className='h-2' />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-cyan-500/30 shadow-lg h-full bg-slate-900/50 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-white'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Plus, label: 'New Task', color: 'from-cyan-500 to-blue-600' },
                    { icon: Calendar, label: 'Schedule Study', color: 'from-purple-500 to-pink-600' },
                    { icon: Award, label: 'View Progress', color: 'from-emerald-500 to-teal-600' },
                    { icon: FileText, label: 'Export Tasks', color: 'from-amber-500 to-orange-600' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-cyan-500/30 hover:border-cyan-500 h-14 bg-slate-950/30 text-white'
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
                      <span className='text-cyan-400'>Overall Progress</span>
                      <span className='font-medium text-white'>75%</span>
                    </div>
                    <Progress value={75} className='h-2' />
                  </div>
                  
                  <div className='p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-5 h-5 text-emerald-400' />
                      <div>
                        <div className='font-medium text-white text-sm'>Great Progress!</div>
                        <div className='text-xs text-emerald-400'>18 tasks completed</div>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Clock className='w-5 h-5 text-amber-400' />
                      <div>
                        <div className='font-medium text-white text-sm'>Upcoming</div>
                        <div className='text-xs text-amber-400'>6 tasks due this week</div>
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
