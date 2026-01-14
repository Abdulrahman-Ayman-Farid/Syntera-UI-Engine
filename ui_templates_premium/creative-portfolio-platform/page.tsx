'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Masonry from 'react-masonry-css'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Palette, Camera, Code, Music, Film, Heart,
  Eye, Share2, Download, MessageCircle, MoreVertical,
  TrendingUp, Users, Award, Sparkles, Filter,
  Instagram, Twitter, Github, Linkedin, Globe,
  ChevronRight, ExternalLink, Calendar
} from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Urban Architecture',
    category: 'Photography',
    views: 2450,
    likes: 320,
    color: 'from-blue-500 to-cyan-500',
    tags: ['Architecture', 'Urban', 'Modern'],
    featured: true
  },
  {
    id: 2,
    title: 'Abstract Motion',
    category: 'Animation',
    views: 1890,
    likes: 210,
    color: 'from-purple-500 to-pink-500',
    tags: ['Abstract', 'Motion', 'Digital'],
    featured: true
  },
  {
    id: 3,
    title: 'Code Symphony',
    category: 'Development',
    views: 3120,
    likes: 450,
    color: 'from-emerald-500 to-teal-500',
    tags: ['Web', 'React', 'UI/UX'],
    featured: false
  },
  {
    id: 4,
    title: 'Brand Identity',
    category: 'Design',
    views: 1560,
    likes: 180,
    color: 'from-amber-500 to-orange-500',
    tags: ['Branding', 'Logo', 'Identity'],
    featured: false
  },
  {
    id: 5,
    title: 'Cinematic Short',
    category: 'Film',
    views: 4250,
    likes: 520,
    color: 'from-rose-500 to-red-500',
    tags: ['Cinematic', 'Short Film', 'Storytelling'],
    featured: true
  },
  {
    id: 6,
    title: 'Sound Design',
    category: 'Music',
    views: 1780,
    likes: 240,
    color: 'from-violet-500 to-purple-500',
    tags: ['Sound', 'Music', 'Audio'],
    featured: false
  },
]

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1
}

export default function CreativePortfolioPlatform() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [likedProjects, setLikedProjects] = useState(new Set())

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const toggleLike = (projectId: number) => {
    const newLiked = new Set(likedProjects)
    if (newLiked.has(projectId)) {
      newLiked.delete(projectId)
    } else {
      newLiked.add(projectId)
    }
    setLikedProjects(newLiked)
  }

  const stats = [
    { label: 'Total Projects', value: '42', icon: Palette, change: '+5' },
    { label: 'Followers', value: '8.5K', icon: Users, change: '+320' },
    { label: 'Client Reviews', value: '4.9', icon: Award, change: '+0.2' },
    { label: 'Years Experience', value: '7', icon: Sparkles, change: '+1' },
  ]

  const categories = [
    { id: 'all', label: 'All Work', icon: Palette, count: 42 },
    { id: 'design', label: 'Design', icon: Palette, count: 18 },
    { id: 'photography', label: 'Photography', icon: Camera, count: 12 },
    { id: 'development', label: 'Development', icon: Code, count: 8 },
    { id: 'music', label: 'Music', icon: Music, count: 4 },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'>
      {/* Hero Section */}
      <header className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30' />
        <div className='relative px-6 py-12 lg:py-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-6xl mx-auto'
          >
            <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
              <div className='lg:w-2/3'>
                <Badge className='mb-4 bg-white/10 backdrop-blur-sm border-white/20'>
                  <Sparkles className='w-3 h-3 mr-1' />
                  Creative Portfolio
                </Badge>
                <h1 className='text-5xl lg:text-7xl font-bold tracking-tight mb-6'>
                  <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'>
                    Alex Morgan
                  </span>
                  <br />
                  <span className='text-white'>Digital Creator</span>
                </h1>
                <p className='text-xl text-gray-300 mb-8 max-w-2xl'>
                  Crafting immersive digital experiences through design, photography, 
                  and development. Turning ideas into visually stunning realities.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'>
                    View Projects
                    <ChevronRight className='w-4 h-4 ml-2' />
                  </Button>
                  <Button variant='outline' className='border-white/30 bg-white/5 hover:bg-white/10'>
                    <MessageCircle className='w-4 h-4 mr-2' />
                    Contact Me
                  </Button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className='relative'
              >
                <div className='w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-1'>
                  <div className='w-full h-full rounded-full bg-gray-900 p-4'>
                    <div className='w-full h-full rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center'>
                      <Palette className='w-24 h-24 text-white/50' />
                    </div>
                  </div>
                </div>
                <div className='absolute -top-4 -right-4'>
                  <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                    <Award className='w-3 h-3 mr-1' />
                    Featured
                  </Badge>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className='px-6 py-8'>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='max-w-6xl mx-auto mb-12'
        >
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
              <Card key={index} className='bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all hover:scale-105'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-400'>{stat.label}</p>
                      <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                      <div className='flex items-center text-emerald-400 text-sm mt-1'>
                        <TrendingUp className='w-3 h-3 mr-1' />
                        {stat.change}
                      </div>
                    </div>
                    <div className='p-3 rounded-full bg-gradient-to-br from-white/10 to-transparent'>
                      <stat.icon className='w-6 h-6' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='max-w-6xl mx-auto mb-12'
        >
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-3xl font-bold'>Featured Work</h2>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-48 bg-white/5 border-white/10'>
                <SelectValue placeholder='Filter by category' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900 border-white/10'>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className='hover:bg-white/10'>
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex items-center'>
                        <cat.icon className='w-4 h-4 mr-2' />
                        {cat.label}
                      </div>
                      <Badge variant='outline' className='border-white/20'>
                        {cat.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <AnimatePresence>
            <Masonry
              breakpointCols={breakpointColumns}
              className='flex -ml-6 w-auto'
              columnClassName='pl-6 bg-clip-padding'
            >
              {projects
                .filter(p => selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory)
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='mb-6'
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className='group cursor-pointer bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] overflow-hidden'>
                          <div className={`h-48 bg-gradient-to-r ${project.color} relative overflow-hidden`}>
                            {project.featured && (
                              <Badge className='absolute top-4 left-4 bg-white/20 backdrop-blur-sm'>
                                Featured
                              </Badge>
                            )}
                            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                              <div className='p-4 bg-black/60 backdrop-blur-sm rounded-full'>
                                <Eye className='w-6 h-6' />
                              </div>
                            </div>
                          </div>
                          <CardContent className='p-6'>
                            <div className='flex items-start justify-between mb-4'>
                              <div>
                                <h3 className='text-xl font-bold mb-2'>{project.title}</h3>
                                <p className='text-gray-400'>{project.category}</p>
                              </div>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleLike(project.id)
                                }}
                                className='hover:bg-white/10'
                              >
                                <Heart className={`w-5 h-5 ${likedProjects.has(project.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                            </div>
                            <div className='flex flex-wrap gap-2 mb-4'>
                              {project.tags.map((tag, i) => (
                                <Badge key={i} variant='outline' className='border-white/20'>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className='flex items-center justify-between text-sm text-gray-400'>
                              <div className='flex items-center space-x-4'>
                                <span className='flex items-center'>
                                  <Eye className='w-3 h-3 mr-1' />
                                  {project.views.toLocaleString()}
                                </span>
                                <span className='flex items-center'>
                                  <Heart className='w-3 h-3 mr-1' />
                                  {project.likes}
                                </span>
                              </div>
                              <Button variant='ghost' size='sm' className='text-white/60 hover:text-white'>
                                <ExternalLink className='w-3 h-3' />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className='max-w-4xl bg-gray-900 border-white/10'>
                        {selectedProject && (
                          <div className='p-6'>
                            <div className={`h-64 bg-gradient-to-r ${project.color} rounded-lg mb-6`} />
                            <h3 className='text-2xl font-bold mb-2'>{project.title}</h3>
                            <p className='text-gray-400 mb-4'>{project.category}</p>
                            <div className='flex items-center space-x-4 mb-6'>
                              <Badge variant='outline' className='border-white/20'>
                                {project.views.toLocaleString()} views
                              </Badge>
                              <Badge variant='outline' className='border-white/20'>
                                {project.likes} likes
                              </Badge>
                            </div>
                            <p className='text-gray-300'>
                              A detailed description of this creative project goes here. 
                              This could include the inspiration, tools used, challenges faced, 
                              and the final outcome.
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
            </Masonry>
          </AnimatePresence>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='max-w-6xl mx-auto'
        >
          <Card className='bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-white/10'>
            <CardContent className='p-8'>
              <div className='text-center'>
                <h3 className='text-2xl font-bold mb-4'>Let's Connect</h3>
                <p className='text-gray-300 mb-6'>Follow my creative journey across platforms</p>
                <div className='flex justify-center space-x-6'>
                  {[
                    { icon: Instagram, label: 'Instagram', color: 'from-purple-600 to-pink-600' },
                    { icon: Twitter, label: 'Twitter', color: 'from-blue-500 to-cyan-500' },
                    { icon: Github, label: 'GitHub', color: 'from-gray-700 to-black' },
                    { icon: Linkedin, label: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
                    { icon: Globe, label: 'Website', color: 'from-emerald-500 to-teal-500' },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href='#'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-full bg-gradient-to-br ${social.color} shadow-lg`}
                    >
                      <social.icon className='w-6 h-6' />
                    </motion.a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}