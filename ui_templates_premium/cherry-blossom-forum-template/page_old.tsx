'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, UserCircle2, Users, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type User = {
  id: number
  name: string
  avatarUrl?: string
}

type Post = {
  id: number
  title: string
  content: string
  author: User
  createdAt: Date
}

const users: User[] = [
  { id: 1, name: 'Alice', avatarUrl: '/avatars/alice.png' },
  { id: 2, name: 'Bob', avatarUrl: '/avatars/bob.png' },
]

const posts: Post[] = [
  { id: 1, title: 'Welcome to the Forum!', content: 'This is the first post...', author: users[0], createdAt: new Date() },
  { id: 2, title: 'Introducing New Features', content: 'Check out these cool updates...', author: users[1], createdAt: new Date() }
]

const CherryBlossomForumTemplate = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(posts)

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  useEffect(() => {
    // Filter posts based on search term
    if (searchTerm === '') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const openPostDialog = (post: Post) => {
    setSelectedPost(post)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setSelectedPost(null)
    setDialogOpen(false)
  }

  return (
    <div className='bg-gradient-to-tr from-rose-100 via-pink-100 to-white min-h-screen'>
      <header className='flex items-center justify-between p-6 bg-white shadow-2xl rounded-b-2xl'>
        <div className='flex items-center space-x-4'>
          <button className='p-2 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors duration-300'>
            <Plus size={24} aria-label='Add new post' />
          </button>
          <h1 className='text-3xl font-bold'>Cherry Blossom Forum</h1>
        </div>
        <div className='relative w-full max-w-xs'>
          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='pl-10'
            aria-label='Search forum'
          />
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
        </div>
      </header>
      <main className='mt-8 px-6'>
        <div className='overflow-auto'>
          <div className='flex space-x-6'>
            <section className='w-[300px] flex-shrink-0 bg-white rounded-2xl shadow-lg p-6'>
              <h2 className='text-xl font-semibold mb-4'>Categories</h2>
              <ul className='space-y-2'>
                <li>
                  <Button variant='ghost' className='w-full justify-start rounded-lg'>
                    <Users className='mr-2' /> General Discussion
                  </Button>
                </li>
                <li>
                  <Button variant='ghost' className='w-full justify-start rounded-lg'>
                    <MessageCircle className='mr-2' /> Announcements
                  </Button>
                </li>
              </ul>
            </section>
            <section className='flex-grow bg-white rounded-2xl shadow-lg p-6'>
              <h2 className='text-xl font-semibold mb-4'>Recent Posts</h2>
              {isLoading ? (
                <div className='space-y-4'>
                  {[1, 2].map((index) => (
                    <Skeleton key={index} className='h-16 rounded-lg' />
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id} onClick={() => openPostDialog(post)} className='cursor-pointer hover:bg-pink-50 transition-colors duration-300'>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage src={post.author.avatarUrl ?? ''} alt={`${post.author.name}'s avatar`} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{post.author.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Intl.DateTimeFormat('en-US').format(post.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='text-center mt-8'>
                  <p>No posts found.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <footer className='bg-white shadow-2xl rounded-t-2xl py-4 px-6 mt-8'>
        <p className='text-center text-gray-500'>© 2023 Cherry Blossom Forum. All rights reserved.</p>
      </footer>
      <Dialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
          <Dialog.Content className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6'>
            <Dialog.Title className='text-2xl font-bold mb-4'>Post Details</Dialog.Title>
            {selectedPost && (
              <div>
                <h3 className='text-xl font-semibold'>{selectedPost.title}</h3>
                <div className='flex items-center space-x-2 mt-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={selectedPost.author.avatarUrl ?? ''} alt={`${selectedPost.author.name}'s avatar`} />
                    <AvatarFallback>{selectedPost.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{selectedPost.author.name}</span>
                  <span className='text-gray-500'>•</span>
                  <span>{new Intl.DateTimeFormat('en-US').format(selectedPost.createdAt)}</span>
                </div>
                <p className='mt-4'>{selectedPost.content}</p>
              </div>
            )}
            <Dialog.Close className='mt-6'>
              <Button variant='outline' onClick={closeDialog}>
                Close
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default CherryBlossomForumTemplate