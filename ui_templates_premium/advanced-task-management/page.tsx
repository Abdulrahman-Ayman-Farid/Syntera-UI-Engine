'use client'

import { useState, useEffect } from 'react'
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
  CalendarDays
} from 'lucide-react'

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
        priority: 'medium',
        assignee: 'JD',
        dueDate: '2024-01-30',
        tags: ['Research', 'Design'],
        estimated: 4
      },
      {
        id: '2',
        title: 'Update project documentation',
        description: 'Add new API endpoints to docs',
        priority: 'low',
        assignee: 'AS',
        dueDate: '2024-02-05',
        tags: ['Documentation'],
        estimated: 2
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
        priority: 'high',
        assignee: 'MR',
        dueDate: '2024-01-25',
        tags: ['Frontend', 'Feature'],
        estimated: 8
      },
      {
        id: '4',
        title: 'Fix login bug',
        description: 'Users experiencing timeout issues',
        priority: 'high',
        assignee: 'TL',
        dueDate: '2024-01-22',
        tags: ['Bug', 'Auth'],
        estimated: 3
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
        priority: 'medium',
        assignee: 'JD',
        dueDate: '2024-01-28',
        tags: ['Responsive', 'Design'],
        estimated: 6
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
        priority: 'medium',
        assignee: 'AS',
        dueDate: '2024-01-29',
        tags: ['Refactor', 'Code'],
        estimated: 5
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
        priority: 'low',
        assignee: 'MR',
        dueDate: '2024-01-20',
        tags: ['Testing', 'User Research'],
        estimated: 4
      },
    ]
  }
}

export default function AdvancedTaskManagement() {
  const [columns, setColumns] = useState(initialColumns)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    tags: [] as string[],
    estimated: 2
  })
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)

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
      ...newTask
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
      priority: 'medium',
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

  const teamMembers = [
    { id: 'JD', name: 'Jane Doe', role: 'Design Lead', color: 'bg-purple-500' },
    { id: 'AS', name: 'Alex Smith', role: 'Backend Dev', color: 'bg-blue-500' },
    { id: 'MR', name: 'Mike Ross', role: 'Frontend Dev', color: 'bg-emerald-500' },
    { id: 'TL', name: 'Taylor Lee', role: 'Full Stack', color: 'bg-amber-500' },
  ]

  const stats = [
    { label: 'Total Tasks', value: '42', change: '+5', icon: CheckSquare, color: 'text-blue-600' },
    { label: 'Completed', value: '28', change: '+8', icon: CheckCheck, color: 'text-emerald-600' },
    { label: 'Overdue', value: '3', change: '-1', icon: AlertCircle, color: 'text-rose-600' },
    { label: 'In Progress', value: '11', change: '+2', icon: Clock, color: 'text-amber-600' },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <CheckSquare className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>TaskFlow Pro</h1>
                <p className='text-slate-600'>Advanced project management</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button 
                className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg'
                onClick={() => setShowNewTaskDialog(true)}
              >
                <Plus className='w-4 h-4 mr-2' />
                New Task
              </Button>
              <Button variant='outline' className='border-slate-300 shadow-sm'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Stats & Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {stats.map((stat, index) => (
            <Card key={index} className='border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-slate-600'>{stat.label}</p>
                    <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                    <div className={`flex items-center mt-1 ${stat.color}`}>
                      <ArrowUpRight className='w-4 h-4 mr-1' />
                      <span className='text-sm font-medium'>{stat.change}</span>
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-gradient-to-br from-slate-50 to-white'>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search & Filters */}
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-2/3'>
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
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
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
          </div>
          <div className='lg:w-1/3'>
            <Card className='border border-slate-200 shadow-sm'>
              <CardContent className='p-6'>
                <h3 className='font-bold text-slate-900 mb-4'>Team Members</h3>
                <div className='flex -space-x-2'>
                  {teamMembers.map((member) => (
                    <TooltipProvider key={member.id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Avatar className='border-2 border-white'>
                            <AvatarFallback className={member.color + ' text-white'}>
                              {member.id}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{member.name}</p>
                          <p className='text-sm text-slate-600'>{member.role}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  <Avatar className='border-2 border-white'>
                    <AvatarFallback className='bg-slate-100 text-slate-600'>
                      <Plus className='w-4 h-4' />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kanban Board */}
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

        {/* Recent Activity */}
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