'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { TablerArrowBarLeft, TablerArrowBarRight, TablerBellRinging, TablerChevronDown, TablerChevronUp, TablerCurrencyBitcoin, TablerSearch, TablerSettings, TablerUserCircle, TablerX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type User = {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

type Transaction = {
  id: number
  amount: number
  currency: string
  date: string
  status: 'success' | 'pending' | 'failed'
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatarUrl: '/avatars/john.png' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatarUrl: '/avatars/jane.png' }
]

const transactions: Transaction[] = [
  { id: 1, amount: 2500, currency: 'USD', date: '2023-10-01', status: 'success' },
  { id: 2, amount: 500, currency: 'EUR', date: '2023-10-02', status: 'pending' }
]

export default function TradingPlatform() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [selectedTab, setSelectedTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredTransactions(
        transactions.filter((transaction) =>
          transaction.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.status.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredTransactions(transactions)
    }
  }, [searchQuery])

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
  }

  return (
    <div className='bg-background text-white min-h-screen flex'>
      {/* Sidebar */}
      <aside className={`bg-primary w-64 fixed left-0 top-0 bottom-0 pt-20 pb-10 px-6 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>n        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className='absolute right-0 top-0 m-4 p-2 bg-secondary rounded-full text-primary hover:bg-accent hover:text-black transition-colors duration-300'>
          {isSidebarOpen ? <TablerChevronLeft /> : <TablerChevronRight />}
        </button>
        <nav className='space-y-8'>
          <div className='flex items-center space-x-4'>
            <Avatar className='border border-accent'>
              <AvatarImage src='/avatars/user.png' alt='@vercel' />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <p className='text-sm font-semibold leading-none'>John Doe</p>
              <p className='text-xs text-muted-foreground'>Trader</p>
            </div>
          </div>
          <div className='space-y-1'>
            <button
              className='w-full justify-start rounded-lg p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              onClick={() => router.push('/dashboard')}
            >
              <span className='mr-2'><TablerCurrencyBitcoin /></span>Dashboard
            </button>
            <button
              className='w-full justify-start rounded-lg p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              onClick={() => router.push('/settings')}
            >
              <span className='mr-2'><TablerSettings /></span>Settings
            </button>
            <button
              className='w-full justify-start rounded-lg p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              onClick={() => router.push('/notifications')}
            >
              <span className='mr-2'><TablerBellRinging /></span>Notifications
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='ml-64 mt-20 p-6 flex-1'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Trading Dashboard</h1>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='pulse'>
                  <TablerBellRinging className='h-4 w-4' aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={5} className='bg-secondary text-primary'>
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Tabs defaultValue={selectedTab} onValueChange={handleTabChange} className='mb-6'>
          <TabsList className='grid grid-cols-2'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='transactions'>Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            <div className='grid gap-4 grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
              <Card className='bg-gradient-to-r from-primary to-secondary shadow-xl rounded-xl overflow-hidden relative'>
                <CardContent className='relative'>
                  <div className='absolute inset-0 bg-[url(/patterns/geometric.svg)] opacity-10 mix-blend-multiply'></div>
                  <div className='relative z-10'>
                    <div className='text-2xl font-bold'>$10,000</div>
                    <p className='text-sm text-muted-foreground'>Total Balance</p>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-gradient-to-r from-primary to-secondary shadow-xl rounded-xl overflow-hidden relative'>
                <CardContent className='relative'>
                  <div className='absolute inset-0 bg-[url(/patterns/geometric.svg)] opacity-10 mix-blend-multiply'></div>
                  <div className='relative z-10'>
                    <div className='text-2xl font-bold'>$2,500</div>
                    <p className='text-sm text-muted-foreground'>Available Balance</p>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-gradient-to-r from-primary to-secondary shadow-xl rounded-xl overflow-hidden relative'>
                <CardContent className='relative'>
                  <div className='absolute inset-0 bg-[url(/patterns/geometric.svg)] opacity-10 mix-blend-multiply'></div>
                  <div className='relative z-10'>
                    <div className='text-2xl font-bold'>$5,000</div>
                    <p className='text-sm text-muted-foreground'>Pending Transactions</p>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-gradient-to-r from-primary to-secondary shadow-xl rounded-xl overflow-hidden relative'>
                <CardContent className='relative'>
                  <div className='absolute inset-0 bg-[url(/patterns/geometric.svg)] opacity-10 mix-blend-multiply'></div>
                  <div className='relative z-10'>
                    <div className='text-2xl font-bold'>$2,500</div>
                    <p className='text-sm text-muted-foreground'>Completed Transactions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='transactions'>
            <div className='flex items-center justify-between mb-4'>
              <Input
                placeholder='Search by currency or status...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='max-w-sm'
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='default'>Add Transaction</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                      Enter the details of the transaction you want to add.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='currency' className='text-right'>
                        Currency
                      </Label>
                      <Select>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Select a currency...' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='usd'>USD</SelectItem>
                          <SelectItem value='eur'>EUR</SelectItem>
                          <SelectItem value='gbp'>GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='amount' className='text-right'>
                        Amount
                      </Label>
                      <Input id='amount' className='col-span-3' />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm text-muted-foreground'>
                <thead className='bg-accent'>
                  <tr>
                    <th scope='col' className='py-3 px-6'>ID</th>
                    <th scope='col' className='py-3 px-6'>Amount</th>
                    <th scope='col' className='py-3 px-6'>Currency</th>
                    <th scope='col' className='py-3 px-6'>Date</th>
                    <th scope='col' className='py-3 px-6'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className='border-b border-gray-700'>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Skeleton className='w-16 h-4' />
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className='border-b border-gray-700'>
                        <td className='whitespace-nowrap py-4 px-6'>{transaction.id}</td>
                        <td className='whitespace-nowrap py-4 px-6'>${transaction.amount.toLocaleString()}</td>
                        <td className='whitespace-nowrap py-4 px-6'>{transaction.currency}</td>
                        <td className='whitespace-nowrap py-4 px-6'>{transaction.date}</td>
                        <td className='whitespace-nowrap py-4 px-6'>
                          <Badge className={`${transaction.status === 'success' && 'bg-green-500'} ${transaction.status === 'pending' && 'bg-yellow-500'} ${transaction.status === 'failed' && 'bg-red-500'}`}>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className='fixed bottom-0 w-full bg-primary p-4'>
        <div className='container mx-auto'>
          <p className='text-center text-sm'>© 2023 Premium Trading Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}