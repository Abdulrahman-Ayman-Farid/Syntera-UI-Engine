'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ArrowRight, UserCircle, FileText, FolderPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email(),
})

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        { id: 1, title: 'Introduction to AI', author: 'Dr. Smith', progress: 75 },
        { id: 2, title: 'Web Development Basics', author: 'John Doe', progress: 50 },
        { id: 3, title: 'Advanced Python', author: 'Jane Smith', progress: 90 },
      ]
      setCourses(mockData)
      setFilteredCourses(mockData)
      setIsLoading(false)
    }, 1500)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses)
      return
    }
    setFilteredCourses(
      courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, courses])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setFilteredCourses([...filteredCourses].sort((a, b) => {
      if (value === 'date') {
        return new Date(b.date) - new Date(a.date)
      }
      if (value === 'name') {
        return a.title.localeCompare(b.title)
      }
      return 0
    }))
  }

  const handleAddCourse = () => {
    toast.success('Course added!')
    setIsModalOpen(false)
  }

  return (
    <div className='bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-100 min-h-screen relative overflow-hidden'>
      <header className='py-8 px-6 bg-primary text-white flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm shadow-lg'>
        <h1 className='text-2xl font-bold'>Online Courses</h1>
        <div className='flex gap-4'>
          <Button variant='ghost' onClick={() => setCurrentTab('all')} aria-label='All Courses'>All</Button>
          <Button variant='ghost' onClick={() => setCurrentTab('my')} aria-label='My Courses'>My Courses</Button>
          <Button variant='outline' onClick={() => setIsModalOpen(true)} aria-label='Add Course'><Plus size={16} /> Add Course</Button>
        </div>
      </header>
      <main className='p-6 pt-20'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='relative w-full max-w-sm'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search courses...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='pl-10 pr-10'
              aria-label='Search courses'
            />
          </div>
          <div className='flex gap-4'>
            <Select
              defaultValue='date'
              onValueChange={handleSortChange}
              aria-label='Sort by'
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Sort by...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='date'>Date</SelectItem>
                <SelectItem value='name'>Name</SelectItem>
              </SelectContent>
            </Select>
            <Filter size={16} className='cursor-pointer' aria-label='Filter courses' /> {/* Placeholder for filter functionality */}
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className='aspect-video rounded-lg' />
            ))
          ) : (
            filteredCourses.map(course => (
              <Card key={course.id} className='border-t border-l border-accent bg-background shadow-lg hover:shadow-2xl transition-transform transform-gpu hover:translate-y-[-5px] cursor-pointer rounded-xl'>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>By {course.author}</CardDescription>
                </CardHeader>
                <CardContent className='flex items-end justify-between'>
                  <Progress value={course.progress} className='w-full' />
                  <span className='ml-2'>{course.progress}%</span>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Badge variant='secondary'>Completed</Badge>
                  <Button size='icon' aria-label={`View ${course.title}`}><ChevronRight size={16} /></Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
      <footer className='py-4 px-6 bg-primary text-white fixed bottom-0 w-full'>
        <p className='text-center'>© 2023 Online Courses Inc.</p>
      </footer>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='bg-background shadow-2xl rounded-lg p-6 space-y-4 animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-right-10 sm:zoom-in-90'>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Create a new course entry.</DialogDescription>
          </DialogHeader>
          <Form {...useForm({ resolver: zodResolver(formSchema), defaultValues: { email: '' } })} onSubmit={(values) => console.log(values)}> {/* Replace with actual submit handler */}
            <FormField
              control={useForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder='name@company.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-4 flex justify-end'>
              <DialogClose asChild>
                <Button type='button' variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit' className='ml-2' onClick={handleAddCourse}>Add Course</Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}