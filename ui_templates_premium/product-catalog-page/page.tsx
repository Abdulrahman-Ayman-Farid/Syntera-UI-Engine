'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import * as DialogRadix from '@radix-ui/react-dialog'
import * as DropdownMenuRadix from '@radix-ui/react-dropdown-menu'
import * as PopoverRadix from '@radix-ui/react-popover'
import * as TabsRadix from '@radix-ui/react-tabs'
import * as SwitchRadix from '@radix-ui/react-switch'
import * as SliderRadix from '@radix-ui/react-slider'
import * as ScrollAreaRadix from '@radix-ui/react-scroll-area'
import * as RadioGroupRadix from '@radix-ui/react-radio-group'
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, ShoppingCartIcon, StarIcon, UserCircleIcon, MenuIcon, XIcon } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
}

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/images/product1.jpg', rating: 4.5 },
  { id: 2, name: 'Product 2', price: 39.99, image: '/images/product2.jpg', rating: 4.7 },
  { id: 3, name: 'Product 3', price: 19.99, image: '/images/product3.jpg', rating: 4.2 },
  // Add more products here
]

const ProductCatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('price_asc')
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (sortOption === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price)
      } else {
        filtered.sort((a, b) => a.price - b.price)
      }
      setFilteredProducts(filtered)
      setIsLoading(false)
    }, 1000)
  }, [searchTerm, sortOption])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  return (
    <div className='bg-white text-slate-700 min-h-screen'>
      <header className='bg-gradient-to-l from-e0f7fa via-b2ebf2 to-accent py-6 px-4 flex items-center justify-between'>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle Sidebar' className='md:hidden'><MenuIcon className='drop-shadow-lg'/></button>
        <h1 className='text-3xl font-bold'>Product Catalog</h1>
        <ShoppingCartIcon className='drop-shadow-lg'/>
      </header>
      <main className='flex gap-8 mt-8 mx-4'>
        <aside className={`w-64 bg-gradient-to-l from-e0f7fa to-accent p-4 rounded-xl ${isSidebarOpen ? '' : 'hidden md:block'}`}>          <Collapsible open={true}>
            <CollapsibleTrigger className='text-xl font-semibold cursor-pointer'>Filters</CollapsibleTrigger>
            <CollapsibleContent className='mt-2'>
              <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
                <div>
                  <label htmlFor='search' className='block text-sm font-medium'>Search</label>
                  <div className='relative mt-1'>
                    <MagnifyingGlassIcon className='absolute left-3 top-3 w-5 h-5 pointer-events-none drop-shadow-lg'/>                      <Input
                      id='search'
                      type='text'
                      placeholder='Search products...'
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className='pl-10'                      />
                  </div>
                </div>
                <div>
                  <label htmlFor='sort' className='block text-sm font-medium'>Sort By</label>
                  <Select defaultValue='price_asc' onValueChange={handleSortChange}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='price_asc'>Price: Low to High</SelectItem>
                      <SelectItem value='price_desc'>Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </aside>
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {isLoading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className='aspect-square rounded-xl overflow-hidden animate-pulse'/>
            ))
          ) : (
            filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Card key={product.id} className='border-t border-l border-accent bg-gradient-to-l from-e0f7fa to-accent rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out'>
                  <CardContent className='p-4'>
                    <img src={product.image} alt={product.name} className='w-full aspect-square object-cover rounded-t-xl'/>
                    <div className='mt-4'>
                      <h3 className='text-xl font-semibold'>{product.name}</h3>
                      <div className='flex items-center space-x-2 mt-2'>
                        {Array.from({ length: Math.floor(product.rating) }).map((_, index) => (
                          <StarIcon key={index} className='w-5 h-5 text-yellow-400'/>
                        ))}
                      </div>
                      <p className='text-gray-500 mt-2'>${product.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className='p-4'>
                    <Button variant='default' className='w-full'>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className='col-span-full text-center'>
                <p className='text-2xl font-semibold'>No products found</p>
                <p className='text-gray-500 mt-2'>Try adjusting your filters or search term.</p>
              </div>
            )
          )}
        </section>
      </main>
      <footer className='bg-gradient-to-l from-e0f7fa to-accent text-white py-4 px-4 mt-8'>
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ProductCatalogPage
