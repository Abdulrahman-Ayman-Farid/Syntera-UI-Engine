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
import { Tab, Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, ArrowLeftCircle, ArrowRightCircle, RefreshCw, DollarSign, ChartBar } from 'lucide-react'

const CryptoExchangePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [cryptos, setCryptos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setCryptos(mockCryptos)
        setIsLoading(false)
        setIsSuccess(true)
      } catch (error) {
        console.error(error)
        setIsLoading(false)
        setIsError(true)
      }
    }

    fetchData()
  }, [])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className='bg-background text-text min-h-screen'>
      <header className='py-8 px-4 flex justify-between items-center border-b border-primary/10'>
        <h1 className='text-4xl font-bold'>Crypto Exchange</h1>
        <div className='flex space-x-4'>
          <Button variant='outline' onClick={() => router.push('/dashboard')}><ArrowLeftCircle /> Back</Button>
          <Button variant='default'><RefreshCw /></Button>
        </div>
      </header>
      <main className='p-4'>
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Market Overview</h2>
            <div className='flex space-x-2'>
              <Input placeholder='Search...' value={searchQuery} onChange={handleSearchChange} className='max-w-xs' />
              <Select onValueChange={(value) => setSelectedCrypto(value)} value={selectedCrypto}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter by Crypto' />
                </SelectTrigger>
                <SelectContent>
                  {mockCryptos.map(crypto => (
                    <SelectItem key={crypto.id} value={crypto.id}>{crypto.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredCryptos.map(crypto => (
              <Card key={crypto.id} className='shadow-sm transition-transform hover:translate-y-[-5px]'>
                <CardHeader className='pb-0'>
                  <CardTitle>{crypto.name}</CardTitle>
                  <CardDescription>{crypto.symbol.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent className='relative'>
                  <div className='absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50'></div>
                  <div className='relative z-10'>
                    <div className='flex justify-between'>
                      <span className='font-medium'>{crypto.price.toLocaleString()} USD</span>
                      <span className={`font-medium ${crypto.change > 0 ? 'text-green-500' : 'text-red-500'}`}>{crypto.change.toFixed(2)}%</span>
                    </div>
                    <Progress className='mt-2' value={crypto.marketCap / 10000000000} max={100} />
                  </div>
                </CardContent>
                <div className='border-t border-primary/10 pt-4 px-4 pb-2'>
                  <Button variant='outline' className='w-full' aria-label={`Buy ${crypto.name}`}><DollarSign /> Buy</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className='mb-8'>
          <Tabs defaultValue='overview' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-2'>
              <Tab value='overview'>Overview</Tab>
              <Tab value='charts'>Charts</Tab>
            </TabsList>
            <TabsContent value='overview'>
              <Card className='shadow-sm'>
                <CardHeader className='pb-0'>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className='relative'>
                  <div className='absolute inset-0 pointer-events-none bg-gradient-to-tr from-accent/10 to-primary/10 opacity-50'></div>
                  <div className='relative z-10'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Crypto</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTransactions.map(tx => (
                          <TableRow key={tx.id}>
                            <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                            <TableCell>{tx.crypto}</TableCell>
                            <TableCell>{tx.amount.toLocaleString()} USD</TableCell>
                            <TableCell><Badge variant={tx.status === 'completed' ? 'success' : 'destructive'}>{tx.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='charts'>
              <Card className='shadow-sm'>
                <CardHeader className='pb-0'>
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent className='relative'>
                  <div className='absolute inset-0 pointer-events-none bg-gradient-to-bl from-secondary/10 to-accent/10 opacity-50'></div>
                  <div className='relative z-10'>
                    <div className='w-full h-96 bg-zinc-900/5 rounded-lg overflow-hidden'>
                      {/* Placeholder for chart */}
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none' className='w-full h-full'>
                        <polygon points='0,100 100,0 100,100' fill='#FFECB3' />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <aside className='fixed bottom-0 left-0 right-0 sm:hidden'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className='flex justify-center items-center py-2 bg-background border-t border-primary/10'>
            <ChevronRight className='transform-gpu transition-transform rotate-90 group-open:-rotate-90' /> Menu
          </CollapsibleTrigger>
          <CollapsibleContent className='overflow-auto animate-slide-up'>
            <nav className='p-4'>
              <ul className='space-y-2'>
                <li>
                  <Button variant='ghost' className='w-full justify-start'>Dashboard</Button>
                </li>
                <li>
                  <Button variant='ghost' className='w-full justify-start'>Wallet</Button>
                </li>
                <li>
                  <Button variant='ghost' className='w-full justify-start'>History</Button>
                </li>
                <li>
                  <Button variant='ghost' className='w-full justify-start'>Settings</Button>
                </li>
              </ul>
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>
      <footer className='bg-background border-t border-primary/10 fixed bottom-0 left-0 right-0 py-4 px-4 sm:hidden'>
        <div className='flex justify-between items-center'>
          <Avatar>
            <AvatarImage src='/avatars/01.png' alt='@vercel' />
            <AvatarFallback>V</AvatarFallback>
          </Avatar>
          <Button variant='default' onClick={() => setIsOpen(!isOpen)}>Toggle Menu</Button>
        </div>
      </footer>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Button variant='outline' className='hidden sm:flex'>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
          <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
            <Dialog.Title className='text-lg font-semibold'>Add New Crypto</Dialog.Title>
            <Dialog.Description className='text-sm text-muted-foreground mt-2'>Enter details for the new cryptocurrency.</Dialog.Description>
            <Form className='mt-4'>
              <div className='grid gap-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>Name</Label>
                  <Input id='name' placeholder='Bitcoin' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='symbol' className='text-right'>Symbol</Label>
                  <Input id='symbol' placeholder='BTC' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='price' className='text-right'>Price</Label>
                  <Input id='price' placeholder='$40,000' className='col-span-3' />
                </div>
              </div>
              <Dialog.Close asChild>
                <Button type='submit' className='mt-4'>Submit</Button>
              </Dialog.Close>
            </Form>
            <Dialog.Close asChild>
              <Button variant='outline' className='mt-2'>Cancel</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

// Mock Data
const mockCryptos = [
  { id: '1', name: 'Bitcoin', symbol: 'btc', price: 40000, change: 1.2, marketCap: 770000000000 },
  { id: '2', name: 'Ethereum', symbol: 'eth', price: 3000, change: -0.5, marketCap: 380000000000 },
  { id: '3', name: 'Ripple', symbol: 'xrp', price: 0.5, change: 0.8, marketCap: 30000000000 },
  { id: '4', name: 'Litecoin', symbol: 'ltc', price: 150, change: 0.2, marketCap: 15000000000 },
]

const mockTransactions = [
  { id: '1', date: '2023-10-01T12:00:00Z', crypto: 'Bitcoin', amount: 12000, status: 'completed' },
  { id: '2', date: '2023-09-25T15:30:00Z', crypto: 'Ethereum', amount: 5000, status: 'pending' },
  { id: '3', date: '2023-09-20T09:45:00Z', crypto: 'Ripple', amount: 1000, status: 'completed' },
  { id: '4', date: '2023-09-15T11:00:00Z', crypto: 'Litecoin', amount: 3000, status: 'failed' },
]

export default CryptoExchangePage