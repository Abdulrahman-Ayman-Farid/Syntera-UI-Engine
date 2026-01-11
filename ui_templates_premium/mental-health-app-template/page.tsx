'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Search, Filter, ChevronRight, UserCircle, TrendingUp, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: number
  name: string
  email: string
  status: string
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' }
]

export default function MentalHealthApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (value: string) => {
    setFilterStatus(value)
  }

  const filteredUsers = users.filter(user => {
    if (filterStatus === 'All') return true
    return user.status.toLowerCase() === filterStatus.toLowerCase()
  }).filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className='bg-gradient-to-b from-FF6B6B to-FE5D8D min-h-screen text-white'>
      <header className='p-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Mental Health Dashboard</h1>
        <div className='flex gap-4'>
          <Input
            placeholder='Search users...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='bg-white text-black px-4 py-2 rounded-lg'
          />
          <Button onClick={() => setShowModal(true)} variant='outline' className='border-none bg-white text-black rounded-lg px-4 py-2'>
            <Plus className='mr-2' /> Add New User
          </Button>
        </div>
      </header>
      <main className='p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='shadow-2xl rounded-2xl overflow-hidden relative'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Total Users</h2>
              <p className='mt-2 text-gray-300'>{filteredUsers.length}</p>
            </div>
            <UserCircle className='w-12 h-12 text-gray-300' />
          </CardContent>
          <CardFooter className='p-6'>
            <button className='bg-white text-black px-4 py-2 rounded-lg'>View All</button>
          </CardFooter>
        </Card>
        <Card className='shadow-2xl rounded-2xl overflow-hidden relative'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Active Users</h2>
              <p className='mt-2 text-gray-300'>{filteredUsers.filter(user => user.status === 'Active').length}</p>
            </div>
            <TrendingUp className='w-12 h-12 text-gray-300' />
          </CardContent>
          <CardFooter className='p-6'>
            <button className='bg-white text-black px-4 py-2 rounded-lg'>View Active</button>
          </CardFooter>
        </Card>
        <Card className='shadow-2xl rounded-2xl overflow-hidden relative'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Inactive Users</h2>
              <p className='mt-2 text-gray-300'>{filteredUsers.filter(user => user.status === 'Inactive').length}</p>
            </div>
            <AlertTriangle className='w-12 h-12 text-gray-300' />
          </CardContent>
          <CardFooter className='p-6'>
            <button className='bg-white text-black px-4 py-2 rounded-lg'>View Inactive</button>
          </CardFooter>
        </Card>
        <Card className='col-span-full shadow-2xl rounded-2xl overflow-hidden relative'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            {!isLoading ? (
              <Table className='text-white'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id} className='hover:bg-gray-800'>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size='icon' aria-label={`Edit ${user.name}`} className='bg-white text-black rounded-lg'>
                          <ChevronRight className='w-4 h-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Skeleton className='h-48' />
            )}
          </CardContent>
        </Card>
      </main>
      <footer className='p-6'>
        <p className='text-gray-300'>© 2023 Mental Health App. All rights reserved.</p>
      </footer>
      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/80 backdrop-blur-sm' />
          <Dialog.Content className='fixed w-full max-w-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 space-y-4 shadow-2xl animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-left-10'>
            <Dialog.Title className='text-2xl font-bold'>Add New User</Dialog.Title>
            <Form className='space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name</label>
                <Input id='name' placeholder='Enter name...' className='mt-1 block w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none' />
              </div>
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                <Input id='email' placeholder='Enter email...' className='mt-1 block w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none' />
              </div>
              <div>
                <label htmlFor='status' className='block text-sm font-medium text-gray-700'>Status</label>
                <Select onValueChange={handleFilterChange} defaultValue='Active'>
                  <SelectTrigger className='mt-1 block w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none'>
                    <SelectValue placeholder='Select status...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='All'>All</SelectItem>
                    <SelectItem value='Active'>Active</SelectItem>
                    <SelectItem value='Inactive'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type='submit' className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg'>Save</Button>
            </Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}