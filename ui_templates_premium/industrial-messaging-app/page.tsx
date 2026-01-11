'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import { Plus, Search, Filter, ChevronRight, User, Users, Bell, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
}

const formSchema = z.object({
  message: z.string().nonempty('Message is required'),
})

export default function MessagingApp() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      const mockData = [
        { id: 1, sender: 'Alice', content: 'Hello Bob!', timestamp: '10:00 AM' },
        { id: 2, sender: 'Bob', content: 'Hi Alice!', timestamp: '10:01 AM' },
        { id: 3, sender: 'Alice', content: 'How are you?', timestamp: '10:02 AM' },
        { id: 4, sender: 'Bob', content: 'Doing great! And you?', timestamp: '10:03 AM' },
      ]
      setMessages(mockData)
      setFilteredMessages(mockData)
      setIsLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    // Filter messages based on search query
    if (!searchQuery) {
      setFilteredMessages(messages)
    } else {
      const filtered = messages.filter((msg) =>
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMessages(filtered)
    }
  }, [searchQuery, messages])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulate sending message
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessages([...messages, { id: Date.now(), sender: 'Alice', content: values.message, timestamp: new Date().toLocaleTimeString() }])
      form.reset()
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-[#1F2937] text-white min-h-screen flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl z-50'>
        <div className='flex items-center gap-4'>
          <button onClick={() => router.back()} className='p-2 rounded-full hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <ChevronRight className='w-5 h-5 transform rotate-180' aria-hidden='true' />
          </button>
          <span className='font-semibold'>Messaging</span>
        </div>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <Search className='w-5 h-5' aria-hidden='true' />
            <span className='sr-only'>Search Messages</span>
          </Button>
          <DialogTrigger asChild>
            <Button variant='ghost' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
              <Bell className='w-5 h-5' aria-hidden='true' />
              <span className='sr-only'>Notifications</span>
            </Button>
          </DialogTrigger>
          <Button variant='ghost' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            <Settings className='w-5 h-5' aria-hidden='true' />
            <span className='sr-only'>Settings</span>
          </Button>
        </div>
      </header>
      <main className='flex flex-1 overflow-y-auto'>
        <aside className='hidden md:flex flex-col w-64 bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl p-6 space-y-4'>
          <Input placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='border-b border-b-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500' />
          <Tabs defaultValue='chats'>
            <TabsList className='space-x-2'>
              <TabsTrigger value='chats'>Chats</TabsTrigger>
              <TabsTrigger value='groups'>Groups</TabsTrigger>
            </TabsList>
            <TabsContent value='chats'>
              <ul className='mt-4'>
                {[...Array(5)].map((_, i) => (
                  <li key={i} className='flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                    <Avatar>
                      <AvatarImage src={`https://example.com/user${i + 1}.jpg`} alt={`User ${i + 1}`} />
                      <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                    </Avatar>
                    <span>User {i + 1}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value='groups'>
              <ul className='mt-4'>
                {[...Array(3)].map((_, i) => (
                  <li key={i} className='flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                    <Avatar>
                      <AvatarImage src={`https://example.com/group${i + 1}.jpg`} alt={`Group ${i + 1}`} />
                      <AvatarFallback>{`G${i + 1}`}</AvatarFallback>
                    </Avatar>
                    <span>Group {i + 1}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </aside>
        <section className='flex-1 p-6'>
          <div className='mb-4'>
            <Input
              placeholder='Search messages...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full border-b border-b-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            />
          </div>
          <div className='space-y-4'>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-20 rounded-lg' />
              ))
            ) : isError ? (
              <p>Error loading messages.</p>
            ) : filteredMessages.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              filteredMessages.map((msg) => (
                <Card key={msg.id} className='bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-lg p-4'>
                  <CardHeader>
                    <CardTitle className='text-lg font-semibold'>{msg.sender}</CardTitle>
                  </CardHeader>
                  <CardContent className='py-2'>
                    <p>{msg.content}</p>
                  </CardContent>
                  <CardFooter className='text-right text-xs'>
                    {msg.timestamp}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          <Form {...form} onSubmit={onSubmit} className='mt-6'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex items-center gap-2'>
                  <FormControl>
                    <Input
                      placeholder='Type your message here...'
                      className='flex-1 border-b border-b-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                      {...field}
                    />
                  </FormControl>
                  <Button disabled={isLoading} className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                    Send
                  </Button>
                </FormItem>
              )}
            />
          </Form>
        </section>
      </main>
      <footer className='flex items-center justify-center px-6 py-4 bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl'>
        <span className='text-sm'>© 2023 Industrial Messaging Inc.</span>
      </footer>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-lg p-6'>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Stay up-to-date with the latest notifications.
          </DialogDescription>
          <div className='mt-4 space-y-4'>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className='bg-black bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-lg p-4'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>New Message</CardTitle>
                </CardHeader>
                <CardContent className='py-2'>
                  <p>You have a new message from User {i + 1}</p>
                </CardContent>
                <CardFooter className='text-right text-xs'>
                  Just now
                </CardFooter>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant='default' className='hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
              Mark All as Read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}