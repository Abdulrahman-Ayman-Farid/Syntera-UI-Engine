'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tab, Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useToast } from '@/components/ui/use-toast'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Slider } from '@radix-ui/react-slider'
import { Switch } from '@radix-ui/react-switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, ChevronRight, Info, BookOpen, UserCircle2, FolderPlus, CheckCircle, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Course {
  id: number
  title: string
  author: string
  progress: number
  thumbnail: string
}

const mockCourses: Course[] = [
  { id: 1, title: 'Introduction to AI', author: 'Dr. Jane Doe', progress: 75, thumbnail: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Web Development Basics', author: 'John Smith', progress: 50, thumbnail: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Advanced JavaScript', author: 'Alice Johnson', progress: 25, thumbnail: 'https://via.placeholder.com/150' }
]

export default function EducationLibrary() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      if (Math.random() > 0.1) {
        setCourses(mockCourses)
        setFilteredCourses(mockCourses)
        setIsLoading(false)
      } else {
        setError('Failed to load courses.')
        setIsLoading(false)
      }
    }, 2000)
  }, [])

  useEffect(() => {
    // Filter courses based on search term
    const filtered = courses.filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredCourses(filtered)
  }, [searchTerm, courses])

  const handleAddCourse = () => {
    toast({
      variant: 'success',
      title: 'Course Added!',
      description: 'The course has been added to your library.'
    })
  }

  return (
    <div className='bg-background text-white min-h-screen'>
      <header className='bg-primary p-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Educational Library</h1>
        <button className='md:hidden' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FolderPlus className='w-6 h-6 drop-shadow-lg' /> Open Menu
        </button>
        <nav className='hidden md:block'>
          <ul className='flex space-x-6'>
            <li><a href='#' className='hover:text-accent transition-colors duration-300'>Home</a></li>
            <li><a href='#' className='hover:text-accent transition-colors duration-300'>Catalog</a></li>
            <li><a href='#' className='hover:text-accent transition-colors duration-300'>My Courses</a></li>
            <li><a href='#' className='hover:text-accent transition-colors duration-300'>About Us</a></li>
          </ul>
        </nav>
        <div className='space-x-4'>
          <Button size='icon' variant='outline' aria-label='Notifications'>
            <Bell className='w-5 h-5 drop-shadow-lg' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='outline' aria-label='User menu'>
                <UserCircle2 className='w-5 h-5 drop-shadow-lg' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Sign out clicked')}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className='p-6'>
        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Browse Categories</h2>
            <Button size='sm' variant='outline'>
              View All
            </Button>
          </div>
          <ScrollArea className='overflow-y-hidden w-full'>
            <div className='flex space-x-4'>
              <div className='relative rounded-lg overflow-hidden cursor-pointer group'>
                <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: 'url(https://via.placeholder.com/150)' }}></div>
                <div className='absolute inset-0 bg-black opacity-30'></div>
                <div className='absolute bottom-0 left-0 right-0 px-4 py-3 bg-secondary/80'>
                  <span className='text-sm font-medium'>Programming</span>
                </div>
              </div>
              <div className='relative rounded-lg overflow-hidden cursor-pointer group'>
                <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: 'url(https://via.placeholder.com/150)' }}></div>
                <div className='absolute inset-0 bg-black opacity-30'></div>
                <div className='absolute bottom-0 left-0 right-0 px-4 py-3 bg-secondary/80'>
                  <span className='text-sm font-medium'>Data Science</span>
                </div>
              </div>
              <div className='relative rounded-lg overflow-hidden cursor-pointer group'>
                <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: 'url(https://via.placeholder.com/150)' }}></div>
                <div className='absolute inset-0 bg-black opacity-30'></div>
                <div className='absolute bottom-0 left-0 right-0 px-4 py-3 bg-secondary/80'>
                  <span className='text-sm font-medium'>Business</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </section>
        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Recommended Courses</h2>
            <Button size='sm' variant='outline'>
              See More
            </Button>
          </div>
          <ScrollArea className='overflow-y-hidden w-full'>
            <div className='flex space-x-4'>
              {isLoading ? (
                <Skeleton className='w-72 h-40 rounded-lg' />
              ) : error ? (
                <div className='text-red-500'>{error}</div>
              ) : (
                filteredCourses.map(course => (
                  <Card key={course.id} className='border-none bg-secondary/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300'>
                    <CardContent className='p-4'>
                      <Avatar className='mb-4'>
                        <AvatarImage src={course.thumbnail} alt={`${course.title} Thumbnail`} />
                        <AvatarFallback>{course.author[0]}</AvatarFallback>
                      </Avatar>
                      <CardTitle className='text-lg font-semibold'>{course.title}</CardTitle>
                      <CardFooter className='mt-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <UserCircle2 className='w-4 h-4 drop-shadow-lg' /> <span className='text-xs'>{course.author}</span>
                          </div>
                          <Progress value={course.progress} className='w-24 h-2' /> <span className='text-xs'>{course.progress}%</span>
                        </div>
                      </CardFooter>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </section>
        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Your Learning Path</h2>
            <Button size='sm' variant='outline'>
              Edit Path
            </Button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, index) => (
              <div key={index} className='relative rounded-lg overflow-hidden cursor-pointer group'>
                <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: 'url(https://via.placeholder.com/150)' }}></div>
                <div className='absolute inset-0 bg-black opacity-30'></div>
                <div className='absolute bottom-0 left-0 right-0 px-4 py-3 bg-secondary/80'>
                  <span className='text-sm font-medium'>Module {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <aside className={`fixed top-0 left-0 h-screen bg-primary/90 backdrop-blur-sm z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>n        <div className='p-6'>
          <Button size='icon' className='block md:hidden mb-4' onClick={() => setIsSidebarOpen(false)}>
            <ChevronRight className='w-6 h-6 drop-shadow-lg' />
          </Button>
          <h3 className='text-xl font-semibold mb-4'>Filters</h3>
          <form className='space-y-4'>
            <div>
              <label htmlFor='categories' className='block text-sm font-medium'>Categories</label>
              <Select onValueChange={(value) => console.log(value)}>n                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Select categories...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectLabel>Select a category</SelectLabel>
                  <SelectItem value='programming'>Programming</SelectItem>
                  <SelectItem value='datascience'>Data Science</SelectItem>
                  <SelectItem value='business'>Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor='difficulty' className='block text-sm font-medium'>Difficulty Level</label>
              <Select onValueChange={(value) => console.log(value)}>n                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Select difficulty...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectLabel>Select a difficulty level</SelectLabel>
                  <SelectItem value='beginner'>Beginner</SelectItem>
                  <SelectItem value='intermediate'>Intermediate</SelectItem>
                  <SelectItem value='advanced'>Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor='duration' className='block text-sm font-medium'>Duration</label>
              <Select onValueChange={(value) => console.log(value)}>n                <SelectTrigger className='w-full mt-1'>
                  <SelectValue placeholder='Select duration...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectLabel>Select a duration</SelectLabel>
                  <SelectItem value='<1hour'>< 1 hour</SelectItem>
                  <SelectItem value='1-3hours'>1 - 3 hours</SelectItem>
                  <SelectItem value='>3hours'>> 3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type='submit' className='w-full'>Apply Filters</Button>
          </form>
        </div>
      </aside>
      <footer className='bg-primary p-6 text-center'>
        <p>&copy; 2023 Educational Library. All rights reserved.</p>
      </footer>
    </div>
  )
}