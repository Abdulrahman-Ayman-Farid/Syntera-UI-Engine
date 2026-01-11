'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Plus, Search, Filter, ChevronRight, Info, Terminal, Key, AlertCircle } from 'lucide-react'

const mockData = [
  { id: 1, name: 'User Management', endpoint: '/api/users', method: 'GET', status: 'active' },
  { id: 2, name: 'Product List', endpoint: '/api/products', method: 'POST', status: 'inactive' }
]

export default function ApiDocDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setData(mockData)
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (value) => {
    setFilterStatus(value)
  }

  const filteredData = data.filter((item) => {
    if (filterStatus === 'all') {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return item.status === filterStatus && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className='bg-gradient-to-r from-[#0F2027] via-[#1E3A8A] to-[#0D47A1] text-white min-h-screen flex flex-col'>
      <header className='p-6 bg-opacity-80 backdrop-blur-md shadow-2xl z-10 sticky top-0'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-bold'>API Documentation</h1>
          <div className='space-x-4'>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className='group relative inline-flex items-center justify-center p-2 rounded-full cursor-pointer bg-teal-900 text-white hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                    <Info className='w-5 h-5' aria-hidden='true' />
                    <span className='sr-only'>Information</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className='bg-black/80 text-white rounded-lg p-2'>More info about the API</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant='default' onClick={() => setIsModalOpen(true)}><Plus /> New Endpoint</Button>
          </div>
        </div>
      </header>
      <main className='flex-1 p-6 space-y-8 overflow-auto'>
        <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-transparent backdrop-blur-sm shadow-2xl rounded-2xl p-6 space-y-4'>
            <h2 className='text-2xl font-semibold'>Quick Actions</h2>
            <div className='flex space-x-4'>
              <Button variant='secondary'><Terminal /> Test API</Button>
              <Button variant='secondary'><Key /> Generate Keys</Button>
            </div>
          </div>
          <div className='bg-transparent backdrop-blur-sm shadow-2xl rounded-2xl p-6 space-y-4'>
            <h2 className='text-2xl font-semibold'>Statistics</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Card className='hover:scale-105 transition-transform duration-300'>
                <CardHeader className='pb-2'>
                  <CardTitle>Requests</CardTitle>
                  <CardDescription>Total requests made today</CardDescription>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='text-3xl font-bold'>1,234</div>
                  <Progress value={80} className='mt-4' />
                </CardContent>
              </Card>
              <Card className='hover:scale-105 transition-transform duration-300'>
                <CardHeader className='pb-2'>
                  <CardTitle>Errors</CardTitle>
                  <CardDescription>Error rate percentage</CardDescription>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='text-3xl font-bold'>5%</div>
                  <Progress value={5} className='mt-4' />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className='bg-transparent backdrop-blur-sm shadow-2xl rounded-2xl p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Endpoints</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search endpoints...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='border border-teal-900 focus:border-teal-700 focus:ring-teal-700 focus:ring-offset-black'
              />
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className='group relative inline-flex items-center justify-center p-2 rounded-full cursor-pointer bg-teal-900 text-white hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                      <Filter className='w-5 h-5' aria-hidden='true' />
                      <span className='sr-only'>Filter</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className='bg-black/80 text-white rounded-lg p-2'>Filter endpoints by status</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {showFilters ? (
                <div className='absolute right-0 mt-2 w-48 bg-black/80 rounded-lg p-2'>
                  <Select defaultValue='all' onValueChange={handleFilterChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='All Statuses' />
                    </SelectTrigger>
                    <SelectContent className='bg-black/80 text-white rounded-lg'>
                      <SelectItem value='all'>All</SelectItem>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          </div>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className='bg-teal-900 rounded-2xl p-6 h-40' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {filteredData.map((item) => (
                <Card key={item.id} className='hover:scale-105 transition-transform duration-300'>
                  <CardHeader className='pb-2'>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.endpoint}</CardDescription>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <div className='flex items-center justify-between'>
                      <Badge variant={item.status === 'active' ? 'success' : 'destructive'}>{item.status.toUpperCase()}</Badge>
                      <Button variant='secondary' size='icon' onClick={() => router.push(`/endpoint/${item.id}`)}>View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className='bg-transparent backdrop-blur-sm shadow-2xl rounded-2xl p-6 mt-8'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold'>Need Help?</h3>
            <p className='text-gray-300'>Contact our support team for assistance.</p>
          </div>
          <Button variant='secondary'><AlertCircle /> Contact Support</Button>
        </div>
      </footer>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg rounded-lg p-6 bg-black/80 shadow-2xl animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:translate-y-[-50%]' aria-labelledby='modal-title' aria-describedby='modal-description'>
            <Dialog.Title id='modal-title' className='text-xl font-semibold'>Add New Endpoint</Dialog.Title>
            <Dialog.Description id='modal-description' className='mt-2 text-gray-300'>Fill out the form below to add a new API endpoint.</Dialog.Description>
            <form className='mt-4 space-y-4'>
              <Input placeholder='Endpoint Name' className='border border-teal-900 focus:border-teal-700 focus:ring-teal-700 focus:ring-offset-black' />
              <Input placeholder='Endpoint URL' className='border border-teal-900 focus:border-teal-700 focus:ring-teal-700 focus:ring-offset-black' />
              <Select>
                <SelectTrigger className='w-full border border-teal-900 focus:border-teal-700 focus:ring-teal-700 focus:ring-offset-black'>
                  <SelectValue placeholder='HTTP Method' />
                </SelectTrigger>
                <SelectContent className='bg-black/80 text-white rounded-lg'>
                  <SelectItem value='get'>GET</SelectItem>
                  <SelectItem value='post'>POST</SelectItem>
                  <SelectItem value='put'>PUT</SelectItem>
                  <SelectItem value='delete'>DELETE</SelectItem>
                </SelectContent>
              </Select>
              <Button type='submit' className='mt-4'>Add Endpoint</Button>
            </form>
            <Dialog.Close asChild>
              <button className='absolute top-4 right-4 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
                <ChevronRight className='w-4 h-4 rotate-45' aria-hidden='true' />
                <span className='sr-only'>Close</span>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}