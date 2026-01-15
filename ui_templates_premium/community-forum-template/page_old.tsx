'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Heart, Share2, Users, Send, Search, Filter,
  Plus, Edit, Trash, Bell, AtSign, Hash, ThumbsUp, Eye,
  Bookmark, TrendingUp, ChevronRight, UserPlus, Clock,
  Pin, Star, Award, Zap, Activity, BarChart3, PieChart
} from 'lucide-react'

// Forum metrics with type safety
const FORUM_METRICS = [
  {
    id: 'total_threads',
    label: 'Total Threads',
    value: '24,856',
    change: '+1,245',
    status: 'increasing' as const,
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    format: 'count'
  },
  {
    id: 'active_users',
    label: 'Active Users',
    value: '8,432',
    change: '+12%',
    status: 'increasing' as const,
    icon: Users,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'total_posts',
    label: 'Total Posts',
    value: '156.2k',
    change: '+24%',
    status: 'increasing' as const,
    icon: Send,
    color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'engagement_rate',
    label: 'Engagement Rate',
    value: '87',
    unit: '%',
    change: '+5%',
    status: 'good' as const,
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    format: 'percent'
  }
] as const

const FORUM_CATEGORIES = [
  { id: 'general', name: 'General Discussion', threads: 4520, posts: 28400, color: '#FFD700' },
  { id: 'announcements', name: 'Announcements', threads: 245, posts: 3200, color: '#EAB308' },
  { id: 'help', name: 'Help & Support', threads: 3890, posts: 42100, color: '#3F3F46' },
  { id: 'feedback', name: 'Feedback', threads: 1680, posts: 12800, color: '#78350f' },
] as const

const TRENDING_THREADS = [
  {
    id: 'thread-001',
    title: 'Welcome to our community! Introduce yourself here',
    author: {
      username: 'admin',
      displayName: 'Community Admin',
      avatar: '👨‍💼',
      reputation: 9842
    },
    category: 'general',
    replies: 1284,
    views: 45620,
    likes: 892,
    isPinned: true,
    createdAt: '2024-01-10T08:00:00Z',
    lastActivity: '2 min ago',
    tags: ['welcome', 'introduction']
  },
  {
    id: 'thread-002',
    title: 'Best practices for community engagement in 2024',
    author: {
      username: 'sarah_m',
      displayName: 'Sarah Mitchell',
      avatar: '👩‍💻',
      reputation: 5420
    },
    category: 'general',
    replies: 428,
    views: 12450,
    likes: 324,
    isPinned: false,
    createdAt: '2024-01-12T10:30:00Z',
    lastActivity: '15 min ago',
    tags: ['engagement', 'tips']
  },
  {
    id: 'thread-003',
    title: 'How to use the new forum features?',
    author: {
      username: 'john_d',
      displayName: 'John Doe',
      avatar: '👨‍🎨',
      reputation: 3245
    },
    category: 'help',
    replies: 156,
    views: 5890,
    likes: 124,
    isPinned: false,
    createdAt: '2024-01-13T14:20:00Z',
    lastActivity: '1 hour ago',
    tags: ['help', 'features']
  },
  {
    id: 'thread-004',
    title: 'Community guidelines and rules - Please read!',
    author: {
      username: 'moderator',
      displayName: 'Forum Moderator',
      avatar: '🛡️',
      reputation: 8924
    },
    category: 'announcements',
    replies: 89,
    views: 18240,
    likes: 456,
    isPinned: true,
    createdAt: '2024-01-08T09:00:00Z',
    lastActivity: '3 hours ago',
    tags: ['rules', 'guidelines']
  },
] as const

const ACTIVITY_DATA = [
  { day: 'Mon', posts: 420, threads: 85, users: 1240 },
  { day: 'Tue', posts: 580, threads: 92, users: 1580 },
  { day: 'Wed', posts: 720, threads: 105, users: 1820 },
  { day: 'Thu', posts: 890, threads: 120, users: 2140 },
  { day: 'Fri', posts: 950, threads: 135, users: 2280 },
  { day: 'Sat', posts: 680, threads: 98, users: 1890 },
  { day: 'Sun', posts: 540, threads: 78, users: 1450 },
] as const

const TOP_CONTRIBUTORS = [
  { username: 'sarah_m', posts: 2456, reputation: 5420, avatar: '👩‍💻', badge: 'Expert' },
  { username: 'john_d', posts: 1842, reputation: 3245, avatar: '👨‍🎨', badge: 'Helper' },
  { username: 'emily_r', posts: 1624, reputation: 2890, avatar: '👩‍🔬', badge: 'Active' },
  { username: 'michael_k', posts: 1389, reputation: 2456, avatar: '👨‍🚀', badge: 'Contributor' },
] as const

export default function CommunityForumDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
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
