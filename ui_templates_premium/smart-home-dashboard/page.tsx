'use client'

import { useState, useEffect } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Thermometer, Droplets, Sun, Zap, Wifi,
  Shield, Bell, Users, Clock, Settings, Power,
  Plus, Search, Filter, Moon, Wind, Lightbulb,
  Volume2, Camera, Lock, Unlock, Battery,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle
} from 'lucide-react'

const energyData = [
  { time: '00:00', usage: 0.8, cost: 0.12 },
  { time: '04:00', usage: 0.6, cost: 0.09 },
  { time: '08:00', usage: 2.4, cost: 0.36 },
  { time: '12:00', usage: 1.8, cost: 0.27 },
  { time: '16:00', usage: 2.2, cost: 0.33 },
  { time: '20:00', usage: 3.1, cost: 0.47 },
  { time: '23:59', usage: 1.2, cost: 0.18 },
]

export default function SmartHomeDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [temperature, setTemperature] = useState(72)
  const [mode, setMode] = useState('home')
  const [selectedRoom, setSelectedRoom] = useState('living-room')
  const [securityStatus, setSecurityStatus] = useState('armed')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const rooms = [
    {
      id: 'living-room',
      name: 'Living Room',
      temperature: 72,
      humidity: 45,
      lights: { on: 3, total: 4 },
      devices: 5,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      temperature: 68,
      humidity: 50,
      lights: { on: 1, total: 3 },
      devices: 3,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      temperature: 74,
      humidity: 40,
      lights: { on: 4, total: 4 },
      devices: 6,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'office',
      name: 'Home Office',
      temperature: 70,
      humidity: 48,
      lights: { on: 2, total: 3 },
      devices: 4,
      color: 'from-amber-500 to-orange-500'
    },
  ]

  const devices = [
    { id: 1, name: 'Smart Thermostat', type: 'climate', status: 'on', power: 45, icon: Thermometer },
    { id: 2, name: 'Living Room Lights', type: 'lighting', status: 'on', power: 120, icon: Lightbulb },
    { id: 3, name: 'Security Camera', type: 'security', status: 'recording', power: 85, icon: Camera },
    { id: 4, name: 'Smart Speaker', type: 'entertainment', status: 'standby', power: 12, icon: Volume2 },
    { id: 5, name: 'Refrigerator', type: 'appliance', status: 'on', power: 180, icon: Wind },
    { id: 6, name: 'Front Door Lock', type: 'security', status: 'locked', power: 8, icon: Lock },
  ]

  const quickScenes = [
    { id: 'morning', name: 'Morning Routine', icon: Sun, active: false },
    { id: 'away', name: 'Away Mode', icon: Users, active: true },
    { id: 'evening', name: 'Evening Relax', icon: Moon, active: false },
    { id: 'night', name: 'Night Mode', icon: Moon, active: false },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900/50 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <Home className='w-8 h-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>SmartHome Pro</h1>
                <div className='flex items-center space-x-2'>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <Wifi className='w-3 h-3 mr-1' />
                    All Systems Connected
                  </Badge>
                  <span className='text-gray-400'>Intelligent home automation</span>
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className='w-40 bg-white/5 border-white/10'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-900 border-white/10'>
                  <SelectItem value='home'>Home Mode</SelectItem>
                  <SelectItem value='away'>Away Mode</SelectItem>
                  <SelectItem value='sleep'>Sleep Mode</SelectItem>
                  <SelectItem value='vacation'>Vacation Mode</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700'>
                <Plus className='w-4 h-4 mr-2' />
                Add Device
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Overview Cards */}
        <section data-template-section='overview-cards'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              {
                id: 'temperature',
                label: 'Average Temperature',
                value: '72°F',
                change: '+2°',
                changeType: 'neutral',
                icon: Thermometer,
                color: 'from-rose-500 to-orange-500'
              },
              {
                id: 'humidity',
                label: 'Humidity Level',
                value: '45%',
                change: '-3%',
                changeType: 'positive',
                icon: Droplets,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                id: 'energy',
                label: 'Energy Usage',
                value: '2.4 kWh',
                change: '-15%',
                changeType: 'positive',
                icon: Zap,
                color: 'from-emerald-500 to-teal-500'
              },
              {
                id: 'security',
                label: 'Security Status',
                value: 'Armed',
                change: 'Active',
                changeType: 'positive',
                icon: Shield,
                color: 'from-purple-500 to-pink-500'
              },
            ].map((metric) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
              >
                <Card className='border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all'>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-gray-400'>{metric.label}</p>
                        <div className='flex items-baseline space-x-2'>
                          <span className='text-2xl font-bold'>{metric.value}</span>
                        </div>
                        <div className={`flex items-center text-sm font-medium ${
                          metric.changeType === 'positive' ? 'text-emerald-400' :
                          metric.changeType === 'negative' ? 'text-rose-400' :
                          'text-amber-400'
                        }`}>
                          {metric.changeType === 'positive' ? (
                            <TrendingDown className='w-4 h-4 mr-1' />
                          ) : metric.changeType === 'negative' ? (
                            <TrendingUp className='w-4 h-4 mr-1' />
                          ) : (
                            <AlertTriangle className='w-4 h-4 mr-1' />
                          )}
                          {metric.change}
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg`}>
                        <metric.icon className='w-6 h-6' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Room Controls & Energy Chart */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Room Controls */}
          <section data-template-section='room-controls'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Room Controls</CardTitle>
                    <CardDescription>Manage individual room settings</CardDescription>
                  </div>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className='w-40 bg-white/5 border-white/10'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-900 border-white/10'>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode='wait'>
                  {rooms.filter(r => r.id === selectedRoom).map((room) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className='space-y-6'
                    >
                      <div className='grid grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-400 mb-2'>
                              Temperature: {room.temperature}°F
                            </label>
                            <Slider
                              value={[room.temperature]}
                              onValueChange={([value]) => {
                                const updatedRooms = rooms.map(r => 
                                  r.id === room.id ? { ...r, temperature: value } : r
                                )
                                // Update state
                              }}
                              min={60}
                              max={80}
                              step={1}
                              className='[&>span]:bg-gradient-to-r [&>span]:from-blue-500 [&>span]:to-cyan-500'
                            />
                          </div>
                          <div className='flex items-center justify-between'>
                            <div>
                              <p className='text-sm font-medium text-gray-400'>Lights</p>
                              <p className='text-2xl font-bold'>{room.lights.on}/{room.lights.total}</p>
                            </div>
                            <Switch checked={room.lights.on > 0} />
                          </div>
                        </div>
                        <div className='space-y-4'>
                          <div className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl'>
                            <p className='text-sm text-gray-400 mb-2'>Humidity</p>
                            <div className='flex items-baseline space-x-2'>
                              <span className='text-3xl font-bold'>{room.humidity}</span>
                              <span className='text-gray-400'>%</span>
                            </div>
                            <Progress value={room.humidity} className='mt-4 bg-gray-700' />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </section>

          {/* Energy Consumption */}
          <section data-template-section='energy-consumption' data-chart-type='area'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Energy Consumption</CardTitle>
                    <CardDescription>24-hour power usage analysis</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-400'>
                    <TrendingDown className='w-3 h-3 mr-1' />
                    15% lower vs. yesterday
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={energyData}>
                    <defs>
                      <linearGradient id='colorUsage' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8} />
                        <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='time' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <TooltipProvider>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          color: 'white'
                        }}
                      />
                    </TooltipProvider>
                    <Area
                      type='monotone'
                      dataKey='usage'
                      stroke='#3b82f6'
                      fillOpacity={1}
                      fill='url(#colorUsage)'
                      strokeWidth={2}
                    />
                    <ReferenceLine y={1.8} stroke='#ef4444' strokeDasharray='3 3' label='Avg' />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Device Grid & Scenes */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Device Grid */}
          <section data-template-section='device-grid' className='lg:col-span-2'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Connected Devices</CardTitle>
                    <CardDescription>Manage all smart home devices</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search devices...'
                      className='w-48 bg-white/5 border-white/10'
                      startIcon={Search}
                    />
                    <Button variant='outline' className='border-white/10'>
                      <Filter className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className='p-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-xl hover:border-blue-500/50 transition-colors'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg'>
                            <device.icon className='w-5 h-5 text-blue-400' />
                          </div>
                          <div>
                            <h4 className='font-medium'>{device.name}</h4>
                            <p className='text-sm text-gray-400'>{device.type}</p>
                          </div>
                        </div>
                        <Switch checked={device.status !== 'off'} />
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>Power Usage</span>
                        <div className='flex items-center space-x-2'>
                          <span className='font-medium'>{device.power}W</span>
                          <Battery className='w-4 h-4 text-emerald-400' />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Scenes */}
          <section data-template-section='quick-scenes'>
            <Card className='border border-white/10 bg-white/5 backdrop-blur-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Scenes</CardTitle>
                <CardDescription>One-touch home modes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {quickScenes.map((scene) => (
                    <Button
                      key={scene.id}
                      variant={scene.active ? 'default' : 'outline'}
                      className={`w-full justify-start h-auto py-4 ${
                        scene.active 
                          ? 'bg-gradient-to-r from-blue-600 to-emerald-600 border-0' 
                          : 'border-white/10 hover:border-blue-500/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        scene.active 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-br from-gray-800 to-gray-900'
                      }`}>
                        <scene.icon className='w-5 h-5' />
                      </div>
                      <div className='text-left'>
                        <div className='font-medium'>{scene.name}</div>
                        <div className={`text-sm ${scene.active ? 'text-white/80' : 'text-gray-400'}`}>
                          {scene.active ? 'Active' : 'Tap to activate'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Security & Alerts */}
        <section data-template-section='security-alerts'>
          <Card className='border border-white/10 bg-white/5 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Security & Alerts</CardTitle>
                  <CardDescription>Real-time home security monitoring</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Button
                    variant={securityStatus === 'armed' ? 'default' : 'outline'}
                    className={securityStatus === 'armed' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'border-white/10'}
                    onClick={() => setSecurityStatus(securityStatus === 'armed' ? 'disarmed' : 'armed')}
                  >
                    {securityStatus === 'armed' ? (
                      <>
                        <Shield className='w-4 h-4 mr-2' />
                        System Armed
                      </>
                    ) : (
                      <>
                        <Unlock className='w-4 h-4 mr-2' />
                        System Disarmed
                      </>
                    )}
                  </Button>
                  <Button variant='outline' className='border-white/10'>
                    <Bell className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'>
                  <div className='flex items-center space-x-4 mb-4'>
                    <div className='p-3 bg-emerald-500/20 rounded-lg'>
                      <CheckCircle className='w-6 h-6 text-emerald-400' />
                    </div>
                    <div>
                      <div className='font-bold text-2xl'>12</div>
                      <div className='text-sm text-gray-400'>Devices Online</div>
                    </div>
                  </div>
                  <Progress value={100} className='bg-gray-700' />
                </div>
                <div className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'>
                  <div className='flex items-center space-x-4 mb-4'>
                    <div className='p-3 bg-blue-500/20 rounded-lg'>
                      <Camera className='w-6 h-6 text-blue-400' />
                    </div>
                    <div>
                      <div className='font-bold text-2xl'>4</div>
                      <div className='text-sm text-gray-400'>Cameras Active</div>
                    </div>
                  </div>
                  <div className='text-sm text-gray-400'>All recording 24/7</div>
                </div>
                <div className='p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10'>
                  <div className='flex items-center space-x-4 mb-4'>
                    <div className='p-3 bg-amber-500/20 rounded-lg'>
                      <AlertTriangle className='w-6 h-6 text-amber-400' />
                    </div>
                    <div>
                      <div className='font-bold text-2xl'>0</div>
                      <div className='text-sm text-gray-400'>Active Alerts</div>
                    </div>
                  </div>
                  <div className='text-sm text-emerald-400'>All systems normal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}