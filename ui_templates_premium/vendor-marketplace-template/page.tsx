'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Search, Filter, Plus, Store, User,
  Package, Star, TrendingUp, TrendingDown, Tag, MapPin,
  CheckCircle, AlertCircle, DollarSign, Users, Eye,
  Award, Clock, Box, Truck, BarChart3
} from 'lucide-react'

// Marketplace metrics with type-safe constants
const MARKETPLACE_METRICS = [
  {
    id: 'total_vendors',
    label: 'Active Vendors',
    value: '342',
    change: '+28',
    status: 'increasing' as const,
    icon: Store,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'total_products',
    label: 'Total Products',
    value: '12,845',
    change: '+324',
    status: 'increasing' as const,
    icon: Package,
    color: 'from-cyan-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'daily_sales',
    label: 'Daily Sales',
    value: '$45,280',
    change: '+18%',
    status: 'good' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-green-500',
    format: 'currency'
  },
  {
    id: 'avg_rating',
    label: 'Avg. Rating',
    value: '4.7',
    change: '+0.2',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'rating'
  }
] as const

// Vendor products with oceanic theme
const VENDOR_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Ocean Breeze Canvas',
    description: 'Premium coastal artwork',
    price: 129.99,
    compareAtPrice: 159.99,
    image: '🖼️',
    category: 'art',
    vendor: {
      id: 'v-001',
      name: 'Coastal Creations',
      rating: 4.8,
      verified: true
    },
    rating: 4.9,
    reviewCount: 287,
    inStock: true,
    inventory: 45,
    featured: true,
    sales: 342
  },
  {
    id: 'prod-002',
    name: 'Nautical Rope Basket',
    description: 'Handwoven storage solution',
    price: 54.99,
    compareAtPrice: 54.99,
    image: '🧺',
    category: 'home-decor',
    vendor: {
      id: 'v-002',
      name: 'Maritime Home',
      rating: 4.6,
      verified: true
    },
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    inventory: 23,
    featured: false,
    sales: 198
  },
  {
    id: 'prod-003',
    name: 'Seashell Wind Chime',
    description: 'Authentic coastal decor',
    price: 38.50,
    compareAtPrice: 45.00,
    image: '🐚',
    category: 'accessories',
    vendor: {
      id: 'v-003',
      name: 'Beach Treasures',
      rating: 4.9,
      verified: true
    },
    rating: 4.8,
    reviewCount: 412,
    inStock: false,
    inventory: 0,
    featured: true,
    sales: 567
  },
  {
    id: 'prod-004',
    name: 'Coral Reef Throw Pillow',
    description: 'Premium comfort & style',
    price: 42.00,
    compareAtPrice: 55.00,
    image: '🪸',
    category: 'home-decor',
    vendor: {
      id: 'v-004',
      name: 'Ocean Living',
      rating: 4.7,
      verified: false
    },
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    inventory: 67,
    featured: false,
    sales: 289
  },
] as const

// Sales trends data
const SALES_TRENDS = [
  { month: 'Jan', sales: 28500, vendors: 298, orders: 1240 },
  { month: 'Feb', sales: 32400, vendors: 312, orders: 1420 },
  { month: 'Mar', sales: 35800, vendors: 325, orders: 1580 },
  { month: 'Apr', sales: 38200, vendors: 334, orders: 1685 },
  { month: 'May', sales: 42100, vendors: 340, orders: 1820 },
  { month: 'Jun', sales: 45280, vendors: 342, orders: 1950 },
] as const

// Top vendors data
const TOP_VENDORS = [
  { vendor: 'Coastal Creations', sales: 12500, products: 45, rating: 4.9, color: '#0066cc' },
  { vendor: 'Maritime Home', sales: 10200, products: 38, rating: 4.8, color: '#40c4ff' },
  { vendor: 'Beach Treasures', sales: 8900, products: 52, rating: 4.7, color: '#0891b2' },
  { vendor: 'Ocean Living', sales: 7600, products: 31, rating: 4.6, color: '#06b6d4' },
] as const

export default function VendorMarketplaceTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [filterStock, setFilterStock] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStockStatus = (inStock: boolean) => {
    return inStock 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : 'bg-rose-100 text-rose-800 border-rose-300'
  }

  const calculateDiscount = (price: number, compareAt: number) => {
    if (compareAt <= price) return 0
    return Math.round(((compareAt - price) / compareAt) * 100)
  }

  const filteredProducts = useMemo(() => {
    return VENDOR_PRODUCTS.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        product.category === selectedCategory
      const matchesStock = filterStock === 'all' || 
        (filterStock === 'in-stock' && product.inStock) ||
        (filterStock === 'out-of-stock' && !product.inStock)
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [searchQuery, selectedCategory, filterStock])

  return (
    <div className='min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-blue-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg'>
                <Store className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Vendor Marketplace</h1>
                <p className='text-gray-600'>Discover products from verified sellers</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-blue-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Become Vendor
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Marketplace Metrics Overview */}
        <section data-template-section='marketplace-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {MARKETPLACE_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-blue-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : metric.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            )}
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

        {/* Analytics Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Sales Trends */}
          <section data-template-section='sales-trends' data-chart-type='line' data-metrics='sales,orders'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Sales Trends</CardTitle>
                    <CardDescription>Monthly performance overview</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +23% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={SALES_TRENDS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='sales' 
                      stroke='#0066cc' 
                      strokeWidth={2}
                      name='Sales ($)'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='orders' 
                      stroke='#40c4ff' 
                      strokeWidth={2}
                      name='Orders'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Top Vendors */}
          <section data-template-section='top-vendors' data-chart-type='bar' data-metrics='sales,rating'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Top Vendors</CardTitle>
                    <CardDescription>Best performing sellers</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-amber-200 text-amber-700'>
                    <Award className='w-3 h-3 mr-1' />
                    Top 4
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={TOP_VENDORS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='vendor' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='sales' name='Sales ($)' radius={[4, 4, 0, 0]}>
                      {TOP_VENDORS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Product Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Products Grid */}
          <section data-template-section='product-browser' data-component-type='product-grid' className='lg:col-span-2'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Vendor Products</CardTitle>
                    <CardDescription>Browse marketplace offerings</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search products...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-blue-300'
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-blue-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value='art'>Art</SelectItem>
                        <SelectItem value='home-decor'>Home Decor</SelectItem>
                        <SelectItem value='accessories'>Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl hover:border-cyan-300 transition-colors cursor-pointer ${
                          selectedProduct === product.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-5xl'>{product.image}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold text-sm'>{product.name}</h4>
                              <div className='flex items-center space-x-1'>
                                {product.featured && (
                                  <Badge className='bg-amber-100 text-amber-800 border-amber-300 text-xs'>
                                    <Star className='w-2 h-2 mr-1' />
                                    Featured
                                  </Badge>
                                )}
                                {product.vendor.verified && (
                                  <CheckCircle className='w-4 h-4 text-blue-500' />
                                )}
                              </div>
                            </div>
                            <p className='text-xs text-gray-600 mb-2'>{product.description}</p>
                            
                            <div className='flex items-center space-x-2 text-xs text-gray-600 mb-2'>
                              <Store className='w-3 h-3' />
                              <span>{product.vendor.name}</span>
                              <Star className='w-3 h-3 fill-amber-400 text-amber-400' />
                              <span>{product.vendor.rating}</span>
                            </div>

                            <div className='space-y-2 mb-3'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                  <span className='font-bold text-lg text-blue-600'>
                                    ${product.price}
                                  </span>
                                  {product.compareAtPrice > product.price && (
                                    <>
                                      <span className='text-sm text-gray-400 line-through'>
                                        ${product.compareAtPrice}
                                      </span>
                                      <Badge className='bg-emerald-100 text-emerald-800 border-emerald-300 text-xs'>
                                        {calculateDiscount(product.price, product.compareAtPrice)}% off
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge className={getStockStatus(product.inStock)}>
                                {product.inStock ? `${product.inventory} in stock` : 'Out of stock'}
                              </Badge>
                            </div>

                            <div className='flex items-center space-x-4 text-xs text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Star className='w-3 h-3 mr-1 fill-amber-400 text-amber-400' />
                                {product.rating}
                              </span>
                              <span className='flex items-center'>
                                <Eye className='w-3 h-3 mr-1' />
                                {product.reviewCount} reviews
                              </span>
                              <span className='flex items-center'>
                                <Package className='w-3 h-3 mr-1' />
                                {product.sales} sold
                              </span>
                            </div>

                            <div className='flex items-center justify-between'>
                              <Button size='sm' className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'>
                                <ShoppingCart className='w-3 h-3 mr-1' />
                                Add to Cart
                              </Button>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Heart className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-blue-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Store, label: 'Browse Vendors', color: 'from-blue-500 to-cyan-500' },
                    { icon: ShoppingCart, label: 'View Cart', color: 'from-cyan-500 to-teal-500' },
                    { icon: Heart, label: 'My Favorites', color: 'from-rose-500 to-pink-500' },
                    { icon: Package, label: 'Track Order', color: 'from-emerald-500 to-green-500' },
                    { icon: User, label: 'Vendor Dashboard', color: 'from-purple-500 to-pink-500' },
                    { icon: Award, label: 'Top Rated', color: 'from-amber-500 to-orange-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-blue-300 hover:border-cyan-300 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Cart Items</span>
                      <span className='font-medium'>5 items</span>
                    </div>
                    <Progress value={33} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Truck className='w-5 h-5 text-blue-600' />
                      <div>
                        <div className='font-medium'>Free Shipping</div>
                        <div className='text-sm text-blue-600'>On orders $50+</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Marketplace Insights */}
        <section data-template-section='marketplace-insights' data-component-type='stats-grid'>
          <Card className='border border-blue-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Marketplace Insights</CardTitle>
                  <CardDescription>Performance and activity metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-blue-300'>
                  <BarChart3 className='w-4 h-4 mr-2' />
                  Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Best Seller', 
                    value: 'Canvas Art', 
                    desc: '342 units sold',
                    icon: Award,
                    color: 'from-amber-500 to-orange-500'
                  },
                  { 
                    label: 'Top Vendor', 
                    value: 'Coastal Creations', 
                    desc: '$12,500 revenue',
                    icon: Store,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'New Vendors', 
                    value: '28 this month', 
                    desc: '+12% growth',
                    icon: Users,
                    color: 'from-cyan-500 to-teal-500'
                  },
                  { 
                    label: 'Avg. Delivery', 
                    value: '2.3 days', 
                    desc: 'Fast shipping',
                    icon: Truck,
                    color: 'from-emerald-500 to-green-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-1'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>{stat.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}