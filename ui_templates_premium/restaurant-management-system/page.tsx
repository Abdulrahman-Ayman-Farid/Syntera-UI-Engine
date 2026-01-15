'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip as RechartsTooltip,
  PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Utensils, ChefHat, Coffee, Clock, Users,
  TrendingUp, TrendingDown, DollarSign, Star, Bell, Settings,
  Search, Filter, Plus, Edit, Trash2, 
  Calendar, Phone, MapPin, MessageSquare, 
  Package, ShoppingCart, Activity, Tag
} from 'lucide-react'

// Restaurant metrics with type-safe constants
const RESTAURANT_METRICS = [
  {
    id: 'daily_revenue',
    label: "Today's Revenue",
    value: '$2,845',
    change: '+18%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'active_tables',
    label: 'Active Tables',
    value: '14',
    unit: '/24',
    change: '+2',
    status: 'good' as const,
    icon: Utensils,
    color: 'from-rose-500 to-red-500',
    format: 'count'
  },
  {
    id: 'avg_wait_time',
    label: 'Avg. Wait Time',
    value: '12',
    unit: 'min',
    change: '-3 min',
    status: 'good' as const,
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    format: 'time'
  },
  {
    id: 'customer_rating',
    label: 'Customer Rating',
    value: '4.8',
    unit: '/5',
    change: '+0.2',
    status: 'increasing' as const,
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
    format: 'rating'
  }
] as const

const ORDER_STATUS_DISTRIBUTION = [
  { status: 'Preparing', count: 12, color: '#f59e0b' },
  { status: 'Ready', count: 5, color: '#10b981' },
  { status: 'Served', count: 18, color: '#3b82f6' },
  { status: 'Completed', count: 32, color: '#6366f1' },
] as const

const ORDERS_DATA = [
  {
    id: 'order-101',
    orderNumber: 101,
    table: 'T-12',
    customerName: 'John Smith',
    items: [
      { name: 'Truffle Pasta', quantity: 1, price: 24.99 },
      { name: 'Caesar Salad', quantity: 2, price: 14.50 },
      { name: 'Red Wine', quantity: 1, price: 18.00 }
    ],
    itemCount: 3,
    total: 71.99,
    status: 'preparing',
    timeElapsed: '15 min',
    server: 'Emma Wilson',
    priority: 'normal',
    specialRequests: 'No onions'
  },
  {
    id: 'order-102',
    orderNumber: 102,
    table: 'T-05',
    customerName: 'Sarah Johnson',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 28.99 },
      { name: 'Sparkling Water', quantity: 1, price: 4.50 }
    ],
    itemCount: 2,
    total: 33.49,
    status: 'ready',
    timeElapsed: '5 min',
    server: 'Michael Chen',
    priority: 'high',
    specialRequests: ''
  },
  {
    id: 'order-103',
    orderNumber: 103,
    table: 'T-08',
    customerName: 'David Lee',
    items: [
      { name: 'Steak Dinner', quantity: 2, price: 42.00 },
      { name: 'Chocolate Lava', quantity: 2, price: 12.99 }
    ],
    itemCount: 4,
    total: 109.98,
    status: 'served',
    timeElapsed: '0 min',
    server: 'Lisa Zhang',
    priority: 'normal',
    specialRequests: 'Medium rare'
  },
] as const

const MENU_ITEMS = [
  { 
    id: 'menu-001',
    name: 'Truffle Pasta', 
    category: 'Main Course', 
    price: 24.99, 
    availability: true, 
    popularity: 95,
    ingredients: ['Pasta', 'Truffle', 'Cream'],
    prepTime: 15
  },
  { 
    id: 'menu-002',
    name: 'Caesar Salad', 
    category: 'Appetizer', 
    price: 14.50, 
    availability: true, 
    popularity: 88,
    ingredients: ['Romaine', 'Parmesan', 'Croutons'],
    prepTime: 8
  },
  { 
    id: 'menu-003',
    name: 'Chocolate Lava', 
    category: 'Dessert', 
    price: 12.99, 
    availability: false, 
    popularity: 92,
    ingredients: ['Chocolate', 'Flour', 'Butter'],
    prepTime: 12
  },
  { 
    id: 'menu-004',
    name: 'Grilled Salmon', 
    category: 'Main Course', 
    price: 28.99, 
    availability: true, 
    popularity: 85,
    ingredients: ['Salmon', 'Lemon', 'Herbs'],
    prepTime: 18
  },
] as const

const RESERVATIONS_DATA = [
  { 
    id: 'res-001',
    name: 'Michael Smith', 
    guests: 4, 
    time: '7:30 PM',
    date: '2026-01-14', 
    status: 'confirmed',
    special: 'Birthday',
    phone: '+1-555-0101',
    notes: 'Window seat preferred'
  },
  { 
    id: 'res-002',
    name: 'Emma Wilson', 
    guests: 2, 
    time: '8:15 PM',
    date: '2026-01-14', 
    status: 'pending',
    special: 'None',
    phone: '+1-555-0102',
    notes: ''
  },
  { 
    id: 'res-003',
    name: 'James Brown', 
    guests: 6, 
    time: '6:45 PM',
    date: '2026-01-14', 
    status: 'confirmed',
    special: 'Anniversary',
    phone: '+1-555-0103',
    notes: 'Quiet table, champagne'
  },
] as const

const SALES_DATA = [
  { hour: '11am', orders: 8, revenue: 245 },
  { hour: '12pm', orders: 15, revenue: 485 },
  { hour: '1pm', orders: 18, revenue: 625 },
  { hour: '2pm', orders: 12, revenue: 380 },
  { hour: '6pm', orders: 22, revenue: 785 },
  { hour: '7pm', orders: 28, revenue: 945 },
  { hour: '8pm', orders: 32, revenue: 1125 },
  { hour: '9pm', orders: 24, revenue: 820 },
] as const

export default function RestaurantManagementSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('today')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'served': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredOrders = useMemo(() => {
    return ORDERS_DATA.filter(order => {
      const matchesSearch = searchQuery === '' || 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toString().includes(searchQuery)
      const matchesStatus = statusFilter === 'all' || 
        order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50/30'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-rose-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-rose-600 to-amber-600 rounded-xl shadow-lg'>
                <Utensils className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-stone-900'>Gusto Restaurant Pro</h1>
                <p className='text-stone-600'>Fine dining management system</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-rose-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' className='border-rose-200 text-rose-700 hover:bg-rose-50'>
                <Calendar className='w-4 h-4 mr-2' />
                Reservations
              </Button>
              <Button className='bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700'>
                <Plus className='w-4 h-4 mr-2' />
                New Order
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Restaurant Overview */}
        <section data-template-section='restaurant-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {RESTAURANT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-rose-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-stone-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-stone-900'>{metric.value}</span>
                            {metric.unit && (
                              <span className='text-stone-500'>{metric.unit}</span>
                            )}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'increasing' 
                              ? 'text-emerald-600' 
                              : 'text-amber-600'
                          }`}>
                            {metric.change.startsWith('+') || metric.change.startsWith('-') ? (
                              metric.change.startsWith('+') ? (
                                <TrendingUp className='w-4 h-4 mr-1' />
                              ) : (
                                <TrendingDown className='w-4 h-4 mr-1' />
                              )
                            ) : null}
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
          {/* Order Status Distribution */}
          <section data-template-section='order-distribution' data-chart-type='pie' data-metrics='count'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Order Status</CardTitle>
                    <CardDescription>Distribution by status</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-rose-200 text-rose-700'>
                    <Activity className='w-3 h-3 mr-1' />
                    Live Status
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={ORDER_STATUS_DISTRIBUTION}
                      dataKey='count'
                      nameKey='status'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      label
                    >
                      {ORDER_STATUS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Sales Trends */}
          <section data-template-section='sales-trends' data-chart-type='line' data-metrics='orders,revenue'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Hourly Sales</CardTitle>
                    <CardDescription>Orders and revenue by hour</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +28% Today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={SALES_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='hour' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='orders' 
                      stroke='#e11d48' 
                      strokeWidth={2}
                      name='Orders'
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
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='orders'>Active Orders</TabsTrigger>
            <TabsTrigger value='menu'>Menu Management</TabsTrigger>
            <TabsTrigger value='reservations'>Reservations</TabsTrigger>
          </TabsList>

          {/* Active Orders Tab */}
          <TabsContent value='orders' data-template-section='active-orders' data-component-type='order-grid'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Active Orders</CardTitle>
                    <CardDescription>Manage current orders</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search orders...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-rose-300'
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className='w-32 border-rose-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='preparing'>Preparing</SelectItem>
                        <SelectItem value='ready'>Ready</SelectItem>
                        <SelectItem value='served'>Served</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className='border border-rose-100 hover:shadow-xl transition-all duration-300'>
                          <CardContent className='p-6'>
                            <div className='flex items-start justify-between mb-4'>
                              <div>
                                <h3 className='text-xl font-bold text-stone-900'>Order #{order.orderNumber}</h3>
                                <p className='text-sm text-stone-600'>Table {order.table}</p>
                                <p className='text-sm text-stone-500'>{order.customerName}</p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            
                            <div className='space-y-4'>
                              <div className='grid grid-cols-2 gap-4'>
                                <div className='bg-rose-50 p-3 rounded-lg'>
                                  <div className='text-sm text-rose-600'>Items</div>
                                  <div className='text-xl font-bold'>{order.itemCount}</div>
                                </div>
                                <div className='bg-amber-50 p-3 rounded-lg'>
                                  <div className='text-sm text-amber-600'>Total</div>
                                  <div className='text-xl font-bold'>${order.total.toFixed(2)}</div>
                                </div>
                              </div>
                              
                              <div className='text-sm text-stone-600 space-y-1'>
                                {order.items.map((item, i) => (
                                  <div key={i} className='flex justify-between'>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span className='font-medium'>${item.price}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className='flex items-center justify-between pt-4 border-t border-rose-100'>
                                <div className='flex items-center text-stone-600'>
                                  <Clock className='w-4 h-4 mr-2' />
                                  <span>{order.timeElapsed}</span>
                                </div>
                                <Button size='sm' className='bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600'>
                                  Update
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value='menu' data-template-section='menu-management' data-component-type='menu-grid'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Menu Items</CardTitle>
                    <CardDescription>Manage your restaurant menu</CardDescription>
                  </div>
                  <Button variant='outline' className='border-rose-300'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {MENU_ITEMS.map((item) => (
                    <div key={item.id} className='flex items-center justify-between p-4 bg-rose-50 rounded-lg'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-10 h-10 bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg flex items-center justify-center'>
                          <Utensils className='w-5 h-5 text-white' />
                        </div>
                        <div>
                          <h4 className='font-medium'>{item.name}</h4>
                          <div className='flex items-center space-x-4 text-sm text-stone-600'>
                            <span>{item.category}</span>
                            <span>${item.price}</span>
                            <span>{item.prepTime} min</span>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                          <div className='flex items-center space-x-2 mb-1'>
                            <Progress value={item.popularity} className='w-20 h-2' />
                            <span className='text-sm font-medium'>{item.popularity}%</span>
                          </div>
                          <Badge className={item.availability ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}>
                            {item.availability ? 'Available' : 'Sold Out'}
                          </Badge>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value='reservations' data-template-section='reservations' data-component-type='reservation-list'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Today's Reservations</CardTitle>
                    <CardDescription>Manage table bookings</CardDescription>
                  </div>
                  <Button variant='outline' className='border-rose-300'>
                    <Plus className='w-4 h-4 mr-2' />
                    New Reservation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {RESERVATIONS_DATA.map((reservation) => (
                    <div key={reservation.id} className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white'>
                          <Users className='w-6 h-6' />
                        </div>
                        <div>
                          <h4 className='font-medium'>{reservation.name}</h4>
                          <div className='flex items-center space-x-4 text-sm text-blue-600 mt-1'>
                            <span className='flex items-center'>
                              <Users className='w-3 h-3 mr-1' />
                              {reservation.guests} guests
                            </span>
                            <span className='flex items-center'>
                              <Clock className='w-3 h-3 mr-1' />
                              {reservation.time}
                            </span>
                            <span className='flex items-center'>
                              <Phone className='w-3 h-3 mr-1' />
                              {reservation.phone}
                            </span>
                          </div>
                          {reservation.special !== 'None' && (
                            <Badge className='mt-2 bg-amber-100 text-amber-800 border-amber-200'>
                              {reservation.special}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className='text-right'>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <div className='flex items-center space-x-2 mt-2'>
                          <Button variant='ghost' size='sm'>
                            <Phone className='w-3 h-3' />
                          </Button>
                          <Button variant='ghost' size='sm'>
                            <Edit className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Staff & Tables */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Staff On Duty */}
          <section data-template-section='staff-management' data-component-type='staff-grid'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Staff On Duty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                  {[
                    { name: 'Chef Maria', role: 'Head Chef', status: 'Active', color: 'bg-rose-100 text-rose-800' },
                    { name: 'Server Tom', role: 'Lead Server', status: 'On Break', color: 'bg-amber-100 text-amber-800' },
                    { name: 'Manager Leo', role: 'Floor Manager', status: 'Active', color: 'bg-blue-100 text-blue-800' },
                    { name: 'Bartender Sam', role: 'Mixologist', status: 'Active', color: 'bg-emerald-100 text-emerald-800' },
                    { name: 'Hostess Mia', role: 'Reception', status: 'Active', color: 'bg-purple-100 text-purple-800' },
                    { name: 'Dishwasher Joe', role: 'Kitchen', status: 'Available', color: 'bg-slate-100 text-slate-800' },
                  ].map((staff, i) => (
                    <div key={i} className='text-center'>
                      <Avatar className='w-12 h-12 mx-auto mb-2'>
                        <AvatarFallback className={staff.color.split(' ')[0]}>
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className='font-medium'>{staff.name}</h4>
                      <p className='text-sm text-stone-600'>{staff.role}</p>
                      <Badge variant='outline' className='mt-2'>
                        {staff.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Table Status */}
          <section data-template-section='table-status' data-component-type='table-grid'>
            <Card className='border border-rose-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Table Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-4 gap-4'>
                  {[
                    { id: 'T-01', status: 'Occupied', time: '45 min', guests: 4 },
                    { id: 'T-02', status: 'Available', time: '', guests: 0 },
                    { id: 'T-03', status: 'Reserved', time: '7:30 PM', guests: 6 },
                    { id: 'T-04', status: 'Occupied', time: '30 min', guests: 2 },
                    { id: 'T-05', status: 'Available', time: '', guests: 0 },
                    { id: 'T-06', status: 'Cleaning', time: '', guests: 0 },
                    { id: 'T-07', status: 'Occupied', time: '60 min', guests: 4 },
                    { id: 'T-08', status: 'Available', time: '', guests: 0 },
                  ].map((table, i) => (
                    <div key={i} className={`
                      p-4 rounded-lg text-center cursor-pointer transition-all hover:scale-105
                      ${table.status === 'Occupied' ? 'bg-rose-100 text-rose-800 border-2 border-rose-300' :
                        table.status === 'Available' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' :
                        table.status === 'Reserved' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                        'bg-amber-100 text-amber-800 border-2 border-amber-300'}
                    `}>
                      <div className='font-bold text-lg'>{table.id}</div>
                      <div className='text-sm font-medium mt-1'>{table.status}</div>
                      {table.time && <div className='text-xs mt-1'>{table.time}</div>}
                      {table.guests > 0 && <div className='text-xs mt-1'>{table.guests} guests</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
