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
  CartesianGrid, ResponsiveContainer, Legend, ReferenceLine, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Factory, Cpu, Zap, AlertTriangle, Settings, BarChart3,
  TrendingUp, TrendingDown, Clock, Shield, Wrench, Eye,
  Play, Pause, RefreshCw, Download, Filter, Search,
  Thermometer, Droplets, Gauge, Package, Users, DollarSign,
  CheckCircle, XCircle, RotateCw, PieChart, Target, Bell
} from 'lucide-react'

// Data derived from template.json configurations
const PRODUCTION_METRICS = [
  {
    id: 'production_rate',
    label: 'Production Rate',
    value: '245',
    unit: 'units/hour',
    target: 250,
    status: 'optimal' as const,
    icon: Factory,
    color: 'from-blue-500 to-cyan-500',
    format: 'number'
  },
  {
    id: 'equipment_efficiency',
    label: 'OEE',
    value: '92.4',
    unit: '%',
    target: 90,
    status: 'optimal' as const,
    icon: Cpu,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  },
  {
    id: 'energy_consumption',
    label: 'Energy Usage',
    value: '1.8',
    unit: 'MWh',
    target: 2.0,
    status: 'optimal' as const,
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    format: 'number'
  },
  {
    id: 'quality_rate',
    label: 'Quality Rate',
    value: '98.7',
    unit: '%',
    target: 95,
    status: 'optimal' as const,
    icon: CheckCircle,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  }
]

const PRODUCTION_DATA = [
  { hour: '06:00', output: 1200, efficiency: 88, quality: 97 },
  { hour: '08:00', output: 1850, efficiency: 92, quality: 98 },
  { hour: '10:00', output: 2200, efficiency: 94, quality: 99 },
  { hour: '12:00', output: 1950, efficiency: 91, quality: 98 },
  { hour: '14:00', output: 2100, efficiency: 93, quality: 98 },
  { hour: '16:00', output: 1800, efficiency: 90, quality: 97 },
  { hour: '18:00', output: 1650, efficiency: 89, quality: 97 },
]

const EQUIPMENT_STATUS = [
  { id: 'press-001', name: 'Hydraulic Press', status: 'running' as const, uptime: 99.2, output: 245 },
  { id: 'mill-002', name: 'CNC Mill', status: 'maintenance' as const, uptime: 96.8, output: 180 },
  { id: 'lathe-003', name: 'Auto Lathe', status: 'running' as const, uptime: 98.5, output: 210 },
  { id: 'robot-004', name: 'Assembly Robot', status: 'idle' as const, uptime: 97.3, output: 195 },
  { id: 'oven-005', name: 'Curing Oven', status: 'running' as const, uptime: 99.0, output: 230 },
  { id: 'packer-006', name: 'Auto Packer', status: 'warning' as const, uptime: 95.4, output: 175 },
]

export default function SmartManufacturingControl() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('shift')
  const [selectedLine, setSelectedLine] = useState('line-1')
  const [productionMode, setProductionMode] = useState('auto')
  const [alerts, setAlerts] = useState<Array<{id: string, severity: 'critical' | 'warning' | 'info', message: string, timestamp: string}>>([])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      setAlerts([
        { id: '1', severity: 'warning', message: 'CNC Mill requires calibration', timestamp: '10:30 AM' },
        { id: '2', severity: 'info', message: 'Scheduled maintenance in 2 hours', timestamp: '09:15 AM' },
        { id: '3', severity: 'critical', message: 'Temperature sensor anomaly detected', timestamp: '08:45 AM' },
      ])
    }, 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500'
      case 'maintenance': return 'bg-amber-500'
      case 'idle': return 'bg-slate-500'
      case 'warning': return 'bg-rose-500'
      default: return 'bg-gray-500'
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg'>
                <Factory className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Manufacturing Intelligence</h1>
                <p className='text-gray-600'>Real-time production monitoring & control</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='shift'>Current Shift</SelectItem>
                  <SelectItem value='day'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
              <Badge className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white'>
                <Shield className='w-3 h-3 mr-1' />
                All Systems Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Production Metrics */}
        <section data-template-section='production-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PRODUCTION_METRICS.map((metric) => (
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
                            <span className='text-gray-500'>{metric.unit}</span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <Progress 
                              value={(parseFloat(metric.value) / metric.target) * 100} 
                              className='w-24 h-2'
                            />
                            <span className='text-sm text-gray-500'>{metric.target}</span>
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

        {/* Production Monitoring */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Production Trends */}
          <section data-template-section='production-trends' data-chart-type='line' data-metrics='output,efficiency,quality'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Production Trends</CardTitle>
                    <CardDescription>Hourly output and efficiency metrics</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +5.2% vs. target
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={PRODUCTION_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='hour' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='output' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Output (units)'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='efficiency' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Efficiency (%)'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='quality' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Quality (%)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Equipment Status */}
          <section data-template-section='equipment-status' data-component-type='equipment-grid'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Equipment Status</CardTitle>
                    <CardDescription>Real-time machine monitoring</CardDescription>
                  </div>
                  <Select value={selectedLine} onValueChange={setSelectedLine}>
                    <SelectTrigger className='w-40 border-gray-300'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='line-1'>Assembly Line 1</SelectItem>
                      <SelectItem value='line-2'>Assembly Line 2</SelectItem>
                      <SelectItem value='line-3'>Packaging Line</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {EQUIPMENT_STATUS.map((equipment) => (
                    <div
                      key={equipment.id}
                      className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center space-x-3'>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(equipment.status)}`} />
                          <h4 className='font-medium'>{equipment.name}</h4>
                        </div>
                        <Badge variant='outline' className='border-gray-300'>
                          {equipment.status}
                        </Badge>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <div className='text-sm text-gray-600'>Uptime</div>
                          <div className='text-xl font-bold'>{equipment.uptime}%</div>
                        </div>
                        <div>
                          <div className='text-sm text-gray-600'>Output</div>
                          <div className='text-xl font-bold'>{equipment.output}/hr</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Control Panel & Alerts */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Control Panel */}
          <section data-template-section='control-panel' data-component-type='control-group'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Control Panel</CardTitle>
                <CardDescription>Production line controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center space-x-2'>
                        <div className={`p-2 rounded-lg ${
                          productionMode === 'auto' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {productionMode === 'auto' ? <Play className='w-5 h-5' /> : <Pause className='w-5 h-5' />}
                        </div>
                        <div>
                          <div className='font-medium'>Production Mode</div>
                          <div className='text-sm text-gray-600'>Current: {productionMode}</div>
                        </div>
                      </div>
                      <Switch 
                        checked={productionMode === 'auto'}
                        onCheckedChange={(checked) => setProductionMode(checked ? 'auto' : 'manual')}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <Button 
                        variant='outline' 
                        className='border-gray-300'
                        onClick={() => setProductionMode('auto')}
                      >
                        <Play className='w-4 h-4 mr-2' />
                        Auto Mode
                      </Button>
                      <Button 
                        variant='outline' 
                        className='border-gray-300'
                        onClick={() => setProductionMode('manual')}
                      >
                        <Pause className='w-4 h-4 mr-2' />
                        Manual Mode
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-2'>
                        Production Speed: <span className='font-bold'>85%</span>
                      </label>
                      <Slider 
                        defaultValue={[85]}
                        max={100}
                        step={5}
                        className='[&>span]:bg-gradient-to-r [&>span]:from-blue-500 [&>span]:to-cyan-500'
                      />
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                      <Button variant='outline' className='border-gray-300'>
                        <RefreshCw className='w-4 h-4 mr-2' />
                        Reset Line
                      </Button>
                      <Button variant='outline' className='border-gray-300'>
                        <Download className='w-4 h-4 mr-2' />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Live Alerts */}
          <section data-template-section='live-alerts' data-component-type='alert-feed'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>Live Alerts</CardTitle>
                  <Badge variant='outline' className='border-rose-200 text-rose-700'>
                    <AlertTriangle className='w-3 h-3 mr-1' />
                    {alerts.length} Active
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
                            {alert.severity === 'info' && <Bell className='w-5 h-5' />}
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

          {/* Quality Metrics */}
          <section data-template-section='quality-metrics' data-chart-type='radial' data-metrics='defect_rate,rework_rate'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quality Metrics</CardTitle>
                <CardDescription>Production quality indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-6'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-emerald-600'>98.7%</div>
                    <div className='text-sm text-gray-600'>Pass Rate</div>
                    <Progress value={98.7} className='mt-2' />
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-rose-600'>0.8%</div>
                    <div className='text-sm text-gray-600'>Defect Rate</div>
                    <Progress value={0.8} className='mt-2 bg-rose-100' />
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-amber-600'>1.2%</div>
                    <div className='text-sm text-gray-600'>Rework Rate</div>
                    <Progress value={1.2} className='mt-2 bg-amber-100' />
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-blue-600'>99.1%</div>
                    <div className='text-sm text-gray-600'>First Pass Yield</div>
                    <Progress value={99.1} className='mt-2' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Production Analytics */}
        <section data-template-section='production-analytics' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Production Analytics</CardTitle>
                  <CardDescription>Shift performance and insights</CardDescription>
                </div>
                <Button variant='outline' className='border-gray-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[
                  { label: 'Units Produced', value: '8,450', change: '+5.2%', icon: Package },
                  { label: 'Energy Efficiency', value: '92%', change: '+1.8%', icon: Zap },
                  { label: 'Labor Productivity', value: '125%', change: '+3.4%', icon: Users },
                  { label: 'Cost Per Unit', value: '$4.25', change: '-2.1%', icon: DollarSign },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg'>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='text-2xl font-bold mb-2'>{stat.value}</div>
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
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}