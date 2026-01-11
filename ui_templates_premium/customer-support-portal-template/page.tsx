'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tab, Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, UserCircle2, MessageSquare, ClockIcon, CheckCircle2, XCircle } from 'lucide-react'

interface Ticket {
  id: number
  title: string
  status: string
  priority: string
  assignedTo: string
  createdAt: Date
}

const mockTickets: Ticket[] = [
  { id: 1, title: 'Login Issue', status: 'Open', priority: 'High', assignedTo: 'John Doe', createdAt: new Date() },
  { id: 2, title: 'Payment Problem', status: 'Pending', priority: 'Medium', assignedTo: 'Jane Smith', createdAt: new Date() },
  { id: 3, title: 'Feature Request', status: 'Closed', priority: 'Low', assignedTo: 'Alice Johnson', createdAt: new Date() }
]

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      setTickets(mockTickets)
      setIsLoading(false)
    }, 1500)
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTickets(tickets)
    } else {
      setFilteredTickets(
        tickets.filter((ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, tickets])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className='bg-black text-white min-h-screen flex flex-col'>
      <header className='p-4 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 shadow-2xl'>
        <h1 className='text-3xl font-bold'>Customer Support Portal</h1>
      </header>
      <div className='flex flex-row grow'>
        <aside className='hidden lg:block w-64 bg-gray-800 p-4 space-y-4'>
          <div className='space-y-2'>
            <h2 className='font-semibold'>Navigation</h2>
            <button className='w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300'>Dashboard</button>
            <button className='w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300'>Tickets</button>
            <button className='w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300'>Knowledge Base</button>
          </div>
          <div className='space-y-2'>
            <h2 className='font-semibold'>Settings</h2>
            <button className='w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300'>Profile</button>
            <button className='w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300'>Notifications</button>
          </div>
        </aside>
        <main className='flex-grow p-4'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex space-x-2'>
              <Input
                placeholder='Search tickets...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='border-none focus:outline-none focus:border-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
              />
              <Button variant='default'>
                <Search className='mr-2' /> Search
              </Button>
            </div>
            <Button variant='default' onClick={() => router.push('/new-ticket')}>
              <Plus className='mr-2' /> New Ticket
            </Button>
          </div>
          <Tabs defaultValue='all'>
            <TabsList className='mb-4'>
              <Tab value='all'>All Tickets</Tab>
              <Tab value='open'>Open</Tab>
              <Tab value='pending'>Pending</Tab>
              <Tab value='closed'>Closed</Tab>
            </TabsList>
            <TabsContent value='all'>
              {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className='aspect-video rounded-lg animate-pulse' />
                  ))}
                </div>
              ) : filteredTickets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className='hover:bg-gray-800 cursor-pointer'>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>
                          <Badge variant={ticket.status === 'Open' ? 'destructive' : ticket.status === 'Pending' ? 'secondary' : 'success'}>{ticket.status}</Badge>
                        </TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>{ticket.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='flex flex-col items-center justify-center h-full'>
                  <XCircle className='text-4xl opacity-50 mb-4' />
                  <p className='opacity-75'>No tickets found.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value='open'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Date Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets
                    .filter((ticket) => ticket.status === 'Open')
                    .map((ticket) => (
                      <TableRow key={ticket.id} className='hover:bg-gray-800 cursor-pointer'>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>{ticket.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value='pending'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Date Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets
                    .filter((ticket) => ticket.status === 'Pending')
                    .map((ticket) => (
                      <TableRow key={ticket.id} className='hover:bg-gray-800 cursor-pointer'>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>{ticket.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value='closed'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Date Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets
                    .filter((ticket) => ticket.status === 'Closed')
                    .map((ticket) => (
                      <TableRow key={ticket.id} className='hover:bg-gray-800 cursor-pointer'>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>{ticket.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <footer className='p-4 bg-gray-800'>
        <p className='text-center'>© 2023 Cyberpunk Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}