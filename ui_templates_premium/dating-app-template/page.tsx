'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import * as TabsRadix from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { Plus, Search, Filter, ChevronRight, Heart, MessageCircle, UserPlus, ArrowLeft, ArrowRight } from 'lucide-react'

type UserProfile = {
  id: number,
  name: string,
  age: number,
  bio: string,
  imageUrl: string,
  matchPercentage: number
}

const initialUsers: UserProfile[] = [
  { id: 1, name: 'Alice Johnson', age: 28, bio: 'Loves hiking and trying new foods.', imageUrl: '/images/alice.jpg', matchPercentage: 85 },
  { id: 2, name: 'Bob Smith', age: 34, bio: 'Musician by night, gamer by day.', imageUrl: '/images/bob.jpg', matchPercentage: 70 },
  { id: 3, name: 'Charlie Brown', age: 22, bio: 'Graphic designer with a passion for art.', imageUrl: '/images/charlie.jpg', matchPercentage: 60 },
  // Add more users here...
]

export default function HomePage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setLoading(true)
    setTimeout(() => {
      setUsers(initialUsers)
      setLoading(false)
    }, 1500)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
           (filter === 'all' || filter === 'new' ? true : user.matchPercentage > parseInt(filter))
  })

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-tr from-primary via-secondary to-background'>
        <Skeleton className='w-1/2 h-64 animate-pulse' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-tr from-primary via-secondary to-background text-red-500'>
        <p>Error loading users: {error}</p>
      </div>
    )
  }

  return (
    <div className='bg-gradient-to-tr from-primary via-secondary to-background min-h-screen overflow-hidden'>
      <header className='sticky top-0 z-50 bg-background/80 backdrop-blur-sm shadow-xl py-4 px-6 flex justify-between items-center'>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle sidebar'>
          <ArrowLeft className='w-6 h-6' /> {isSidebarOpen ? 'Close' : 'Filters'}
        </button>
        <h1 className='text-2xl font-bold text-accent'>MatchMe</h1>
        <div className='relative w-64'>
          <Input
            placeholder='Search...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='pl-10 pr-4 py-2 rounded-full bg-accent/10 focus:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          />
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
        </div>
      </header>

      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-background/80 backdrop-blur-sm shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>n        <button className='absolute top-4 right-4' onClick={() => setIsSidebarOpen(false)} aria-label='Close sidebar'>
          <ArrowRight className='w-6 h-6' />
        </button>
        <div className='py-6 px-4'>
          <h2 className='text-xl font-semibold mb-4'>Filters</h2>
          <FormField
            control={form.control}
            name='filter'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Match Percentage</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => setFilter(value)}
                    defaultValue='all'
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select match percentage' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      <SelectItem value='50'>Above 50%</SelectItem>
                      <SelectItem value='70'>Above 70%</SelectItem>
                      <SelectItem value='80'>Above 80%</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </aside>

      <main className='mt-20 pb-10 relative pl-6 pr-6 sm:pr-12 md:pr-16 lg:pr-20 xl:pr-24'>
        <div className='mb-6'>
          <Tabs defaultValue='matches'>
            <TabsList className='grid grid-cols-2 gap-2'>
              <TabsTrigger value='matches'>Matches</TabsTrigger>
              <TabsTrigger value='favorites'>Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value='matches'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {filteredUsers.map(user => (
                  <Card key={user.id} className='bg-background/80 backdrop-blur-sm shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300 ease-in-out'>
                    <CardHeader>
                      <Avatar className='mx-auto'>
                        <AvatarImage src={user.imageUrl} alt={`${user.name}'s avatar`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <CardTitle className='text-center mt-2'>{user.name}</CardTitle>
                      <CardDescription className='text-center'>{user.age}</CardDescription>
                    </CardHeader>
                    <CardContent className='text-center'>
                      <p className='text-sm text-gray-400'>{user.bio}</p>
                      <Progress value={user.matchPercentage} className='my-4' />
                      <div className='flex justify-center gap-2'>
                        <Button variant='default' size='icon' aria-label='Send message'>
                          <MessageCircle className='w-4 h-4' />
                        </Button>
                        <Button variant='default' size='icon' aria-label='Add friend'>
                          <UserPlus className='w-4 h-4' />
                        </Button>
                        <Button variant='default' size='icon' aria-label='Like'>
                          <Heart className='w-4 h-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value='favorites'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {/* Render favorite users here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className='fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm shadow-xl py-4 px-6 flex justify-center items-center'>
        <Button variant='default' size='lg' className='w-full max-w-sm'>Load More Matches</Button>
      </footer>
    </div>
  )
}