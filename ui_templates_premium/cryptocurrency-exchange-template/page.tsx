'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { Plus, Search, Filter, ChevronRight, DollarSign, ArrowUp, ArrowDown, Users, BarChart2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ScrollArea } from '@radix-ui/react-scroll-area'

interface User {
  id: number
  name: string
  email: string
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

const CryptoExchangeDashboard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className='bg-background text-white min-h-screen'>
      <header className='p-6 bg-primary flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Crypto Exchange</h1>
        <div className='flex gap-4'>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='md:hidden'>
            <ChevronRight className='w-6 h-6' />
          </button>
          <div className='hidden md:block'>
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='transactions'>Transactions</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
              </TabsList>
              <TabsContent value='overview'>
                <div className='p-6'>
                  <h2 className='text-xl font-semibold mb-4'>Dashboard Overview</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card className='relative overflow-hidden rounded-lg bg-gradient-to-l from-secondary to-accent shadow-2xl'>
                      <CardContent className='p-6'>
                        <div className='absolute inset-0 bg-[url(/geometric-pattern.png)] bg-cover opacity-10'></div>
                        <DollarSign className='absolute right-4 bottom-4 w-24 h-24 opacity-10'/>
                        <div className='z-10 relative'>
                          <h3 className='font-medium text-sm'>Total Balance</h3>
                          <div className='text-2xl font-bold'>$50,000.00</div>
                          <Progress value={80} className='mt-4' />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='relative overflow-hidden rounded-lg bg-gradient-to-l from-secondary to-accent shadow-2xl'>
                      <CardContent className='p-6'>
                        <div className='absolute inset-0 bg-[url(/geometric-pattern.png)] bg-cover opacity-10'></div>
                        <ArrowUp className='absolute right-4 bottom-4 w-24 h-24 opacity-10'/>
                        <div className='z-10 relative'>
                          <h3 className='font-medium text-sm'>Profit Growth</h3>
                          <div className='text-2xl font-bold'>+25%</div>
                          <Progress value={25} className='mt-4' />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='relative overflow-hidden rounded-lg bg-gradient-to-l from-secondary to-accent shadow-2xl'>
                      <CardContent className='p-6'>
                        <div className='absolute inset-0 bg-[url(/geometric-pattern.png)] bg-cover opacity-10'></div>
                        <ArrowDown className='absolute right-4 bottom-4 w-24 h-24 opacity-10'/>
                        <div className='z-10 relative'>
                          <h3 className='font-medium text-sm'>Loss Reduction</h3>
                          <div className='text-2xl font-bold'>-10%</div>
                          <Progress value={90} className='mt-4' />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value='transactions'>
                <div className='p-6'>
                  <h2 className='text-xl font-semibold mb-4'>Recent Transactions</h2>
                  <Table className='border-separate border-spacing-y-4'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className='py-4'>
                            <Skeleton className='w-full h-6' />
                          </td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id} className='transition-transform hover:scale-105 duration-300'>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>$1,000.00</td>
                            <td>2023-10-01</td>
                            <td><Badge variant='success'>Completed</Badge></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value='settings'>
                <div className='p-6'>
                  <h2 className='text-xl font-semibold mb-4'>Account Settings</h2>
                  <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
                    <Input placeholder='Email' className='bg-transparent border-b border-secondary focus:border-accent outline-none' />
                    <Input placeholder='Password' type='password' className='bg-transparent border-b border-secondary focus:border-accent outline-none' />
                    <Button className='bg-secondary hover:bg-accent'>Save Changes</Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </header>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-background transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>        <div className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Navigation</h2>
          <ul className='space-y-2'>
            <li>
              <Button variant='outline' className='w-full justify-start'>
                <Search className='mr-2' /> Search
              </Button>
            </li>
            <li>
              <Button variant='outline' className='w-full justify-start'>
                <Filter className='mr-2' /> Filters
              </Button>
            </li>
            <li>
              <Button variant='outline' className='w-full justify-start'>
                <BarChart2 className='mr-2' /> Analytics
              </Button>
            </li>
            <li>
              <Button variant='outline' className='w-full justify-start'>
                <Users className='mr-2' /> Users
              </Button>
            </li>
          </ul>
        </div>
      </aside>
      <main className='ml-0 md:ml-64 mt-24 p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <Card className='overflow-hidden rounded-lg bg-gradient-to-l from-secondary to-accent shadow-2xl'>
            <CardContent className='p-6'>
              <div className='absolute inset-0 bg-[url(/geometric-pattern.png)] bg-cover opacity-10'></div>
              <div className='z-10 relative'>
                <h3 className='font-medium text-sm'>User Activity</h3>
                <div className='text-2xl font-bold'>1,200 Active</div>
                <Progress value={75} className='mt-4' />
              </div>
            </CardContent>
          </Card>
          <Card className='overflow-hidden rounded-lg bg-gradient-to-l from-secondary to-accent shadow-2xl'>
            <CardContent className='p-6'>
              <div className='absolute inset-0 bg-[url(/geometric-pattern.png)] bg-cover opacity-10'></div>
              <div className='z-10 relative'>
                <h3 className='font-medium text-sm'>Transaction Volume</h3>
                <div className='text-2xl font-bold'>$10M+</div>
                <Progress value={85} className='mt-4' />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Market Trends</h2>
          <div className='backdrop-blur-sm bg-background/30 rounded-lg shadow-lg p-6'>
            <canvas id='marketTrendsChart' width='400' height='200'></canvas>
          </div>
        </div>
      </main>
      <footer className='p-6 bg-primary text-center'>
        <p>&copy; 2023 Crypto Exchange. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default CryptoExchangeDashboard
