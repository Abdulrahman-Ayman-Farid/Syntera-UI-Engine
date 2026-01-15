'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, User, Users, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  author: string
  date: string
  content: string
}

const mockPosts: Post[] = [
  { id: 1, title: 'Welcome to Our Community!', author: 'Admin', date: '2023-10-01', content: 'This is the first post...' },
  { id: 2, title: 'Introducing New Features', author: 'Jane Doe', date: '2023-10-05', content: 'We have added some cool features...' }
]

const CommunityForumPage = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false)
      if (Math.random() > 0.9) {
        setError('Failed to load posts.')
      }
    }, 2000)
  }, [])

  useEffect(() => {
    // Filter posts based on search query
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredPosts(results)
  }, [searchQuery, posts])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className='bg-gradient-to-b from-#FFF9EB via-#F2C871 to-#D29E5D min-h-screen text-#2B2B2B'>
      <header className='p-6 shadow-sm bg-white/30 backdrop-blur-sm'>
        <nav className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Community Forum</h1>
          <div className='flex gap-4'>
            <Input
              placeholder='Search...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='w-64'
            />
            <Button variant='outline'>
              <Filter className='mr-2' /> Filters
            </Button>
            <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle Sidebar'>
              <Users className='mr-2' /> Members
            </Button>
          </div>
        </nav>
      </header>
      <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6'>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-56 rounded-lg' />
          ))
        ) : error ? (
          <div className='col-span-full flex justify-center items-center h-56 rounded-lg bg-white/30 backdrop-blur-sm shadow-sm'>
            <p>{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className='col-span-full flex justify-center items-center h-56 rounded-lg bg-white/30 backdrop-blur-sm shadow-sm'>
            <p>No posts found.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <Card key={post.id} className='transition-transform duration-300 hover:scale-105 rounded-2xl shadow-sm bg-white/30 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='font-semibold'>{post.title}</CardTitle>
                <p className='text-sm opacity-75'>{post.date}</p>
              </CardHeader>
              <CardContent className='pt-4'>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className='flex justify-end'>
                <Badge variant='outline' className='rounded-full'>
                  by {post.author}
                </Badge>
              </CardFooter>
            </Card>
          ))
        )}
      </main>
      <aside className={`fixed inset-y-0 right-0 w-64 bg-white/30 backdrop-blur-sm shadow-sm overflow-hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>n        <Collapsible open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <CollapsibleTrigger className='hidden md:block px-6 py-4'>Members</CollapsibleTrigger>
          <CollapsibleContent className='p-6'>
            <div className='space-y-4'>
              {[1, 2, 3, 4, 5].map(id => (
                <div key={id} className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${id}`} alt='User avatar' />
                  </Avatar>
                  <div>
                    <p className='font-medium'>Member {id}</p>
                    <p className='text-sm opacity-75'>Active today</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </aside>
      <footer className='p-6 bg-white/30 backdrop-blur-sm shadow-sm mt-auto'>
        <p className='text-center text-sm opacity-75'>© 2023 Community Forum. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default CommunityForumPage
