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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Gift, Star, TrendingUp, DollarSign, Users, ShoppingBag, Calendar, Heart, CheckCircle,
  ArrowLeft, Search, Filter, Clock, Sparkles, Crown, Zap, Award
} from 'lucide-react'

const SUBSCRIPTION_METRICS = [
  { id: 'active_subs', label: 'Active Subscriptions', value: '2.4K', change: '+18%', status: 'increasing' as const, icon: Package, color: 'from-pink-500 to-rose-500', format: 'count' },
  { id: 'monthly_revenue', label: 'Monthly Revenue', value: '$48.6K', change: '+12%', status: 'increasing' as const, icon: DollarSign, color: 'from-purple-500 to-pink-500', format: 'currency' },
  { id: 'avg_rating', label: 'Average Rating', value: '4.8', change: '+0.3', status: 'good' as const, icon: Star, color: 'from-amber-500 to-yellow-500', format: 'rating' },
  { id: 'retention', label: 'Retention Rate', value: '89%', change: '+5%', status: 'good' as const, icon: Users, color: 'from-emerald-500 to-teal-500', format: 'percentage' }
] as const

const SUBSCRIPTION_PLANS = [
  { 
    id: 'plan-001', 
    name: 'Beauty Box Deluxe', 
    price: 49.99, 
    period: 'month',
    image: '💄', 
    category: 'Beauty', 
    rating: 4.9,
    subscribers: '1.2K',
    features: ['5 premium products', 'Personalized selection', 'Free shipping', 'Cancel anytime'],
    description: 'Curated beauty essentials delivered monthly'
  },
  { 
    id: 'plan-002', 
    name: 'Gourmet Snacks Premium', 
    price: 39.99, 
    period: 'month',
    image: '🍪', 
    category: 'Food', 
    rating: 4.7,
    subscribers: '980',
    features: ['8-10 artisan snacks', 'International flavors', 'Dietary preferences', 'Recipe cards'],
    description: 'Discover unique snacks from around the world'
  },
  { 
    id: 'plan-003', 
    name: 'Book Club Elite', 
    price: 29.99, 
    period: 'month',
    image: '📚', 
    category: 'Books', 
    rating: 4.8,
    subscribers: '750',
    features: ['2 bestselling books', 'Author interviews', 'Discussion guides', 'Digital extras'],
    description: 'Bestsellers and hidden gems for book lovers'
  },
  { 
    id: 'plan-004', 
    name: 'Pet Supplies Plus', 
    price: 34.99, 
    period: 'month',
    image: '🐾', 
    category: 'Pets', 
    rating: 4.6,
    subscribers: '620',
    features: ['Toys & treats', 'Grooming essentials', 'Health supplements', 'Surprise extras'],
    description: 'Everything your furry friend needs'
  },
  { 
    id: 'plan-005', 
    name: 'Fitness Gear Pro', 
    price: 59.99, 
    period: 'month',
    image: '💪', 
    category: 'Fitness', 
    rating: 4.7,
    subscribers: '890',
    features: ['Premium equipment', 'Workout plans', 'Nutrition guide', 'Exclusive discounts'],
    description: 'Gear and guidance for your fitness journey'
  },
  { 
    id: 'plan-006', 
    name: 'Plant Lovers Box', 
    price: 44.99, 
    period: 'month',
    image: '🌿', 
    category: 'Home', 
    rating: 4.8,
    subscribers: '540',
    features: ['Rare plants', 'Care instructions', 'Accessories', 'Expert support'],
    description: 'Grow your indoor garden with unique plants'
  }
] as const

const CATEGORIES = [
  { value: 'all', label: 'All Categories', count: 6 },
  { value: 'beauty', label: 'Beauty', count: 1 },
  { value: 'food', label: 'Food', count: 1 },
  { value: 'books', label: 'Books', count: 1 },
  { value: 'pets', label: 'Pets', count: 1 },
  { value: 'fitness', label: 'Fitness', count: 1 },
  { value: 'home', label: 'Home', count: 1 }
] as const

const REVENUE_DATA = [
  { month: 'Jan', revenue: 38000, subscribers: 1800 },
  { month: 'Feb', revenue: 41000, subscribers: 1950 },
  { month: 'Mar', revenue: 43500, subscribers: 2050 },
  { month: 'Apr', revenue: 45000, subscribers: 2200 },
  { month: 'May', revenue: 47200, subscribers: 2300 },
  { month: 'Jun', revenue: 48600, subscribers: 2400 },
] as const

const CATEGORY_DATA = [
  { category: 'Beauty', boxes: 320 },
  { category: 'Food', boxes: 280 },
  { category: 'Books', boxes: 245 },
  { category: 'Pets', boxes: 195 },
  { category: 'Fitness', boxes: 230 },
  { category: 'Home', boxes: 180 },
] as const

export default function PremiumSubscriptionBoxPlatform() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredPlans = useMemo(() => {
    return SUBSCRIPTION_PLANS.filter(plan => {
      const matchesCategory = selectedCategory === 'all' || plan.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           plan.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50/50'>
      <header className='sticky top-0 z-50 border-b border-pink-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='icon' onClick={() => router.back()}>
                <ArrowLeft className='w-5 h-5' />
              </Button>
              <div className='p-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg'>
                <Gift className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Premium Subscription Boxes</h1>
                <p className='text-gray-600'>Discover curated experiences delivered monthly</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Button variant='outline'>
                <ShoppingBag className='w-4 h-4 mr-2' />
                My Subscriptions
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        <section data-template-section='subscription-overview' data-component-type='kpi-grid'>
          <motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence>
              {SUBSCRIPTION_METRICS.map((metric) => (
                <motion.div key={metric.id} layoutId={`metric-${metric.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ y: -4 }}>
                  <Card className='h-full border border-pink-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`text-sm font-medium ${metric.status === 'good' ? 'text-emerald-600' : 'text-pink-600'}`}>
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
          <section data-template-section='revenue-growth' data-chart-type='line' data-metrics='revenue,subscribers'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Revenue & Growth</CardTitle>
                <CardDescription>Monthly revenue and subscriber trends</CardDescription>
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
                    <Line yAxisId='left' type='monotone' dataKey='revenue' stroke='#ec4899' strokeWidth={2} name='Revenue' />
                    <Line yAxisId='right' type='monotone' dataKey='subscribers' stroke='#f59e0b' strokeWidth={2} name='Subscribers' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='boxes'>
            <Card className='border border-pink-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Popular Categories</CardTitle>
                <CardDescription>Subscription boxes by category</CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={CATEGORY_DATA} layout='vertical'>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis type='number' stroke='#666' />
                    <YAxis type='category' dataKey='category' stroke='#666' width={80} />
                    <TooltipProvider><Tooltip /></TooltipProvider>
                    <Bar dataKey='boxes' fill='#ec4899' name='Active Boxes' radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        <section data-template-section='filters' data-component-type='filter-controls'>
          <Card className='border border-pink-200 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input placeholder='Search subscription boxes...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className='w-full md:w-[200px]'>
                    <Filter className='w-4 h-4 mr-2' />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label} ({cat.count})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>

        <section data-template-section='subscription-plans' data-component-type='plan-grid'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <AnimatePresence>
              {filteredPlans.map((plan) => (
                <motion.div key={plan.id} layoutId={`plan-${plan.id}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -8 }} className={`relative ${selectedPlan === plan.id ? 'ring-2 ring-pink-500' : ''}`}>
                  <Card className='h-full border border-pink-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-pink-50/50'>
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div className='text-6xl'>{plan.image}</div>
                        <Button variant='ghost' size='icon' className='hover:bg-pink-100'>
                          <Heart className='w-5 h-5 text-pink-500' />
                        </Button>
                      </div>
                      <CardTitle className='text-xl mt-4'>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <Badge className='bg-gradient-to-r from-pink-500 to-rose-500'>{plan.category}</Badge>
                        <div className='flex items-center space-x-1'>
                          <Star className='w-4 h-4 fill-amber-400 text-amber-400' />
                          <span className='font-bold text-sm'>{plan.rating}</span>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-baseline space-x-1'>
                          <span className='text-3xl font-bold text-pink-600'>${plan.price}</span>
                          <span className='text-gray-500'>/{plan.period}</span>
                        </div>
                        <p className='text-sm text-gray-600'>{plan.subscribers} active subscribers</p>
                      </div>
                      <Separator />
                      <div className='space-y-2'>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className='flex items-center space-x-2'>
                            <CheckCircle className='w-4 h-4 text-emerald-500 flex-shrink-0' />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button className='w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg'>
                        <Crown className='w-4 h-4 mr-2' />
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  )
}
