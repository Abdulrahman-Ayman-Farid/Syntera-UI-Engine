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
  Home, Building2, DollarSign, Users, MapPin,
  Search, Filter, Plus, Eye, Edit, Phone,
  Calendar, Wifi, Car, Snowflake, Bath, Bed,
  BarChart3, TrendingUp, Shield, Star, MessageSquare
} from 'lucide-react'

export default function RealEstateManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeProperty, setActiveProperty] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const properties = [
    { 
      id: 1, 
      address: '123 Luxury Ave', 
      type: 'Apartment', 
      price: 4500, 
      status: 'Rented', 
      beds: 3,
      baths: 2,
      area: 1200,
      rating: 4.8,
      color: 'from-amber-500 to-orange-500'
    },
    { 
      id: 2, 
      address: '456 Modern Blvd', 
      type: 'House', 
      price: 3200, 
      status: 'Available', 
      beds: 4,
      baths: 3,
      area: 1800,
      rating: 4.5,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 3, 
      address: '789 Urban St', 
      type: 'Condo', 
      price: 2800, 
      status: 'Maintenance', 
      beds: 2,
      baths: 2,
      area: 950,
      rating: 4.2,
      color: 'from-blue-500 to-cyan-500'
    },
  ]

  const tenants = [
    { id: 1, name: 'Michael Chen', property: '123 Luxury Ave', rent: 4500, status: 'Current', leaseEnd: '2024-12-31' },
    { id: 2, name: 'Sarah Johnson', property: '456 Modern Blvd', rent: 3200, status: 'Pending', leaseEnd: '2024-06-30' },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 flex flex-col'>
      <header className='p-6 bg-white/90 backdrop-blur-sm border-b border-stone-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl'>
              <Home className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-stone-900'>PropertyPro</h1>
              <p className='text-stone-600'>Real Estate Management Platform</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Tabs value={viewMode} onValueChange={setViewMode} className='w-auto'>
              <TabsList>
                <TabsTrigger value='grid'>Grid</TabsTrigger>
                <TabsTrigger value='list'>List</TabsTrigger>
                <TabsTrigger value='map'>Map</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className='bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'>
              <Plus className='w-4 h-4 mr-2' />
              Add Property
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Portfolio Overview */}
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            { label: 'Total Properties', value: '24', change: '+3', icon: Building2, color: 'text-amber-600' },
            { label: 'Monthly Revenue', value: '$68,400', change: '+12%', icon: DollarSign, color: 'text-emerald-600' },
            { label: 'Occupancy Rate', value: '92%', change: '+4%', icon: Users, color: 'text-blue-600' },
            { label: 'Maintenance Requests', value: '8', change: '-2', icon: Shield, color: 'text-rose-600' },
          ].map((stat, i) => (
            <Card key={i} className='border border-stone-200 hover:shadow-lg transition-shadow'>
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
                  <div className='p-3 rounded-full bg-gradient-to-br from-stone-50 to-white'>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Properties Grid */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-stone-900'>Properties</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search properties...'
                className='w-64 border-stone-300 focus:border-amber-500'
                startIcon={Search}
              />
              <Select defaultValue='all'>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='available'>Available</SelectItem>
                  <SelectItem value='rented'>Rented</SelectItem>
                  <SelectItem value='maintenance'>Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-96 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {properties.map((property) => (
                <Card 
                  key={property.id}
                  className='border border-stone-200 hover:shadow-xl transition-all duration-300 group cursor-pointer'
                  onClick={() => setActiveProperty(property)}
                >
                  <div className={`h-48 bg-gradient-to-r ${property.color} rounded-t-xl relative overflow-hidden`}>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Home className='w-16 h-16 text-white/40' />
                    </div>
                    <div className='absolute top-4 right-4'>
                      <Badge className='bg-white/90 text-stone-900'>
                        ${property.price}/mo
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-bold text-stone-900 group-hover:text-amber-600'>
                          {property.address}
                        </h3>
                        <p className='text-sm text-stone-600 mt-1'>{property.type}</p>
                      </div>
                      <div className='flex items-center'>
                        <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
                        <span className='ml-1 text-sm font-medium'>{property.rating}</span>
                      </div>
                    </div>
                    
                    <div className='space-y-4'>
                      <div className='grid grid-cols-3 gap-4 text-center'>
                        <div className='bg-stone-50 p-3 rounded-lg'>
                          <Bed className='w-4 h-4 text-stone-600 mx-auto mb-1' />
                          <div className='font-medium'>{property.beds}</div>
                          <div className='text-xs text-stone-500'>Beds</div>
                        </div>
                        <div className='bg-stone-50 p-3 rounded-lg'>
                          <Bath className='w-4 h-4 text-stone-600 mx-auto mb-1' />
                          <div className='font-medium'>{property.baths}</div>
                          <div className='text-xs text-stone-500'>Baths</div>
                        </div>
                        <div className='bg-stone-50 p-3 rounded-lg'>
                          <div className='font-medium'>{property.area} sqft</div>
                          <div className='text-xs text-stone-500'>Area</div>
                        </div>
                      </div>
                      
                      <div className='flex items-center justify-between pt-4 border-t border-stone-100'>
                        <Badge variant={
                          property.status === 'Rented' ? 'success' :
                          property.status === 'Available' ? 'default' :
                          'secondary'
                        }>
                          {property.status}
                        </Badge>
                        <div className='flex space-x-2'>
                          <Button variant='ghost' size='icon'>
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon'>
                            <Edit className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Tenants & Finances */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Current Tenants */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Users className='w-5 h-5 mr-2 text-amber-600' />
                Current Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {tenants.map((tenant) => (
                  <div key={tenant.id} className='flex items-center justify-between p-4 bg-stone-50 rounded-lg'>
                    <div className='flex items-center space-x-4'>
                      <Avatar>
                        <AvatarFallback className='bg-amber-100 text-amber-800'>
                          {tenant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className='font-medium'>{tenant.name}</h4>
                        <p className='text-sm text-stone-600'>{tenant.property}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-bold'>${tenant.rent}/mo</div>
                      <Badge variant={tenant.status === 'Current' ? 'success' : 'secondary'} className='mt-1'>
                        {tenant.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-stone-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add New Tenant
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart3 className='w-5 h-5 mr-2 text-emerald-600' />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Monthly Revenue</span>
                    <span>$68,400 / $75,000</span>
                  </div>
                  <Progress value={91} className='h-2' />
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { label: 'Collected Rent', value: '$64,200', change: '+8%' },
                    { label: 'Expenses', value: '$12,400', change: '-3%' },
                    { label: 'Net Income', value: '$51,800', change: '+15%' },
                    { label: 'Vacancy Loss', value: '$2,600', change: '-25%' },
                  ].map((metric, i) => (
                    <div key={i} className='bg-stone-50 p-4 rounded-lg'>
                      <p className='text-sm text-stone-600'>{metric.label}</p>
                      <p className='text-xl font-bold mt-2'>{metric.value}</p>
                      <div className={`flex items-center text-sm mt-1 ${
                        metric.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <TrendingUp className='w-3 h-3 mr-1' />
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance & Amenities */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Maintenance Requests */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Shield className='w-5 h-5 mr-2 text-blue-600' />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  { id: 1, property: '123 Luxury Ave', issue: 'AC Not Working', priority: 'High', date: '2 hours ago' },
                  { id: 2, property: '456 Modern Blvd', issue: 'Leaky Faucet', priority: 'Medium', date: '1 day ago' },
                  { id: 3, property: '789 Urban St', issue: 'Broken Window', priority: 'High', date: '2 days ago' },
                ].map((request) => (
                  <div key={request.id} className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
                    <div>
                      <h4 className='font-medium'>{request.property}</h4>
                      <p className='text-sm text-blue-600'>{request.issue}</p>
                    </div>
                    <div className='text-right'>
                      <Badge variant={request.priority === 'High' ? 'destructive' : 'secondary'}>
                        {request.priority}
                      </Badge>
                      <p className='text-sm text-blue-600 mt-1'>{request.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Amenities */}
          <Card className='border border-stone-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Star className='w-5 h-5 mr-2 text-amber-600' />
                Amenities Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                  { icon: Wifi, label: 'WiFi', count: 22 },
                  { icon: Car, label: 'Parking', count: 18 },
                  { icon: Snowflake, label: 'AC', count: 24 },
                  { icon: '🏊', label: 'Pool', count: 8 },
                ].map((amenity, i) => (
                  <div key={i} className='text-center p-4 bg-amber-50 rounded-xl'>
                    {typeof amenity.icon === 'string' ? (
                      <div className='text-2xl mb-2'>{amenity.icon}</div>
                    ) : (
                      <amenity.icon className='w-6 h-6 text-amber-600 mx-auto mb-2' />
                    )}
                    <h4 className='font-bold text-stone-900'>{amenity.label}</h4>
                    <p className='text-sm text-stone-600'>{amenity.count} properties</p>
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