'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent 
} from '@/components/ui/tooltip'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Folder, Image as ImageIcon, Video, FileText, Music, Archive,
  Search, Filter, Plus, Download, Share2, Eye, Edit, Trash2,
  Star, Heart, Clock, Users, TrendingUp, TrendingDown,
  CheckCircle, AlertTriangle, Zap, Lock, Unlock, Globe,
  BarChart3, PieChart, Download as DownloadIcon, Upload,
  RefreshCw, Settings, Bell, MoreVertical, ExternalLink,
  Copy, Tag, Calendar, Hash, FolderOpen
} from 'lucide-react'

// Asset metrics derived from data_types
const ASSET_METRICS = [
  {
    id: 'total_assets',
    label: 'Total Assets',
    value: '4,825',
    change: '+245',
    status: 'increasing' as const,
    icon: Folder,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'storage_used',
    label: 'Storage Used',
    value: '2.4',
    unit: 'TB',
    change: '+15%',
    status: 'warning' as const,
    icon: Archive,
    color: 'from-purple-500 to-pink-500',
    format: 'storage'
  },
  {
    id: 'downloads',
    label: 'Downloads',
    value: '1,842',
    change: '+42%',
    status: 'increasing' as const,
    icon: Download,
    color: 'from-emerald-500 to-teal-500',
    format: 'count'
  },
  {
    id: 'approval_rate',
    label: 'Approval Rate',
    value: '92',
    unit: '%',
    change: '+3%',
    status: 'good' as const,
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-500',
    format: 'percent'
  }
]

const ASSET_TYPES = [
  { type: 'Images', count: 2450, size: '1.2 TB', color: '#3b82f6', icon: ImageIcon },
  { type: 'Videos', count: 850, size: '850 GB', color: '#8b5cf6', icon: Video },
  { type: 'Documents', count: 1250, size: '280 GB', color: '#10b981', icon: FileText },
  { type: 'Audio', count: 275, size: '65 GB', color: '#f59e0b', icon: Music },
]

const RECENT_ASSETS = [
  {
    id: 'asset-001',
    name: 'Product Launch Campaign',
    type: 'video',
    size: '245 MB',
    uploaded: '2 hours ago',
    downloads: 42,
    status: 'approved',
    thumbnail: '🎬'
  },
  {
    id: 'asset-002',
    name: 'Brand Guidelines 2024',
    type: 'document',
    size: '18 MB',
    uploaded: '5 hours ago',
    downloads: 85,
    status: 'approved',
    thumbnail: '📄'
  },
  {
    id: 'asset-003',
    name: 'Office Photos Q4',
    type: 'image',
    size: '420 MB',
    uploaded: '1 day ago',
    downloads: 24,
    status: 'pending',
    thumbnail: '🖼️'
  },
  {
    id: 'asset-004',
    name: 'Corporate Presentation',
    type: 'presentation',
    size: '95 MB',
    uploaded: '2 days ago',
    downloads: 156,
    status: 'approved',
    thumbnail: '📊'
  },
]

const USAGE_DATA = [
  { month: 'Jan', downloads: 420, uploads: 85, storage: 1.8 },
  { month: 'Feb', downloads: 580, uploads: 92, storage: 1.9 },
  { month: 'Mar', downloads: 720, uploads: 105, storage: 2.1 },
  { month: 'Apr', downloads: 890, uploads: 120, storage: 2.3 },
  { month: 'May', downloads: 950, uploads: 135, storage: 2.4 },
  { month: 'Jun', downloads: 1020, uploads: 150, storage: 2.5 },
]

export default function DigitalAssetManagementSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬'
      case 'document': return '📄'
      case 'image': return '🖼️'
      case 'presentation': return '📊'
      case 'audio': return '🎵'
      default: return '📁'
    }
  }

  const filteredAssets = useMemo(() => {
    return RECENT_ASSETS.filter(asset => {
      const matchesSearch = searchQuery === '' || 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        asset.type === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg'>
                <Folder className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>AssetFlow Pro</h1>
                <p className='text-gray-600'>Digital asset management & collaboration</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className='w-40 border-gray-300 shadow-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                <Plus className='w-4 h-4 mr-2' />
                Upload Asset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Asset Overview */}
        <section data-template-section='asset-overview' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {ASSET_METRICS.map((metric) => (
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

        {/* Asset Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Asset Distribution */}
          <section data-template-section='asset-distribution' data-chart-type='bar' data-metrics='count,size'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Asset Distribution</CardTitle>
                    <CardDescription>Assets by type and size</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-purple-200 text-purple-700'>
                    <BarChart3 className='w-3 h-3 mr-1' />
                    Bar Chart
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={ASSET_TYPES}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='type' stroke='#666' />
                    <YAxis stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Bar dataKey='count' name='Asset Count' radius={[4, 4, 0, 0]}>
                      {ASSET_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Usage Trends */}
          <section data-template-section='usage-trends' data-chart-type='line' data-metrics='downloads,uploads,storage'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Usage Trends</CardTitle>
                    <CardDescription>Monthly asset activity</CardDescription>
                  </div>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <TrendingUp className='w-3 h-3 mr-1' />
                    +24% Growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={USAGE_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' stroke='#666' />
                    <YAxis yAxisId='left' stroke='#666' />
                    <YAxis yAxisId='right' orientation='right' stroke='#666' />
                    <TooltipProvider>
                      <Tooltip />
                    </TooltipProvider>
                    <Legend />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='downloads' 
                      stroke='#8b5cf6' 
                      strokeWidth={2}
                      name='Downloads'
                    />
                    <Line 
                      yAxisId='left'
                      type='monotone' 
                      dataKey='uploads' 
                      stroke='#3b82f6' 
                      strokeWidth={2}
                      name='Uploads'
                    />
                    <Line 
                      yAxisId='right'
                      type='monotone' 
                      dataKey='storage' 
                      stroke='#10b981' 
                      strokeWidth={2}
                      name='Storage (TB)'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Asset Browser & Controls */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Asset Browser */}
          <section data-template-section='asset-browser' data-component-type='asset-grid' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Recent Assets</CardTitle>
                    <CardDescription>Latest uploaded digital assets</CardDescription>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Input
                      placeholder='Search assets...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-48 border-gray-300'
                      startIcon={Search}
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className='w-32 border-gray-300'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='image'>Images</SelectItem>
                        <SelectItem value='video'>Videos</SelectItem>
                        <SelectItem value='document'>Documents</SelectItem>
                      </SelectContent>
                    </Select>
                    <Tabs value={viewMode} onValueChange={setViewMode} className='w-auto'>
                      <TabsList>
                        <TabsTrigger value='grid'>Grid</TabsTrigger>
                        <TabsTrigger value='list'>List</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  <AnimatePresence>
                    {filteredAssets.map((asset) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer ${
                          selectedAsset === asset.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedAsset(asset.id)}
                      >
                        <div className='flex items-start space-x-4'>
                          <div className='text-3xl'>{asset.thumbnail}</div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-bold'>{asset.name}</h4>
                              <Badge className={getStatusColor(asset.status)}>
                                {asset.status}
                              </Badge>
                            </div>
                            <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
                              <span className='flex items-center'>
                                <Tag className='w-3 h-3 mr-1' />
                                {asset.type}
                              </span>
                              <span className='flex items-center'>
                                <Archive className='w-3 h-3 mr-1' />
                                {asset.size}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {asset.uploaded}
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Eye className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Download className='w-4 h-4' />
                                </Button>
                                <Button variant='ghost' size='icon' className='h-8 w-8'>
                                  <Share2 className='w-4 h-4' />
                                </Button>
                              </div>
                              <div className='flex items-center text-sm text-gray-600'>
                                <Download className='w-3 h-3 mr-1' />
                                {asset.downloads} downloads
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section data-template-section='quick-actions' data-component-type='action-panel'>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { icon: Upload, label: 'Upload Files', color: 'from-blue-500 to-cyan-500' },
                    { icon: FolderOpen, label: 'Create Collection', color: 'from-purple-500 to-pink-500' },
                    { icon: Share2, label: 'Share Assets', color: 'from-emerald-500 to-teal-500' },
                    { icon: DownloadIcon, label: 'Batch Download', color: 'from-amber-500 to-orange-500' },
                    { icon: Users, label: 'Manage Users', color: 'from-rose-500 to-red-500' },
                    { icon: Settings, label: 'System Settings', color: 'from-gray-500 to-slate-500' },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      className='w-full justify-start border-gray-300 hover:border-purple-300 h-14'
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mr-3 flex items-center justify-center`}>
                        <action.icon className='w-5 h-5 text-white' />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className='my-6' />
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-gray-600'>Storage Used</span>
                      <span className='font-medium'>2.4 TB / 5 TB</span>
                    </div>
                    <Progress value={48} className='h-2' />
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <Lock className='w-5 h-5 text-purple-600' />
                      <div>
                        <div className='font-medium'>Security Status</div>
                        <div className='text-sm text-purple-600'>All assets encrypted</div>
                      </div>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Asset Analytics & Permissions */}
        <section data-template-section='asset-analytics' data-component-type='analytics-grid'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Asset Analytics</CardTitle>
                  <CardDescription>Performance and usage insights</CardDescription>
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
                  { 
                    label: 'Top Downloaded', 
                    value: 'Brand Guidelines', 
                    downloads: 245,
                    icon: TrendingUp,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    label: 'Most Shared', 
                    value: 'Product Launch Video', 
                    shares: 142,
                    icon: Share2,
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    label: 'Recent Approval', 
                    value: 'Office Photos Q4', 
                    time: '2 hours ago',
                    icon: CheckCircle,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    label: 'Storage Alert', 
                    value: 'Approaching Limit', 
                    used: '85%',
                    icon: AlertTriangle,
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((stat, i) => (
                  <div key={i} className='p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='text-sm text-gray-600'>{stat.label}</div>
                    </div>
                    <div className='font-bold text-lg mb-2'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>
                      {stat.downloads && `${stat.downloads} downloads`}
                      {stat.shares && `${stat.shares} shares`}
                      {stat.time && `Approved ${stat.time}`}
                      {stat.used && `${stat.used} of storage used`}
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