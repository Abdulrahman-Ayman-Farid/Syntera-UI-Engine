'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon, ArrowLeftIcon, ArrowRightIcon, PlusIcon, UserIcon, CalendarIcon, SearchIcon, FilterIcon, FolderIcon, FileTextIcon, ChartBarHorizontalIcon } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

const mockUsers: UserData[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: '/avatars/john.png' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: '/avatars/jane.png' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', avatarUrl: '/avatars/alice.png' }
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('appointments');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (!searchTerm) {
      setFilteredUsers(mockUsers);
    } else {
      setFilteredUsers(
        mockUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddAppointment = () => {
    // Handle adding appointment logic here
    console.log('Adding appointment:', appointmentDate, appointmentNotes);
    setIsModalOpen(false);
  };

  return (
    <div className='bg-gradient-to-b from-sky-100 via-lime-50 to-coral-50 min-h-screen text-black'>
      <header className='fixed w-full z-50 backdrop-blur-sm bg-white/80 shadow-lg'>
        <div className='container flex items-center justify-between py-4 px-6'>
          <button onClick={() => setShowSidebar(!showSidebar)} aria-label='Toggle sidebar' className='md:hidden'>
            <FolderIcon className='w-6 h-6' />
          </button>
          <h1 className='text-2xl font-bold'>Patient Portal</h1>
          <div className='flex space-x-4'>
            <Button variant='outline'>Settings</Button>
            <Button>Logout</Button>
          </div>
        </div>
      </header>

      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>n        <div className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Navigation</h2>
          <ul className='space-y-2'>
            <li>
              <button
                onClick={() => setCurrentTab('appointments')}
                className={`block w-full p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 ${currentTab === 'appointments' && 'bg-gray-100'}`}
              >
                <CalendarIcon className='inline-block mr-2 w-4 h-4' /> Appointments
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('documents')}
                className={`block w-full p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 ${currentTab === 'documents' && 'bg-gray-100'}`}
              >
                <FileTextIcon className='inline-block mr-2 w-4 h-4' /> Documents
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('analytics')}
                className={`block w-full p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 ${currentTab === 'analytics' && 'bg-gray-100'}`}
              >
                <ChartBarHorizontalIcon className='inline-block mr-2 w-4 h-4' /> Analytics
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className='pt-24 pb-12 pl-6 pr-6 md:pl-64'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <Input
              placeholder='Search patients...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full p-4 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-offset-2 focus:ring-accent/50'
            />
          </div>

          <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className='mb-8'>
            <TabsList className='grid grid-cols-3 gap-2'>
              <TabsTrigger value='appointments'>Appointments</TabsTrigger>
              <TabsTrigger value='documents'>Documents</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value='appointments'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className='aspect-video rounded-lg' />
                  ))
                ) : filteredUsers.length === 0 ? (
                  <div className='col-span-full text-center'>No patients found.</div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className='transition-transform duration-300 hover:scale-105 cursor-pointer group'>
                      <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </CardHeader>
                      <CardContent className='relative'>
                        <div className='absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none' />
                        <UserIcon className='w-12 h-12 drop-shadow-lg absolute right-4 top-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                        <Avatar src={user.avatarUrl} alt={user.name} className='border-2 border-white' />
                      </CardContent>
                      <CardFooter className='flex justify-end'>
                        <Button variant='ghost' onClick={() => router.push(`/patient/${user.id}`)}>View Profile</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value='documents'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Agreement</CardTitle>
                    <CardDescription>Signed on Jan 15, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Download your signed agreement here.</p>
                  </CardContent>
                  <CardFooter className='flex justify-end'>
                    <Button variant='ghost'>Download PDF</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Insurance Information</CardTitle>
                    <CardDescription>Updated on Feb 20, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Check your insurance details.</p>
                  </CardContent>
                  <CardFooter className='flex justify-end'>n                    <Button variant='ghost'>Update Details</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='analytics'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={75} className='h-6 rounded-full' />
                    <p className='mt-2'>15 out of 20 appointments scheduled</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={85} className='h-6 rounded-full' />
                    <p className='mt-2'>85% response rate to reminders</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant='default' className='mt-8'>Schedule Appointment</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Enter the date and any additional notes.
              </DialogDescription>
              <form onSubmit={(e) => e.preventDefault()} className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='date' className='text-right'>
                    Date
                  </Label>
                  <Input
                    id='date'
                    type='date'
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className='col-span-3'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='notes' className='text-right'>
                    Notes
                  </Label>
                  <Input
                    id='notes'
                    placeholder='Enter any notes here...'
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    className='col-span-3'
                  />
                </div>
              </form>
              <DialogFooter className='sm:justify-end'>
                <DialogPrimitive.Close asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogPrimitive.Close>
                <Button type='submit' onClick={handleAddAppointment}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <footer className='fixed bottom-0 w-full bg-white shadow-lg'>
        <div className='container flex items-center justify-center py-4 px-6'>
          <p>&copy; 2023 Tropical Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}