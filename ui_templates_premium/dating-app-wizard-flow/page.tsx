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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend, Cell, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, User, MapPin, Camera, Star, MessageCircle,
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

const UserProfilePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);
  const [mockData, setMockData] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      age: undefined,
      bio: '',
    },
  });

  useEffect(() => {
    // Simulate data fetch
    setIsLoading(true);
    setTimeout(() => {
      setMockData([
        { id: 1, name: 'Alice', age: 25, bio: 'Loves hiking and painting.' },
        { id: 2, name: 'Bob', age: 30, bio: 'Tech enthusiast, enjoys coding.' },
        { id: 3, name: 'Charlie', age: 28, bio: 'Musician, plays guitar.' },
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(values);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setError('An error occurred while submitting your information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className='bg-white text-slate-900 min-h-screen flex flex-col'>
      <header className='p-4 bg-secondary shadow-lg'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Profile Setup</h1>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handlePrevStep} disabled={currentStep === 1} aria-label='Previous Step'>
              <ArrowLeft className='w-4 h-4' /> Previous
            </Button>
            <Button variant='default' onClick={handleNextStep} disabled={isLoading || currentStep === 4} aria-label='Next Step'>
              Next <ArrowRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </header>
      <main className='flex-1 py-8 px-4 container mx-auto'>
        <div className='max-w-4xl mx-auto space-y-8'>
          {currentStep === 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter your username...' {...field} />)
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter your email...' {...field} />)
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='age'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='Enter your age...' {...field} />)
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isLoading} className='mt-4'>
                  {isLoading ? 'Submitting...' : 'Continue'}
                </Button>
                {error && <p className='text-red-500'>{error}</p>}
                {success && <p className='text-green-500'>Successfully submitted!</p>}
              </form>
            </Form>
          )}
          {currentStep === 2 && (
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Tell us more about you</h2>
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder='Write something about yourself...' {...field} />)
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button onClick={handleNextStep} disabled={isLoading}>Continue</Button>
            </div>
          )}
          {currentStep === 3 && (
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Choose your interests</h2>
              <Command className='overflow-hidden rounded-lg w-full'>
                <CommandInput placeholder='Search interests...' />
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Suggestions'>
                  <CommandItem>Art</CommandItem>
                  <CommandItem>Travel</CommandItem>
                  <CommandItem>Music</CommandItem>
                  <CommandItem>Movies</CommandItem>
                  <CommandItem>Sports</CommandItem>
                </CommandGroup>
              </Command>
              <Button onClick={handleNextStep} disabled={isLoading}>Continue</Button>
            </div>
          )}
          {currentStep === 4 && (
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Review your profile</h2>
              <Card className='border-t border-l bg-gradient-to-tr from-accent to-primary shadow-xl rounded-2xl'>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='w-16 h-16'>
                      <AvatarImage src='/avatars/01.png' alt='@vercel' />
                      <AvatarFallback>VN</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <p className='text-xl font-semibold'>Vercel Ninja</p>
                      <p className='text-sm'>Developer at Vercel</p>
                    </div>
                  </div>
                  <p className='mt-4'>Enjoys building amazing web applications with Next.js and Tailwind CSS.</p>
                  <div className='mt-4'>
                    <Badge variant='secondary' className='mr-2'>JavaScript</Badge>
                    <Badge variant='secondary'>React</Badge>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={onSubmit} disabled={isLoading} className='mt-4'>
                {isLoading ? 'Submitting...' : 'Finish Setup'}
              </Button>
              {error && <p className='text-red-500'>{error}</p>}
              {success && <p className='text-green-500'>Successfully submitted!</p>}
            </div>
          )}
        </div>
      </main>
      <footer className='p-4 bg-secondary shadow-lg'>
        <div className='container mx-auto text-center'>
          <p>&copy; 2023 DatingApp Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfilePage;