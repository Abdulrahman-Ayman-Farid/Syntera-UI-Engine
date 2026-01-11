'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import * as DialogRadix from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import * as TabsRadix from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import { Plus, Search, Filter, ChevronRight, CalendarIcon, Users2, MapPin, Clock, Tag } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: 'Event name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  date: z.date(),
})

export default function EventPlanningPlatform() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: 'Beach Party',
          location: 'Sunset Beach',
          date: '2023-12-15',
          attendees: 150,
        },
        {
          id: 2,
          name: 'Garden Wedding',
          location: 'Green Garden Park',
          date: '2023-11-20',
          attendees: 200,
        },
        {
          id: 3,
          name: 'City Gala',
          location: 'Downtown Plaza',
          date: '2023-10-10',
          attendees: 300,
        },
      ]
      setEvents(mockData)
      setLoading(false)
    }, 1500)
  }, [])

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true
    return event.name.toLowerCase().includes(filter.toLowerCase())
  })

  const handleCreateEvent = () => {
    router.push('/create-event')
  }

  const handleSearchChange = (e) => {
    setFilter(e.target.value)
  }

  return (
    <div className='bg-gradient-to-l from-coral via-sky-blue to-lime min-h-screen text-black'>
      <header className='p-6 shadow-2xl bg-white/30 backdrop-blur-sm rounded-b-2xl'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <img src='/logo.png' alt='Logo' className='w-10 h-10' />
            <h1 className='text-2xl font-bold'>Eventify</h1>
          </div>
          <div className='space-x-4'>
            <Input
              type='text'
              placeholder='Search events...'
              onChange={handleSearchChange}
              className='border-t border-l rounded-2xl'
            />
            <Button onClick={handleCreateEvent} variant='default'>
              <Plus className='mr-2' /> Create Event
            </Button>
          </div>
        </nav>
      </header>
      <main className='p-6'>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Upcoming Events</h2>
          <Tabs defaultValue='all' className='max-w-[400px] w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='personal'>Personal</TabsTrigger>
              <TabsTrigger value='professional'>Professional</TabsTrigger>
            </TabsList>
            <TabsContent value='all'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className='aspect-video rounded-2xl' />
                  ))
                ) : error ? (
                  <div className='col-span-full text-center'>Error loading events</div>
                ) : (
                  filteredEvents.map((event) => (
                    <Card key={event.id} className='shadow-xl rounded-2xl overflow-hidden relative'>
                      <CardContent className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-br from-transparent to-black/30 z-10'></div>
                        <div className='relative z-20'>
                          <CardTitle>{event.name}</CardTitle>
                          <CardDescription className='mt-2'>
                            <div className='flex items-center space-x-2'>
                              <MapPin className='w-4 h-4' /> {event.location}
                            </div>
                            <div className='flex items-center space-x-2 mt-1'>
                              <CalendarIcon className='w-4 h-4' /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className='flex items-center space-x-2 mt-1'>
                              <Users2 className='w-4 h-4' /> {event.attendees} Attendees
                            </div>
                          </CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Event Statistics</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <Card className='shadow-xl rounded-2xl p-6'>
              <CardTitle>Total Events</CardTitle>
              <CardDescription className='mt-2'>150</CardDescription>
            </Card>
            <Card className='shadow-xl rounded-2xl p-6'>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription className='mt-2'>50</CardDescription>
            </Card>
            <Card className='shadow-xl rounded-2xl p-6'>
              <CardTitle>Past Events</CardTitle>
              <CardDescription className='mt-2'>100</CardDescription>
            </Card>
          </div>
        </section>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4'>Recent Activity</h2>
          <ul className='space-y-4'>
            <li className='flex items-center space-x-4 bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-xl'>
              <Avatar className='border-t border-l'>
                <AvatarImage src='/avatars/jane-doe.jpg' alt='Jane Doe' />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold'>Jane Doe</p>
                <p className='text-sm'>Created a new event: Summer Picnic</p>
              </div>
            </li>
            <li className='flex items-center space-x-4 bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-xl'>
              <Avatar className='border-t border-l'>
                <AvatarImage src='/avatars/john-doe.jpg' alt='John Doe' />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold'>John Doe</p>
                <p className='text-sm'>Updated event details: City Gala</p>
              </div>
            </li>
          </ul>
        </section>
      </main>
      <footer className='p-6 bg-white/30 backdrop-blur-sm rounded-t-2xl'>
        <div className='flex items-center justify-between'>
          <p>&copy; 2023 Eventify. All rights reserved.</p>
          <div className='space-x-4'>
            <a href='#' className='hover:underline'>Privacy Policy</a>
            <a href='#' className='hover:underline'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}