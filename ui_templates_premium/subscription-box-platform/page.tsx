'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Gift, Star, Calendar, Users, TrendingUp, TrendingDown,
  DollarSign, CheckCircle, Clock, Heart, ShoppingCart, Box,
  Truck, RefreshCw, Award, Sparkles, Tag
} from 'lucide-react'

// Subscription metrics with TypeScript constants
const SUBSCRIPTION_METRICS = [
  {
    id: 'active_subs',
    label: 'Active Subscriptions',
    value: '1,842',
    change: '+245',
    status: 'increasing' as const,
    icon: Package,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'monthly_revenue',
    label: 'Monthly Revenue',
    value: '$52,450',
    change: '+18%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'satisfaction',
    label: 'Satisfaction Rate',
    value: '94',
    unit: '%',
    change: '+4%',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  },
  {
    id: 'retention',
    label: 'Retention Rate',
    value: '87',
    unit: '%',
    change: '+2%',
    status: 'increasing' as const,
    icon: RefreshCw,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  }
] as const

const SUBSCRIPTION_PLANS = [
  {
    id: 'plan-001',
    name: 'Beauty Essentials Box',
    price: 29.99,
    billing: 'monthly',
    subscribers: 2450,
    items: 5,
    category: 'Beauty',
    image: '💄',
    rating: 4.8,
    reviews: 1245,
    features: ['5 Premium Products', 'Free Shipping', 'Cancel Anytime', 'Exclusive Discounts'],
    popular: true
  },
  {
    id: 'plan-002',
    name: 'Gourmet Food Box',
    price: 49.99,
    billing: 'monthly',
    subscribers: 1850,
    items: 8,
    category: 'Food',
    image: '🍱',
    rating: 4.9,
    reviews: 956,
    features: ['8 Artisan Items', 'Locally Sourced', 'Dietary Options', 'Recipe Cards'],
    popular: false
  },
  {
    id: 'plan-003',
    name: 'Book Lovers Box',
    price: 34.99,
    billing: 'monthly',
    subscribers: 1425,
    items: 3,
    category: 'Books',
    image: '📚',
    rating: 4.7,
    reviews: 824,
    features: ['3 Curated Books', 'Bookmarks Included', 'Author Notes', 'Discussion Guides'],
    popular: false
  },
  {
    id: 'plan-004',
    name: 'Fitness & Wellness Box',
    price: 39.99,
    billing: 'monthly',
    subscribers: 2120,
    items: 6,
    category: 'Health',
    image: '💪',
    rating: 4.6,
    reviews: 1042,
    features: ['6 Wellness Products', 'Workout Plans', 'Nutrition Guide', 'Expert Tips'],
    popular: true
  },
  {
    id: 'plan-005',
    name: 'Pet Care Box',
    price: 24.99,
    billing: 'monthly',
    subscribers: 1680,
    items: 4,
    category: 'Pets',
    image: '🐾',
    rating: 4.8,
    reviews: 765,
    features: ['4 Pet Treats', 'Toy Included', 'All Natural', 'Pet-Safe Guarantee'],
    popular: false
  },
  {
    id: 'plan-006',
    name: 'Coffee Connoisseur Box',
    price: 44.99,
    billing: 'monthly',
    subscribers: 1290,
    items: 3,
    category: 'Beverages',
    image: '☕',
    rating: 4.9,
    reviews: 645,
    features: ['3 Premium Blends', 'Single Origin', 'Tasting Notes', 'Brewing Guide'],
    popular: true
  },
] as const

const CATEGORIES = [
  { id: 'all', name: 'All Categories', count: 18, color: '#3b82f6' },
  { id: 'Beauty', name: 'Beauty & Skincare', count: 4, color: '#ec4899' },
  { id: 'Food', name: 'Food & Beverage', count: 5, color: '#10b981' },
  { id: 'Books', name: 'Books & Media', count: 3, color: '#8b5cf6' },
  { id: 'Health', name: 'Health & Wellness', count: 4, color: '#f59e0b' },
  { id: 'Pets', name: 'Pet Care', count: 2, color: '#14b8a6' },
] as const

const REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, subscribers: 1420 },
  { month: 'Feb', revenue: 45000, subscribers: 1580 },
  { month: 'Mar', revenue: 48000, subscribers: 1720 },
  { month: 'Apr', revenue: 49500, subscribers: 1850 },
  { month: 'May', revenue: 51000, subscribers: 1980 },
  { month: 'Jun', revenue: 52450, subscribers: 2120 },
] as const

export default function SubscriptionBoxPlatform() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredPlans = useMemo(() => {
    return SUBSCRIPTION_PLANS.filter(plan => {
      const matchesSearch = searchQuery === '' || plan.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'subscribers': return b.subscribers - a.subscribers
        default: return b.popular ? 1 : -1
      }
    })
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg'>
                <Gift className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Subscription Boxes</h1>
                <p className='text-gray-600'>Curated experiences delivered monthly</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg'>
                <ShoppingCart className='w-4 h-4 mr-2' />
                My Subscriptions
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Subscription Metrics */}
        <section data-template-section='subscription-overview' data-component-type='kpi-grid'>
          <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence>
              {SUBSCRIPTION_METRICS.map((metric) => (
                <motion.div key={metric.id} layoutId={`metric-${metric.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ y: -4 }}>
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                            {metric.unit && <span className='text-gray-500'>{metric.unit}</span>}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${metric.status === 'good' || metric.status === 'increasing' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {metric.change.startsWith('+') ? <TrendingUp className='w-4 h-4 mr-1' /> : <TrendingDown className='w-4 h-4 mr-1' />}
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

        {/* Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='revenue-trends' data-chart-type='line' data-metrics='revenue,subscribers'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Revenue Growth</CardTitle>
                    <CardDescription>Monthly revenue & subscriber trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +24% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider><Tooltip /></TooltipProvider>
                    <Legend />
                    <Line yAxisId='left' type='monotone' dataKey='revenue' stroke='#10b981' strokeWidth={2} name='Revenue ($)' />
                    <Line yAxisId='right' type='monotone' dataKey='subscribers' stroke='#8b5cf6' strokeWidth={2} name='Subscribers' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Categories</CardTitle>
                <CardDescription>Subscription boxes by category</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={CATEGORIES.slice(1)}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='name' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider><Tooltip /></TooltipProvider>
                    <Bar dataKey='count' name='Plans' radius={[4, 4, 0, 0]}>
                      {CATEGORIES.slice(1).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Subscription Plans */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters */}
          <section data-template-section='subscription-filters' data-component-type='filter-panel'>
            <Card className='border border-gray-200 shadow-sm sticky top-24'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Filters</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className='w-full border-gray-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name} ({cat.count})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='w-full border-gray-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='popular'>Most Popular</SelectItem>
                      <SelectItem value='price_asc'>Price: Low to High</SelectItem>
                      <SelectItem value='price_desc'>Price: High to Low</SelectItem>
                      <SelectItem value='rating'>Highest Rated</SelectItem>
                      <SelectItem value='subscribers'>Most Subscribers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className='p-4 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <Sparkles className='w-5 h-5 text-pink-600' />
                    <div className='font-medium text-pink-900'>Free Trial</div>
                  </div>
                  <p className='text-sm text-pink-700'>First box free on annual plans</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Plans Grid */}
          <section data-template-section='subscription-plans' data-component-type='plan-grid' className='lg:col-span-3'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Available Plans</CardTitle>
                    <CardDescription>{filteredPlans.length} subscription boxes</CardDescription>
                  </div>
                  <Input placeholder='Search plans...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-64 border-gray-300' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredPlans.map((plan) => (
                      <motion.div key={plan.id} layoutId={`plan-${plan.id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -4 }} className={`p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-lg transition-all cursor-pointer ${selectedPlan === plan.id ? 'ring-2 ring-pink-500 ring-offset-2' : ''}`} onClick={() => setSelectedPlan(plan.id)}>
                        <div className='flex flex-col space-y-4'>
                          <div className='relative'>
                            <div className='text-6xl text-center mb-2'>{plan.image}</div>
                            {plan.popular && (
                              <Badge className='absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 border-0'>
                                <Award className='w-3 h-3 mr-1' />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <div>
                            <h4 className='font-bold text-lg mb-1'>{plan.name}</h4>
                            <div className='flex items-center space-x-2 mb-2'>
                              <div className='flex items-center'>
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(plan.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className='text-sm text-gray-600'>{plan.rating} ({plan.reviews})</span>
                            </div>
                            <Badge variant='outline'>{plan.category}</Badge>
                          </div>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-3xl font-bold text-pink-600'>${plan.price}</span>
                            <span className='text-gray-500'>/{plan.billing}</span>
                          </div>
                          <div className='space-y-2'>
                            <p className='text-sm text-gray-600 flex items-center'>
                              <Package className='w-4 h-4 mr-2' />
                              {plan.items} items per box
                            </p>
                            <p className='text-sm text-gray-600 flex items-center'>
                              <Users className='w-4 h-4 mr-2' />
                              {plan.subscribers.toLocaleString()} subscribers
                            </p>
                          </div>
                          <Separator />
                          <ul className='space-y-2'>
                            {plan.features.map((feature, i) => (
                              <li key={i} className='flex items-start text-sm'>
                                <CheckCircle className='w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Separator />
                          <div className='flex items-center space-x-2'>
                            <Button className='flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'>
                              <ShoppingCart className='w-4 h-4 mr-2' />
                              Subscribe
                            </Button>
                            <Button variant='outline' size='icon'>
                              <Heart className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
