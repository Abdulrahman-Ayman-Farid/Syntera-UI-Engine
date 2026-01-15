'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  ShoppingCart, Package, Users, DollarSign, TrendingUp, 
  Search, Filter, Plus, Eye, Edit, Trash2, 
  ShoppingBag, PieChart, BarChart3, CreditCard
} from 'lucide-react'

const mockProducts = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 199.99, stock: 45, status: 'In Stock', sales: 234 },
  { id: 2, name: 'Organic Coffee Beans', category: 'Food & Drink', price: 24.99, stock: 0, status: 'Out of Stock', sales: 189 },
  { id: 3, name: 'Yoga Mat Premium', category: 'Fitness', price: 49.99, stock: 32, status: 'In Stock', sales: 156 },
  { id: 4, name: 'Desk Lamp', category: 'Home', price: 34.99, stock: 18, status: 'Low Stock', sales: 89 },
]

const mockOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: 299.97, status: 'Delivered', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', total: 124.99, status: 'Processing', date: '2024-01-14' },
]

export default function EcommerceAdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts)
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1500)
  }, [])

  const stats = [
    { label: 'Total Revenue', value: '$12,456', icon: DollarSign, change: '+12.5%', color: 'text-green-500' },
    { label: 'Total Orders', value: '342', icon: ShoppingCart, change: '+8.2%', color: 'text-blue-500' },
    { label: 'Products', value: '156', icon: Package, change: '+5.1%', color: 'text-purple-500' },
    { label: 'Customers', value: '2,845', icon: Users, change: '+15.3%', color: 'text-orange-500' },
  ]

  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen flex flex-col'>
      <header className='p-6 bg-white shadow-lg border-b'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-blue-600 rounded-lg'>
              <ShoppingBag className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>E-commerce Admin</h1>
              <p className='text-gray-600'>Manage your store efficiently</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' className='space-x-2'>
              <BarChart3 className='w-4 h-4' />
              <span>Reports</span>
            </Button>
            <Button onClick={() => setIsAddProductOpen(true)} className='bg-blue-600 hover:bg-blue-700'>
              <Plus className='w-4 h-4 mr-2' />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Stats Overview */}
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat, index) => (
            <Card key={index} className='hover:shadow-xl transition-shadow duration-300 border border-gray-200'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
                    <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                    <div className='flex items-center mt-1'>
                      <TrendingUp className={`w-4 h-4 ${stat.color} mr-1`} />
                      <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                    </div>
                  </div>
                  <div className='p-3 bg-blue-50 rounded-full'>
                    <stat.icon className='w-6 h-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Products Section */}
        <section className='bg-white rounded-xl shadow-lg border p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>Products</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search products...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-64 border-gray-300 focus:border-blue-500'
                startIcon={Search}
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-40'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  <SelectItem value='electronics'>Electronics</SelectItem>
                  <SelectItem value='food'>Food & Drink</SelectItem>
                  <SelectItem value='fitness'>Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className='space-y-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className='font-medium'>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={
                        product.status === 'In Stock' ? 'success' :
                        product.status === 'Out of Stock' ? 'destructive' :
                        'secondary'
                      }>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <Button variant='ghost' size='icon'>
                          <Eye className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon'>
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='icon'>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        {/* Recent Orders & Inventory */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Card className='border shadow-lg'>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>${order.total}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'Delivered' ? 'success' :
                          order.status === 'Processing' ? 'secondary' :
                          'default'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className='border shadow-lg'>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Stock levels overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {products.map((product) => (
                  <div key={product.id} className='flex items-center justify-between'>
                    <span className='font-medium'>{product.name}</span>
                    <div className='flex items-center space-x-4'>
                      <Progress 
                        value={(product.stock / 50) * 100} 
                        className='w-32'
                      />
                      <span className='text-sm text-gray-600'>{product.stock}/50</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Product Dialog */}
      <Dialog.Root open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-full bg-white rounded-xl p-6 shadow-2xl'>
            <Dialog.Title className='text-2xl font-bold mb-2'>Add New Product</Dialog.Title>
            <Dialog.Description className='text-gray-600 mb-6'>
              Fill in the details to add a new product to your store.
            </Dialog.Description>
            
            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Product Name</label>
                <Input placeholder='Enter product name' />
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Price</label>
                  <Input type='number' placeholder='0.00' startIcon={DollarSign} />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Stock</label>
                  <Input type='number' placeholder='Quantity' />
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium mb-2'>Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='electronics'>Electronics</SelectItem>
                    <SelectItem value='clothing'>Clothing</SelectItem>
                    <SelectItem value='home'>Home & Garden</SelectItem>
                    <SelectItem value='food'>Food & Drink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='flex justify-end space-x-4 pt-4'>
                <Button variant='outline' type='button' onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
                  Add Product
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}