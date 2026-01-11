'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@radix-ui/react-dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Plus, Search, Filter, ChevronRight, Bell, User, Users, MessageCircle } from 'lucide-react'

interface User {
  id: number
  name: string
  avatar: string
}

const users: User[] = [
  { id: 1, name: 'Alice', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Bob', avatar: 'https://via.placeholder.com/40' }
]

const MessagingAppPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setMessages(['Hello!', 'How are you?', 'See you later!'])
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleSendMessage = () => {
    if (selectedUser && messages.length < 10) {
      setMessages([...messages, `Message to ${selectedUser.name}`])
    } else {
      alert('Maximum messages reached or select a user.')
    }
  }

  return (
    <div className='bg-background text-text min-h-screen'>
      <header className='p-4 flex justify-between items-center bg-primary text-white shadow-xl shadow-secondary/50'>
        <h1 className='text-2xl font-bold'>Messaging App</h1>
        <div className='flex space-x-4'>
          <button aria-label='Notifications' className='hover:bg-secondary rounded-full p-2'><Bell /></button>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label='Profile' className='hover:bg-secondary rounded-full p-2'><User /></DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/logout')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className='p-4 flex'>
        <aside className='hidden sm:block w-64 mr-4 bg-secondary shadow-xl shadow-secondary/50 rounded-2xl overflow-hidden'>
          <div className='p-4'>
            <div className='mb-4'>
              <Input placeholder='Search users...' className='bg-background/50' />
            </div>
            <Tabs defaultValue='chats'>
              <TabsList className='grid grid-cols-2'>
                <TabsTrigger value='chats'>Chats</TabsTrigger>
                <TabsTrigger value='groups'>Groups</TabsTrigger>
              </TabsList>
              <TabsContent value='chats'>
                <div className='space-y-2 mt-4'>
                  {users.map(user => (
                    <button key={user.id} onClick={() => setSelectedUser(user)} className={`block px-4 py-2 text-left rounded-lg hover:bg-accent/20 ${selectedUser?.id === user.id ? 'bg-accent/20' : ''}`}>{user.name}</button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='groups'>
                <div className='space-y-2 mt-4'>
                  <button className='block px-4 py-2 text-left rounded-lg hover:bg-accent/20'>Group Chat 1</button>
                  <button className='block px-4 py-2 text-left rounded-lg hover:bg-accent/20'>Group Chat 2</button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </aside>
        <div className='flex-grow bg-secondary shadow-xl shadow-secondary/50 rounded-2xl overflow-hidden relative'>
          <div className='p-4 flex justify-between items-center'>
            <div className='flex items-center'>
              {selectedUser ? (
                <>
                  <Avatar src={selectedUser.avatar} className='mr-2' />
                  <span>{selectedUser.name}</span>
                </>
              ) : (
                <span>Select a user to start chatting</span>
              )}
            </div>
            <button aria-label='More options' className='hover:bg-accent/20 rounded-full p-2'><ChevronRight /></button>
          </div>
          <div className='relative p-4 flex-grow overflow-y-auto'>
            {isLoading ? (
              <Skeleton className='h-12 mb-4' />
            ) : isError ? (
              <div className='text-red-500'>Failed to load messages.</div>
            ) : messages.length > 0 ? (
              <ul className='space-y-4'>
                {messages.map((message, index) => (
                  <li key={index} className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-accent/10' : 'bg-background/50'} shadow-sm`}>{message}</li>
                ))}
              </ul>
            ) : (
              <div className='text-gray-500'>No messages yet.</div>
            )}
            <div className='absolute bottom-0 left-0 right-0 p-4 bg-secondary/50'>
              <form onSubmit={(e) => e.preventDefault()} className='flex'>
                <Input placeholder='Type your message...' className='flex-grow mr-2 bg-background/50' />
                <Button type='submit' onClick={handleSendMessage}>Send</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <footer className='p-4 bg-primary text-white text-center'>
        <p>&copy; 2023 Messaging App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default MessagingAppPage