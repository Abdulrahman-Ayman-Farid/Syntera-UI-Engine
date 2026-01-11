'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Search, Filter, Heart, User, Users, MessageCircle, MapPin, Star, ArrowUpRight } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  image: string;
}

const mockUsers: UserData[] = [
  { id: 1, name: 'Alice Johnson', age: 28, location: 'New York', bio: 'Coffee lover, outdoor enthusiast.', image: '/alice.jpg' },
  { id: 2, name: 'Bob Smith', age: 34, location: 'Los Angeles', bio: 'Musician, foodie.', image: '/bob.jpg' },
  { id: 3, name: 'Charlie Brown', age: 22, location: 'Chicago', bio: 'Tech geek, sports fan.', image: '/charlie.jpg' }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {};
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(mockUsers);
      return;
    }

    const results = mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <div className='bg-radial-gradient-from-center bg-[#FFF9ED] text-[#1B1B1B]'>
      <header className='p-6 text-center'>
        <h1 className='text-4xl font-bold mb-4'>Find Your Perfect Match</h1>
        <p className='text-lg'>Discover love with our exclusive dating platform.</p>
        <div className='mt-6 flex justify-center'>
          <Input
            type='text'
            placeholder='Search users...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          />
          <Button variant='default' className='ml-2'>
            <Search size={20} className='mr-2' /> Search
          </Button>
        </div>
      </header>
      <main className='max-w-6xl mx-auto mt-12'>
        <section className='mb-12'>
          <h2 className='text-3xl font-semibold mb-6'>Featured Matches</h2>
          {isLoading ? (
            <div className='flex space-x-4'>
              {[1, 2, 3].map(skeletonId => (
                <Skeleton key={skeletonId} className='w-full h-64 rounded-lg' />
              ))}
            </div>
          ) : error ? (
            <p className='text-red-500'>{error}</p>
          ) : filteredUsers.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {filteredUsers.map(user => (
                <Card key={user.id} className='border-b border-l border-accent rounded-xl shadow-md relative'>
                  <CardContent className='relative'>
                    <img src={user.image} alt={`${user.name}'s profile`} className='w-full h-64 object-cover rounded-t-xl' />
                    <div className='absolute bottom-[-10px] left-4 right-4 bg-background rounded-full p-4 flex items-center justify-between'>
                      <div>
                        <CardTitle>{user.name}, {user.age}</CardTitle>
                        <p className='text-sm'>{user.location}</p>
                      </div>
                      <Heart size={24} className='text-secondary' />                      
                    </div>
                    <CardFooter className='pt-4'>
                      <p className='text-sm'>{user.bio}</p>
                      <Button variant='outline' className='mt-4 w-full' onClick={() => router.push(`/profile/${user.id}`)}>View Profile</Button>
                    </CardFooter>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No matches found.</p>
          )}
        </section>
        <section className='mb-12'>
          <h2 className='text-3xl font-semibold mb-6'>Testimonials</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card className='border-b border-l border-accent rounded-xl shadow-md'>
              <CardHeader>
                <CardTitle>Jane Doe</CardTitle>
                <CardDescription>Happy Customer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>&quot;Finding my soulmate was easier than ever with this app.&quot;</p>
              </CardContent>
            </Card>
            <Card className='border-b border-l border-accent rounded-xl shadow-md'>
              <CardHeader>
                <CardTitle>John Smith</CardTitle>
                <CardDescription>Long-term Relationship</CardDescription>
              </CardHeader>
              <CardContent>
                <p>&quot;Met my best friend here.&quot;</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className='mb-12'>
          <h2 className='text-3xl font-semibold mb-6'>Pricing Plans</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='border-b border-l border-accent rounded-xl shadow-md'>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>$9/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li>Essential features</li>
                  <li>Limited matches</li>
                  <li>No ads</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='default'>Choose Plan</Button>
              </CardFooter>
            </Card>
            <Card className='border-b border-l border-accent rounded-xl shadow-md'>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>$19/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li>All basic features</li>
                  <li>Unlimited matches</li>
                  <li>Priority customer service</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='default'>Choose Plan</Button>
              </CardFooter>
            </Card>
            <Card className='border-b border-l border-accent rounded-xl shadow-md'>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>$29/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li>All premium features</li>
                  <li>Exclusive events</li>
                  <li>VIP status</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='default'>Choose Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className='mb-12'>
          <h2 className='text-3xl font-semibold mb-6'>Contact Us</h2>
          <form onSubmit={(e) => e.preventDefault()} className='max-w-md mx-auto'>
            <div className='mb-4'>
              <Label htmlFor='name' className='block text-sm font-medium leading-6 text-muted-foreground'>Name</Label>
              <Input id='name' placeholder='Your Name' className='mt-2' required />
            </div>
            <div className='mb-4'>
              <Label htmlFor='email' className='block text-sm font-medium leading-6 text-muted-foreground'>Email</Label>
              <Input id='email' type='email' placeholder='your@email.com' className='mt-2' required />
            </div>
            <div className='mb-4'>
              <Label htmlFor='message' className='block text-sm font-medium leading-6 text-muted-foreground'>Message</Label>
              <Textarea id='message' placeholder='Type your message...' className='mt-2' required />
            </div>
            <Button type='submit' className='w-full'>Send Message</Button>
          </form>
        </section>
      </main>
      <footer className='py-6 text-center bg-primary text-background'>
        <p>&copy; 2023 Premium Dating App. All rights reserved.</p>
      </footer>
    </div>
  );
}