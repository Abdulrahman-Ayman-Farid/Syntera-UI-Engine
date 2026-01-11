'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, ChevronRight, CalendarIcon, UsersIcon, CheckCircleIcon } from 'lucide-react';

const events = [
  { id: 1, name: 'Tech Conference', date: '2023-10-15', location: 'San Francisco', attendees: 200 },
  { id: 2, name: 'Product Launch', date: '2023-11-01', location: 'New York', attendees: 150 },
  { id: 3, name: 'Team Building', date: '2023-12-10', location: 'Los Angeles', attendees: 100 }
];

const EventPlanningPlatform = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventsData, setEventsData] = useState(events);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter events based on search query and active tab
    let filtered = eventsData;
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab !== 'all') {
      filtered = filtered.filter(event => event.location === activeTab);
    }
    setFilteredEvents(filtered);
  }, [searchQuery, activeTab, eventsData]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddEvent = () => {
    // Logic to add new event
    console.log('Adding new event...');
  };

  return (
    <div className='bg-white text-gray-900 min-h-screen flex flex-col'>
      <header className='bg-slate-50 shadow-md px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Event Planner</h1>
          <Button onClick={handleAddEvent} variant='default' className='bg-secondary hover:bg-secondary-dark'>
            <Plus className='mr-2' /> Add Event
          </Button>
        </div>
      </header>
      <main className='flex-1 flex overflow-hidden'>
        <aside className='w-64 border-r border-gray-100 hidden sm:block'>
          <div className='p-6'>
            <Tabs defaultValue='all' orientation='vertical'>
              <TabsList className='space-y-1'>
                <TabsTrigger value='all' onClick={() => setActiveTab('all')} className='bg-gradient-to-tr from-primary to-secondary hover:from-secondary hover:to-primary text-white'>All Events</TabsTrigger>
                <TabsTrigger value='san-francisco' onClick={() => setActiveTab('San Francisco')} className='bg-gradient-to-tr from-primary to-secondary hover:from-secondary hover:to-primary text-white'>San Francisco</TabsTrigger>
                <TabsTrigger value='new-york' onClick={() => setActiveTab('New York')} className='bg-gradient-to-tr from-primary to-secondary hover:from-secondary hover:to-primary text-white'>New York</TabsTrigger>
                <TabsTrigger value='los-angeles' onClick={() => setActiveTab('Los Angeles')} className='bg-gradient-to-tr from-primary to-secondary hover:from-secondary hover:to-primary text-white'>Los Angeles</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </aside>
        <div className='flex-1 p-6'>
          <div className='mb-4'>
            <Input
              type='text'
              placeholder='Search events...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='border-b border-gray-300 focus:border-secondary focus:outline-none w-full'
            />
          </div>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className='h-40 rounded-lg bg-gradient-to-tr from-gray-100 to-gray-200 animate-pulse' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredEvents.map(event => (
                <Card key={event.id} className='shadow-lg rounded-lg bg-gradient-to-tr from-primary to-secondary hover:translate-y-[-5px] duration-300 ease-in-out'>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-2'>
                      <CalendarIcon className='text-white' /> <span className='text-white'>{event.date}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <UsersIcon className='text-white' /> <span className='text-white'>{event.attendees}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant='outline' className='text-white border-white hover:text-secondary hover:bg-white'>Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className='bg-slate-50 shadow-md px-6 py-4'>
        <p className='text-center'>© 2023 Event Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EventPlanningPlatform;