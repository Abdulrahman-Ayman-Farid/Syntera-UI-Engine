'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, CreditCard, MapPin, Package, Check,
  ChevronRight, ChevronLeft, Trash2, Plus, Minus,
  Star, Heart, Gift, Truck, Shield, Clock,
  Sparkles, Zap, Award, Tag, AlertCircle, CheckCircle
} from 'lucide-react'

// Type-safe cart items
const CART_ITEMS = [
  {
    id: 'item-001',
    name: 'Rainbow Unicorn Plushie',
    description: 'Soft & cuddly magical friend',
    price: 29.99,
    quantity: 2,
    image: '🦄',
    color: 'Rainbow',
    size: 'Medium',
    inStock: true,
    rating: 4.8,
    discount: 10
  },
  {
    id: 'item-002',
    name: 'Candy Cloud Backpack',
    description: 'Sweet style for everyday',
    price: 49.99,
    quantity: 1,
    image: '🎒',
    color: 'Pink',
    size: 'One Size',
    inStock: true,
    rating: 4.9,
    discount: 0
  },
  {
    id: 'item-003',
    name: 'Glitter Stars Sticker Pack',
    description: '100+ sparkly stickers',
    price: 12.99,
    quantity: 3,
    image: '✨',
    color: 'Multi',
    size: 'Standard',
    inStock: true,
    rating: 5.0,
    discount: 15
  },
  {
    id: 'item-004',
    name: 'Bubble Tea Keychain',
    description: 'Adorable accessory',
    price: 8.99,
    quantity: 1,
    image: '🧋',
    color: 'Brown',
    size: 'Small',
    inStock: true,
    rating: 4.7,
    discount: 0
  }
] as const

// Checkout metrics
const CHECKOUT_METRICS = [
  {
    id: 'subtotal',
    label: 'Subtotal',
    value: '165.92',
    icon: ShoppingCart,
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 'savings',
    label: 'You Save',
    value: '18.50',
    icon: Tag,
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'shipping',
    label: 'Shipping',
    value: 'FREE',
    icon: Truck,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'total',
    label: 'Total',
    value: '147.42',
    icon: Award,
    color: 'from-yellow-400 to-yellow-600',
  }
] as const

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Credit Card', icon: CreditCard, popular: true },
  { id: 'paypal', label: 'PayPal', icon: Zap, popular: false },
  { id: 'apple', label: 'Apple Pay', icon: Gift, popular: true },
  { id: 'google', label: 'Google Pay', icon: Shield, popular: false },
] as const

const ORDER_TIMELINE_DATA = [
  { step: 'Cart', time: '00:30', status: 'complete' },
  { step: 'Info', time: '01:15', status: 'complete' },
  { step: 'Payment', time: '02:00', status: 'current' },
  { step: 'Review', time: 'Next', status: 'pending' },
] as const

export default function CandyPopCheckoutFlow() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState([...CART_ITEMS])
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: ''
  })

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // Calculate totals
  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const savings = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity * item.discount / 100), 0)
    const shipping = subtotal > 50 ? 0 : 4.99
    const promoDiscount = promoApplied ? subtotal * 0.05 : 0
    const total = subtotal - savings - promoDiscount + shipping

    return { subtotal, savings, shipping, promoDiscount, total }
  }, [cartItems, promoApplied])

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'CANDY5') {
      setPromoApplied(true)
    }
  }

  const stepProgress = (currentStep / 4) * 100

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-green-100'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-pink-200 bg-white/95 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 rounded-2xl shadow-lg'>
                <ShoppingCart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-600 via-yellow-500 to-green-500 bg-clip-text text-transparent'>
                  Candy Pop Checkout
                </h1>
                <p className='text-gray-600'>Sweet & easy shopping 🍬</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge className='bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-lg px-4 py-2'>
                <Sparkles className='w-4 h-4 mr-2' />
                {cartItems.length} Items
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className='bg-white border-b border-pink-200'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between mb-3'>
            {['Cart', 'Info', 'Payment', 'Review'].map((step, index) => (
              <div key={index} className='flex items-center'>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  index + 1 <= currentStep 
                    ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1 < currentStep ? <Check className='w-5 h-5' /> : index + 1}
                </div>
                <span className={`ml-2 font-medium ${
                  index + 1 <= currentStep ? 'text-pink-600' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < 3 && (
                  <ChevronRight className='w-5 h-5 mx-4 text-gray-400' />
                )}
              </div>
            ))}
          </div>
          <Progress value={stepProgress} className='h-2 bg-pink-100' />
        </div>
      </div>

      <main className='p-6 lg:p-8 space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Step 1: Cart */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className='border-2 border-pink-200 shadow-xl rounded-3xl bg-gradient-to-br from-white to-pink-50/30'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold text-gray-900 flex items-center'>
                      <ShoppingCart className='w-6 h-6 mr-3 text-pink-500' />
                      Shopping Cart
                    </CardTitle>
                    <CardDescription>Review your sweet selections!</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className='p-4 bg-white rounded-2xl shadow-md border border-pink-100'
                        >
                          <div className='flex items-start space-x-4'>
                            <div className='text-5xl'>{item.image}</div>
                            <div className='flex-1'>
                              <div className='flex items-start justify-between mb-2'>
                                <div>
                                  <h3 className='font-bold text-lg'>{item.name}</h3>
                                  <p className='text-sm text-gray-600'>{item.description}</p>
                                  <div className='flex items-center space-x-2 mt-1'>
                                    <Badge variant='outline' className='text-xs'>{item.color}</Badge>
                                    <Badge variant='outline' className='text-xs'>{item.size}</Badge>
                                    {item.discount > 0 && (
                                      <Badge className='bg-green-100 text-green-700 text-xs'>
                                        -{item.discount}% OFF
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => removeItem(item.id)}
                                  className='text-red-500 hover:text-red-700 hover:bg-red-50'
                                >
                                  <Trash2 className='w-4 h-4' />
                                </Button>
                              </div>
                              
                              <div className='flex items-center justify-between mt-4'>
                                <div className='flex items-center space-x-3 bg-pink-50 rounded-full px-3 py-1'>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className='h-6 w-6 rounded-full hover:bg-pink-200'
                                  >
                                    <Minus className='w-3 h-3' />
                                  </Button>
                                  <span className='font-bold w-8 text-center'>{item.quantity}</span>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className='h-6 w-6 rounded-full hover:bg-pink-200'
                                  >
                                    <Plus className='w-3 h-3' />
                                  </Button>
                                </div>
                                <div className='text-right'>
                                  {item.discount > 0 && (
                                    <div className='text-sm text-gray-400 line-through'>
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  )}
                                  <div className='text-xl font-bold text-pink-600'>
                                    ${((item.price * item.quantity) * (1 - item.discount / 100)).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {cartItems.length === 0 && (
                      <div className='text-center py-12'>
                        <ShoppingCart className='w-16 h-16 mx-auto text-gray-300 mb-4' />
                        <h3 className='text-xl font-bold text-gray-900 mb-2'>Your cart is empty</h3>
                        <p className='text-gray-600'>Add some sweet items to get started!</p>
                      </div>
                    )}

                    {/* Promo Code */}
                    <div className='p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-2xl border border-yellow-200'>
                      <Label className='font-bold text-gray-900 mb-2 block'>Got a promo code?</Label>
                      <div className='flex space-x-2'>
                        <Input
                          placeholder='Enter code (try CANDY5)'
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className='flex-1 border-yellow-300'
                          disabled={promoApplied}
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={promoApplied}
                          className='bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'
                        >
                          {promoApplied ? <CheckCircle className='w-4 h-4 mr-2' /> : null}
                          {promoApplied ? 'Applied!' : 'Apply'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Shipping Info */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className='border-2 border-pink-200 shadow-xl rounded-3xl bg-gradient-to-br from-white to-green-50/30'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold text-gray-900 flex items-center'>
                      <MapPin className='w-6 h-6 mr-3 text-green-500' />
                      Shipping Information
                    </CardTitle>
                    <CardDescription>Where should we send your goodies?</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName'>First Name *</Label>
                        <Input
                          id='firstName'
                          placeholder='Sweet'
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className='border-pink-200'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='lastName'>Last Name *</Label>
                        <Input
                          id='lastName'
                          placeholder='Tooth'
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className='border-pink-200'
                        />
                      </div>
                    </div>
                    
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email *</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='candy@example.com'
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className='border-pink-200'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='address'>Street Address *</Label>
                      <Input
                        id='address'
                        placeholder='123 Candy Lane'
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className='border-pink-200'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='city'>City *</Label>
                        <Input
                          id='city'
                          placeholder='Sweet City'
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className='border-pink-200'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='state'>State *</Label>
                        <Select value={formData.state} onValueChange={(val) => setFormData({...formData, state: val})}>
                          <SelectTrigger className='border-pink-200'>
                            <SelectValue placeholder='Select' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='CA'>California</SelectItem>
                            <SelectItem value='NY'>New York</SelectItem>
                            <SelectItem value='TX'>Texas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='zip'>ZIP Code *</Label>
                        <Input
                          id='zip'
                          placeholder='12345'
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          className='border-pink-200'
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className='border-2 border-pink-200 shadow-xl rounded-3xl bg-gradient-to-br from-white to-blue-50/30'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold text-gray-900 flex items-center'>
                      <CreditCard className='w-6 h-6 mr-3 text-blue-500' />
                      Payment Method
                    </CardTitle>
                    <CardDescription>Choose your payment method</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {PAYMENT_METHODS.map((method) => (
                          <Label
                            key={method.id}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              paymentMethod === method.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-pink-300'
                            }`}
                          >
                            <RadioGroupItem value={method.id} className='mr-3' />
                            <method.icon className='w-5 h-5 mr-3' />
                            <span className='font-medium'>{method.label}</span>
                            {method.popular && (
                              <Badge className='ml-auto bg-yellow-400 text-yellow-900'>Popular</Badge>
                            )}
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'credit' && (
                      <div className='space-y-4 pt-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='cardNumber'>Card Number *</Label>
                          <Input
                            id='cardNumber'
                            placeholder='1234 5678 9012 3456'
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                            className='border-pink-200'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='cardName'>Name on Card *</Label>
                          <Input
                            id='cardName'
                            placeholder='Sweet Tooth'
                            value={formData.cardName}
                            onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                            className='border-pink-200'
                          />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='cardExpiry'>Expiry Date *</Label>
                            <Input
                              id='cardExpiry'
                              placeholder='MM/YY'
                              value={formData.cardExpiry}
                              onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                              className='border-pink-200'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='cardCVC'>CVC *</Label>
                            <Input
                              id='cardCVC'
                              placeholder='123'
                              value={formData.cardCVC}
                              onChange={(e) => setFormData({...formData, cardCVC: e.target.value})}
                              className='border-pink-200'
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className='border-2 border-pink-200 shadow-xl rounded-3xl bg-gradient-to-br from-white to-purple-50/30'>
                  <CardHeader>
                    <CardTitle className='text-2xl font-bold text-gray-900 flex items-center'>
                      <Package className='w-6 h-6 mr-3 text-purple-500' />
                      Review Order
                    </CardTitle>
                    <CardDescription>Almost there! Confirm your order</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div>
                      <h3 className='font-bold text-lg mb-3'>Order Summary</h3>
                      <div className='space-y-2'>
                        {cartItems.map((item) => (
                          <div key={item.id} className='flex justify-between items-center p-2 bg-purple-50 rounded-lg'>
                            <div className='flex items-center space-x-3'>
                              <span className='text-2xl'>{item.image}</span>
                              <div>
                                <div className='font-medium'>{item.name}</div>
                                <div className='text-sm text-gray-600'>Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className='font-bold text-purple-600'>
                              ${((item.price * item.quantity) * (1 - item.discount / 100)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className='font-bold text-lg mb-3'>Shipping Details</h3>
                      <div className='p-4 bg-purple-50 rounded-lg'>
                        <p className='font-medium'>{formData.firstName} {formData.lastName}</p>
                        <p className='text-sm text-gray-600'>{formData.address}</p>
                        <p className='text-sm text-gray-600'>{formData.city}, {formData.state} {formData.zip}</p>
                        <p className='text-sm text-gray-600'>{formData.email}</p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200'>
                      <Shield className='w-6 h-6 text-green-600' />
                      <div>
                        <div className='font-bold text-green-900'>Secure Checkout</div>
                        <div className='text-sm text-green-700'>Your information is protected</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className='lg:col-span-1'>
            <Card className='border-2 border-pink-200 shadow-xl rounded-3xl bg-gradient-to-br from-white to-yellow-50/30 sticky top-24'>
              <CardHeader>
                <CardTitle className='text-xl font-bold text-gray-900'>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className='font-medium'>${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  {cartTotals.savings > 0 && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Savings</span>
                      <span className='font-medium'>-${cartTotals.savings.toFixed(2)}</span>
                    </div>
                  )}
                  {promoApplied && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Promo Code (CANDY5)</span>
                      <span className='font-medium'>-${cartTotals.promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Shipping</span>
                    <span className='font-medium'>
                      {cartTotals.shipping === 0 ? (
                        <Badge className='bg-green-100 text-green-700'>FREE</Badge>
                      ) : (
                        `$${cartTotals.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className='flex justify-between items-center'>
                  <span className='text-lg font-bold text-gray-900'>Total</span>
                  <span className='text-2xl font-bold bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent'>
                    ${cartTotals.total.toFixed(2)}
                  </span>
                </div>

                <div className='space-y-2'>
                  {currentStep < 4 && (
                    <Button
                      className='w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 hover:from-pink-600 hover:via-yellow-500 hover:to-green-500 text-white font-bold text-lg h-12'
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={cartItems.length === 0}
                    >
                      {currentStep === 3 ? 'Review Order' : 'Continue'}
                      <ChevronRight className='w-5 h-5 ml-2' />
                    </Button>
                  )}
                  {currentStep === 4 && (
                    <Button
                      className='w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 hover:from-pink-600 hover:via-yellow-500 hover:to-green-500 text-white font-bold text-lg h-12'
                    >
                      <CheckCircle className='w-5 h-5 mr-2' />
                      Place Order
                    </Button>
                  )}
                  {currentStep > 1 && (
                    <Button
                      variant='outline'
                      className='w-full border-pink-300'
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ChevronLeft className='w-4 h-4 mr-2' />
                      Back
                    </Button>
                  )}
                </div>

                <div className='flex items-center justify-center space-x-2 text-sm text-gray-600 pt-4'>
                  <Shield className='w-4 h-4' />
                  <span>Secure & encrypted checkout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

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