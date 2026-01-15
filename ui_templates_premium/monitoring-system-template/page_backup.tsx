'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Search, Filter, ChevronRight, AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  query: z.string().min(1, {
    message: 'Search query is required.',
  }),
})

export default function MonitoringSystem() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setLoading(true)
    setTimeout(() => {
      try {
        const mockData = [
          { id: 1, name: 'Server 1', status: 'Active', uptime: 99 },
          { id: 2, name: 'Server 2', status: 'Inactive', uptime: 85 },
          { id: 3, name: 'Server 3', status: 'Active', uptime: 95 },
          { id: 4, name: 'Server 4', status: 'Maintenance', uptime: 70 },
        ]
        setData(mockData)
        setFilteredData(mockData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }, 1500)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(data)
    }
  }, [searchQuery, data])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className='bg-gradient-to-b from-[#1E1B26] to-[#1A1723] min-h-screen text-white'>
      <header className='p-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Monitoring System</h1>
        <div className='flex gap-2'>
          <button className='group relative inline-flex items-center overflow-hidden rounded-full bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'>
            <Plus className='w-4 h-4 mr-2' /> Add Server
            <span className='absolute inset-0 -translate-x-full bg-black opacity-30 transition-transform group-hover:translate-x-0'></span>
          </button>
          <button className='group relative inline-flex items-center overflow-hidden rounded-full bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'>
            <AlertTriangle className='w-4 h-4 mr-2' /> Alerts
            <span className='absolute inset-0 -translate-x-full bg-black opacity-30 transition-transform group-hover:translate-x-0'></span>
          </button>
        </div>
      </header>
      <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6'>
        <Card className='shadow-lg rounded-xl bg-[#39304A] backdrop-blur-sm'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>General system overview</CardDescription>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full rounded-lg' />
              <Skeleton className='h-4 w-full rounded-lg' />
              <Skeleton className='h-4 w-full rounded-lg' />
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-lg rounded-xl bg-[#39304A] backdrop-blur-sm'>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Current server statuses</CardDescription>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='flex space-x-2'>
              <Badge variant='default'>Active</Badge>
              <Badge variant='secondary'>Inactive</Badge>
              <Badge variant='secondary'>Maintenance</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-lg rounded-xl bg-[#39304A] backdrop-blur-sm'>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className='pt-4'>
            <Progress value={75} className='h-2 rounded-full' />
          </CardContent>
        </Card>
        <Card className='shadow-lg rounded-xl bg-[#39304A] backdrop-blur-sm'>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
            <CardDescription>Recent log entries</CardDescription>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full rounded-lg' />
              <Skeleton className='h-4 w-full rounded-lg' />
              <Skeleton className='h-4 w-full rounded-lg' />
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 shadow-lg rounded-xl bg-[#39304A] backdrop-blur-sm'>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid grid-cols-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='mt-4'>
                <Form {...form}>n                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField
                      control={form.control}
                      name='query'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Search</FormLabel>
                          <FormControl>
                            <Input placeholder='Search...' onChange={handleSearchChange} {...field} />
                          </FormControl>
                          <FormDescription>Search through your servers.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <Separator className='my-4' />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime (%)</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((server) => (
                        <TableRow key={server.id}>
                          <TableCell>{server.name}</TableCell>
                          <TableCell>
                            {server.status === 'Active' && <Badge variant='default'>{server.status}</Badge>}
                            {server.status === 'Inactive' && <Badge variant='secondary'>{server.status}</Badge>}
                            {server.status === 'Maintenance' && <Badge variant='secondary'>{server.status}</Badge>}
                          </TableCell>
                          <TableCell>{server.uptime}</TableCell>
                          <TableCell className='text-right'>
                            <Button size='icon' variant='ghost' aria-label={`Edit ${server.name}`} onClick={() => setIsModalOpen(true)}>
                              <ChevronRight className='w-4 h-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className='h-24 text-center'>
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value='details'>
              <div className='mt-4'>
                <p>More detailed information about the system will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      <footer className='p-6 text-center'>
        <p>&copy; 2023 Monitoring System Inc. All rights reserved.</p>
      </footer>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
          <Dialog.Content className='fixed left-[50%] top-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-left-10 sm:zoom-in-90'>
            <Dialog.Title className='text-lg font-semibold'>Server Details</Dialog.Title>
            <Dialog.Description className='mt-2'>Update details for the selected server.</Dialog.Description>
            <Separator className='my-4' />
            <Form {...form}>n              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Server Name' {...field} />
                      </FormControl>
                      <FormDescription>The name of the server.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select status...' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='inactive'>Inactive</SelectItem>
                            <SelectItem value='maintenance'>Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>The current status of the server.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='uptime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uptime (%)</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='Uptime' {...field} />
                      </FormControl>
                      <FormDescription>The uptime percentage of the server.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end gap-2'>
                  <Dialog.Close asChild>
                    <Button type='button' variant='secondary'>Cancel</Button>
                  </Dialog.Close>
                  <Button type='submit'>Save</Button>
                </div>
              </form>
            </Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    query: '',
  },
})

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values)
}