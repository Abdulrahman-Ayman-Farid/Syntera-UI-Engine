'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, ArrowLeft, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Product {
  id: number
  name: string
  description: string
  currentBid: number
  highestBidder?: string
}

type SortType = 'price-lowest' | 'price-highest' | 'newest' | 'oldest'

type FilterType = 'all' | 'featured' | 'ending-soon'

const initialProducts: Product[] = [
  { id: 1, name: 'Vintage Watch', description: 'A classic watch from the 1950s.', currentBid: 120, highestBidder: 'John Doe' },
  { id: 2, name: 'Art Deco Vase', description: 'An elegant vase with intricate designs.', currentBid: 150 },
  { id: 3, name: 'Retro Camera', description: 'A vintage camera in perfect condition.', currentBid: 200, highestBidder: 'Jane Smith' }
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortType, setSortType] = useState<SortType>('price-lowest')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setProducts(initialProducts)
        setLoading(false)
      } catch (err) {
        setError('Failed to load products.')
        setLoading(false)
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem loading your products. Please try again later.',
          variant: 'destructive'
        })
      }
    }

    fetchData()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProducts = products.filter((product) => {
    if (filterType === 'all') return true
    if (filterType === 'featured') return product.id <= 2
    if (filterType === 'ending-soon') return product.currentBid > 100
    return false
  }).filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === 'price-lowest') return a.currentBid - b.currentBid
    if (sortType === 'price-highest') return b.currentBid - a.currentBid
    if (sortType === 'newest') return b.id - a.id
    if (sortType === 'oldest') return a.id - b.id
    return 0
  })

  const renderProduct = (product: Product) => (
    <Card key={product.id} className='bg-white rounded-xl shadow-md overflow-hidden relative group'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>{product.name}</CardTitle>
            <p className='text-muted-foreground'>{product.description}</p>
          </div>
          <div className='space-x-2'>
            <Badge className='bg-accent text-accent-foreground'>Current Bid</Badge>
            <span className='font-bold'>$ {product.currentBid.toLocaleString()}</span>
          </div>
        </div>
        <Separator className='my-4' />
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            {product.highestBidder && (
              <div className='flex items-center space-x-2'>
                <Avatar className='w-6 h-6'>JD</Avatar>
                <span className='text-sm'>Highest Bid by {product.highestBidder}</span>
              </div>
            )}
            <Progress value={(product.currentBid / 500) * 100} className='w-full' /> {/* Assuming max bid is $500 */}
          </div>
          <Button onClick={() => router.push(`/product/${product.id}`)} className='bg-primary hover:bg-primary-foreground hover:text-primary'>Place Bid</Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className='bg-background min-h-screen flex flex-col'>
      <header className='bg-primary text-primary-foreground px-6 py-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Auction House</h1>
          <div className='space-x-2'>
            <Button variant='outline' size='icon' aria-label='Notifications'>
              <BellIcon className='w-4 h-4' />
            </Button>
            <Button variant='outline' size='icon' aria-label='User Profile'>
              <UserIcon className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </header>
      <main className='flex-1 flex container mx-auto px-6 py-8'>
        <aside className='hidden lg:block w-64 pr-8'>
          <nav className='space-y-8'>
            <div>
              <h2 className='text-lg font-semibold'>Categories</h2>
              <ul className='mt-2 space-y-2'>
                <li><Button variant='ghost' className='justify-start w-full'>All Categories</Button></li>
                <li><Button variant='ghost' className='justify-start w-full'>Watches</Button></li>
                <li><Button variant='ghost' className='justify-start w-full'>Vases</Button></li>
                <li><Button variant='ghost' className='justify-start w-full'>Cameras</Button></li>
              </ul>
            </div>
            <div>
              <h2 className='text-lg font-semibold'>Filters</h2>
              <div className='mt-2'>
                <Label htmlFor='status' className='block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Featured Only</Label>
                <Toggle id='status' className='mt-2' />
              </div>
            </div>
          </nav>
        </aside>
        <div className='flex-1 space-y-8'>
          <div className='flex items-center justify-between'>
            <div className='space-x-2'>
              <Input
                placeholder='Search Products...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='border-2 border-input focus:border-primary focus:ring-primary'
              />
              <Button variant='outline' size='icon' aria-label='Search'>
                <Search className='w-4 h-4' />
              </Button>
            </div>
            <div className='space-x-2'>
              <Select defaultValue={filterType} onValueChange={setFilterType}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='featured'>Featured</SelectItem>
                  <SelectItem value='ending-soon'>Ending Soon</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={sortType} onValueChange={setSortType}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Sort By...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='price-lowest'>Price: Lowest</SelectItem>
                  <SelectItem value='price-highest'>Price: Highest</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                  <SelectItem value='oldest'>Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[1, 2, 3].map((index) => (
                <Skeleton key={index} className='aspect-video rounded-xl animate-pulse' />
              ))}
            </div>
          ) : error ? (
            <div className='text-center'>
              <AlertTriangle className='mx-auto mb-2' />
              <h2 className='text-lg font-semibold'>Error Loading Products</h2>
              <p className='text-muted-foreground'>{error}</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {sortedProducts.map(renderProduct)}
            </div>
          ) : (
            <div className='text-center'>
              <XCircle className='mx-auto mb-2' />
              <h2 className='text-lg font-semibold'>No Products Found</h2>
              <p className='text-muted-foreground'>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>
      <footer className='bg-secondary text-secondary-foreground px-6 py-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <p>&copy; 2023 Auction House. All rights reserved.</p>
          <div className='space-x-2'>
            <Link href='/about' className='hover:underline'>About Us</Link>
            <Link href='/contact' className='hover:underline'>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
