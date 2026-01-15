'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Search, GitCompare, Star, Check, X, TrendingUp, 
  TrendingDown, DollarSign, Award, Heart, ShoppingCart,
  AlertCircle, CheckCircle, Info, BarChart3, Package,
  Zap, Shield, Truck, RefreshCw
} from 'lucide-react'

// Comparison metrics with TypeScript constants
const COMPARISON_METRICS = [
  {
    id: 'total_comparisons',
    label: 'Total Comparisons',
    value: '2,845',
    change: '+245',
    status: 'increasing' as const,
    icon: GitCompare,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'avg_price_diff',
    label: 'Avg Price Diff',
    value: '$45.50',
    change: '-$5.20',
    status: 'good' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'best_rated',
    label: 'Best Rated',
    value: '4.8',
    unit: '/ 5',
    change: '+0.2',
    status: 'increasing' as const,
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    format: 'rating'
  },
  {
    id: 'savings',
    label: 'Total Savings',
    value: '$12,450',
    change: '+28%',
    status: 'increasing' as const,
    icon: Award,
    color: 'from-purple-500 to-pink-500',
    format: 'currency'
  }
] as const

const PRODUCTS_DATA = [
  {
    id: 'prod-001',
    name: 'Premium Wireless Headphones Pro',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1245,
    brand: 'AudioTech',
    image: '🎧',
    features: {
      battery: '40 hours',
      noiseCancellation: 'Active',
      warranty: '2 years',
      connectivity: 'Bluetooth 5.0',
      weight: '250g'
    },
    specs: {
      frequency: '20Hz-20kHz',
      impedance: '32Ω',
      sensitivity: '105dB'
    },
    pros: ['Excellent sound quality', 'Long battery life', 'Comfortable fit'],
    cons: ['Slightly expensive', 'Heavy'],
    stock: true,
    shipping: 'Free',
    verdict: 'Best Overall'
  },
  {
    id: 'prod-002',
    name: 'Studio Monitor Headphones',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.6,
    reviews: 856,
    brand: 'SoundMaster',
    image: '🎧',
    features: {
      battery: '35 hours',
      noiseCancellation: 'Passive',
      warranty: '1 year',
      connectivity: 'Bluetooth 5.0',
      weight: '280g'
    },
    specs: {
      frequency: '15Hz-25kHz',
      impedance: '32Ω',
      sensitivity: '110dB'
    },
    pros: ['Professional sound', 'Durable build', 'Great value'],
    cons: ['No active NC', 'Heavier'],
    stock: true,
    shipping: 'Free',
    verdict: 'Best Value'
  },
  {
    id: 'prod-003',
    name: 'Budget Wireless Headphones',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.4,
    reviews: 624,
    brand: 'EcoSound',
    image: '🎧',
    features: {
      battery: '30 hours',
      noiseCancellation: 'None',
      warranty: '1 year',
      connectivity: 'Bluetooth 4.2',
      weight: '220g'
    },
    specs: {
      frequency: '20Hz-20kHz',
      impedance: '32Ω',
      sensitivity: '100dB'
    },
    pros: ['Affordable', 'Lightweight', 'Good battery'],
    cons: ['Basic features', 'Average sound'],
    stock: true,
    shipping: '$5.99',
    verdict: 'Budget Pick'
  },
] as const

const COMPARISON_DATA = [
  { feature: 'Battery Life', score1: 95, score2: 85, score3: 75 },
  { feature: 'Sound Quality', score1: 90, score2: 95, score3: 70 },
  { feature: 'Comfort', score1: 85, score2: 80, score3: 90 },
  { feature: 'Value', score1: 75, score2: 90, score3: 95 },
  { feature: 'Build Quality', score1: 90, score2: 85, score3: 70 },
] as const

const PRICE_TREND_DATA = [
  { month: 'Jan', prod1: 349, prod2: 279, prod3: 179 },
  { month: 'Feb', prod1: 339, prod2: 269, prod3: 174 },
  { month: 'Mar', prod1: 329, prod2: 259, prod3: 169 },
  { month: 'Apr', prod1: 319, prod2: 254, prod3: 164 },
  { month: 'May', prod1: 309, prod2: 249, prod3: 159 },
  { month: 'Jun', prod1: 299, prod2: 249, prod3: 149 },
] as const

export default function ProductComparisonTool() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [comparedProducts, setComparedProducts] = useState([0, 1, 2])
  const [showDetails, setShowDetails] = useState<number | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const selectedProducts = useMemo(() => {
    return comparedProducts.map(index => PRODUCTS_DATA[index])
  }, [comparedProducts])

  const getBestValue = useCallback((key: keyof typeof PRODUCTS_DATA[0]) => {
    if (key === 'price') {
      return Math.min(...selectedProducts.map(p => p.price))
    }
    if (key === 'rating') {
      return Math.max(...selectedProducts.map(p => p.rating))
    }
    return null
  }, [selectedProducts])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button 
                variant='ghost' 
                size='icon'
                onClick={() => router.back()}
              >
                <ArrowLeft className='w-5 h-5' />
              </Button>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <GitCompare className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Product Comparison</h1>
                <p className='text-gray-600'>Compare products side by side</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Input
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-64 border-gray-300'
              />
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                <ShoppingCart className='w-4 h-4 mr-2' />
                Add All to Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Comparison Metrics */}
        <section data-template-section='comparison-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {COMPARISON_METRICS.map((metric) => (
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

        {/* Price Trends & Radar Comparison */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Price Trends */}
          <section data-template-section='price-trends' data-chart-type='line' data-metrics='price'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Price Trends</CardTitle>
                    <CardDescription>6-month price history</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingDown className='w-3 h-3 mr-1' />
                    Prices Dropping
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PRICE_TREND_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line type='monotone' dataKey='prod1' stroke='#8b5cf6' strokeWidth={2} name='Product 1' />
                    <Line type='monotone' dataKey='prod2' stroke='#3b82f6' strokeWidth={2} name='Product 2' />
                    <Line type='monotone' dataKey='prod3' stroke='#10b981' strokeWidth={2} name='Product 3' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Radar Comparison */}
          <section data-template-section='feature-comparison' data-chart-type='radar' data-metrics='features'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Feature Comparison</CardTitle>
                    <CardDescription>Product ratings breakdown</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Radar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <RadarChart data={COMPARISON_DATA}>
                    <PolarGrid stroke='#e5e7eb' />
                    <PolarAngleAxis dataKey='feature' />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name='Product 1' dataKey='score1' stroke='#8b5cf6' fill='#8b5cf6' fillOpacity={0.3} />
                    <Radar name='Product 2' dataKey='score2' stroke='#3b82f6' fill='#3b82f6' fillOpacity={0.3} />
                    <Radar name='Product 3' dataKey='score3' stroke='#10b981' fill='#10b981' fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Detailed Comparison Table */}
        <section data-template-section='comparison-table' data-component-type='comparison-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className='grid w-full grid-cols-4'>
                  <TabsTrigger value='overview'>Overview</TabsTrigger>
                  <TabsTrigger value='specs'>Specifications</TabsTrigger>
                  <TabsTrigger value='features'>Features</TabsTrigger>
                  <TabsTrigger value='reviews'>Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='mt-6'>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-48'>Feature</TableHead>
                          {selectedProducts.map((product) => (
                            <TableHead key={product.id} className='text-center'>
                              <div className='flex flex-col items-center space-y-2'>
                                <div className='text-4xl'>{product.image}</div>
                                <div className='font-bold'>{product.name}</div>
                                <Badge>{product.verdict}</Badge>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className='font-medium'>Price</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <div className='space-y-1'>
                                <div className={`text-xl font-bold ${
                                  product.price === getBestValue('price') ? 'text-emerald-600' : ''
                                }`}>
                                  ${product.price.toFixed(2)}
                                  {product.price === getBestValue('price') && (
                                    <CheckCircle className='inline w-4 h-4 ml-2' />
                                  )}
                                </div>
                                <div className='text-sm text-gray-400 line-through'>
                                  ${product.originalPrice.toFixed(2)}
                                </div>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Rating</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <div className='flex flex-col items-center space-y-1'>
                                <div className='flex items-center justify-center'>
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${
                                        i < Math.floor(product.rating) 
                                          ? 'fill-amber-400 text-amber-400' 
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className={`font-bold ${
                                  product.rating === getBestValue('rating') ? 'text-amber-600' : ''
                                }`}>
                                  {product.rating} / 5
                                </span>
                                <span className='text-sm text-gray-500'>
                                  ({product.reviews} reviews)
                                </span>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Brand</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center font-medium'>
                              {product.brand}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Availability</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <Badge className={product.stock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}>
                                {product.stock ? (
                                  <>
                                    <CheckCircle className='w-3 h-3 mr-1' />
                                    In Stock
                                  </>
                                ) : (
                                  <>
                                    <X className='w-3 h-3 mr-1' />
                                    Out of Stock
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Shipping</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <Badge variant='outline' className={product.shipping === 'Free' ? 'border-emerald-300 text-emerald-700' : ''}>
                                <Truck className='w-3 h-3 mr-1' />
                                {product.shipping}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Actions</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <div className='flex flex-col items-center space-y-2'>
                                <Button className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'>
                                  <ShoppingCart className='w-4 h-4 mr-2' />
                                  Add to Cart
                                </Button>
                                <Button variant='outline' className='w-full'>
                                  <Heart className='w-4 h-4 mr-2' />
                                  Wishlist
                                </Button>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value='specs' className='mt-6'>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-48'>Specification</TableHead>
                          {selectedProducts.map((product) => (
                            <TableHead key={product.id} className='text-center'>
                              {product.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className='font-medium'>Frequency Response</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              {product.specs.frequency}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Impedance</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              {product.specs.impedance}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Sensitivity</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              {product.specs.sensitivity}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value='features' className='mt-6'>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-48'>Feature</TableHead>
                          {selectedProducts.map((product) => (
                            <TableHead key={product.id} className='text-center'>
                              {product.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className='font-medium'>Battery Life</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              {product.features.battery}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Noise Cancellation</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <Badge variant='outline'>
                                {product.features.noiseCancellation}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Warranty</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              <Badge className='bg-blue-100 text-blue-800'>
                                <Shield className='w-3 h-3 mr-1' />
                                {product.features.warranty}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Connectivity</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              {product.features.connectivity}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Weight</TableCell>
                          {selectedProducts.map((product) => (
                            <TableCell key={product.id} className='text-center'>
                              {product.features.weight}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value='reviews' className='mt-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {selectedProducts.map((product) => (
                      <Card key={product.id} className='border border-gray-200'>
                        <CardHeader>
                          <CardTitle className='text-base'>{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                          <div>
                            <h4 className='font-semibold text-sm text-emerald-600 mb-2'>Pros</h4>
                            <ul className='space-y-1'>
                              {product.pros.map((pro, i) => (
                                <li key={i} className='flex items-start text-sm'>
                                  <Check className='w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Separator />
                          <div>
                            <h4 className='font-semibold text-sm text-rose-600 mb-2'>Cons</h4>
                            <ul className='space-y-1'>
                              {product.cons.map((con, i) => (
                                <li key={i} className='flex items-start text-sm'>
                                  <X className='w-4 h-4 text-rose-500 mr-2 flex-shrink-0 mt-0.5' />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
