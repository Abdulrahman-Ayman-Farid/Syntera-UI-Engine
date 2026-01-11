'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import * as DialogRadix from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import * as TabsRadix from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Plus, Search, Filter, ChevronRight, UserCircle2, Mail, PhoneCall, ClipboardCheck, FolderPlus, ArrowUpRight, HelpCircle, Check, X, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const formSchema = z.object({
  email: z.string().email(),
  message: z.string().min(2).max(256),
})

export default function CustomerSupportPortal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tickets, setTickets] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Simulate fetching tickets
    const fetchTickets = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTickets(mockTickets)
      setIsLoading(false)
    }

    fetchTickets()
  }, [])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    if (event.target.value.length > 0) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }

  const handleSubmit = (values) => {
    console.log(values)
    toast.success('Message sent!')
  }

  const mockTickets = [
    { id: 1, title: 'Payment Issue', status: 'open', priority: 'high', assignedTo: 'John Doe' },
    { id: 2, title: 'Order Status', status: 'closed', priority: 'medium', assignedTo: 'Jane Smith' },
    { id: 3, title: 'Shipping Inquiry', status: 'pending', priority: 'low', assignedTo: 'Alice Johnson' },
  ]

  return (
    <div className='bg-gradient-to-bl from-cyan-50 via-blue-100 to-sky-100 min-h-screen flex flex-col'>
      <header className='bg-white p-6 shadow-lg flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle sidebar'>
            <ChevronRight className={isSidebarOpen ? 'rotate-180' : ''} />
          </button>
          <h1 className='text-2xl font-bold'>Customer Support</h1>
        </div>
        <div className='flex items-center gap-4'>
          <input
            type='text'
            placeholder='Search...'
            className='border rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            onChange={handleSearchChange}
          />{
            isSearching && (
              <ul className='absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                {mockTickets.filter(ticket => ticket.title.toLowerCase().includes(searchQuery.toLowerCase())).map(ticket => (
                  <li key={ticket.id} className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => setSelectedTicket(ticket)}>{ticket.title}</li>
                ))}
              </ul>
            )
          }</div>
      </header>
      <main className='flex flex-grow p-6'>
        <aside className={`w-64 ${isSidebarOpen ? 'block' : 'hidden'} md:block mr-6 bg-white shadow-lg rounded-lg p-4`}>{
          isLoading ? (
            <Skeleton className='h-[500px]' />
          ) : (
            <>
              <h2 className='text-lg font-semibold mb-4'>Tickets</h2>
              <div className='space-y-2'>{
                tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className={`p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-gray-100' : ''}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className='flex items-center justify-between'>
                      <span>{ticket.title}</span>
                      <Badge variant={ticket.status}>{ticket.status}</Badge>
                    </div>
                    <small className='text-gray-500'>{ticket.priority} | Assigned to {ticket.assignedTo}</small>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
        <section className='flex-grow bg-white shadow-lg rounded-lg p-6'>{
          selectedTicket ? (
            <>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>{selectedTicket.title}</h2>
                <Button variant='destructive' size='icon' onClick={() => setSelectedTicket(null)}><X /></Button>
              </div>
              <div className='mb-4'>
                <p>Status: <Badge variant={selectedTicket.status}>{selectedTicket.status}</Badge></p>
                <p>Priority: {selectedTicket.priority}</p>
                <p>Assigned To: {selectedTicket.assignedTo}</p>
              </div>
              <div className='border-t border-dashed pt-4'>
                <h3 className='text-lg font-semibold mb-2'>Conversation</h3>
                <div className='space-y-4'>
                  <div className='bg-gray-100 p-4 rounded-lg flex items-start'>
                    <Avatar className='mr-4'>
                      <AvatarImage src='https://via.placeholder.com/40' alt='User avatar' />
                      <AvatarFallback>JJ</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <p className='font-medium'>John Doe</p>
                      <p>This is a sample message from the user.</p>
                    </div>
                  </div>
                  <div className='bg-gray-100 p-4 rounded-lg flex items-start'>
                    <Avatar className='mr-4'>
                      <AvatarImage src='https://via.placeholder.com/40' alt='Admin avatar' />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <p className='font-medium'>Alice Johnson</p>
                      <p>Thank you for reaching out. We will look into your issue immediately.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4'>
                <h3 className='text-lg font-semibold mb-2'>Reply</h3>
                <Form {...useForm({ resolver: zodResolver(formSchema) })} onSubmit={handleSubmit}>
                  <FormField
                    control={control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='Email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='message'
                    render={({ field }) => (
                      <FormItem className='mb-4'>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea
                            className='border rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full h-32'
                            placeholder='Type your message here...'
                            {...field}
                          ></textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' disabled={isLoading || !isValid}>
                    {isLoading ? <Loader2 className='animate-spin' /> : 'Send Message'}
                  </Button>
                </Form>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center h-full'>
              <HelpCircle className='text-4xl text-gray-300 mb-4' />
              <p className='text-lg text-gray-500'>No ticket selected</p>
            </div>
          )}
        </section>
      </main>
      <footer className='bg-white p-6 text-center'>
        <p>&copy; 2023 Customer Support Portal. All rights reserved.</p>
      </footer>
    </div>
  )
}