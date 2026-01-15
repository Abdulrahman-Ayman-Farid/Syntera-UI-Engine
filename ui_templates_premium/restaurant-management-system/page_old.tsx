'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  Utensils, ChefHat, Coffee, Clock, Users,
  TrendingUp, DollarSign, Star, Bell, Settings,
  Search, Filter, Plus, Edit, Trash2, 
  Calendar, Phone, MapPin, MessageSquare, Wifi
} from 'lucide-react'

export default function RestaurantManagementSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      setOrders([
        { id: 101, table: 'T-12', items: 3, total: 85.50, status: 'Preparing', time: '15 min' },
        { id: 102, table: 'T-05', items: 2, total: 42.75, status: 'Ready', time: '5 min' },
        { id: 103, table: 'T-08', items: 4, total: 120.25, status: 'Served', time: '0 min' },
      ])
    }, 1200)
  }, [])

  const menuItems = [
    { id: 1, name: 'Truffle Pasta', category: 'Main Course', price: 24.99, availability: true, popularity: 95 },
    { id: 2, name: 'Caesar Salad', category: 'Appetizer', price: 14.50, availability: true, popularity: 88 },
    { id: 3, name: 'Chocolate Lava', category: 'Dessert', price: 12.99, availability: false, popularity: 92 },
  ]

  const reservations = [
    { id: 1, name: 'Michael Smith', guests: 4, time: '7:30 PM', status: 'Confirmed', special: 'Birthday' },
    { id: 2, name: 'Emma Wilson', guests: 2, time: '8:15 PM', status: 'Pending', special: 'None' },
    { id: 3, name: 'James Brown', guests: 6, time: '6:45 PM', status: 'Confirmed', special: 'Anniversary' },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50/30 flex flex-col'>
      <header className='p-6 bg-white/90 backdrop-blur-sm border-b border-rose-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-rose-600 to-amber-600 rounded-xl'>
              <Utensils className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-stone-900'>Gusto Restaurant</h1>
              <p className='text-stone-600'>Fine Dining Management</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
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
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Restaurant Stats */}
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            { label: 'Today\'s Revenue', value: '$2,845', change: '+18%', icon: DollarSign, color: 'text-emerald-600' },
            { label: 'Active Tables', value: '14/24', change: '+2', icon: Users, color: 'text-blue-600' },
            { label: 'Avg. Wait Time', value: '12 min', change: '-3 min', icon: Clock, color: 'text-amber-600' },
            { label: 'Customer Rating', value: '4.8', change: '+0.2', icon: Star, color: 'text-rose-600' },
          ].map((stat, i) => (
            <Card key={i} className='border border-rose-100 hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-stone-600'>{stat.label}</p>
                    <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                    <div className='flex items-center mt-1'>
                      <TrendingUp className={`w-4 h-4 ${stat.color} mr-1`} />
                      <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-gradient-to-br from-rose-50 to-amber-50'>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Active Orders */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-stone-900'>Active Orders</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search orders...'
                className='w-64 border-rose-300 focus:border-rose-500'
                startIcon={Search}
              />
              <Select defaultValue='all'>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='preparing'>Preparing</SelectItem>
                  <SelectItem value='ready'>Ready</SelectItem>
                  <SelectItem value='served'>Served</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-48 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {orders.map((order) => (
                <Card key={order.id} className='border border-rose-100 hover:shadow-xl transition-all duration-300'>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-bold text-stone-900'>Order #{order.id}</h3>
                        <p className='text-sm text-stone-600'>Table {order.table}</p>
                      </div>
                      <Badge variant={
                        order.status === 'Preparing' ? 'secondary' :
                        order.status === 'Ready' ? 'success' :
                        'default'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='bg-rose-50 p-3 rounded-lg'>
                          <div className='text-sm text-rose-600'>Items</div>
                          <div className='text-xl font-bold'>{order.items}</div>
                        </div>
                        <div className='bg-amber-50 p-3 rounded-lg'>
                          <div className='text-sm text-amber-600'>Total</div>
                          <div className='text-xl font-bold'>${order.total}</div>
                        </div>
                      </div>
                      
                      <div className='flex items-center justify-between pt-4 border-t border-rose-100'>
                        <div className='flex items-center text-stone-600'>
                          <Clock className='w-4 h-4 mr-2' />
                          <span>{order.time}</span>
                        </div>
                        <Button size='sm' className='bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600'>
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Menu & Reservations */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Popular Menu Items */}
          <Card className='border border-rose-100'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <ChefHat className='w-5 h-5 mr-2 text-rose-600' />
                Popular Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {menuItems.map((item) => (
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
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='flex items-center space-x-2'>
                        <Progress value={item.popularity} className='w-20 h-2' />
                        <span className='text-sm font-medium'>{item.popularity}%</span>
                      </div>
                      <Badge variant={item.availability ? 'success' : 'destructive'} className='mt-2'>
                        {item.availability ? 'Available' : 'Sold Out'}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-rose-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Menu Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Reservations */}
          <Card className='border border-rose-100'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-blue-600' />
                Today's Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {reservations.map((reservation) => (
                  <div key={reservation.id} className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
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
                      </div>
                      {reservation.special !== 'None' && (
                        <Badge className='mt-2 bg-amber-100 text-amber-800 border-amber-200'>
                          {reservation.special}
                        </Badge>
                      )}
                    </div>
                    <div className='text-right'>
                      <Badge variant={reservation.status === 'Confirmed' ? 'success' : 'secondary'}>
                        {reservation.status}
                      </Badge>
                      <Button variant='ghost' size='sm' className='mt-2'>
                        <Phone className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-blue-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  New Reservation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff & Tables */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Staff On Duty */}
          <Card className='border border-rose-100'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Users className='w-5 h-5 mr-2 text-emerald-600' />
                Staff On Duty
              </CardTitle>
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

          {/* Table Status */}
          <Card className='border border-rose-100'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Utensils className='w-5 h-5 mr-2 text-amber-600' />
                Table Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-4 gap-4'>
                {[
                  { id: 'T-01', status: 'Occupied', time: '45 min' },
                  { id: 'T-02', status: 'Available', time: '' },
                  { id: 'T-03', status: 'Reserved', time: '7:30 PM' },
                  { id: 'T-04', status: 'Occupied', time: '30 min' },
                  { id: 'T-05', status: 'Available', time: '' },
                  { id: 'T-06', status: 'Cleaning', time: '' },
                  { id: 'T-07', status: 'Occupied', time: '60 min' },
                  { id: 'T-08', status: 'Available', time: '' },
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}