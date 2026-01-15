'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, User, Camera, Star,
  CheckCircle, ArrowRight, ArrowLeft, Upload, Music,
  Film, Book, Coffee, Plane, Dumbbell, Palette,
  TrendingUp, Users, Activity, Target
} from 'lucide-react'

// Wizard step configuration with type-safe constants
const WIZARD_STEPS = [
  {
    id: 'basic_info',
    step: 1,
    title: 'Basic Information',
    description: 'Tell us about yourself',
    icon: User,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'preferences',
    step: 2,
    title: 'Preferences',
    description: 'What are you looking for?',
    icon: Heart,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'interests',
    step: 3,
    title: 'Interests & Hobbies',
    description: 'Share your passions',
    icon: Star,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'photos',
    step: 4,
    title: 'Photos & Profile',
    description: 'Complete your profile',
    icon: Camera,
    color: 'from-emerald-500 to-teal-500'
  },
] as const

const PROFILE_METRICS = [
  {
    id: 'profile_completion',
    label: 'Profile Completion',
    value: '75',
    unit: '%',
    change: '+25%',
    status: 'increasing' as const,
    icon: Target,
    color: 'from-pink-500 to-rose-500',
    format: 'percent'
  },
  {
    id: 'matches',
    label: 'Potential Matches',
    value: '142',
    change: '+28',
    status: 'good' as const,
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    format: 'count'
  },
  {
    id: 'profile_views',
    label: 'Profile Views',
    value: '856',
    change: '+15%',
    status: 'increasing' as const,
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    format: 'count'
  },
  {
    id: 'compatibility',
    label: 'Avg Compatibility',
    value: '82',
    unit: '%',
    change: '+8%',
    status: 'good' as const,
    icon: Activity,
    color: 'from-emerald-500 to-teal-500',
    format: 'percent'
  }
] as const

const INTERESTS_OPTIONS = [
  { id: 'music', label: 'Music', icon: Music, color: '#8b5cf6' },
  { id: 'movies', label: 'Movies', icon: Film, color: '#3b82f6' },
  { id: 'reading', label: 'Reading', icon: Book, color: '#10b981' },
  { id: 'coffee', label: 'Coffee', icon: Coffee, color: '#f59e0b' },
  { id: 'travel', label: 'Travel', icon: Plane, color: '#ec4899' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: '#ef4444' },
  { id: 'art', label: 'Art', icon: Palette, color: '#6366f1' },
  { id: 'food', label: 'Food', icon: Coffee, color: '#f97316' },
] as const

const MATCH_TRENDS = [
  { month: 'Jul', matches: 85, views: 620, likes: 45 },
  { month: 'Aug', matches: 110, views: 780, likes: 62 },
  { month: 'Sep', matches: 125, views: 850, likes: 78 },
  { month: 'Oct', matches: 132, views: 920, likes: 85 },
  { month: 'Nov', matches: 138, views: 980, likes: 92 },
  { month: 'Dec', matches: 142, views: 1050, likes: 98 },
] as const

const AGE_DISTRIBUTION = [
  { range: '18-24', count: 245, percentage: 28 },
  { range: '25-34', count: 420, percentage: 48 },
  { range: '35-44', count: 180, percentage: 20 },
  { range: '45+', count: 35, percentage: 4 },
] as const

export default function DatingAppWizardFlow() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  
  // Multi-step form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    
    // Step 2: Preferences
    lookingFor: '',
    ageRangeMin: '18',
    ageRangeMax: '35',
    distance: '25',
    relationship: '',
    
    // Step 3: Interests
    interests: [] as string[],
    bio: '',
    occupation: '',
    education: '',
    
    // Step 4: Photos
    profilePhoto: null as File | null,
    additionalPhotos: [] as File[]
  })

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const progressPercentage = useMemo(() => {
    return (currentStep / WIZARD_STEPS.length) * 100
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg'>
                <Heart className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>MatchMaker Profile</h1>
                <p className='text-gray-600'>Create your perfect dating profile</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <div className='text-sm text-gray-600'>Step {currentStep} of {WIZARD_STEPS.length}</div>
                <div className='text-sm font-medium text-purple-600'>
                  {WIZARD_STEPS.find(s => s.step === currentStep)?.title}
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <Progress value={progressPercentage} className='h-2' />
          </div>
        </div>
      </header>

      <main className='p-6 space-y-8'>
        {/* Profile Metrics */}
        <section data-template-section='profile-metrics' data-component-type='kpi-grid'>
          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {PROFILE_METRICS.map((metric) => (
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
                          <div className='flex items-center text-sm font-medium text-emerald-600'>
                            <TrendingUp className='w-4 h-4 mr-1' />
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

        {/* Wizard Steps Navigation */}
        <section data-template-section='wizard-navigation' data-component-type='step-indicator'>
          <Card className='border border-gray-200 shadow-sm'>
            <CardContent className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                {WIZARD_STEPS.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      currentStep === step.step
                        ? 'border-purple-500 bg-purple-50'
                        : currentStep > step.step
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setCurrentStep(step.step)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center space-x-3'>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color}`}>
                        <step.icon className='w-5 h-5 text-white' />
                      </div>
                      <div className='flex-1'>
                        <div className='font-semibold text-sm'>{step.title}</div>
                        <div className='text-xs text-gray-600'>{step.description}</div>
                      </div>
                      {currentStep > step.step && (
                        <CheckCircle className='w-5 h-5 text-emerald-600' />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Wizard Form Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <section data-template-section='wizard-form' data-component-type='multi-step-form' className='lg:col-span-2'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>
                  {WIZARD_STEPS.find(s => s.step === currentStep)?.title}
                </CardTitle>
                <CardDescription>
                  {WIZARD_STEPS.find(s => s.step === currentStep)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode='wait'>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key='step1'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className='space-y-6'
                    >
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <Label htmlFor='firstName'>First Name</Label>
                          <Input
                            id='firstName'
                            placeholder='John'
                            value={formData.firstName}
                            onChange={(e) => updateFormData('firstName', e.target.value)}
                            className='mt-2'
                          />
                        </div>
                        <div>
                          <Label htmlFor='lastName'>Last Name</Label>
                          <Input
                            id='lastName'
                            placeholder='Doe'
                            value={formData.lastName}
                            onChange={(e) => updateFormData('lastName', e.target.value)}
                            className='mt-2'
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor='email'>Email Address</Label>
                        <Input
                          id='email'
                          type='email'
                          placeholder='john.doe@example.com'
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                        <Input
                          id='dateOfBirth'
                          type='date'
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => updateFormData('gender', value)}
                          className='mt-2 space-y-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='male' id='male' />
                            <Label htmlFor='male'>Male</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='female' id='female' />
                            <Label htmlFor='female'>Female</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='other' id='other' />
                            <Label htmlFor='other'>Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label htmlFor='location'>Location</Label>
                        <Input
                          id='location'
                          placeholder='San Francisco, CA'
                          value={formData.location}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          className='mt-2'
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Preferences */}
                  {currentStep === 2 && (
                    <motion.div
                      key='step2'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className='space-y-6'
                    >
                      <div>
                        <Label>Looking For</Label>
                        <RadioGroup
                          value={formData.lookingFor}
                          onValueChange={(value) => updateFormData('lookingFor', value)}
                          className='mt-2 space-y-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='men' id='men' />
                            <Label htmlFor='men'>Men</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='women' id='women' />
                            <Label htmlFor='women'>Women</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='everyone' id='everyone' />
                            <Label htmlFor='everyone'>Everyone</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>Age Range</Label>
                        <div className='grid grid-cols-2 gap-4 mt-2'>
                          <Input
                            type='number'
                            placeholder='Min age'
                            value={formData.ageRangeMin}
                            onChange={(e) => updateFormData('ageRangeMin', e.target.value)}
                          />
                          <Input
                            type='number'
                            placeholder='Max age'
                            value={formData.ageRangeMax}
                            onChange={(e) => updateFormData('ageRangeMax', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor='distance'>Maximum Distance (miles)</Label>
                        <Input
                          id='distance'
                          type='number'
                          value={formData.distance}
                          onChange={(e) => updateFormData('distance', e.target.value)}
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label htmlFor='relationship'>Relationship Type</Label>
                        <Select
                          value={formData.relationship}
                          onValueChange={(value) => updateFormData('relationship', value)}
                        >
                          <SelectTrigger className='mt-2'>
                            <SelectValue placeholder='Select relationship type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='casual'>Casual Dating</SelectItem>
                            <SelectItem value='serious'>Serious Relationship</SelectItem>
                            <SelectItem value='friendship'>Friendship</SelectItem>
                            <SelectItem value='open'>Open to Anything</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Interests */}
                  {currentStep === 3 && (
                    <motion.div
                      key='step3'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className='space-y-6'
                    >
                      <div>
                        <Label>Select Your Interests</Label>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-3'>
                          {INTERESTS_OPTIONS.map((interest) => (
                            <motion.div
                              key={interest.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  selectedInterests.includes(interest.id)
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 bg-white hover:border-purple-300'
                                }`}
                                onClick={() => handleInterestToggle(interest.id)}
                              >
                                <interest.icon className='w-6 h-6 mx-auto mb-2' style={{ color: interest.color }} />
                                <div className='text-sm font-medium text-center'>{interest.label}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor='bio'>Bio</Label>
                        <Textarea
                          id='bio'
                          placeholder='Tell us about yourself...'
                          value={formData.bio}
                          onChange={(e) => updateFormData('bio', e.target.value)}
                          className='mt-2'
                          rows={4}
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <Label htmlFor='occupation'>Occupation</Label>
                          <Input
                            id='occupation'
                            placeholder='Software Engineer'
                            value={formData.occupation}
                            onChange={(e) => updateFormData('occupation', e.target.value)}
                            className='mt-2'
                          />
                        </div>
                        <div>
                          <Label htmlFor='education'>Education</Label>
                          <Input
                            id='education'
                            placeholder="Bachelor's Degree"
                            value={formData.education}
                            onChange={(e) => updateFormData('education', e.target.value)}
                            className='mt-2'
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Photos */}
                  {currentStep === 4 && (
                    <motion.div
                      key='step4'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className='space-y-6'
                    >
                      <div>
                        <Label>Profile Photo</Label>
                        <div className='mt-3 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer'>
                          <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                          <p className='text-sm text-gray-600 mb-2'>Click to upload or drag and drop</p>
                          <p className='text-xs text-gray-500'>PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                      <div>
                        <Label>Additional Photos (up to 5)</Label>
                        <div className='grid grid-cols-3 gap-4 mt-3'>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className='aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-400 transition-colors cursor-pointer'
                            >
                              <Camera className='w-8 h-8 text-gray-400' />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
                        <div className='flex items-start space-x-3'>
                          <CheckCircle className='w-5 h-5 text-purple-600 mt-0.5' />
                          <div className='flex-1'>
                            <h4 className='font-semibold text-purple-900'>Profile Complete!</h4>
                            <p className='text-sm text-purple-700 mt-1'>
                              You're all set! Click finish to start discovering matches.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className='my-6' />

                <div className='flex justify-between'>
                  <Button
                    variant='outline'
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === WIZARD_STEPS.length}
                    className='bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                  >
                    {currentStep === WIZARD_STEPS.length ? 'Finish' : 'Next'}
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Analytics Sidebar */}
          <section data-template-section='profile-analytics' data-component-type='analytics-panel'>
            <div className='space-y-6'>
              <Card className='border border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Match Trends</CardTitle>
                </CardHeader>
                <CardContent className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={MATCH_TRENDS}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                      <XAxis dataKey='month' stroke='#666' />
                      <YAxis stroke='#666' />
                      <Tooltip />
                      <Line 
                        type='monotone' 
                        dataKey='matches' 
                        stroke='#ec4899' 
                        strokeWidth={2}
                        name='Matches'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className='border border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold'>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={AGE_DISTRIBUTION}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                      <XAxis dataKey='range' stroke='#666' />
                      <YAxis stroke='#666' />
                      <Tooltip />
                      <Bar dataKey='count' fill='#a855f7' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
