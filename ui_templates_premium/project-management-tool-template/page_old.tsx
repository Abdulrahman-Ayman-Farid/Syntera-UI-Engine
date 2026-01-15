'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plus, Search, Filter, ChevronRight, User, Folder, Briefcase, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
})

type FormData = z.infer<typeof formSchema>

export default function ProjectManagementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setProjects([
        { id: 1, name: 'Alpha', status: 'completed', progress: 100 },
        { id: 2, name: 'Beta', status: 'in-progress', progress: 75 },
        { id: 3, name: 'Gamma', status: 'pending', progress: 20 },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='bg-[#1F1F24] text-white min-h-screen'>
      <header className='sticky top-0 bg-[#1F1F24] shadow-sm z-50'>
        <nav className='flex justify-between items-center p-6'>
          <h1 className='text-2xl font-bold'>Project Manager</h1>
          <div className='flex items-center gap-4'>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='sm:hidden'>
              <Plus className='w-6 h-6' /> Toggle Sidebar
            </button>
            <div className='hidden sm:flex items-center gap-4'>
              <Input
                type='text'
                placeholder='Search projects...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='rounded-lg border-none bg-[#2F2F35] text-white focus:bg-[#3F3F45]'
              />
              <Filter className='w-5 h-5' />
            </div>
          </div>
        </nav>
      </header>
      <main className='flex flex-col sm:flex-row p-6'>
        <aside
          className={`${
isSidebarOpen ? 'w-64' : 'sm:w-64 w-0 overflow-hidden'
          } transition-all duration-300 ease-in-out bg-[#2F2F35] rounded-lg shadow-sm p-6`}
        >
          <div className='mb-6'>
            <h2 className='text-lg font-semibold mb-4'>Filters</h2>
            <div className='space-y-2'>
              <Label htmlFor='status' className='cursor-pointer'>
                <input
                  type='checkbox'
                  id='status'
                  className='mr-2'
                />
                Status
              </Label>
              <Label htmlFor='priority' className='cursor-pointer'>
                <input
                  type='checkbox'
                  id='priority'
                  className='mr-2'
                />
                Priority
              </Label>
            </div>
          </div>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold mb-4'>Tags</h2>
            <div className='space-y-2'>
              <Badge variant='outline'>Design</Badge>
              <Badge variant='outline'>Development</Badge>
              <Badge variant='outline'>Marketing</Badge>
            </div>
          </div>
        </aside>
        <section className='flex-grow mt-6 sm:mt-0'>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)} className='w-full'>
            <TabsList className='grid grid-cols-3 w-full'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='projects'>Projects</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-6'>Welcome to Project Manager</h2>
                <p className='text-gray-400'>Manage your projects efficiently with our intuitive interface.</p>
              </div>
            </TabsContent>
            <TabsContent value='projects'>
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-6'>Your Projects</h2>
                {isLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[1, 2, 3].map((item) => (
                      <Skeleton key={item} className='h-64 rounded-lg' />
                    ))}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredProjects.map((project) => (
                      <Card key={project.id} className='border-t border-l border-accent shadow-sm rounded-lg'>
                        <CardHeader>
                          <CardTitle>{project.name}</CardTitle>
                          <CardDescription>Status: {project.status}</CardDescription>
                        </CardHeader>
                        <CardContent className='relative'>
                          <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-black/10 to-transparent pointer-events-none'></div>
                          <div className='relative'>
                            <Progress value={project.progress} className='h-2 rounded-full' />
                          </div>
                        </CardContent>
                        <CardFooter className='flex justify-between'>
                          <Button variant='outline' size='icon'>
                            <ChevronRight className='w-4 h-4' />
                          </Button>
                          <div className='flex space-x-2'>
                            <Button variant='ghost' size='icon'>
                              <User className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon'>
                              <Folder className='w-4 h-4' />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value='settings'>
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-6'>Account Settings</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input id='name' {...register('name')} className='bg-[#2F2F35] text-white' />
                    {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' {...register('email')} className='bg-[#2F2F35] text-white' />
                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                  </div>
                  <Button type='submit' disabled={isSubmitting} className='bg-primary'>
                    {isSubmitting ? <Loader2 className='animate-spin w-4 h-4 mr-2' /> : ''} Save Changes
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <footer className='bg-[#2F2F35] text-center p-6'>
        <p>&copy; 2023 Project Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}

function onSubmit(data: FormData) {
  console.log(data)
}