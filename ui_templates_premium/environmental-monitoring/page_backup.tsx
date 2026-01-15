'use client'

import { useState, useEffect, useMemo } from 'react'
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
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine, Cell, PieChart, Pie
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Thermometer, Droplets, Wind, Cloud, Sun, Tree, Leaf,
  AlertTriangle, CheckCircle, MapPin, Clock, Settings, Eye,
  TrendingUp, TrendingDown, Download, Filter, Search, Plus,
  Bell, RefreshCw, Zap, Battery, Wifi, Shield, Globe,
  Activity, BarChart3, PieChart as PieChartIcon, Target
} from 'lucide-react'

// Environmental metrics derived from data_types
const ENVIRONMENT_METRICS = [
  {
    id: 'air_quality',
    label: 'Air Quality Index',
    value: '42',
    unit: 'AQI',
    status: 'good' as const,
    change: '-3',
    icon: Wind,
    color: 'from-emerald-500 to-teal-500',
    format: 'index'
  },
  {
    id: 'temperature',
    label: 'Temperature',
    value: '22.4',
    unit: '°C',
    status: 'optimal' as const,
    change: '+0.8',
    icon: Thermometer,
    color: 'from-rose-500 to-orange-500',
    format: 'temperature'
  },
  {
    id: 'humidity',
    label: 'Humidity',
    value: '65',
    unit: '%',
    status: 'optimal' as const,
    change: '-2',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    format: 'percent'
  },
  {
    id: 'co2_level',
    label: 'CO₂ Level',
    value: '420',
    unit: 'ppm',
    status: 'good' as const,
    change: '-15',
    icon: Cloud,
    color: 'from-purple-500 to-pink-500',
    format: 'concentration'
  }
]

const SENSOR_DATA = [
  { time: '00:00', temperature: 21.5, humidity: 68, co2: 450, pm25: 12 },
  { time: '04:00', temperature: 20.8, humidity: 72, co2: 480, pm25: 15 },
  { time: '08:00', temperature: 22.1, humidity: 65, co2: 420, pm25: 18 },
  { time: '12:00', temperature: 23.8, humidity: 58, co2: 390, pm25: 22 },
  { time: '16:00', temperature: 24.2, humidity: 62, co2: 410, pm25: 20 },
  { time: '20:00', temperature: 22.5, humidity: 66, co2: 430, pm25: 16 },
]

const SENSOR_NETWORK = [
  { id: 'sensor-001', location: 'Main Office', type: 'air_quality', status: 'active', battery: 85, lastUpdate: '2 min ago' },
  { id: 'sensor-002', location: 'Lab A', type: 'temperature', status: 'active', battery: 92, lastUpdate: '1 min ago' },
  { id: 'sensor-003', location: 'Warehouse', type: 'humidity', status: 'warning', battery: 42, lastUpdate: '5 min ago' },
  { id: 'sensor-004', location: 'Greenhouse', type: 'co2', status: 'active', battery: 78, lastUpdate: '3 min ago' },
  { id: 'sensor-005', location: 'Parking Lot', type: 'pm25', status: 'inactive', battery: 15, lastUpdate: '1 hour ago' },
  { id: 'sensor-006', location: 'Roof Terrace', type: 'weather', status: 'active', battery: 95, lastUpdate: '30 sec ago' },
]

const POLLUTION_SOURCES = [
  { source: 'Vehicle Emissions', contribution: 42, color: '#ef4444' },
  { source: 'Industrial', contribution: 28, color: '#f59e0b' },
  { source: 'Construction', contribution: 18, color: '#8b5cf6' },
  { source: 'Agricultural', contribution: 12, color: '#10b981' },
]

export default function EnvironmentalMonitoringSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [alertThresholds, setAlertThresholds] = useState({
    temperature: { min: 18, max: 26 },
    humidity: { min: 40, max: 70 },
    co2: { max: 1000 },
    pm25: { max: 35 }
  })
  const [alerts, setAlerts] = useState<Array<{id: string, type: string, severity: 'critical' | 'warning', message: string, timestamp: string}>>([])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      setAlerts([
        { id: '1', type: 'temperature', severity: 'warning', message: 'Temperature approaching upper threshold', timestamp: '10:30 AM' },
        { id: '2', type: 'battery', severity: 'critical', message: 'Sensor 003 battery critically low', timestamp: '09:45 AM' },
        { id: '3', type: 'co2', severity: 'warning', message: 'CO₂ levels elevated in Lab A', timestamp: '08:15 AM' },
      ])
    }, 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500'
      case 'warning': return 'bg-amber-500'
      case 'inactive': return 'bg-rose-500'
      default: return 'bg-gray-500'
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-emerald-600'
    if (level > 40) return 'text-amber-600'
    return 'text-rose-600'
  }

  const activeAlerts = useMemo(() => 
    alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'warning'),
    [alerts]
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-emerald-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg'>
                <Leaf className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>EcoMonitor Pro</h1>
                <p className='text-gray-600'>Environmental monitoring & sustainability analytics</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-emerald-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1h'>Last Hour</SelectItem>
                  <SelectItem value='24h'>Last 24 Hours</SelectItem>
                  <SelectItem value='7d'>Last 7 Days</SelectItem>
                  <SelectItem value='30d'>Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Add Sensor
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Environmental Overview */}
        <section data-template-section='environmental-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {ENVIRONMENT_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full border border-emerald-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-600'>{metric.label}</p>
                          <div className='flex items-baseline space-x-2'>
                            <span className='text-2xl font-bold text-gray-900'>{metric.value}</span>
                            <span className='text-gray-500'>{metric.unit}</span>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${
                            metric.status === 'good' || metric.status === 'optimal' 
                              ? 'text-emerald-600' 
                              : 'text-rose-600'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <TrendingDown className='w-4 h-4 mr-1' />
                            )}
                            {metric.change} {metric.unit}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${metric.color} shadow-lg`}>
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

        {/* Sensor Data & Network */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Environmental Trends */}
          <section data-template-section='environmental-trends' data-chart-type='line' data-metrics='temperature,humidity,co2,pm25'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Environmental Trends</CardTitle>
                    <CardDescription>24-hour sensor data monitoring</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <CheckCircle className='w-3 h-3 mr-1' />
                    All Parameters Normal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={SENSOR_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='time' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='temperature' 
                      stroke='#ef4444' 
                      strokeWidth={2}
                      name='Temperature (°C)'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='humidity' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Humidity (%)'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='co2' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='CO₂ (ppm)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Sensor Network */}
          <section data-template-section='sensor-network' data-component-type='sensor-grid'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Sensor Network</CardTitle>
                    <CardDescription>Connected environmental sensors</CardDescription>
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className='w-40 border-emerald-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Locations</SelectItem>
                      <SelectItem value='office'>Office Areas</SelectItem>
                      <SelectItem value='lab'>Laboratories</SelectItem>
                      <SelectItem value='outdoor'>Outdoor Areas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {SENSOR_NETWORK.map((sensor) => (
                    <div
                      key={sensor.id}
                      className='p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl hover:border-emerald-300 transition-colors'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center space-x-3'>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.status)}`} />
                          <div>
                            <div className='font-medium'>{sensor.location}</div>
                            <div className='text-sm text-gray-600'>{sensor.type.replace('_', ' ')}</div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Battery className={`w-4 h-4 ${getBatteryColor(sensor.battery)}`} />
                          <span className={`text-sm font-medium ${getBatteryColor(sensor.battery)}`}>
                            {sensor.battery}%
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-sm text-gray-600'>
                        <span className='flex items-center'>
                          <Wifi className='w-3 h-3 mr-1' />
                          Connected
                        </span>
                        <span>{sensor.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Pollution Analysis & Alerts */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Pollution Sources */}
          <section data-template-section='pollution-sources' data-chart-type='pie' data-metrics='contribution'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Pollution Sources</CardTitle>
                <CardDescription>Air pollution contribution by source</CardDescription>
              </CardHeader>
              <CardContent className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={POLLUTION_SOURCES}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='contribution'
                    >
                      {POLLUTION_SOURCES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Environmental Alerts */}
          <section data-template-section='environmental-alerts' data-component-type='alert-feed'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>Environmental Alerts</CardTitle>
                  <Badge variant='outline' className='border-rose-200 text-rose-700'>
                    <AlertTriangle className='w-3 h-3 mr-1' />
                    {activeAlerts.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <AnimatePresence>
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 rounded-xl border ${getAlertColor(alert.severity)}`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3'>
                            {alert.severity === 'critical' && <AlertTriangle className='w-5 h-5' />}
                            {alert.severity === 'warning' && <AlertTriangle className='w-5 h-5' />}
                            <div>
                              <div className='font-medium'>{alert.message}</div>
                              <div className='text-sm opacity-80'>{alert.timestamp}</div>
                            </div>
                          </div>
                          <Button variant='ghost' size='icon'>
                            <Eye className='w-4 h-4' />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Threshold Controls */}
          <section data-template-section='threshold-controls' data-component-type='control-panel'>
            <Card className='border border-emerald-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Alert Thresholds</CardTitle>
                <CardDescription>Configure environmental limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { 
                      label: 'Temperature', 
                      value: alertThresholds.temperature, 
                      unit: '°C',
                      icon: Thermometer,
                      color: 'from-rose-500 to-orange-500'
                    },
                    { 
                      label: 'Humidity', 
                      value: alertThresholds.humidity, 
                      unit: '%',
                      icon: Droplets,
                      color: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      label: 'CO₂ Level', 
                      value: alertThresholds.co2, 
                      unit: 'ppm',
                      icon: Cloud,
                      color: 'from-purple-500 to-pink-500'
                    },
                  ].map((param, i) => (
                    <div key={i} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <div className={`p-2 rounded-lg ${param.color} bg-gradient-to-br`}>
                            <param.icon className='w-4 h-4 text-white' />
                          </div>
                          <span className='text-sm font-medium'>{param.label}</span>
                        </div>
                        <span className='text-sm text-gray-600'>
                          {'max' in param.value ? `Max: ${param.value.max}${param.unit}` : `${param.value.min}-${param.value.max}${param.unit}`}
                        </span>
                      </div>
                      <div className='flex items-center space-x-4'>
                        {'min' in param.value && (
                          <Input 
                            type='number' 
                            value={param.value.min}
                            onChange={(e) => setAlertThresholds(prev => ({
                              ...prev,
                              [param.label.toLowerCase()]: { ...prev[param.label.toLowerCase() as keyof typeof alertThresholds], min: parseInt(e.target.value) }
                            }))}
                            className='w-20 h-8 text-center'
                          />
                        )}
                        <div className='flex-1'>
                          <Slider 
                            value={[
                              'min' in param.value ? param.value.min : 0,
                              'max' in param.value ? param.value.max : param.value.max
                            ]}
                            min={0}
                            max={param.label === 'Temperature' ? 40 : param.label === 'Humidity' ? 100 : 2000}
                            step={1}
                            className='[&>span]:bg-gradient-to-r [&>span]:from-emerald-500 [&>span]:to-teal-500'
                          />
                        </div>
                        <Input 
                          type='number' 
                          value={'max' in param.value ? param.value.max : param.value.max}
                          onChange={(e) => setAlertThresholds(prev => ({
                            ...prev,
                            [param.label.toLowerCase()]: { ...prev[param.label.toLowerCase() as keyof typeof alertThresholds], max: parseInt(e.target.value) }
                          }))}
                          className='w-20 h-8 text-center'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sustainability Analytics */}
        <section data-template-section='sustainability-analytics' data-component-type='analytics-grid'>
          <Card className='border border-emerald-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Sustainability Analytics</CardTitle>
                  <CardDescription>Environmental impact and efficiency metrics</CardDescription>
                </div>
                <Button variant='outline' className='border-emerald-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { 
                    label: 'Carbon Footprint', 
                    value: '2.4', 
                    unit: 'tons CO₂e',
                    change: '-12%',
                    icon: Leaf,
                    description: 'Monthly reduction'
                  },
                  { 
                    label: 'Energy Efficiency', 
                    value: '85%', 
                    unit: '',
                    change: '+3%',
                    icon: Zap,
                    description: 'Building efficiency'
                  },
                  { 
                    label: 'Water Conservation', 
                    value: '42%', 
                    unit: 'saved',
                    change: '+8%',
                    icon: Droplets,
                    description: 'vs. baseline'
                  },
                  { 
                    label: 'Waste Reduction', 
                    value: '68%', 
                    unit: 'recycled',
                    change: '+15%',
                    icon: Tree,
                    description: 'Recycling rate'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg'>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='text-2xl font-bold mb-2'>
                      {stat.value} <span className='text-gray-500'>{stat.unit}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm text-gray-600'>{stat.description}</div>
                      <div className={`flex items-center text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {stat.change.startsWith('+') ? (
                          <TrendingUp className='w-4 h-4 mr-1' />
                        ) : (
                          <TrendingDown className='w-4 h-4 mr-1' />
                        )}
                        {stat.change}
                      </div>
                    </div>
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