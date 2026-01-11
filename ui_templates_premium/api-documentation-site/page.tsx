'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ArrowRight, Info, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ApiEndpoint {
  id: number
  method: string
  endpoint: string
  description: string
}

const mockApiEndpoints: ApiEndpoint[] = [
  { id: 1, method: 'GET', endpoint: '/users', description: 'Fetches list of users' },
  { id: 2, method: 'POST', endpoint: '/users', description: 'Creates a new user' },
  { id: 3, method: 'PUT', endpoint: '/users/:id', description: 'Updates a user by ID' }
]

const ApiDocumentationPage = () => {
  const router = useRouter()
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(mockApiEndpoints)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMethod, setFilterMethod] = useState<string | undefined>(undefined)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredEndpoints = endpoints.filter((endpoint) => {
    return (
      endpoint.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterMethod || endpoint.method === filterMethod)
    )
  })

  return (
    <div className='bg-background text-text min-h-screen flex flex-col'>
      <header className='bg-primary px-4 py-6 shadow-sm'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>API Documentation</h1>
          <button className='sm:hidden' onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle sidebar'>
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>
      </header>
      <main className='flex-grow max-w-7xl mx-auto px-4 pt-6 pb-12'>
        <div className='grid grid-cols-12 gap-8'>
          <aside className={`col-span-3 ${isSidebarOpen ? 'block' : 'hidden'} sm:block`}>            <div className='sticky top-16 space-y-4'>              <div className='space-y-2'>                <h2 className='text-lg font-medium'>Filters</h2>                <form className='space-y-2'>                  <div className='space-y-1'>                    <Label htmlFor='search'>Search</Label>                    <Input
                      id='search'
                      placeholder='Enter keyword...'
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className='focus:ring-accent focus:ring-offset-background'
                    />                  </div>                  <div className='space-y-1'>                    <Label htmlFor='method'>HTTP Method</Label>                    <Select
                      defaultValue={filterMethod}
                      onValueChange={(value) => setFilterMethod(value as any)}
                    >                      <SelectTrigger className='w-full'>                        <SelectValue placeholder='Select...' />                      </SelectTrigger>                      <SelectContent>                        <SelectItem value='GET'>GET</SelectItem>                        <SelectItem value='POST'>POST</SelectItem>                        <SelectItem value='PUT'>PUT</SelectItem>                        <SelectItem value='DELETE'>DELETE</SelectItem>                      </SelectContent>                    </Select>                  </div>                </form>              </div>            </div>          </aside>
          <section className='col-span-9 space-y-8'>            <div className='p-6 bg-secondary rounded-lg shadow-sm'>              <h2 className='text-xl font-semibold'>Introduction</h2>              <p className='mt-2'>Welcome to our API documentation. Here you will find detailed information about how to interact with our services.</p>            </div>            <Tabs defaultValue='overview'>              <TabsList className='grid grid-cols-3'>                <TabsTrigger value='overview'>Overview</TabsTrigger>                <TabsTrigger value='reference'>Reference</TabsTrigger>                <TabsTrigger value='examples'>Examples</TabsTrigger>              </TabsList>
              <TabsContent value='overview'>                <div className='space-y-4 mt-4'>                  <p>This section provides a high-level overview of the API, including authentication methods, rate limits, and versioning policies.</p>                </div>              </TabsContent>
              <TabsContent value='reference'>                <div className='space-y-4 mt-4'>                  <div className='grid grid-cols-1 gap-4'>                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className='h-[150px]' />
                      ))
                    ) : (
                      filteredEndpoints.map((endpoint) => (
                        <Card key={endpoint.id} className='overflow-hidden rounded-lg shadow-sm bg-secondary'>                          <CardHeader className='pb-0'>                            <CardTitle>{endpoint.method}</CardTitle>                            <CardDescription className='font-mono'>{endpoint.endpoint}</CardDescription>                          </CardHeader>
                          <CardContent className='pt-0'>                            <p>{endpoint.description}</p>                          </CardContent>
                          <CardFooter className='flex justify-end'>                            <Button variant='outline' size='icon' aria-label='More info'>                              <Info className='w-4 h-4' />                            </Button>                          </CardFooter>                        </Card>
                      ))
                    )}                  </div>                </div>              </TabsContent>
              <TabsContent value='examples'>                <div className='space-y-4 mt-4'>                  <p>Code examples demonstrating how to use the API endpoints.</p>                </div>              </TabsContent>            </Tabs>          </section>
        </div>
      </main>
      <footer className='bg-primary px-4 py-6 shadow-sm'>        <div className='max-w-7xl mx-auto text-center'>          <p>&copy; 2023 API Docs Inc. All rights reserved.</p>        </div>      </footer>
    </div>
  )
}

export default ApiDocumentationPage