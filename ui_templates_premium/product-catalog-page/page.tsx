'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Star, Search, Filter, Plus, Download, 
  Share2, Eye, TrendingUp, TrendingDown, Package, DollarSign,
  Users, Tag, Grid3x3, List, SlidersHorizontal, CheckCircle,
  AlertCircle, Clock, Zap, BarChart3, Sparkles, Gift,
  ArrowUpRight, ArrowDownRight, ShoppingBag, Box
} from 'lucide-react'

// Product metrics with TypeScript constants
const PRODUCT_METRICS = [
  {
    id: 'total_products',
    label: 'Total Products',
    value: '1,245',
    change: '+124',
    status: 'increasing' as const,
    icon: Package,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$48,250',
    change: '+18%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'avg_rating',
    label: 'Avg Rating',
    value: '4.7',
    unit: '/ 5',
    change: '+0.3',
    status: 'good' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'rating'
  },
  {
    id: 'total_sales',
    label: 'Total Sales',
    value: '8,425',
    change: '+25%',
    status: 'increasing' as const,
    icon: ShoppingBag,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  }
] as const

const PRODUCTS_DATA = [
  {
    id: 'prod-001',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1245,
    category: 'electronics',
    image: '🎧',
    stock: 45,
    sales: 892,
    featured: true,
    discount: 25
  },
  {
    id: 'prod-002',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 856,
    category: 'electronics',
    image: '⌚',
    stock: 82,
    sales: 654,
    featured: true,
    discount: 20
  },
  {
    id: 'prod-003',
    name: 'Designer Leather Bag',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviews: 524,
    category: 'fashion',
    image: '👜',
    stock: 28,
    sales: 445,
    featured: false,
    discount: 25
  },
  {
    id: 'prod-004',
    name: 'Organic Coffee Beans',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.7,
    reviews: 1842,
    category: 'food',
    image: '☕',
    stock: 156,
    sales: 2145,
    featured: true,
    discount: 17
  },
  {
    id: 'prod-005',
    name: 'Ergonomic Office Chair',
    price: 349.99,
    originalPrice: 449.99,
    rating: 4.5,
    reviews: 642,
    category: 'furniture',
    image: '🪑',
    stock: 18,
    sales: 324,
    featured: false,
    discount: 22
  },
  {
    id: 'prod-006',
    name: 'Professional Camera Kit',
    price: 1299.99,
    originalPrice: 1599.99,
    rating: 4.9,
    reviews: 385,
    category: 'electronics',
    image: '📷',
    stock: 12,
    sales: 185,
    featured: true,
    discount: 19
  },
] as const

const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 1245, color: '#3b82f6' },
  { id: 'electronics', name: 'Electronics', count: 485, color: '#8b5cf6' },
  { id: 'fashion', name: 'Fashion', count: 324, color: '#ec4899' },
  { id: 'food', name: 'Food & Beverage', count: 245, color: '#10b981' },
  { id: 'furniture', name: 'Furniture', count: 191, color: '#f59e0b' },
] as const

const SALES_DATA = [
  { month: 'Jan', sales: 2400, revenue: 48000, orders: 420 },
  { month: 'Feb', sales: 2800, revenue: 56000, orders: 485 },
  { month: 'Mar', sales: 3200, revenue: 64000, orders: 542 },
  { month: 'Apr', sales: 3800, revenue: 76000, orders: 625 },
  { month: 'May', sales: 4200, revenue: 84000, orders: 698 },
  { month: 'Jun', sales: 4800, revenue: 96000, orders: 785 },
] as const

export default function ProductCatalogPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }, [])

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'sales': return b.sales - a.sales
        default: return b.featured ? 1 : -1
      }
    })
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const getStockStatus = useCallback((stock: number) => {
    if (stock > 50) return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    if (stock > 20) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800 border-amber-300' }
    return { label: 'Almost Out', color: 'bg-rose-100 text-rose-800 border-rose-300' }
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg'>
                <ShoppingCart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Product Catalog</h1>
                <p className='text-gray-600'>Discover amazing products & deals</p>
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
              <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg'>
                <ShoppingBag className='w-4 h-4 mr-2' />
                View Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Product Metrics */}
        <section data-template-section='product-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PRODUCT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-gray-500'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
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
          <section data-template-section='sales-trends' data-chart-type='line' data-metrics='sales,revenue,orders'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Sales Performance</CardTitle>
                    <CardDescription>Monthly sales & revenue trends</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +32% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={SALES_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='sales' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Sales'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='revenue' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Revenue ($)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Distribution */}
          <section data-template-section='category-distribution' data-chart-type='bar' data-metrics='count'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Category Overview</CardTitle>
                    <CardDescription>Products by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={CATEGORIES.slice(1)}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='name' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Products' radius={[4, 4, 0, 0]}>
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

        {/* Product Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <section data-template-section='product-filters' data-component-type='filter-panel' className='lg:col-span-1'>
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
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({cat.count})
                        </SelectItem>
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
                      <SelectItem value='featured'>Featured</SelectItem>
                      <SelectItem value='price_asc'>Price: Low to High</SelectItem>
                      <SelectItem value='price_desc'>Price: High to Low</SelectItem>
                      <SelectItem value='rating'>Highest Rated</SelectItem>
                      <SelectItem value='sales'>Best Sellers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700'>View Mode</label>
                    <Tabs value={viewMode} onValueChange={setViewMode}>
                      <TabsList>
                        <TabsTrigger value='grid'><Grid3x3 className='w-4 h-4' /></TabsTrigger>
                        <TabsTrigger value='list'><List className='w-4 h-4' /></TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <Separator />

                <div className='p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <Sparkles className='w-5 h-5 text-blue-600' />
                    <div className='font-medium text-blue-900'>Special Offers</div>
                  </div>
                  <p className='text-sm text-blue-700'>Up to 30% off on featured items</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Product Grid */}
          <section data-template-section='product-grid' data-component-type='product-list' className='lg:col-span-3'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Products</CardTitle>
                    <CardDescription>{filteredProducts.length} items found</CardDescription>
                  </div>
                  <Input
                    placeholder='Search products...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-64 border-gray-300'
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                  <AnimatePresence>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock)
                      const isWishlisted = wishlist.has(product.id)
                      
                      return (
                        <motion.div
                          key={product.id}
                          layoutId={`product-${product.id}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -4 }}
                          className={`p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer ${
                            selectedProduct === product.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                          }`}
                          onClick={() => setSelectedProduct(product.id)}
                        >
                          <div className='flex flex-col space-y-3'>
                            <div className='relative'>
                              <div className='text-6xl text-center mb-2'>{product.image}</div>
                              {product.featured && (
                                <Badge className='absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 border-0'>
                                  <Sparkles className='w-3 h-3 mr-1' />
                                  Featured
                                </Badge>
                              )}
                              {product.discount > 0 && (
                                <Badge className='absolute top-0 left-0 bg-gradient-to-r from-rose-500 to-pink-500 border-0'>
                                  -{product.discount}%
                                </Badge>
                              )}
                            </div>

                            <div>
                              <h4 className='font-bold text-lg mb-1'>{product.name}</h4>
                              <div className='flex items-center space-x-2 mb-2'>
                                <div className='flex items-center'>
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className='text-sm text-gray-600'>
                                  {product.rating} ({product.reviews})
                                </span>
                              </div>
                            </div>

                            <div className='flex items-baseline space-x-2'>
                              <span className='text-2xl font-bold text-gray-900'>
                                ${product.price.toFixed(2)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className='text-sm text-gray-400 line-through'>
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className='flex items-center justify-between text-sm'>
                              <Badge className={stockStatus.color}>
                                {stockStatus.label}
                              </Badge>
                              <span className='text-gray-600 flex items-center'>
                                <ShoppingBag className='w-3 h-3 mr-1' />
                                {product.sales} sold
                              </span>
                            </div>

                            <Separator />

                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Button 
                                  variant='ghost' 
                                  size='icon' 
                                  className='h-8 w-8'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleWishlist(product.id)
                                  }}
                                >
                                  <Heart 
                                    className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
                                  />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Eye className='w-4 h-4' />
                                </Button>
                              </div>
                              <Button 
                                className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                size='sm'
                              >
                                <ShoppingCart className='w-4 h-4 mr-2' />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
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
