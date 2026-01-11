'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Filter, ChevronRight, CreditCard, MapPin, CheckCircle, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

const initialProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 29.99, quantity: 1 },
  { id: 2, name: 'Product 2', price: 19.99, quantity: 2 }
]

const CheckoutFlow = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const calculateTotal = () => {
      const total = products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
      setTotalPrice(total)
    }
    calculateTotal()
  }, [products])

  const handleAddToCart = (product: Product) => {
    setProducts([...products, { ...product, quantity: 1 }])
  }

  const handleRemoveFromCart = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId))
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
      router.push('/checkout-success')
    } catch (error) {
      setIsError(true)
      setErrorMessage('An error occurred during checkout.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-white text-black min-h-screen overflow-x-hidden'>
      <header className='py-6 px-8 flex justify-between items-center bg-conic-gradient-from-pink-to-mint-to-yellow'>
        <h1 className='text-2xl font-bold'>Checkout</h1>
        <button className='flex items-center gap-2 text-primary hover:text-accent'>
          <Plus size={24} /> Add More Items
        </button>
      </header>
      <main className='px-8 pb-8 flex space-x-8 overflow-y-auto'>
        {/* Cart Summary */}
        <section className='w-full max-w-2xl'>
          <Card className='bg-gradient-to-br from-pink-100 via-mint-100 to-yellow-100 shadow-inner shadow-pink-200 rounded-3xl'>
            <CardHeader>
              <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {products.length === 0 ? (
                <Skeleton className='h-20 rounded-xl' />
              ) : (
                products.map(product => (
                  <div key={product.id} className='flex justify-between items-center bg-white p-4 rounded-xl shadow-md'>
                    <span>{product.name}</span>
                    <span>${product.price.toFixed(2)}</span>
                    <button onClick={() => handleRemoveFromCart(product.id)} className='hover:text-red-500'>Remove</button>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className='flex justify-between'>
              <span>Total Price:</span>
              <span className='font-bold'>${totalPrice.toFixed(2)}</span>
            </CardFooter>
          </Card>
        </section>

        {/* Payment Method */}
        <section className='w-full max-w-2xl'>
          <Card className='bg-gradient-to-br from-pink-100 via-mint-100 to-yellow-100 shadow-inner shadow-pink-200 rounded-3xl'>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Tabs defaultValue='credit-card'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='credit-card' className='relative'>
                    Credit Card
                    <CreditCard className='absolute right-0 top-0 w-6 h-6 opacity-50' />
                  </TabsTrigger>
                  <TabsTrigger value='paypal' className='relative'>
                    PayPal
                    <CheckCircle className='absolute right-0 top-0 w-6 h-6 opacity-50' />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='credit-card'>
                  <form className='space-y-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>Name</Label>
                      <Input id='name' placeholder='John Doe' className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='card-number' className='text-right'>Card Number</Label>
                      <Input id='card-number' placeholder='**** **** **** ****' className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='expiry-date' className='text-right'>Expiry Date</Label>
                      <Input id='expiry-date' placeholder='MM/YY' className='col-span-2' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='cvv' className='text-right'>CVV</Label>
                      <Input id='cvv' placeholder='***' className='col-span-1' />
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value='paypal'>
                  <p className='text-center'>Connect your PayPal account.</p>
                  <Button variant='outline' className='mx-auto mt-4'>Connect PayPal</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Shipping Address */}
        <section className='w-full max-w-2xl'>
          <Card className='bg-gradient-to-br from-pink-100 via-mint-100 to-yellow-100 shadow-inner shadow-pink-200 rounded-3xl'>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <form className='space-y-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='address' className='text-right'>Address</Label>
                  <Input id='address' placeholder='123 Main St' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='city' className='text-right'>City</Label>
                  <Input id='city' placeholder='Anytown' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='state' className='text-right'>State</Label>
                  <Input id='state' placeholder='CA' className='col-span-2' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='zip' className='text-right'>ZIP Code</Label>
                  <Input id='zip' placeholder='12345' className='col-span-1' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='country' className='text-right'>Country</Label>
                  <Input id='country' placeholder='USA' className='col-span-3' />
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Review Order */}
        <section className='w-full max-w-2xl'>
          <Card className='bg-gradient-to-br from-pink-100 via-mint-100 to-yellow-100 shadow-inner shadow-pink-200 rounded-3xl'>
            <CardHeader>
              <CardTitle>Review Order</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {products.length === 0 ? (
                <Skeleton className='h-20 rounded-xl' />
              ) : (
                products.map(product => (
                  <div key={product.id} className='flex justify-between items-center bg-white p-4 rounded-xl shadow-md'>
                    <span>{product.name}</span>
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className='flex justify-between'>
              <span>Total Price:</span>
              <span className='font-bold'>${totalPrice.toFixed(2)}</span>
            </CardFooter>
          </Card>
        </section>

        {/* Confirmation */}
        <section className='w-full max-w-2xl'>
          <Card className='bg-gradient-to-br from-pink-100 via-mint-100 to-yellow-100 shadow-inner shadow-pink-200 rounded-3xl'>
            <CardHeader>
              <CardTitle>Confirmation</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Progress value={(totalPrice / 100) * 100} className='bg-gray-200 rounded-full' />
              <div className='flex justify-center'>
                <Button onClick={handleCheckout} disabled={isLoading || isSuccess} className='transition-transform hover:scale-105'>
                  {isLoading ? 'Processing...' : isSuccess ? 'Success!' : isError ? 'Try Again' : 'Complete Checkout'}
                </Button>
              </div>
              {isError && <AlertTriangle className='text-red-500 mx-auto' />}
              {isError && <p className='text-center text-red-500'>{errorMessage}</p>}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

export default CheckoutFlow