'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, X, CheckCircle, AlertTriangle, Loader2, FolderPlus, Users, PieChart, CalendarIcon } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

interface Project {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  users: User[]
  progress: number
  deadline: Date
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: '/avatars/alice.jpg' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatarUrl: '/avatars/bob.jpg' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: '/avatars/charlie.jpg' }
]

const mockProjects: Project[] = [
  { id: 1, title: 'Project Alpha', description: 'Develop a new web application', status: 'in-progress', users: [mockUsers[0], mockUsers[1]], progress: 75, deadline: new Date('2023-12-31') },
  { id: 2, title: 'Project Beta', description: 'Design marketing materials', status: 'pending', users: [mockUsers[2]], progress: 20, deadline: new Date('2024-01-15') },
  { id: 3, title: 'Project Gamma', description: 'Launch event coordination', status: 'completed', users: [mockUsers[0], mockUsers[2]], progress: 100, deadline: new Date('2023-11-15') }
]

const ProjectManagementDashboard = () => {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleStatusChange = (value: 'all' | 'pending' | 'in-progress' | 'completed') => {
    setSelectedStatus(value)
  }

  const filteredProjects = projects.filter(project => {
    if (selectedStatus !== 'all' && project.status !== selectedStatus) return false
    return project.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500 text-white'
      case 'in-progress':
        return 'bg-blue-500 text-white'
      case 'completed':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-l from-purple-900 via-pink-900 to-cyan-900 text-white overflow-hidden'>
      <header className='fixed w-full z-50 bg-black/50 backdrop-blur-sm shadow-2xl'>
        <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
          <div className='flex items-center gap-4'>
            <button onClick={() => setShowSidebar(!showSidebar)} className='sm:hidden text-white'>
              <FolderPlus size={24} />
            </button>
            <h1 className='text-2xl font-bold'>Project Management</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Input placeholder='Search...' onChange={handleSearchChange} className='w-64' />
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Filter by Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='in-progress'>In Progress</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='outline'>
              <CalendarIcon className='mr-2' /> Schedule Meeting
            </Button>
          </div>
          <div className='flex items-center gap-4'>
            <Button variant='ghost'>
              <PieChart size={24} />
            </Button>
            <Avatar className='cursor-pointer'>
              <AvatarImage src='/avatars/user.png' alt='User Avatar' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </header>
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-black/70 backdrop-blur-sm transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}> Sidebar Content </aside>
      <main className='container mx-auto mt-20 pb-10 pl-6 sm:pl-72'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {!isLoading ? (
            filteredProjects.map(project => (
              <Card key={project.id} className='border border-l border-t border-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-transform duration-300 ease-in-out'>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className='pt-4'>
                  <div className='flex items-center justify-between'>
                    <Badge className={getStatusColor(project.status)}>{project.status.replace('-', ' ')}</Badge>
                    <Progress value={project.progress} className='w-full max-w-xs' />
                  </div>
                  <div className='mt-4'>
                    <p className='text-sm'>Deadline: {new Intl.DateTimeFormat('en-US').format(project.deadline)}</p>
                  </div>
                  <div className='mt-4 flex items-center space-x-2'>
                    {project.users.map(user => (
                      <Avatar key={user.id} className='h-8 w-8'>
                        <AvatarImage src={user.avatarUrl || ''} alt={`${user.name}'s Avatar`} />
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className='border border-l border-t border-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-transform duration-300 ease-in-out'>
                <CardHeader>
                  <Skeleton className='w-full h-8 mb-2' />
                  <Skeleton className='w-full h-6' />
                </CardHeader>
                <CardContent className='pt-4'>
                  <Skeleton className='w-full h-4 mb-2' />
                  <Skeleton className='w-full h-2 mb-2' />
                  <Skeleton className='w-full h-2 mb-2' />
                  <Skeleton className='w-full h-2 mb-2' />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <footer className='fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 text-center'>
        © 2023 Cyberpunk Project Management. All rights reserved.
      </footer>
    </div>
  )
}

export default ProjectManagementDashboard