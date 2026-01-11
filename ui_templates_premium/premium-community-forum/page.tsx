'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, UserCircle2, MessageSquare, Users, BarChart, PieChart, ArrowLeft, ArrowRight } from 'lucide-react'

const users = [
  { id: '1', name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' }
]

const posts = [
  { id: '1', title: 'Welcome to the Community!', author: 'John Doe', content: 'This is the first post in our community forum.', date: '2 days ago' },
  { id: '2', title: 'Introducing New Features', author: 'Jane Smith', content: 'Check out the latest updates and features we have added.', date: '1 day ago' }
]

const statistics = {
  totalUsers: 1234,
  totalPosts: 5678,
  activeUsers: 987,
  newUsersToday: 45
}

export default function Home() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    setFilteredPosts(
      posts.filter((post) =>
        post.title.toLowerCase().includes(term) || post.author.toLowerCase().includes(term)
      )
    )
  }

  if (isLoading) return <div className='flex justify-center items-center h-screen'><Skeleton className='w-full max-w-sm h-48'/></div>
  if (error) return <div className='p-4'>Error: {error.message}</div>

  return (
    <div className='bg-[#1e1f2f] text-white min-h-screen overflow-x-hidden relative'>
      {/* Background Mesh Gradient */}
      <div className='absolute inset-0 pointer-events-none bg-[url(\'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M10 10L50 50L90 10\" stroke=\"#8b5cf6\" stroke-width=\"2\" fill=\"none\"/></svg>\')] opacity-20'></div>

      <header className='py-6 px-4 flex justify-between items-center bg-transparent backdrop-blur-sm z-10 sticky top-0'>
        <div className='flex items-center space-x-4'>
          <ChevronRight className='md:hidden' size={24} aria-label='Toggle Menu' />
          <h1 className='text-2xl font-bold'>Community Forum</h1>
        </div>
        <div className='space-x-4'>
          <button className='bg-[#2d2f4a] p-2 rounded-lg shadow-lg hover:bg-[#3c3f62]' aria-label='Notifications'>
            <BellIcon size={20} />
          </button>
          <Avatar className='cursor-pointer'>
            <AvatarImage src='https://via.placeholder.com/150' alt='User Avatar' />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className='px-4 py-6 relative'>
        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Overview</h2>
            <Button variant='outline' className='bg-[#2d2f4a] hover:bg-[#3c3f62]'>View All</Button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <Card className='shadow-lg backdrop-blur-sm bg-[#2d2f4a] hover:scale-105 transform transition-transform duration-300 ease-in-out'>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>{statistics.totalUsers.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            <Card className='shadow-lg backdrop-blur-sm bg-[#2d2f4a] hover:scale-105 transform transition-transform duration-300 ease-in-out'>
              <CardHeader>
                <CardTitle>Total Posts</CardTitle>
                <CardDescription>{statistics.totalPosts.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            <Card className='shadow-lg backdrop-blur-sm bg-[#2d2f4a] hover:scale-105 transform transition-transform duration-300 ease-in-out'>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>{statistics.activeUsers.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            <Card className='shadow-lg backdrop-blur-sm bg-[#2d2f4a] hover:scale-105 transform transition-transform duration-300 ease-in-out'>
              <CardHeader>
                <CardTitle>New Users Today</CardTitle>
                <CardDescription>{statistics.newUsersToday.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Recent Activity</h2>
            <Button variant='outline' className='bg-[#2d2f4a] hover:bg-[#3c3f62]'>Refresh</Button>
          </div>
          <Table className='shadow-lg backdrop-blur-sm bg-[#2d2f4a]'>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id} className='hover:bg-[#3c3f62] cursor-pointer' onClick={() => router.push(`/posts/${post.id}`)}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Members</h2>
            <Button variant='outline' className='bg-[#2d2f4a] hover:bg-[#3c3f62]'>See All</Button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {users.map((user) => (
              <Card key={user.id} className='shadow-lg backdrop-blur-sm bg-[#2d2f4a] hover:scale-105 transform transition-transform duration-300 ease-in-out'>
                <CardContent className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={`${user.name}'s Avatar`} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>{user.name}</p>
                    <p className='text-sm opacity-75'>Member Since X Months Ago</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Create Post</h2>
          </div>
          <Card className='shadow-lg backdrop-blur-sm bg-[#2d2f4a] p-6'>
            <form className='space-y-4'>
              <Input placeholder='Title...' className='bg-[#3c3f62] text-white' />n              <textarea placeholder='Write your post here...' className='w-full bg-[#3c3f62] text-white p-2 rounded-lg resize-y'></textarea>
              <div className='flex justify-end'>
                <Button className='bg-[#8b5cf6] hover:bg-purple-600'>Post</Button>
              </div>
            </form>
          </Card>
        </section>
      </main>

      <footer className='py-6 px-4 flex justify-center items-center bg-transparent backdrop-blur-sm z-10 sticky bottom-0'>
        <p className='text-sm opacity-75'>© 2023 Community Forum. All rights reserved.</p>
      </footer>
    </div>
  )
}