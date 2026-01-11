'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Bug {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee: User;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
];

const bugs: Bug[] = [
  { id: 1, title: 'Login issue', status: 'Open', priority: 'High', assignee: users[0] },
  { id: 2, title: 'Page crash', status: 'In Progress', priority: 'Medium', assignee: users[1] }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBugs, setFilteredBugs] = useState(bugs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBugs(
        bugs.filter((bug) =>
          bug.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBugs(bugs);
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  return (
    <div className='bg-conic-to-r-from-primary-to-secondary min-h-screen flex flex-col'>
      <header className='bg-primary text-white px-6 py-4 shadow-sm'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Bug Tracker</h1>
          <div className='flex space-x-4'>
            <Button variant='outline' onClick={() => setIsOpen(!isOpen)} aria-label='Add New Bug'>
              <Plus className='mr-2' /> Add Bug
            </Button>
          </div>
        </div>
      </header>
      <main className='flex-1 p-6 overflow-y-auto'>
        <div className='mb-6'>
          <Input
            placeholder='Search bugs...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full rounded-full'
          />
        </div>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className='h-60 rounded-lg' />
            ))
          ) : error ? (
            <p>Error loading bugs. Please try again.</p>
          ) : filteredBugs.length > 0 ? (
            filteredBugs.map((bug) => (
              <Card key={bug.id} className='shadow-sm hover:scale-105 transform transition-transform duration-300 ease-in-out'>
                <CardHeader>
                  <CardTitle>{bug.title}</CardTitle>
                  <CardDescription>Assigned to {bug.assignee.name}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className={`badge ${bug.status === 'Open' ? 'bg-red-500' : 'bg-green-500'}`}>{bug.status}</span>
                    <span className={`badge ${bug.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}>{bug.priority}</span>
                  </div>
                  <div className='mt-4'>
                    <Button variant='ghost' onClick={() => router.push(`/bugs/${bug.id}`)} aria-label={`View details for ${bug.title}`}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No bugs found.</p>
          )}
        </div>
      </main>
      <footer className='bg-primary text-white px-6 py-4 shadow-sm'>
        <p>&copy; 2023 Bug Tracker Inc.</p>
      </footer>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Button variant='default'>Add Bug</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-full p-6 rounded-lg bg-background shadow-lg focus:outline-none'>
            <Dialog.Title className='text-lg font-semibold'>Add New Bug</Dialog.Title>
            <Dialog.Description className='mt-2'>Enter the details of the new bug.</Dialog.Description>
            <Form className='mt-4'>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input id='title' placeholder='Bug title' className='focus:ring-primary focus:border-primary' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea id='description' placeholder='Describe the bug...' className='focus:ring-primary focus:border-primary' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select>
                    <SelectTrigger id='status'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='open'>Open</SelectItem>
                      <SelectItem value='in-progress'>In Progress</SelectItem>
                      <SelectItem value='closed'>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='priority'>Priority</Label>
                  <Select>
                    <SelectTrigger id='priority'>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='low'>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='assignee'>Assignee</Label>
                  <Select>
                    <SelectTrigger id='assignee'>
                      <SelectValue placeholder='Select assignee' />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.email}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='mt-4 flex justify-end'>
                <Button variant='outline' onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant='default' className='ml-2' onClick={handleError}>Submit</Button>
              </div>
            </Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Dashboard;