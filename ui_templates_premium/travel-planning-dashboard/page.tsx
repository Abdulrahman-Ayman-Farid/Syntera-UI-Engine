'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  MapPin, Plane, Hotel, Calendar, Users,
  Sun, Cloud, CloudRain, Wind,
  Search, Filter, Plus, Heart, Navigation,
  DollarSign, Clock, Wifi, Utensils,
  BarChart3, Camera, Luggage, Bell
} from 'lucide-react'

export default function TravelPlanningDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      setWeather({
        temperature: 24,
        condition: 'Sunny',
        humidity: 65,
        wind: 12,
        icon: Sun
      })
    }, 1000)
  }, [])

  const trips = [
    { 
      id: 1, 
      destination: 'Bali, Indonesia', 
      date: 'Mar 15-25, 2024', 
      travelers: 2, 
      status: 'Confirmed',
      budget: 3200,
      spent: 2450,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 2, 
      destination: 'Tokyo, Japan', 
      date: 'Apr 5-15, 2024', 
      travelers: 4, 
      status: 'Planning',
      budget: 4500,
      spent: 1250,
      color: 'from-rose-500 to-pink-500'
    },
    { 
      id: 3, 
      destination: 'Swiss Alps', 
      date: 'Dec 10-20, 2024', 
      travelers: 3, 
      status: 'Saved',
      budget: 2800,
      spent: 0,
      color: 'from-blue-500 to-cyan-500'
    },
  ]

  const itinerary = [
    { day: 'Day 1', date: 'Mar 15', activities: ['Arrival', 'Check-in', 'Beach Sunset'] },
    { day: 'Day 2', date: 'Mar 16', activities: ['Temple Visit', 'Cooking Class', 'Spa'] },
    { day: 'Day 3', date: 'Mar 17', activities: ['Island Hopping', 'Snorkeling', 'Seafood Dinner'] },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50/50 flex flex-col'>
      <header className='p-6 bg-white/90 backdrop-blur-sm border-b border-sky-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-xl'>
              <Plane className='w-8 h-8 text-white transform rotate-45' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>Wanderlust</h1>
              <p className='text-slate-600'>Plan your perfect adventure</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' className='border-sky-200 text-sky-700 hover:bg-sky-50'>
              <Plus className='w-4 h-4 mr-2' />
              New Trip
            </Button>
            <Button variant='ghost' size='icon'>
              <Bell className='w-5 h-5' />
            </Button>
            <Avatar>
              <AvatarImage src="/traveler-avatar.jpg" />
              <AvatarFallback>TR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Upcoming Trip & Weather */}
        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Card className='lg:col-span-2 bg-gradient-to-r from-sky-600 to-emerald-600 text-white'>
            <CardContent className='p-8'>
              <div className='flex justify-between items-start'>
                <div>
                  <h2 className='text-2xl font-bold mb-2'>Next Adventure: Bali</h2>
                  <p className='opacity-90'>March 15-25, 2024 • 10 days</p>
                  <div className='flex items-center space-x-6 mt-6'>
                    <div className='text-center'>
                      <div className='text-3xl font-bold'>24</div>
                      <div className='text-sm opacity-90'>Days to go</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold'>2</div>
                      <div className='text-sm opacity-90'>Travelers</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold'>75%</div>
                      <div className='text-sm opacity-90'>Planned</div>
                    </div>
                  </div>
                </div>
                <div className='bg-white/20 p-4 rounded-xl'>
                  <div className='text-sm'>Budget Used</div>
                  <div className='text-2xl font-bold mt-2'>$2,450</div>
                  <Progress value={76} className='mt-2 bg-white/30' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card className='border border-sky-200'>
            <CardContent className='p-6'>
              {weather ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-slate-600'>Current Weather</p>
                      <h3 className='text-2xl font-bold text-slate-900'>{weather.temperature}°C</h3>
                      <p className='text-slate-600'>{weather.condition}</p>
                    </div>
                    <div className='text-4xl'>🌤️</div>
                  </div>
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    <div className='bg-sky-50 p-3 rounded-lg'>
                      <div className='text-sm text-slate-600'>Humidity</div>
                      <div className='font-bold'>{weather.humidity}%</div>
                    </div>
                    <div className='bg-sky-50 p-3 rounded-lg'>
                      <div className='text-sm text-slate-600'>Wind</div>
                      <div className='font-bold'>{weather.wind} km/h</div>
                    </div>
                    <div className='bg-sky-50 p-3 rounded-lg'>
                      <div className='text-sm text-slate-600'>Feels Like</div>
                      <div className='font-bold'>26°C</div>
                    </div>
                  </div>
                </div>
              ) : (
                <Skeleton className='h-40' />
              )}
            </CardContent>
          </Card>
        </section>

        {/* Trip Cards */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>My Trips</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search destinations...'
                className='w-64 border-sky-300 focus:border-sky-500'
                startIcon={Search}
              />
              <Select defaultValue='all'>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='planning'>Planning</SelectItem>
                  <SelectItem value='confirmed'>Confirmed</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-72 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {trips.map((trip) => (
                <Card 
                  key={trip.id}
                  className='border border-sky-200 hover:shadow-xl transition-all duration-300 group cursor-pointer'
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className={`h-2 bg-gradient-to-r ${trip.color} rounded-t-xl`} />
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-bold text-slate-900 group-hover:text-sky-600'>
                          {trip.destination}
                        </h3>
                        <p className='text-sm text-slate-600 mt-1'>{trip.date}</p>
                      </div>
                      <Button variant='ghost' size='icon'>
                        <Heart className='w-4 h-4' />
                      </Button>
                    </div>
                    
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='flex items-center text-slate-600'>
                          <Users className='w-3 h-3 mr-1' />
                          {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                        </span>
                        <Badge variant={
                          trip.status === 'Confirmed' ? 'success' :
                          trip.status === 'Planning' ? 'secondary' :
                          'outline'
                        }>
                          {trip.status}
                        </Badge>
                      </div>
                      
                      <div className='bg-sky-50 p-4 rounded-lg'>
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-slate-600'>Budget: ${trip.budget}</span>
                          <span className='font-medium'>${trip.spent} spent</span>
                        </div>
                        <Progress value={(trip.spent / trip.budget) * 100} className='h-2' />
                      </div>
                      
                      <div className='flex justify-between pt-4 border-t border-sky-100'>
                        <Button variant='outline' size='sm' className='border-sky-200'>
                          <Calendar className='w-3 h-3 mr-1' />
                          Itinerary
                        </Button>
                        <Button variant='outline' size='sm' className='border-sky-200'>
                          <Navigation className='w-3 h-3 mr-1' />
                          Explore
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Itinerary & Expenses */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Itinerary */}
          <Card className='border border-sky-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-sky-600' />
                Bali Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {itinerary.map((day, i) => (
                  <div key={i} className='flex space-x-4'>
                    <div className='text-center'>
                      <div className='font-bold text-slate-900'>{day.day}</div>
                      <div className='text-sm text-slate-600'>{day.date}</div>
                    </div>
                    <div className='flex-1'>
                      <div className='bg-sky-50 rounded-lg p-4'>
                        <ul className='space-y-2'>
                          {day.activities.map((activity, j) => (
                            <li key={j} className='flex items-center text-sm'>
                              <div className='w-2 h-2 bg-sky-500 rounded-full mr-3' />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-sky-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Day
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className='border border-sky-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <DollarSign className='w-5 h-5 mr-2 text-emerald-600' />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {[
                  { category: 'Flights', amount: 850, percentage: 35, color: 'bg-sky-500' },
                  { category: 'Accommodation', amount: 1200, percentage: 49, color: 'bg-emerald-500' },
                  { category: 'Activities', amount: 250, percentage: 10, color: 'bg-amber-500' },
                  { category: 'Food', amount: 150, percentage: 6, color: 'bg-rose-500' },
                ].map((expense, i) => (
                  <div key={i} className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <div className='flex items-center'>
                        <div className={`w-3 h-3 rounded-full ${expense.color} mr-2`} />
                        <span>{expense.category}</span>
                      </div>
                      <span className='font-medium'>${expense.amount}</span>
                    </div>
                    <Progress value={expense.percentage} className='h-2 bg-sky-100' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Travel Essentials */}
        <Card className='border border-sky-200'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Luggage className='w-5 h-5 mr-2 text-slate-600' />
              Travel Essentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {[
                { icon: '📱', label: 'E-SIM', status: 'Purchased' },
                { icon: '🏥', label: 'Travel Insurance', status: 'Active' },
                { icon: '🔌', label: 'Adapter', status: 'Missing' },
                { icon: '💳', label: 'Travel Card', status: 'Ready' },
              ].map((item, i) => (
                <div key={i} className='text-center p-4 bg-sky-50 rounded-xl'>
                  <div className='text-3xl mb-2'>{item.icon}</div>
                  <h4 className='font-bold text-slate-900'>{item.label}</h4>
                  <Badge 
                    variant={item.status === 'Missing' ? 'destructive' : 'success'} 
                    className='mt-2'
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}