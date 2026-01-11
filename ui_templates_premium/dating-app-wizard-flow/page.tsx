'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { Plus, Search, Filter, ChevronRight, UserCircle2, Heart, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  age: z.number().int().positive(),
  bio: z.string().max(160),
});

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