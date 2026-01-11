'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Minus, Trash2, ShoppingCart, User, ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 29.99, quantity: 1 },
  { id: 2, name: 'Product 2', price: 49.99, quantity: 2 },
  { id: 3, name: 'Product 3', price: 19.99, quantity: 1 }
]

export default function ShoppingCartPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [total, setTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      calculateTotal()
      setIsLoading(false)
    }, 1500)
  }, [products])

  const calculateTotal = () => {
    setTotal(products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0))
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setProducts(prevProducts => prevProducts.map(product => (product.id === id ? { ...product, quantity } : product)))
  }

  const handleRemoveProduct = (id: number) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id))
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-background'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent'></div>
      </div>
    )
  }

  return (
    <div className='bg-gradient-to-bl from-primary to-secondary text-text min-h-screen flex flex-col'>
      <header className='p-6 flex items-center justify-between shadow-md bg-background'>
        <div className='flex items-center gap-4'>
          <button onClick={() => router.back()} aria-label='Go Back' className='hover:text-accent'>
            <ArrowLeft />
          </button>
          <h1 className='text-2xl font-bold'>Shopping Cart</h1>
        </div>
        <div className='relative'>
          <Input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={handleSearch}
            className='pr-10'
            aria-label='Search Products'
          />
          <Search className='absolute right-3 top-3' size={18} />n        </div>
      </header>
      <main className='flex-1 p-6 flex gap-6'>
        <div className='w-full lg:w-3/4'>
          <Card className='shadow-md overflow-hidden rounded-lg'>
            <CardHeader>
              <CardTitle>Items in your Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className='text-right'>Price</TableHead>
                      <TableHead className='text-right'>Quantity</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id} className='group'>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className='text-right'>$ {product.price.toFixed(2)}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center space-x-2'>
                            <Button variant='outline' size='icon' onClick={() => handleQuantityChange(product.id, Math.max(1, product.quantity - 1))} aria-label={`Decrease ${product.name} Quantity`}>
                              <Minus size={16} />
                            </Button>
                            <Input
                              type='number'
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                              className='w-12 text-center'
                              min={1}
                              aria-label={`${product.name} Quantity`}
                            />
                            <Button variant='outline' size='icon' onClick={() => handleQuantityChange(product.id, product.quantity + 1)} aria-label={`Increase ${product.name} Quantity`}>
                              <Plus size={16} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className='text-right'>$ {(product.price * product.quantity).toFixed(2)}</TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='icon' onClick={() => handleRemoveProduct(product.id)} aria-label={`Remove ${product.name}`}>
                            <Trash2 size={16} className='text-destructive' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='flex flex-col items-center justify-center py-10'>
                  <ShoppingCart size={64} className='mb-4 opacity-50' />
                  <p className='text-muted-foreground'>Your cart is empty.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className='hidden lg:block w-1/4'>
          <Card className='shadow-md rounded-lg sticky top-6'>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>$ {total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax (10%)</span>
                  <span>$ {(total * 0.1).toFixed(2)}</span>
                </div>
                <div className='border-t pt-2 mt-2'>
                  <div className='flex justify-between font-semibold'>
                    <span>Total</span>
                    <span>$ {(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
              <Button className='bg-accent text-background'>Proceed to Checkout</Button>
              <Button variant='outline'>Continue Shopping</Button>
            </CardFooter>
          </Card>
        </aside>
      </main>
      <footer className='p-6 bg-background shadow-md'>
        <div className='flex justify-between items-center'>
          <span>&copy; 2023 Company Name</span>
          <nav className='flex gap-4'>
            <a href='#' className='hover:text-accent'>Privacy Policy</a>
            <a href='#' className='hover:text-accent'>Terms of Service</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}