'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Search, Filter, CalendarIcon, ChevronDown, ArrowRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: number
  name: string
  role: string
}

const users: User[] = [
  { id: 1, name: 'Alice', role: 'Organizer' },
  { id: 2, name: 'Bob', role: 'Guest' },
  { id: 3, name: 'Charlie', role: 'Vendor' }
]

const EventPlanningDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setFilteredUsers(users)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load data')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(term.toLowerCase())))
  }

  return (
    <div className='bg-gradient-to-b from-white via-E0F7FA to-B2EBF2 min-h-screen flex'>
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-sm transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:translate-x-0`}> Sidebar Content </aside>
      <main className='flex-1 p-6 relative'>
        <header className='mb-6'>
          <h1 className='text-3xl font-bold mb-4'>Event Planning Dashboard</h1>
          <div className='flex items-center space-x-4'>
            <Input
              type='text'
              placeholder='Search events...'
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className='border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-accent'
            />
            <Button variant='default' className='shadow-sm'>
              <Plus className='mr-2' /> New Event
            </Button>
          </div>
        </header>
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <Card className='shadow-sm rounded-lg overflow-hidden'>
            <CardHeader className='p-6'>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              {isLoading && (
                <div className='space-y-2'>
                  <Skeleton className='h-4' />
                  <Skeleton className='h-4' />
                  <Skeleton className='h-4' />
                </div>
              )}
              {!isLoading && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[{ name: 'Conference', date: 'Oct 15', status: 'Active' }].map(event => (
                      <TableRow key={event.name}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>
                          <Badge>{event.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Card className='shadow-sm rounded-lg overflow-hidden'>
            <CardHeader className='p-6'>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              {isLoading && (
                <div className='space-y-2'>
                  <Skeleton className='h-4' />
                  <Skeleton className='h-4' />
                  <Skeleton className='h-4' />
                </div>
              )}
              {!isLoading && (
                filteredUsers.map(user => (
                  <div key={user.id} className='flex items-center justify-between my-2'>
                    <div className='flex items-center'>
                      <Avatar className='mr-2'>
                        <AvatarImage src={`https://via.placeholder.com/48?text=${user.name[0]}`} alt={`${user.name}'s avatar`} />
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                    <Badge>{user.role}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card className='shadow-sm rounded-lg overflow-hidden'>
            <CardHeader className='p-6'>
              <CardTitle>Event Statistics</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <span>Total Events</span>
                <span className='font-semibold'>12</span>
              </div>
              <Progress value={60} className='mb-4' />
              <div className='flex items-center justify-between mb-4'>
                <span>Active Events</span>
                <span className='font-semibold'>8</span>
              </div>
              <Progress value={80} className='mb-4' />
              <div className='flex items-center justify-between'>
                <span>Pending Events</span>
                <span className='font-semibold'>4</span>
              </div>
              <Progress value={20} className='mb-4' />
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className='bg-white shadow-sm text-center p-4 mt-auto'>
        © 2023 EventPlanner Inc.
      </footer>
    </div>
  )
}

export default EventPlanningDashboard