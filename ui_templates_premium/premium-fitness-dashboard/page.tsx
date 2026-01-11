'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, TrendingUp, UserCircle, Activity } from 'lucide-react'

interface UserData {
  id: number
  name: string
  avatar: string
  activityLevel: string
}

const mockUsers: UserData[] = [
  { id: 1, name: 'John Doe', avatar: '/avatars/john.jpg', activityLevel: 'High' },
  { id: 2, name: 'Jane Smith', avatar: '/avatars/jane.jpg', activityLevel: 'Medium' },
  { id: 3, name: 'Sam Johnson', avatar: '/avatars/sam.jpg', activityLevel: 'Low' }
]

export default function FitnessDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(mockUsers)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(mockUsers)
      return
    }
    const filtered = mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm])

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user)
    router.push(`/dashboard/user/${user.id}`)
  }

  return (
    <div className='bg-gradient-to-bl from-blue-950 via-blue-800 to-blue-700 min-h-screen text-white'>
      <header className='p-6 flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>Fitness Tracker</h1>
        <div className='flex space-x-4'>
          <Button variant='outline' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <ChevronRight className='w-4 h-4' />
          </Button>
          <Button variant='default'>Settings</Button>
        </div>
      </header>
      <main className='p-6'>
        <div className='mb-8'>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className='h-[200px]' />
                  ))
                ) : (
                  filteredUsers.map(user => (
                    <Card key={user.id} className='bg-blue-500/20 shadow-lg shadow-blue-900/50 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer' onClick={() => handleUserClick(user)}>
                      <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>Activity Level: {user.activityLevel}</CardDescription>
                      </CardHeader>
                      <CardContent className='flex flex-col items-center justify-center'>
                        <Avatar className='w-24 h-24'>
                          <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </CardContent>
                      <CardFooter className='flex items-center justify-between'>
                        <p className='text-xs text-blue-300'>View Profile</p>
                        <TrendingUp className='w-4 h-4 text-blue-300' />
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value='analytics'>
              <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                <Card className='bg-blue-500/20 shadow-lg shadow-blue-900/50'>
                  <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                    <CardDescription>Number of active users</CardDescription>
                  </CardHeader>
                  <CardContent className='text-3xl font-semibold'>{mockUsers.length}</CardContent>
                </Card>
                <Card className='bg-blue-500/20 shadow-lg shadow-blue-900/50'>
                  <CardHeader>
                    <CardTitle>Average Activity</CardTitle>
                    <CardDescription>Average activity level across users</CardDescription>
                  </CardHeader>
                  <CardContent className='text-3xl font-semibold'>High</CardContent>
                </Card>
                <Card className='col-span-2 row-span-2 bg-blue-500/20 shadow-lg shadow-blue-900/50'>
                  <CardHeader>
                    <CardTitle>User Activity Chart</CardTitle>
                  </CardHeader>
                  <CardContent className='relative'>
                    <Skeleton className='absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-gray-700/10 to-transparent' />
                    <canvas id='activityChart' className='w-full h-full'></canvas>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
          <Card className='bg-blue-500/20 shadow-lg shadow-blue-900/50'>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className='overflow-y-auto max-h-[300px]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Oct 1, 2023</TableCell>
                      <TableCell>30 mins</TableCell>
                      <TableCell className='text-right'>
                        <Badge variant='secondary'>Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className='bg-blue-500/20 shadow-lg shadow-blue-900/50'>
            <CardHeader>
              <CardTitle>User Insights</CardTitle>
              <CardDescription>Key metrics</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-blue-300'>Active Users</p>
                  <p className='font-semibold'>1,200</p>
                </div>
                <Plus className='w-4 h-4' />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-blue-300'>New Signups</p>
                  <p className='font-semibold'>200</p>
                </div>
                <UserCircle className='w-4 h-4' />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-blue-300'>Total Sessions</p>
                  <p className='font-semibold'>5,000</p>
                </div>
                <Activity className='w-4 h-4' />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className='p-6 bg-blue-800/50 backdrop-blur-md'>
        <p className='text-center'>© 2023 Fitness Tracker Inc. All rights reserved.</p>
      </footer>
      <Collapsible open={isSidebarOpen} className='fixed left-0 top-0 bottom-0 w-64 bg-blue-900 text-white overflow-y-auto'>
        <CollapsibleTrigger className='block w-full px-4 py-2 text-left hover:bg-blue-800'>Toggle Sidebar</CollapsibleTrigger>
        <CollapsibleContent className='py-2'>
          <div className='flex flex-col space-y-2'>
            <Button variant='ghost'>Dashboard</Button>
            <Button variant='ghost'>Users</Button>
            <Button variant='ghost'>Reports</Button>
            <Button variant='ghost'>Settings</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}