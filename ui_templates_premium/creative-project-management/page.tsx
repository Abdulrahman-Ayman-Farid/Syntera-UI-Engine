'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  Palette, Calendar, Users, Target, Clock,
  Plus, Search, Filter, MessageSquare, Paperclip,
  CheckCircle, Circle, AlertCircle, MoreVertical,
  BarChart3, FolderKanban, TrendingUp, Sparkles
} from 'lucide-react'

const projects = [
  { 
    id: 1, 
    name: 'Brand Identity Redesign', 
    team: ['JD', 'AS', 'MR'], 
    progress: 75, 
    status: 'In Progress', 
    deadline: '2024-02-15',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  { 
    id: 2, 
    name: 'Mobile App UI/UX', 
    team: ['JD', 'TL'], 
    progress: 45, 
    status: 'On Track', 
    deadline: '2024-02-28',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  },
  { 
    id: 3, 
    name: 'Website Redesign', 
    team: ['MR', 'AS'], 
    progress: 90, 
    status: 'Almost Done', 
    deadline: '2024-01-30',
    color: 'bg-gradient-to-r from-amber-500 to-orange-500'
  },
]

const tasks = [
  { id: 1, title: 'Design Logo Concepts', project: 'Brand Identity', assignee: 'JD', priority: 'high', completed: true },
  { id: 2, title: 'User Flow Diagrams', project: 'Mobile App', assignee: 'TL', priority: 'medium', completed: false },
  { id: 3, title: 'Color Palette Selection', project: 'Brand Identity', assignee: 'AS', priority: 'high', completed: false },
]

export default function CreativeProjectManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeProject, setActiveProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1200)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 flex flex-col'>
      <header className='p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg'>
              <Palette className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Creative Studio
              </h1>
              <p className='text-gray-600'>Manage your creative projects</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' className='border-purple-200 text-purple-700 hover:bg-purple-50'>
              <FolderKanban className='w-4 h-4 mr-2' />
              Kanban
            </Button>
            <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'>
              <Plus className='w-4 h-4 mr-2' />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Stats & Overview */}
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            { label: 'Active Projects', value: '12', icon: Palette, change: '+2', color: 'text-purple-600' },
            { label: 'Team Members', value: '8', icon: Users, change: '+1', color: 'text-pink-600' },
            { label: 'Upcoming Deadlines', value: '5', icon: Calendar, change: '-1', color: 'text-blue-600' },
            { label: 'On Time Rate', value: '94%', icon: Target, change: '+3%', color: 'text-green-600' },
          ].map((stat, i) => (
            <Card key={i} className='border border-gray-200 hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600'>{stat.label}</p>
                    <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                    <div className='flex items-center mt-1'>
                      <TrendingUp className={`w-4 h-4 ${stat.color} mr-1`} />
                      <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-gradient-to-br from-gray-50 to-white'>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Projects Grid */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Active Projects</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search projects...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-64 border-gray-300 focus:border-purple-500'
                startIcon={Search}
              />
              <Button variant='outline' className='border-gray-300'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-64 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {projects.map((project) => (
                <Card 
                  key={project.id}
                  className='border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group'
                  onClick={() => setActiveProject(project)}
                >
                  <div className={`h-2 ${project.color} rounded-t-xl`} />
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <h3 className='text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors'>
                        {project.name}
                      </h3>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </div>
                    
                    <div className='space-y-4'>
                      <div>
                        <div className='flex justify-between text-sm text-gray-600 mb-2'>
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className='h-2' />
                      </div>
                      
                      <div className='flex items-center justify-between'>
                        <div className='flex -space-x-2'>
                          {project.team.map((initials, i) => (
                            <Avatar key={i} className='w-8 h-8 border-2 border-white'>
                              <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Badge variant={
                          project.status === 'In Progress' ? 'default' :
                          project.status === 'On Track' ? 'success' :
                          'secondary'
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className='flex items-center text-sm text-gray-600'>
                        <Calendar className='w-4 h-4 mr-2' />
                        <span>Due {project.deadline}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Tasks & Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Tasks */}
          <Card className='border border-gray-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <CheckCircle className='w-5 h-5 mr-2 text-purple-600' />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {tasks.map((task) => (
                  <div key={task.id} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-white transition-colors'>
                    <div className='flex items-center space-x-4'>
                      <button className='w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500'>
                        {task.completed && <CheckCircle className='w-4 h-4 text-purple-600' />}
                      </button>
                      <div>
                        <h4 className='font-medium'>{task.title}</h4>
                        <p className='text-sm text-gray-600'>{task.project}</p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <Avatar className='w-8 h-8'>
                        <AvatarFallback className='text-xs'>{task.assignee}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-gray-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className='border border-gray-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Sparkles className='w-5 h-5 mr-2 text-amber-500' />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {[
                  { user: 'Jane D.', action: 'completed Brand Logo', time: '2 hours ago', color: 'bg-purple-500' },
                  { user: 'Alex S.', action: 'uploaded wireframes', time: '4 hours ago', color: 'bg-blue-500' },
                  { user: 'Mike R.', action: 'commented on design', time: '1 day ago', color: 'bg-pink-500' },
                  { user: 'Taylor L.', action: 'updated project timeline', time: '2 days ago', color: 'bg-green-500' },
                ].map((activity, i) => (
                  <div key={i} className='flex items-start space-x-4'>
                    <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center mt-1`}>
                      <span className='text-white text-xs font-bold'>
                        {activity.user.split(' ')[1]?.[0] || activity.user[0]}
                      </span>
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium'>
                        <span className='text-gray-900'>{activity.user}</span>{' '}
                        <span className='text-gray-600'>{activity.action}</span>
                      </p>
                      <p className='text-sm text-gray-500 mt-1'>{activity.time}</p>
                    </div>
                    <Button variant='ghost' size='icon'>
                      <MessageSquare className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className='border border-gray-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50'>
          <CardContent className='p-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {[
                { label: 'Schedule Meeting', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
                { label: 'Upload Files', icon: Paperclip, color: 'bg-purple-100 text-purple-600' },
                { label: 'Team Chat', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
                { label: 'Generate Report', icon: BarChart3, color: 'bg-amber-100 text-amber-600' },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant='outline'
                  className={`h-24 flex-col border-2 border-dashed hover:border-solid ${action.color.split(' ')[0]} hover:${action.color}`}
                >
                  <action.icon className={`w-8 h-8 mb-2 ${action.color.split(' ')[1]}`} />
                  <span className='font-medium'>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}