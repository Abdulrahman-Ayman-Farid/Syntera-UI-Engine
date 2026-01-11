'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import * as DialogRadix from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, CalendarIcon, Users, Clock, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees: number;
}

const mockEvents: Event[] = [
  { id: 1, title: 'Tech Conference', date: '2023-12-15', location: 'San Francisco', attendees: 500 },
  { id: 2, title: 'Music Festival', date: '2024-01-20', location: 'Los Angeles', attendees: 1000 },
  { id: 3, title: 'Art Exhibition', date: '2024-02-10', location: 'New York', attendees: 300 }
];

const shimmerEffect = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite_forwards] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent`;

export default function EventPlanningPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEvents(mockEvents);
      return;
    }
    setFilteredEvents(
      events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='bg-gradient-to-l from-black via-gray-800 to-gray-900 text-white min-h-screen flex flex-col'>
      <header className='p-4 bg-gray-800 shadow-xl shadow-black/50 sticky top-0 z-50'>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <CalendarIcon size={24} />
            <h1 className='text-2xl font-bold'>Event Planner</h1>
          </div>
          <nav className='hidden md:flex space-x-4'>
            <button className='hover:text-secondary'>Dashboard</button>
            <button className='hover:text-secondary'>Events</button>
            <button className='hover:text-secondary'>Settings</button>
          </nav>
          <DialogTrigger asChild>
            <Button variant='default'>Add Event</Button>
          </DialogTrigger>
        </div>
      </header>
      <main className='p-4 flex-1'>
        <div className='container mx-auto'>
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-semibold'>Upcoming Events</h2>
              <div className='flex items-center space-x-4'>
                <Input
                  placeholder='Search events...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='w-full max-w-xs'
                />
                <Select>
                  <SelectTrigger className='w-full max-w-xs'>
                    <SelectValue placeholder='Filter by...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='location'>Location</SelectItem>
                    <SelectItem value='date'>Date</SelectItem>
                    <SelectItem value='attendees'>Attendees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className='aspect-video rounded-xl' />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredEvents.map((event) => (
                  <Card key={event.id} className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                    <CardContent className='p-4'>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className='mt-2'>
                        <div className='flex items-center gap-2'>
                          <Clock size={16} /> {formatDate(event.date)}
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <MapPin size={16} /> {event.location}
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <Users size={16} /> {event.attendees} Attendees
                        </div>
                      </CardDescription>
                    </CardContent>
                    <CardFooter className='flex justify-end'>
                      <Button onClick={() => router.push(`/event/${event.id}`)}>View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <h3 className='text-xl font-medium'>No events found</h3>
                <p className='mt-2 text-gray-400'>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
          <div className='bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 p-8'>
            <h2 className='text-2xl font-semibold mb-4'>Quick Stats</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Card className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                <CardContent className='p-4'>
                  <CardTitle>Total Events</CardTitle>
                  <CardDescription className='mt-2'>
                    <span className='text-3xl'>{events.length}</span>
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                <CardContent className='p-4'>
                  <CardTitle>Active Events</CardTitle>
                  <CardDescription className='mt-2'>
                    <span className='text-3xl'>{events.length}</span>
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className='border border-accent hover:border-primary rounded-xl shadow-xl shadow-black/50'>
                <CardContent className='p-4'>
                  <CardTitle>Completed Events</CardTitle>
                  <CardDescription className='mt-2'>
                    <span className='text-3xl'>0</span>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className='p-4 bg-gray-800 shadow-xl shadow-black/50'>
        <div className='container mx-auto text-center'>
          <p>&copy; 2023 Event Planner Inc. All rights reserved.</p>
        </div>
      </footer>
      <Dialog>
        <DialogContent className='max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50'>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>Create a new event here.</DialogDescription>
          </DialogHeader>
          <Form>
            <FormField
              control={{}}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Event Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder='Event Location' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name='attendees'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Attendees</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          <DialogFooter className='flex justify-between'>
            <Button type='submit'>Save</Button>
            <Button variant='outline' onClick={() => console.log('Cancel')}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}