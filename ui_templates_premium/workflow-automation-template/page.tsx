'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tab, Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { Plus, Search, Filter, ChevronRight, FolderIcon, PlayIcon, PauseIcon, StopIcon, ArrowLeft, ArrowRight, MoreHorizontal } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Simulate error scenario
    if (Math.random() > 0.8) {
      setError('Failed to load data');
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(mockUsers);
      return;
    }
    setFilteredUsers(
      mockUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const navigateToUser = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  return (
    <div className='bg-background text-text min-h-screen flex'>
      {/* Sidebar */}
      <aside className={`bg-secondary w-64 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 transition-transform duration-300 ease-in-out`}>n        <div className='p-6'>
          <button className='flex items-center gap-2 text-accent hover:text-primary' onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <ArrowLeft className='w-5 h-5' />
            <span>Toggle Menu</span>
          </button>
        </div>
        <nav className='mt-6 px-6 space-y-2'>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex items-center gap-2 text-accent hover:text-primary'>
                  <FolderIcon className='w-5 h-5 drop-shadow-lg' />
                  <span>Workflows</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className='bg-primary text-accent'>Manage Workflows</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex items-center gap-2 text-accent hover:text-primary'>
                  <PlayIcon className='w-5 h-5 drop-shadow-lg' />
                  <span>Start</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className='bg-primary text-accent'>Start Automation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex items-center gap-2 text-accent hover:text-primary'>
                  <PauseIcon className='w-5 h-5 drop-shadow-lg' />
                  <span>Pause</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className='bg-primary text-accent'>Pause Automation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex items-center gap-2 text-accent hover:text-primary'>
                  <StopIcon className='w-5 h-5 drop-shadow-lg' />
                  <span>Stop</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className='bg-primary text-accent'>Stop Automation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      {/* Main Content */}
      <main className='ml-64 p-6 w-full'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground mt-2'>Welcome to your workflow automation dashboard.</p>
        </header>
        <section className='space-y-8'>
          {/* Statistics */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Card className='bg-gradient-to-tr from-secondary to-primary animate-pulse hover:animate-none transition-transform duration-300 ease-in-out hover:scale-105'>
              <CardContent className='py-4'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-muted-foreground'>Active Workflows</div>
                  <Plus className='w-4 h-4 drop-shadow-lg' />
                </div>
                <div className='text-2xl font-bold'>5</div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-tr from-secondary to-primary animate-pulse hover:animate-none transition-transform duration-300 ease-in-out hover:scale-105'>
              <CardContent className='py-4'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-muted-foreground'>Completed Tasks</div>
                  <CheckCircle className='w-4 h-4 drop-shadow-lg' />
                </div>
                <div className='text-2xl font-bold'>120</div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-tr from-secondary to-primary animate-pulse hover:animate-none transition-transform duration-300 ease-in-out hover:scale-105'>
              <CardContent className='py-4'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-muted-foreground'>Pending Tasks</div>
                  <Clock className='w-4 h-4 drop-shadow-lg' />
                </div>
                <div className='text-2xl font-bold'>5</div>
              </CardContent>
            </Card>
          </div>
          {/* Users Table */}
          <Card className='bg-secondary rounded-lg overflow-hidden'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-2xl'>Users</CardTitle>
              <CardDescription>Manage users who have access to workflows.</CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='relative mb-4'>
                <Input
                  type='text'
                  placeholder='Search by name or email...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='pl-10 pr-4 py-2 w-full bg-primary text-accent border border-input rounded-lg focus:outline-none focus:border-accent focus:shadow-sm'
                />
                <Search className='absolute left-3 top-3 w-5 h-5 text-muted-foreground' />
              </div>
              {isLoading && <Skeleton className='w-full h-[200px]' />}
              {error && <p className='text-destructive'>{error}</p>}
              {!isLoading && !error && filteredUsers.length === 0 && (
                <p>No results found</p>
              )}
              {!isLoading && !error && filteredUsers.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className='hover:bg-accent cursor-pointer' onClick={() => navigateToUser(user.id)}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <MoreHorizontal className='cursor-pointer' />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          {/* Progress Bars */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Card className='bg-gradient-to-tr from-secondary to-primary animate-pulse hover:animate-none transition-transform duration-300 ease-in-out hover:scale-105'>
              <CardContent className='py-4'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-muted-foreground'>Workflow Completion</div>
                  <Progress value={75} className='h-2 w-full rounded-full bg-primary/10' indicatorClass='bg-accent' />
                </div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-tr from-secondary to-primary animate-pulse hover:animate-none transition-transform duration-300 ease-in-out hover:scale-105'>
              <CardContent className='py-4'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-muted-foreground'>Task Success Rate</div>
                  <Progress value={95} className='h-2 w-full rounded-full bg-primary/10' indicatorClass='bg-accent' />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}