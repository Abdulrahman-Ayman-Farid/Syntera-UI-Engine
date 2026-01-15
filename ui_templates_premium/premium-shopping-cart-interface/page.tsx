'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Trash2, Plus, Minus, Heart, CreditCard, Truck, Package, TrendingUp, TrendingDown,
  DollarSign, Tag, AlertCircle, CheckCircle, ArrowLeft, Search, Gift, Percent, Clock
} from 'lucide-react'

const CART_METRICS = [
  { id: 'total_items', label: 'Total Items', value: '8', change: '+2', status: 'increasing' as const, icon: Package, color: 'from-blue-500 to-cyan-500', format: 'count' },
  { id: 'subtotal', label: 'Subtotal', value: '$845.92', change: '+$89.99', status: 'increasing' as const, icon: DollarSign, color: 'from-emerald-500 to-teal-500', format: 'currency' },
  { id: 'savings', label: 'You Save', value: '$154.08', change: '15%', status: 'good' as const, icon: Tag, color: 'from-amber-500 to-orange-500', format: 'currency' },
  { id: 'total', label: 'Total', value: '$845.92', change: 'Free Shipping', status: 'good' as const, icon: ShoppingCart, color: 'from-purple-500 to-pink-500', format: 'currency' }
] as const

const CART_ITEMS = [
  { id: 'item-001', name: 'Premium Wireless Headphones', price: 299.99, originalPrice: 399.99, quantity: 1, image: '🎧', inStock: true, category: 'Electronics', discount: 25 },
  { id: 'item-002', name: 'Smart Fitness Watch', price: 199.99, originalPrice: 249.99, quantity: 2, image: '⌚', inStock: true, category: 'Electronics', discount: 20 },
  { id: 'item-003', name: 'Designer Leather Bag', price: 149.99, originalPrice: 199.99, quantity: 1, image: '👜', inStock: true, category: 'Fashion', discount: 25 },
  { id: 'item-004', name: 'Organic Coffee Beans', price: 24.99, originalPrice: 29.99, quantity: 3, image: '☕', inStock: true, category: 'Food', discount: 17 },
] as const

const SPENDING_DATA = [
  { month: 'Jan', amount: 450, savings: 85 },
  { month: 'Feb', amount: 580, savings: 105 },
  { month: 'Mar', amount: 720, savings: 125 },
  { month: 'Apr', amount: 650, savings: 115 },
  { month: 'May', amount: 780, savings: 140 },
  { month: 'Jun', amount: 846, savings: 154 },
] as const

const RECOMMENDED_ITEMS = [
  { id: 'rec-001', name: 'Wireless Mouse', price: 29.99, image: '🖱️', rating: 4.7 },
  { id: 'rec-002', name: 'USB-C Cable', price: 14.99, image: '🔌', rating: 4.5 },
  { id: 'rec-003', name: 'Phone Stand', price: 19.99, image: '📱', rating: 4.6 },
] as const

export default function PremiumShoppingCartInterface() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState([...CART_ITEMS])
  const [promoCode, setPromoCode] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const updateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ))
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
    const savings = originalTotal - subtotal
    const shipping = subtotal > 500 ? 0 : 9.99
    const total = subtotal + shipping
    
    return { subtotal, savings, shipping, total, itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0) }
  }, [cartItems])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50'>
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='icon' onClick={() => router.back()}>
                <ArrowLeft className='w-5 h-5' />
              </Button>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <ShoppingCart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Premium Shopping Cart</h1>
                <p className='text-gray-600'>{cartSummary.itemCount} premium items</p>
              </div>
            </div>
            <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
              <CreditCard className='w-4 h-4 mr-2' />
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        <section data-template-section='cart-overview' data-component-type='kpi-grid'>
          <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence>
              {CART_METRICS.map((metric) => (
                <motion.div key={metric.id} layoutId={`metric-${metric.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ y: -4 }}>
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`text-sm font-medium ${metric.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {metric.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg`}>
                          <metric.icon className='w-6 h-6 text-white' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='spending-trends' data-chart-type='bar' data-metrics='amount,savings'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Shopping Trends</CardTitle>
                <CardDescription>Your spending & savings over time</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={SPENDING_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider><Tooltip /></TooltipProvider>
                    <Legend />
                    <Bar dataKey='amount' fill='#3b82f6' name='Spending' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='savings' fill='#f59e0b' name='Savings' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='cart-summary' data-component-type='summary-card'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal ({cartSummary.itemCount} items)</span>
                  <span className='font-bold'>${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-emerald-600'>
                  <span>Savings</span>
                  <span className='font-bold'>-${cartSummary.savings.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-bold'>{cartSummary.shipping === 0 ? 'FREE' : `$${cartSummary.shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className='flex justify-between text-lg'>
                  <span className='font-bold'>Total</span>
                  <span className='font-bold text-blue-600'>${cartSummary.total.toFixed(2)}</span>
                </div>
                <div className='flex space-x-2'>
                  <Input placeholder='Promo code' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button variant='outline'><Tag className='w-4 h-4 mr-2' />Apply</Button>
                </div>
                <Progress value={Math.min(100, (cartSummary.subtotal / 500) * 100)} className='h-2' />
                <p className='text-sm text-gray-600 text-center'>
                  {cartSummary.subtotal >= 500 ? '🎉 You qualify for FREE shipping!' : `Add $${(500 - cartSummary.subtotal).toFixed(2)} more for FREE shipping`}
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        <section data-template-section='cart-items' data-component-type='item-list'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div key={item.id} layoutId={`item-${item.id}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-all ${selectedItem === item.id ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className='flex items-center space-x-4'>
                        <div className='text-5xl'>{item.image}</div>
                        <div className='flex-1'>
                          <h4 className='font-bold text-lg'>{item.name}</h4>
                          <Badge variant='outline' className='mt-1'>{item.category}</Badge>
                          <div className='flex items-center space-x-2 mt-2'>
                            <span className='text-xl font-bold text-blue-600'>${(item.price * item.quantity).toFixed(2)}</span>
                            <span className='text-sm text-gray-400 line-through'>${(item.originalPrice * item.quantity).toFixed(2)}</span>
                            <Badge className='bg-rose-500'>{item.discount}% OFF</Badge>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <Button variant='outline' size='icon' onClick={() => updateQuantity(item.id, -1)}><Minus className='w-4 h-4' /></Button>
                          <span className='w-12 text-center font-bold'>{item.quantity}</span>
                          <Button variant='outline' size='icon' onClick={() => updateQuantity(item.id, 1)}><Plus className='w-4 h-4' /></Button>
                        </div>
                        <div className='flex flex-col space-y-2'>
                          <Button variant='ghost' size='icon'><Heart className='w-4 h-4' /></Button>
                          <Button variant='ghost' size='icon' onClick={() => removeItem(item.id)}><Trash2 className='w-4 h-4 text-rose-500' /></Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>

        <section data-template-section='recommendations' data-component-type='product-suggestions'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>You May Also Like</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {RECOMMENDED_ITEMS.map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -4 }} className='p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl'>
                    <div className='text-center'>
                      <div className='text-5xl mb-2'>{item.image}</div>
                      <h5 className='font-bold'>{item.name}</h5>
                      <div className='text-lg font-bold text-blue-600 mt-2'>${item.price}</div>
                      <Button size='sm' className='mt-3 w-full bg-gradient-to-r from-blue-600 to-cyan-600'><Plus className='w-4 h-4 mr-2' />Add to Cart</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
