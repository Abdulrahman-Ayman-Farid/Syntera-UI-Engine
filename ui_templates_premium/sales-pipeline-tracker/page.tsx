'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Target, Users, Filter as FilterIcon,
  Plus, Search, Download, RefreshCw, Eye, Edit, MoreVertical,
  CheckCircle, Clock, AlertCircle, BarChart3
} from 'lucide-react'

// Sales stages with 'as const'
const SALES_STAGES = [
  { 
    id: 'prospect', 
    name: 'Prospect', 
    color: '#3b82f6',
    deals: 12,
    value: 45000
  },
  { 
    id: 'qualified', 
    name: 'Qualified', 
    color: '#8b5cf6',
    deals: 8,
    value: 78000
  },
  { 
    id: 'proposal', 
    name: 'Proposal', 
    color: '#10b981',
    deals: 5,
    value: 125000
  },
  { 
    id: 'negotiation', 
    name: 'Negotiation', 
    color: '#f59e0b',
    deals: 3,
    value: 85000
  },
  { 
    id: 'closed', 
    name: 'Closed Won', 
    color: '#10b981',
    deals: 15,
    value: 450000
  }
] as const

const PIPELINE_METRICS = [
  {
    id: 'total_deals',
    label: 'Total Deals',
    value: '$783,000',
    change: '+15%',
    status: 'increasing' as const,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    format: 'currency'
  },
  {
    id: 'active_deals',
    label: 'Active Deals',
    value: '28',
    change: '+5',
    status: 'increasing' as const,
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    value: '35%',
    change: '+3%',
    status: 'good' as const,
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    format: 'percent'
  },
  {
    id: 'team_members',
    label: 'Team Members',
    value: '12',
    change: '+2',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-amber-500 to-orange-500',
    format: 'count'
  }
] as const

const DEALS_DATA = [
  {
    id: 'deal-001',
    name: 'Enterprise Software Deal',
    company: 'Acme Corp',
    value: 125000,
    stage: 'proposal',
    probability: 75,
    owner: 'John Doe',
    closeDate: '2024-02-15',
    lastActivity: '2 hours ago'
  },
  {
    id: 'deal-002',
    name: 'Cloud Infrastructure',
    company: 'Tech Solutions Inc',
    value: 85000,
    stage: 'negotiation',
    probability: 60,
    owner: 'Jane Smith',
    closeDate: '2024-02-28',
    lastActivity: '1 day ago'
  },
  {
    id: 'deal-003',
    name: 'SaaS Subscription',
    company: 'StartupXYZ',
    value: 45000,
    stage: 'qualified',
    probability: 45,
    owner: 'Mike Johnson',
    closeDate: '2024-03-10',
    lastActivity: '3 hours ago'
  }
] as const

const FUNNEL_DATA = [
  { stage: 'Leads', count: 150, value: 1500000 },
  { stage: 'Qualified', count: 80, value: 1200000 },
  { stage: 'Proposal', count: 40, value: 900000 },
  { stage: 'Negotiation', count: 20, value: 600000 },
  { stage: 'Closed', count: 15, value: 450000 }
] as const


export default function SalesPipelineTracker() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const filteredDeals = useMemo(() => {
    return DEALS_DATA.filter(deal => {
      const matchesSearch = searchQuery === '' || 
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter
      return matchesSearch && matchesStage
    })
  }, [searchQuery, stageFilter])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50'>
      {/* Header */}
      <header 
        className='sticky top-0 z-50 bg-gradient-to-tr from-primary to-secondary text-white border-b shadow-lg'
        data-template-section='header'
        data-component-type='navigation'
      >
        <div className='container mx-auto px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-white/20 backdrop-blur-sm rounded-xl'>
                <BarChart3 className='w-8 h-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>Sales Pipeline Tracker</h1>
                <p className='text-white/80'>Manage your deals and opportunities</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 bg-white/20 border-white/30 text-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant='outline' 
                      size='icon'
                      onClick={handleRefresh}
                      className='bg-white/20 border-white/30 text-white'
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Pipeline</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button className='bg-white text-primary hover:bg-white/90 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                New Deal
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto p-8 space-y-8'>
        {/* Pipeline Metrics */}
        <section data-template-section='pipeline-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PIPELINE_METRICS.map((metric) => (
                <motion.div
                  key={metric.id}
                  layoutId={`metric-${metric.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className='h-full shadow-xl border-0'>
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
                              : 'text-amber-600'
                          }`}>
                            {metric.change.startsWith('+') ? (
                              <TrendingUp className='w-4 h-4 mr-1' />
                            ) : (
                              <></>
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

        {/* Sales Funnel */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section data-template-section='sales-funnel' data-chart-type='bar' data-metrics='count,value'>
            <Card className='shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Sales Funnel</CardTitle>
                    <CardDescription>Deal progression by stage</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Funnel View
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={FUNNEL_DATA} layout='vertical'>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis type='number' stroke='#666' />
                    <YAxis dataKey='stage' type='category' stroke='#666' />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey='count' name='Deal Count' fill='#3b82f6' radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <section data-template-section='pipeline-stages' data-component-type='stage-overview'>
            <Card className='shadow-xl'>
              <CardHeader>
                <CardTitle>Pipeline Stages</CardTitle>
                <CardDescription>Deals by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {SALES_STAGES.map((stage) => (
                    <div key={stage.id} className='p-4 bg-gradient-to-r from-gray-50 to-white border rounded-xl'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center space-x-3'>
                          <div 
                            className='w-4 h-4 rounded-full'
                            style={{ backgroundColor: stage.color }}
                          />
                          <h4 className='font-bold text-gray-900'>{stage.name}</h4>
                        </div>
                        <Badge variant='outline'>{stage.deals} deals</Badge>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>Total Value</span>
                        <span className='font-bold'>${stage.value.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(stage.deals / 43) * 100} 
                        className='mt-2 h-2'
                        style={{ backgroundColor: `${stage.color}20` }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Deals List */}
        <section data-template-section='deals-list' data-component-type='deals-grid'>
          <Card className='shadow-xl'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Active Deals</CardTitle>
                  <CardDescription>Your open opportunities</CardDescription>
                </div>
                <div className='flex items-center space-x-4'>
                  <Input
                    placeholder='Search deals...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-48'
                  />
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger className='w-40'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Stages</SelectItem>
                      {SALES_STAGES.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <AnimatePresence>
                  {filteredDeals.map((deal) => {
                    const stage = SALES_STAGES.find(s => s.id === deal.stage)
                    return (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 bg-gradient-to-br from-white to-gray-50 border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                          selectedDeal === deal.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedDeal(deal.id)}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <h4 className='font-bold text-lg text-gray-900'>{deal.name}</h4>
                            <p className='text-sm text-gray-600'>{deal.company}</p>
                          </div>
                          <div className='text-right'>
                            <div className='font-bold text-xl text-gray-900'>
                              ${deal.value.toLocaleString()}
                            </div>
                            <Badge className='mt-1' style={{ backgroundColor: stage?.color }}>
                              {stage?.name}
                            </Badge>
                          </div>
                        </div>
                        <Separator className='my-3' />
                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div>
                            <span className='text-gray-600'>Owner:</span>
                            <div className='font-medium mt-1'>{deal.owner}</div>
                          </div>
                          <div>
                            <span className='text-gray-600'>Probability:</span>
                            <div className='font-medium mt-1'>{deal.probability}%</div>
                          </div>
                          <div>
                            <span className='text-gray-600'>Close Date:</span>
                            <div className='font-medium mt-1'>{deal.closeDate}</div>
                          </div>
                        </div>
                        <Separator className='my-3' />
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2 text-sm text-gray-600'>
                            <Clock className='w-4 h-4' />
                            <span>Last activity: {deal.lastActivity}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Eye className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <MoreVertical className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className='bg-gray-100 py-4 px-8 text-gray-600 border-t'>
        <div className='container mx-auto'>
          &copy; 2026 Sales Pipeline Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
            <TabsContent value='deals'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[10rem]'>Deal Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>{deal.stage}</TableCell>
                        <TableCell>
                          <Progress value={deal.progress} className='w-full' />
                        </TableCell>
                        <TableCell className='flex space-x-2'>
                          {deal.users.map((user) => (
                            <TooltipProvider key={user.id} delayDuration={300}>
                              <TooltipRoot>
                                <TooltipTrigger>
                                  <Avatar src={user.avatar}>{user.name.charAt(0)}</Avatar>
                                </TooltipTrigger>
                                <TooltipContent>{user.name}</TooltipContent>
                              </TooltipRoot>
                            </TooltipProvider>
                          ))}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' onClick={() => handleAddUserToStage(deal.id)}>
                            <Plus size={16} className='mr-2' /> Assign User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value='analytics'>
              <Card className='p-6 shadow-2xl rounded-2xl backdrop-blur-sm bg-white/50'>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='border p-4 rounded-lg bg-white/30 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='font-semibold'>Conversion Rate</h3>
                    <p className='text-2xl font-bold'>30%</p>
                  </div>
                  <div className='border p-4 rounded-lg bg-white/30 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='font-semibold'>Average Deal Value</h3>
                    <p className='text-2xl font-bold'>$20K</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <footer className='bg-gray-100 py-4 px-4 sm:px-8 text-gray-600'>
        <div className='container mx-auto'>
          &copy; 2023 Sales Pipeline Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}