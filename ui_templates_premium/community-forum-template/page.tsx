'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import * as DialogRadix from '@radix-ui/react-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { TabsRadix, TabsContentRadix, TabsListRadix, TabsTriggerRadix } from '@radix-ui/react-tabs'
import { Switch } from '@radix-ui/react-switch'
import { Slider } from '@radix-ui/react-slider'
import { Plus, Search, Filter, ChevronRight, UserPlus, MessageCircle, Star, Trash2 } from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  content: z.string().min(20, {
    message: 'Content must be at least 20 characters.',
  }),
})

export default function CommunityForum() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      const mockData: Post[] = [
        { id: 1, title: 'Welcome to the Community!', content: 'This is the first post in our community forum...', author: 'Admin', date: '2023-10-01' },
        { id: 2, title: 'New Features Update', content: 'We have added some exciting new features to enhance your experience...', author: 'DevTeam', date: '2023-10-15' },
        { id: 3, title: 'How to Contribute?', content: 'If you want to contribute to our community...', author: 'Moderator', date: '2023-10-20' },
      ]
      setPosts(mockData)
      setFilteredPosts(mockData)
      setIsLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts)
      return
    }
    const filtered = posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredPosts(filtered)
  }, [searchQuery, posts])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values)
      // Simulate post creation
      const newPost: Post = {
        id: posts.length + 1,
        title: values.title,
        content: values.content,
        author: 'User',
        date: new Date().toISOString().split('T')[0],
      }
      setPosts(prevPosts => [...prevPosts, newPost])
      setFilteredPosts(prevPosts => [...prevPosts, newPost])
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      setIsError(true)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const shimmerEffect = `
    animate-shimmer
    relative
    overflow-hidden
    before:absolute
    before:inset-0
    before:-translate-x-full
    before:animate-[shimmer_1.5s_infinite]
    before:bg-gradient-to-r
    before:from-transparent
    before:via-white/10
    before:to-transparent
  `

  return (
    <>
      <header className='bg-gradient-to-tl from-secondary via-primary to-accent text-background py-6 px-4'>
        <div className='max-w-screen-xl mx-auto flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Community Forum</h1>
          <Button onClick={() => setIsOpen(true)} variant='default'>
            <Plus className='mr-2 w-4 h-4' /> New Post
          </Button>
        </div>
      </header>
      <main className='bg-background min-h-screen py-8'>
        <div className='max-w-screen-xl mx-auto px-4'>
          <div className='mb-6'>
            <Input
              placeholder='Search posts...'
              onChange={handleSearchChange}
              className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'
            />
          </div>
          <div className='space-y-4'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={`relative ${shimmerEffect}`}>                  <Card className='bg-gradient-to-tr from-secondary via-background to-primary text-background shadow-xl shadow-secondary/50 p-6 rounded-xl'>                    <Skeleton className='w-full h-5 mb-2' />                    <Skeleton className='w-3/4 h-3' />                  </Card>                </div>
              ))
            ) : isError ? (
              <p>Error loading posts.</p>
            ) : filteredPosts.length === 0 ? (
              <p>No posts found.</p>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className='bg-gradient-to-tr from-secondary via-background to-primary text-background shadow-xl shadow-secondary/50 p-6 rounded-xl'>
                  <CardHeader className='flex flex-row space-between justify-between items-start'>
                    <CardTitle>{post.title}</CardTitle>
                    <div className='flex gap-2'>                      <Badge variant='outline'>{post.author}</Badge>
                      <Badge>{new Date(post.date).toLocaleDateString()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>{post.content}</CardContent>
                  <CardFooter className='flex justify-end'>                    <Button variant='ghost'><Star className='mr-2 w-4 h-4' /> Like</Button>
                    <Button variant='ghost'><Trash2 className='mr-2 w-4 h-4' /> Delete</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <aside className='fixed left-0 bottom-0 w-full sm:w-1/4 bg-background shadow-xl shadow-secondary/50 p-4 rounded-t-lg sm:rounded-t-none sm:rounded-r-lg backdrop-blur-sm'>
        <Collapsible open={true}>
          <CollapsibleTrigger className='font-semibold'>Filters</CollapsibleTrigger>
          <CollapsibleContent className='mt-2'>
            <div className='space-y-2'>              <div className='flex items-center justify-between'>                <label htmlFor='sort' className='text-sm'>Sort by:</label>
                <Select defaultValue='latest'>                  <SelectTrigger id='sort' className='w-24'>                    <SelectValue placeholder='Latest' />                  </SelectTrigger>
                  <SelectContent>                    <SelectItem value='latest'>Latest</SelectItem>
                    <SelectItem value='oldest'>Oldest</SelectItem>
                  </SelectContent>                </Select>
              </div>
              <div className='flex items-center justify-between'>                <label htmlFor='tags' className='text-sm'>Tags:</label>
                <Select defaultValue='all'>                  <SelectTrigger id='tags' className='w-24'>                    <SelectValue placeholder='All' />                  </SelectTrigger>
                  <SelectContent>                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='news'>News</SelectItem>
                    <SelectItem value='updates'>Updates</SelectItem>
                  </SelectContent>                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </aside>
      <footer className='bg-gradient-to-tl from-secondary via-primary to-accent text-background py-4 px-4 mt-8'>
        <div className='max-w-screen-xl mx-auto text-center'>
          <p>&copy; 2023 Community Forum. All rights reserved.</p>
        </div>
      </footer>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='default'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className='bg-gradient-to-tr from-secondary via-background to-primary text-background shadow-2xl shadow-secondary/50 p-6 rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Enter the details of your new post below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter title...' {...field} />                    </FormControl>
                    <FormMessage />                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter content...' {...field} />                    </FormControl>
                    <FormMessage />                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>Create Post</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Shimmer animation
/** @keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
} */
