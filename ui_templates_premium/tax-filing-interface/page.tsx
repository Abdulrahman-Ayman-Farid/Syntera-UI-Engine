'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Filter, ChevronRight, ArrowUpRight, FileText, FolderPlus, Info } from 'lucide-react'

interface UserData {
  id: number
  name: string
  email: string
  status: string
}

const mockUsers: UserData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
  { id: 3, name: 'Sam Johnson', email: 'sam@example.com', status: 'inactive' }
]

const TaxFilingInterface = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<null | UserData>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='bg-gradient-to-tr from-magenta to-cyan min-h-screen text-white flex'>
      <aside className='fixed w-64 h-full bg-black p-6 space-y-8 shadow-2xl transition-transform duration-300 ease-in-out transform translate-x-0 sm:translate-x-0 md:translate-x-0 lg:translate-x-0 xl:translate-x-0 2xl:translate-x-0'>
        <div className='flex items-center justify-between'>
          <span className='font-bold text-2xl'>Tax Filer</span>
          <button className='hover:bg-gray-800 p-2 rounded-full'>
            <Info size={24} aria-hidden='true' />
          </button>
        </div>
        <nav className='space-y-4'>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-800'>
                  <FileText size={24} /> Dashboard
                </button>
              </TooltipTrigger>
              <TooltipContent>Go to Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg hover:bg-gray-800'>
                  <FolderPlus size={24} /> New Tax Filing
                </button>
              </TooltipTrigger>
              <TooltipContent>Create New Tax Filing</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <main className='ml-64 p-6 flex-grow space-y-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold'>Welcome Back!</h1>
          <p className='text-lg opacity-75'>Manage your tax filings efficiently.</p>
        </header>
        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Input placeholder='Search users...' className='max-w-sm' />
            <Button variant='outline' className='border-dashed'>
              <Filter size={16} className='mr-2' /> Filters
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} onClick={() => handleUserClick(user)} className='cursor-pointer hover:bg-gray-800'>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <ArrowUpRight size={24} className='transition-transform duration-300 ease-in-out transform hover:scale-110' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Recent Activity</h2>
          <Tabs defaultValue='overview' className='w-[400px]'>
            <TabsList className='grid grid-cols-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='space-y-4'>
                <Card className='bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Tax Year 2022</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex justify-between space-x-4'>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Income</p>
                        <p className='text-sm font-medium'>$50,000</p>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Expenses</p>
                        <p className='text-sm font-medium'>$20,000</p>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Tax Due</p>
                        <p className='text-sm font-medium'>$8,000</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Tax Year 2021</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex justify-between space-x-4'>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Income</p>
                        <p className='text-sm font-medium'>$45,000</p>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Expenses</p>
                        <p className='text-sm font-medium'>$18,000</p>
                      </div>
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Tax Due</p>
                        <p className='text-sm font-medium'>$7,000</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='details'>
              <div className='space-y-4'>
                <Card className='bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>No payments made yet.</p>
                  </CardContent>
                </Card>
                <Card className='bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Refunds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>No refunds available.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Dialog.Root open={!!selectedUser} onOpenChange={handleCloseModal}>
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black bg-opacity-50 fixed inset-0' />
          <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-black p-6 shadow-2xl outline-none focus:outline-none animate-fadeIn'>
            <Dialog.Title className='text-2xl font-bold'>User Details</Dialog.Title>
            <Dialog.Description className='mt-2 mb-4'>View and manage details for selected user.</Dialog.Description>
            <div className='space-y-4'>
              {selectedUser && (
                <div className='flex items-center space-x-4'>
                  <Avatar className='h-16 w-16'>
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-xl'>{selectedUser.name}</p>
                    <p className='opacity-75'>{selectedUser.email}</p>
                  </div>
                </div>
              )}
              <div className='grid grid-cols-2 gap-4'>
                <Card className='bg-gradient-to-br from-cyan-900 via-blue-900 to-violet-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Income</CardTitle>
                  </CardHeader>
                  <CardContent>$10,000</CardContent>
                </Card>
                <Card className='bg-gradient-to-br from-pink-900 via-red-900 to-orange-900 rounded-2xl shadow-2xl'>
                  <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>$4,000</CardContent>
                </Card>
              </div>
              <Button className='w-full mt-4'>Edit User</Button>
            </div>
            <Dialog.Close className='absolute top-4 right-4 rounded-full opacity-70 transition-opacity hover:opacity-100'>×</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default TaxFilingInterface
