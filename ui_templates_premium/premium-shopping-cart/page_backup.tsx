'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, User, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

const mockProducts = [
  { id: 1, name: 'Product 1', price: 29.99, quantity: 1 },
  { id: 2, name: 'Product 2', price: 49.99, quantity: 2 },
]

const ShoppingCartPage = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [products, setProducts] = useState(mockProducts)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const calculateTotal = () => {
      const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0)
      setTotalPrice(total)
    }

    calculateTotal()
  }, [products])

  const handleNextStep = () => {
    if (activeStep === 0 && !form.formState.isValid) {
      form.trigger()
      return
    }
    setActiveStep(prevStep => prevStep + 1)
  }

  const handlePreviousStep = () => {
    setActiveStep(prevStep => prevStep - 1)
  }

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      router.push('/success')
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-white'>Shopping Cart</h2>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-800 text-white'>
                  <th className='p-4'>Product</th>
                  <th className='p-4'>Quantity</th>
                  <th className='p-4'>Price</th>
                  <th className='p-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className='border-b border-gray-700'>
                    <td className='flex items-center gap-4 p-4'>
                      <Avatar className='bg-primary'>{product.name.charAt(0)}</Avatar>
                      {product.name}
                    </td>
                    <td className='p-4'>
                      <input
                        type='number'
                        min='1'
                        value={product.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10)
                          setProducts(prevProducts =>
                            prevProducts.map(p => (p.id === product.id ? { ...p, quantity: newQuantity } : p)),
                          )
                        }}
                        className='w-16 px-2 py-1 bg-transparent border border-gray-700 text-white rounded-lg focus:outline-none focus:border-secondary'
                      />
                    </td>
                    <td className='p-4'>${product.price.toFixed(2)}</td>
                    <td className='p-4'>
                      <Button
                        variant='destructive'
                        size='icon'
                        onClick={() =>
                          setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id))
                        }
                      >
                        <XCircle className='h-4 w-4' aria-hidden='true' /> <span className='sr-only'>Remove Product</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='mt-4 flex justify-between'>
              <div className='font-semibold text-white'>Total Price:</div>
              <div className='font-bold text-secondary'>${totalPrice.toFixed(2)}</div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-white'>Shipping Information</h2>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='name' className='block text-sm font-medium leading-6 text-white'>Full Name</label>
                <Input
                  id='name'
                  placeholder='John Doe'
                  className='placeholder:text-accent'
                  {...form.register('name', { required: true })}
                />
                {form.formState.errors.name && <p className='text-red-500'>Name is required</p>}
              </div>
              <div className='space-y-2'>
                <label htmlFor='address' className='block text-sm font-medium leading-6 text-white'>Address</label>
                <Input
                  id='address'
                  placeholder='123 Main St'
                  className='placeholder:text-accent'
                  {...form.register('address', { required: true })}
                />
                {form.formState.errors.address && <p className='text-red-500'>Address is required</p>}
              </div>
              <div className='space-y-2'>
                <label htmlFor='city' className='block text-sm font-medium leading-6 text-white'>City</label>
                <Input
                  id='city'
                  placeholder='Metropolis'
                  className='placeholder:text-accent'
                  {...form.register('city', { required: true })}
                />
                {form.formState.errors.city && <p className='text-red-500'>City is required</p>}
              </div>
              <div className='space-y-2'>
                <label htmlFor='state' className='block text-sm font-medium leading-6 text-white'>State</label>
                <Input
                  id='state'
                  placeholder='NY'
                  className='placeholder:text-accent'
                  {...form.register('state', { required: true })}
                />
                {form.formState.errors.state && <p className='text-red-500'>State is required</p>}
              </div>
              <div className='space-y-2'>
                <label htmlFor='zip' className='block text-sm font-medium leading-6 text-white'>ZIP Code</label>
                <Input
                  id='zip'
                  placeholder='10001'
                  className='placeholder:text-accent'
                  {...form.register('zip', { required: true })}
                />
                {form.formState.errors.zip && <p className='text-red-500'>ZIP Code is required</p>}
              </div>
              <div className='space-y-2'>
                <label htmlFor='country' className='block text-sm font-medium leading-6 text-white'>Country</label>
                <Input
                  id='country'
                  placeholder='USA'
                  className='placeholder:text-accent'
                  {...form.register('country', { required: true })}
                />
                {form.formState.errors.country && <p className='text-red-500'>Country is required</p>}
              </div>
              <Button type='submit' disabled={isLoading} className='w-full bg-secondary text-black'>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
              {isSuccess && <div className='text-green-500'>Order submitted successfully!</div>}
              {isError && <div className='text-red-500'>There was an error submitting your order.</div>}
            </form>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='bg-background text-text min-h-screen flex flex-col relative overflow-x-hidden'>
      <header className='py-6 px-4 bg-primary shadow-2xl'>
        <div className='container mx-auto flex items-center justify-between'>
          <h1 className='text-3xl font-extrabold tracking-tight text-white'>My Store</h1>
          <button className='text-white hover:text-secondary' onClick={() => router.push('/')}>Home</button>
        </div>
      </header>
      <main className='flex-1 py-8 px-4 space-y-8'>
        <div className='bg-primary/10 backdrop-blur-sm shadow-lg rounded-2xl p-8'>
          <div className='relative before:absolute before:inset-0 before:bg-primary/10 before:backdrop-blur-sm before:shadow-lg before:-translate-x-2 before:-translate-y-2 before:rounded-2xl before:opacity-50'>
            <div className='relative z-10'>
              <Steps activeStep={activeStep} setActiveStep={setActiveStep} /> <Separator className='my-4' />
              {renderStep()}
              <div className='flex justify-between mt-8'>
                {activeStep > 0 && (
                  <Button variant='outline' onClick={handlePreviousStep} className='bg-primary/10 hover:bg-primary/20'>
                    <ArrowLeft className='mr-2 h-4 w-4' aria-hidden='true' /> Previous
                  </Button>
                )}
                {activeStep < 1 && (
                  <Button onClick={handleNextStep} className='bg-secondary text-black'>
                    Next <ArrowRight className='ml-2 h-4 w-4' aria-hidden='true' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className='py-4 px-4 bg-primary text-white text-center'>
        © 2023 My Store. All rights reserved.
      </footer>
    </div>
  )
}

interface StepsProps {
  activeStep: number
  setActiveStep: (step: number) => void
}

const Steps = ({ activeStep, setActiveStep }: StepsProps) => {
  const steps = ['Cart', 'Shipping', 'Payment']

  return (
    <nav aria-label='Progress'>
      <ol role='list' className='overflow-hidden'>
        {steps.map((step, index) => (
          <li key={index} className='relative pb-8'>
            {index !== steps.length - 1 ? (
              <div className='-ml-px absolute inset-0 left-4 top-4 w-0.5 h-full bg-secondary/20' aria-hidden='true' />
            ) : null}
            <a href='#' className='relative flex items-start space-x-3' onClick={() => setActiveStep(index)}> <span className='h-9 flex items-center' aria-hidden='true'>
                <span className={`relative z-10 flex h-8 w-8 items-center justify-center ${activeStep >= index ? 'bg-secondary text-white' : 'bg-primary text-secondary'} rounded-full transition-colors duration-500 ease-in-out`}> <span className='h-2.5 w-2.5 bg-current rounded-full'></span></span>
              </span>
              <span className='min-w-0 flex flex-col'>
                <span className={`text-xs font-semibold tracking-wide uppercase ${activeStep >= index ? 'text-secondary' : 'text-secondary opacity-50'}`}>{step}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default ShoppingCartPage