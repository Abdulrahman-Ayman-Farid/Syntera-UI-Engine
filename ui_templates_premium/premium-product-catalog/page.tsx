'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plus, Search, Filter, ChevronRight, ShoppingCart, Heart, Star, User, Menu, ArrowLeft } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
}

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/images/product1.jpg', rating: 4.5 },
  { id: 2, name: 'Product 2', price: 39.99, image: '/images/product2.jpg', rating: 4.8 },
  { id: 3, name: 'Product 3', price: 19.99, image: '/images/product3.jpg', rating: 4.2 }
]

const ProductCatalogPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='bg-background text-text min-h-screen relative overflow-hidden'>
      <header className='fixed w-full bg-background z-50 py-4 px-6 sm:px-12 flex items-center justify-between border-b border-accent'>
        <button className='sm:hidden' aria-label='Open menu'>
          <Menu className='w-6 h-6 text-primary' />\
        </button>
        <h1 className='text-2xl font-bold'>Product Catalog</h1>
        <div className='flex space-x-4'>
          <Button variant='outline'>
            <ShoppingCart className='mr-2 w-4 h-4' />\
            Cart
          </Button>
          <Avatar>
            <AvatarImage src='/avatars/01.png' alt='@vercel' />
            <AvatarFallback>VN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className='mt-20 py-8 px-6 sm:px-12'>
        <div className='mb-8'>
          <h2 className='text-3xl font-semibold'>Explore Our Products</h2>
          <p className='text-muted-foreground mt-2'>Discover the latest and greatest products.</p>
        </div>
        <div className='relative mb-8'>
          <div className='absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/10 to-secondary/10'></div>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='pl-10 pr-12 w-full bg-background'
            />
            <Search className='absolute left-3 top-3 w-5 h-5 text-primary' />\
            <Filter className='absolute right-3 top-3 w-5 h-5 text-primary cursor-pointer' />\
          </div>
        </div>
        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className='aspect-video rounded-lg' />
            ))}
          </div>
        ) : error ? (
          <div className='text-destructive'>{error}</div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredProducts.map((product) => (
              <Card key={product.id} className='overflow-hidden bg-background shadow-2xl rounded-2xl transform hover:translate-y-[-10px] transition-transform duration-300 ease-in-out'>
                <CardContent className='relative'>
                  <img src={product.image} alt={product.name} className='w-full aspect-video object-cover' />
                  <div className='absolute bottom-0 left-0 right-0 p-4 bg-background/75 backdrop-blur-sm flex justify-between items-center'>
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>${product.price.toFixed(2)}</CardDescription>
                    </div>
                    <div className='flex space-x-2'>
                      <Heart className='w-5 h-5 text-red-500 cursor-pointer' />\
                      <Star className='w-5 h-5 text-yellow-400 cursor-pointer' />\
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button variant='default'>Add to Cart</Button>
                  <Button variant='ghost'>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <footer className='fixed bottom-0 w-full bg-background p-4 sm:p-6 text-center'>
        <p className='text-muted-foreground'>© 2023 Premium E-commerce. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ProductCatalogPage
