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
  Heart, ShoppingBag, ShoppingCart, Search, Filter, Plus,
  Edit, Trash, ChevronRight, UserCircle, Share2, Download,
  Tag, TrendingUp, TrendingDown, Eye, Star, AlertTriangle,
  DollarSign, Package, Clock, CheckCircle
} from 'lucide-react'

// Wishlist metrics with type-safe constants
const WISHLIST_METRICS = [
  {
    id: 'total_items',
    label: 'Total Items',
    value: '156',
    change: '+12',
    status: 'increasing' as const,
    icon: Heart,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'total_value',
    label: 'Total Value',
    value: '$8,425',
    change: '+18%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-cyan-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'price_drops',
    label: 'Price Drops',
    value: '23',
    change: '+5',
    status: 'good' as const,
    icon: TrendingDown,
    color: 'from-emerald-500 to-green-500',
    format: 'count'
  },
  {
    id: 'out_of_stock',
    label: 'Out of Stock',
    value: '7',
    change: '+2',
    status: 'warning' as const,
    icon: AlertTriangle,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

// Ocean themed wishlist products
const WISHLIST_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Ocean Blue Ceramic Vase',
    price: 89.99,
    compareAtPrice: 120.00,
    image: '🏺',
    category: 'home-decor',
    inStock: true,
    rating: 4.8,
    reviewCount: 245,
    addedAt: '2026-01-10',
    priceDropped: false
  },
  {
    id: 'prod-002',
    name: 'Turquoise Wave Art Print',
    price: 45.00,
    compareAtPrice: 65.00,
    image: '🖼️',
    category: 'art',
    inStock: true,
    rating: 4.9,
    reviewCount: 182,
    addedAt: '2026-01-12',
    priceDropped: true
  },
  {
    id: 'prod-003',
    name: 'Azure Throw Pillows Set',
    price: 52.00,
    compareAtPrice: 52.00,
    image: '🛋️',
    category: 'home-decor',
    inStock: false,
    rating: 4.6,
    reviewCount: 98,
    addedAt: '2026-01-08',
    priceDropped: false
  },
  {
    id: 'prod-004',
    name: 'Coastal Blue Table Lamp',
    price: 125.00,
    compareAtPrice: 150.00,
    image: '💡',
    category: 'lighting',
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    addedAt: '2026-01-14',
    priceDropped: true
  },
] as const

// Price tracking data
const PRICE_HISTORY = [
  { week: 'W1', avgPrice: 95, lowestPrice: 78, itemsTracked: 142 },
  { week: 'W2', avgPrice: 92, lowestPrice: 75, itemsTracked: 148 },
  { week: 'W3', avgPrice: 88, lowestPrice: 72, itemsTracked: 151 },
  { week: 'W4', avgPrice: 85, lowestPrice: 68, itemsTracked: 156 },
] as const

// Category distribution
const CATEGORY_STATS = [
  { category: 'Home Decor', count: 65, value: '$3,250', color: '#0066cc' },
  { category: 'Art & Prints', count: 42, value: '$1,890', color: '#40c4ff' },
  { category: 'Lighting', count: 28, value: '$2,100', color: '#0891b2' },
  { category: 'Textiles', count: 21, value: '$1,185', color: '#06b6d4' },
] as const

export default function OceanBlueWishlistManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('recent')
  const [filterStock, setFilterStock] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStockStatus = (inStock: boolean) => {
    return inStock 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : 'bg-rose-100 text-rose-800 border-rose-300'
  }

  const calculateSavings = (price: number, compareAt: number) => {
    return compareAt - price
  }

  const filteredProducts = useMemo(() => {
    return WISHLIST_PRODUCTS.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        product.category === selectedCategory
      const matchesStock = filterStock === 'all' || 
        (filterStock === 'in-stock' && product.inStock) ||
        (filterStock === 'out-of-stock' && !product.inStock)
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [searchQuery, selectedCategory, filterStock])

  return (
    <div className='min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-blue-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Ocean Wishlist</h1>
                <p className='text-gray-600'>Track and save your favorite items</p>
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
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Wishlist Metrics Overview */}
        <section data-template-section='wishlist-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {WISHLIST_METRICS.map((metric) => (
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
          {/* Price Tracking */}
          <section data-template-section='price-tracking' data-chart-type='line' data-metrics='avgPrice,lowestPrice'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Price Tracking</CardTitle>
                    <CardDescription>Average and lowest prices over time</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingDown className='w-3 h-3 mr-1' />
                    -12% Avg Price
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PRICE_HISTORY}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='week' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type='monotone' 
                      dataKey='avgPrice' 
                      stroke='#0066cc' 
                      strokeWidth={2}
                      name='Avg Price'
                    />
                    <Line 
                      type='monotone' 
                      dataKey='lowestPrice' 
                      stroke='#40c4ff' 
                      strokeWidth={2}
                      name='Lowest Price'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Category Distribution */}
          <section data-template-section='category-stats' data-chart-type='bar' data-metrics='count,value'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Category Distribution</CardTitle>
                    <CardDescription>Items by category</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <Tag className='w-3 h-3 mr-1' />
                    4 Categories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={CATEGORY_STATS}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='category' stroke='#666' />
                    <YAxis stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Items' radius={[4, 4, 0, 0]}>
                      {CATEGORY_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Wishlist Browser */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Products Grid */}
          <section data-template-section='wishlist-browser' data-component-type='product-grid' className='lg:col-span-2'>
            <Card className='border border-blue-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>My Wishlist</CardTitle>
                    <CardDescription>Saved items and favorites</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search items...'
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
                        <SelectItem value='home-decor'>Home Decor</SelectItem>
                        <SelectItem value='art'>Art</SelectItem>
                        <SelectItem value='lighting'>Lighting</SelectItem>
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
                              <h4 className='font-bold'>{product.name}</h4>
                              <Badge className={getStockStatus(product.inStock)}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </div>
                            
                            <div className='space-y-2 mb-3'>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>Current Price</span>
                                <span className='font-bold text-lg text-blue-600'>
                                  ${product.price.toFixed(2)}
                                </span>
                              </div>
                              {product.compareAtPrice > product.price && (
                                <div className='flex items-center justify-between'>
                                  <span className='text-sm text-gray-400 line-through'>
                                    ${product.compareAtPrice.toFixed(2)}
                                  </span>
                                  <span className='text-sm font-medium text-emerald-600'>
                                    Save ${calculateSavings(product.price, product.compareAtPrice).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Star className='w-3 h-3 mr-1 fill-amber-400 text-amber-400' />
                                {product.rating}
                              </span>
                              <span className='flex items-center'>
                                <Eye className='w-3 h-3 mr-1' />
                                {product.reviewCount} reviews
                              </span>
                              {product.priceDropped && (
                                <Badge className='bg-emerald-100 text-emerald-800 border-emerald-300'>
                                  <TrendingDown className='w-3 h-3 mr-1' />
                                  Price Drop
                                </Badge>
                              )}
                            </div>

                            <div className='flex items-center justify-between'>
                              <Button size='sm' className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'>
                                <ShoppingCart className='w-3 h-3 mr-1' />
                                Add to Cart
                              </Button>
                              <div className='flex items-center space-x-2'>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Share2 className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8 text-rose-500'>
                                  <Trash className='w-4 h-4' />
                                </Button>
                              </div>
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
                    { icon: Plus, label: 'Add Item', color: 'from-blue-500 to-cyan-500' },
                    { icon: ShoppingCart, label: 'Move to Cart', color: 'from-cyan-500 to-teal-500' },
                    { icon: Share2, label: 'Share Wishlist', color: 'from-teal-500 to-emerald-500' },
                    { icon: Download, label: 'Export List', color: 'from-emerald-500 to-green-500' },
                    { icon: Tag, label: 'Price Alerts', color: 'from-amber-500 to-orange-500' },
                    { icon: Filter, label: 'Filter Items', color: 'from-purple-500 to-pink-500' },
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
                      <span className='text-gray-600'>Items in Cart</span>
                      <span className='font-medium'>12 / 156</span>
                    </div>
                    <Progress value={7.7} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <TrendingDown className='w-5 h-5 text-emerald-600' />
                      <div>
                        <div className='font-medium'>Price Drops</div>
                        <div className='text-sm text-emerald-600'>23 items on sale</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Savings & Insights */}
        <section data-template-section='savings-insights' data-component-type='stats-grid'>
          <Card className='border border-blue-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Savings & Insights</CardTitle>
                  <CardDescription>Track your savings and deals</CardDescription>
                </div>
                <Button variant='outline' className='border-blue-300'>
                  <TrendingDown className='w-4 h-4 mr-2' />
                  View All Deals
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Total Savings', 
                    value: '$1,245', 
                    desc: 'From price drops',
                    icon: DollarSign,
                    color: 'from-emerald-500 to-green-500'
                  },
                  { 
                    label: 'Best Deal', 
                    value: '42% off', 
                    desc: 'Turquoise Wave Print',
                    icon: Tag,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Most Wanted', 
                    value: '89 views', 
                    desc: 'Ocean Blue Vase',
                    icon: Eye,
                    color: 'from-cyan-500 to-teal-500'
                  },
                  { 
                    label: 'Price Alerts', 
                    value: '15 active', 
                    desc: 'Notifications enabled',
                    icon: AlertTriangle,
                    color: 'from-amber-500 to-orange-500'
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