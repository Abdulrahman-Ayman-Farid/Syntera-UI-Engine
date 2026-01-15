'use client'

import { useState, useEffect, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import {
  CheckSquare,
  Clock,
  Flag,
  User,
  Tag,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Inbox,
  TrendingUp,
  BarChart3,
  Target,
  Bell,
  Star,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  CheckCheck,
  CalendarDays,
  TrendingDown
} from 'lucide-react'

// Task metrics with type-safe constants
const TASK_METRICS = [
  {
    id: 'total_tasks',
    label: 'Total Tasks',
    value: '42',
    change: '+5',
    status: 'increasing' as const,
    icon: CheckSquare,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'completed',
    label: 'Completed',
    value: '28',
    change: '+8',
    status: 'good' as const,
    icon: CheckCheck,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'overdue',
    label: 'Overdue',
    value: '3',
    change: '-1',
    status: 'decreasing' as const,
    icon: AlertCircle,
    color: 'from-rose-500 to-red-500',
    format: 'count'
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    value: '11',
    change: '+2',
    status: 'increasing' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const PRIORITY_DISTRIBUTION = [
  { priority: 'High', count: 12, color: '#ef4444' },
  { priority: 'Medium', count: 18, color: '#f59e0b' },
  { priority: 'Low', count: 12, color: '#10b981' },
] as const

const TASK_COMPLETION_TREND = [
  { week: 'Week 1', completed: 8, created: 5 },
  { week: 'Week 2', completed: 12, created: 8 },
  { week: 'Week 3', completed: 15, created: 10 },
  { week: 'Week 4', completed: 18, created: 12 },
] as const

const TEAM_MEMBERS = [
  { id: 'JD', name: 'Jane Doe', role: 'Design Lead', color: 'bg-purple-500', tasksAssigned: 8 },
  { id: 'AS', name: 'Alex Smith', role: 'Backend Dev', color: 'bg-blue-500', tasksAssigned: 12 },
  { id: 'MR', name: 'Mike Ross', role: 'Frontend Dev', color: 'bg-emerald-500', tasksAssigned: 10 },
  { id: 'TL', name: 'Taylor Lee', role: 'Full Stack', color: 'bg-amber-500', tasksAssigned: 11 },
] as const

const initialColumns = {
  backlog: {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-gray-100 border-gray-300',
    tasks: [
      {
        id: '1',
        title: 'Research new design trends',
        description: 'Explore latest UI/UX patterns for 2024',
        priority: 'medium' as const,
        assignee: 'JD',
        dueDate: '2024-01-30',
        tags: ['Research', 'Design'],
        estimated: 4,
        status: 'backlog' as const
      },
      {
        id: '2',
        title: 'Update project documentation',
        description: 'Add new API endpoints to docs',
        priority: 'low' as const,
        assignee: 'AS',
        dueDate: '2024-02-05',
        tags: ['Documentation'],
        estimated: 2,
        status: 'backlog' as const
      },
    ]
  },
  todo: {
    id: 'todo',
    title: 'To Do',
    color: 'bg-blue-50 border-blue-300',
    tasks: [
      {
        id: '3',
        title: 'Implement dark mode',
        description: 'Add dark theme support across app',
        priority: 'high' as const,
        assignee: 'MR',
        dueDate: '2024-01-25',
        tags: ['Frontend', 'Feature'],
        estimated: 8,
        status: 'todo' as const
      },
      {
        id: '4',
        title: 'Fix login bug',
        description: 'Users experiencing timeout issues',
        priority: 'high' as const,
        assignee: 'TL',
        dueDate: '2024-01-22',
        tags: ['Bug', 'Auth'],
        estimated: 3,
        status: 'todo' as const
      },
    ]
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-amber-50 border-amber-300',
    tasks: [
      {
        id: '5',
        title: 'Mobile responsive design',
        description: 'Optimize for tablet and mobile',
        priority: 'medium' as const,
        assignee: 'JD',
        dueDate: '2024-01-28',
        tags: ['Responsive', 'Design'],
        estimated: 6,
        status: 'in-progress' as const
      },
    ]
  },
  review: {
    id: 'review',
    title: 'Review',
    color: 'bg-purple-50 border-purple-300',
    tasks: [
      {
        id: '6',
        title: 'Code refactor',
        description: 'Clean up legacy components',
        priority: 'medium' as const,
        assignee: 'AS',
        dueDate: '2024-01-29',
        tags: ['Refactor', 'Code'],
        estimated: 5,
        status: 'review' as const
      },
    ]
  },
  done: {
    id: 'done',
    title: 'Done',
    color: 'bg-emerald-50 border-emerald-300',
    tasks: [
      {
        id: '7',
        title: 'User testing session',
        description: 'Conducted with 15 participants',
        priority: 'low' as const,
        assignee: 'MR',
        dueDate: '2024-01-20',
        tags: ['Testing', 'User Research'],
        estimated: 4,
        status: 'done' as const
      },
    ]
  }
}

export default function AdvancedTaskManagement() {
  const [columns, setColumns] = useState(initialColumns)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [timeRange, setTimeRange] = useState('month')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignee: '',
    dueDate: '',
    tags: [] as string[],
    estimated: 2
  })
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredTasks = useMemo(() => {
    const allTasks = Object.values(columns).flatMap(col => col.tasks)
    return allTasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
  }, [columns, searchQuery, filterPriority])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof typeof columns]
      const destColumn = columns[destination.droppableId as keyof typeof columns]
      const sourceTasks = [...sourceColumn.tasks]
      const destTasks = [...destColumn.tasks]
      const [removed] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks
        }
      })
    } else {
      const column = columns[source.droppableId as keyof typeof columns]
      const copiedTasks = [...column.tasks]
      const [removed] = copiedTasks.splice(source.index, 1)
      copiedTasks.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedTasks
        }
      })
    }
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const taskId = Date.now().toString()
    const newTaskObj = {
      id: taskId,
      ...newTask,
      status: 'todo' as const
    }

    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [...prev.todo.tasks, newTaskObj]
      }
    }))

    setNewTask({
      title: '',
      description: '',
      priority: 'medium' as const,
      assignee: '',
      dueDate: '',
      tags: [],
      estimated: 2
    })
    setShowNewTaskDialog(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <CheckSquare className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>TaskFlow Pro</h1>
                <p className='text-slate-600'>Advanced task & project management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-slate-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg'
                onClick={() => setShowNewTaskDialog(true)}
              >
                <Plus className='w-4 h-4 mr-2' />
                New Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Task Metrics */}
        <section data-template-section='task-metrics' data-component-type='kpi-grid'>
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {TASK_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-slate-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-slate-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-slate-900'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : metric.status === 'decreasing'
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          }`}>
                            {metric.change.startsWith('+') || metric.change.startsWith('-') ? (
                              metric.change.startsWith('+') ? (
                                <TrendingUp className='w-4 h-4 mr-1' />
                              ) : (
                                <TrendingDown className='w-4 h-4 mr-1' />
                              )
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Priority Distribution */}
          <section data-template-section='priority-distribution' data-chart-type='bar' data-metrics='count,priority'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Priority Distribution</CardTitle>
                    <CardDescription>Tasks grouped by priority level</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={PRIORITY_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='priority' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Task Count' radius={[4, 4, 0, 0]}>
                      {PRIORITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Completion Trends */}
          <section data-template-section='completion-trends' data-chart-type='line' data-metrics='completed,created'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Task Completion Trends</CardTitle>
                    <CardDescription>Weekly completed vs created tasks</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +12% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={TASK_COMPLETION_TREND}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='week' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='completed' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Completed Tasks'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='created' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Created Tasks'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Search & Filters */}
        <section data-template-section='task-filters' data-component-type='filter-bar'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <Input
                    placeholder='Search tasks...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border-slate-300 focus:border-blue-500'
                    startIcon={Search}
                  />
                </div>
                <div className='flex gap-4'>
                  <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                    <SelectTrigger className='w-40 border-slate-300'>
                      <SelectValue placeholder='Priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Priorities</SelectItem>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='low'>Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant='outline' className='border-slate-300'>
                    <CalendarDays className='w-4 h-4 mr-2' />
                    Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team Members */}
        <section data-template-section='team-members' data-component-type='member-grid'>
          <Card className='border border-slate-200 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>Team Members</CardTitle>
              <CardDescription>Task assignments across team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {TEAM_MEMBERS.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl'
                  >
                    <div className='flex items-center space-x-3 mb-3'>
                      <Avatar className='w-10 h-10'>
                        <AvatarFallback className={`${member.color} text-white`}>
                          {member.id}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium text-slate-900'>{member.name}</div>
                        <div className='text-sm text-slate-600'>{member.role}</div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-slate-600'>Tasks Assigned</span>
                      <Badge variant='outline' className='border-slate-300'>
                        {member.tasksAssigned}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Kanban Board */}
        <section data-template-section='kanban-board' data-component-type='drag-drop-grid'>
          <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
            {Object.values(columns).map((column) => (
              <div key={column.id} className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-bold text-slate-900'>{column.title}</h3>
                    <Badge variant='outline' className='border-slate-300'>
                      {column.tasks.length}
                    </Badge>
                  </div>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <MoreVertical className='w-4 h-4' />
                  </Button>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[500px] rounded-lg border-2 ${column.color} ${snapshot.isDraggingOver ? 'ring-2 ring-blue-500' : ''} p-4 transition-all`}
                    >
                      <AnimatePresence>
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`mb-4 ${snapshot.isDragging ? 'shadow-2xl rotate-2' : 'shadow-sm'}`}
                              >
                                <Card className='border border-slate-200 hover:border-blue-300 transition-colors cursor-move'>
                                  <CardContent className='p-4'>
                                    <div className='space-y-3'>
                                      <div className='flex items-start justify-between'>
                                        <h4 className='font-medium text-slate-900'>{task.title}</h4>
                                        <Badge className={getPriorityColor(task.priority)}>
                                          <Flag className='w-3 h-3 mr-1' />
                                          {task.priority}
                                        </Badge>
                                      </div>
                                      <p className='text-sm text-slate-600 line-clamp-2'>{task.description}</p>
                                      <div className='flex flex-wrap gap-2'>
                                        {task.tags.map((tag, i) => (
                                          <Badge key={i} variant='outline' className='text-xs border-slate-300'>
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                      <div className='flex items-center justify-between text-sm text-slate-500'>
                                        <div className='flex items-center space-x-4'>
                                          <span className='flex items-center'>
                                            <User className='w-3 h-3 mr-1' />
                                            {task.assignee}
                                          </span>
                                          <span className='flex items-center'>
                                            <Clock className='w-3 h-3 mr-1' />
                                            {task.estimated}h
                                          </span>
                                        </div>
                                        <span className='flex items-center'>
                                          <Calendar className='w-3 h-3 mr-1' />
                                          {task.dueDate}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
        </section>

        {/* Recent Activity */}
        <section data-template-section='recent-activity' data-component-type='activity-feed'>
        <Card className='border border-slate-200 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[
                { user: 'Jane Doe', action: 'moved "Dark Mode" to In Progress', time: '10 minutes ago' },
                { user: 'Alex Smith', action: 'commented on "API Documentation"', time: '45 minutes ago' },
                { user: 'Mike Ross', action: 'completed "User Testing"', time: '2 hours ago' },
                { user: 'Taylor Lee', action: 'assigned "Login Bug" to themselves', time: '3 hours ago' },
              ].map((activity, index) => (
                <div key={index} className='flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-white transition-colors'>
                  <Avatar>
                    <AvatarFallback className='bg-blue-100 text-blue-800'>
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <p className='font-medium'>{activity.user} <span className='font-normal text-slate-600'>{activity.action}</span></p>
                    <p className='text-sm text-slate-500'>{activity.time}</p>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Eye className='w-4 h-4' />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </section>
      </main>

      {/* New Task Dialog */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your project</DialogDescription>
          </DialogHeader>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Task Title</label>
                <Input
                  placeholder='What needs to be done?'
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Description</label>
                <Textarea
                  placeholder='Add details about this task...'
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Priority</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='low'>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Assignee</label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select assignee' />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Due Date</label>
                  <Input
                    type='date'
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Estimated Hours</label>
                  <Input
                    type='number'
                    value={newTask.estimated}
                    onChange={(e) => setNewTask({ ...newTask, estimated: parseInt(e.target.value) || 2 })}
                    min='1'
                    max='40'
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowNewTaskDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTask}
              className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}