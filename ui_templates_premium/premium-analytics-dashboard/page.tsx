'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, BellIcon, CalendarIcon, CheckIcon, ChevronDownIcon, ChevronsUpDownIcon, CopyIcon, DotsHorizontalIcon, EyeIcon, FilePlusIcon, FunnelIcon, Loader2Icon, MessageSquareIcon, MoreHorizontalIcon, PencilIcon, PlusIcon, SearchIcon, SettingsIcon, TrashIcon, XCircleIcon } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'active' }
];

const shimmerEffect = `
  animate-shimmer
  before:absolute
  before:inset-0
  before:-translate-x-full
  before:animate-[shimmer_2s_infinite]
  before:bg-gradient-to-r
  before:from-transparent
  before:via-white/40
  before:to-transparent
`;

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value as 'all' | 'active' | 'inactive');
  };

  const handleSortChange = (value: boolean) => {
    setSortOrder(value ? 'asc' : 'desc');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredUsers = users.filter(user => {
    if (filterStatus === 'all') return true;
    return user.status === filterStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className='bg-background text-foreground min-h-screen flex flex-col'>
      <header className='p-6 border-b border-primary/10'>
        <div className='container mx-auto flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Analytics Dashboard</h1>
          <div className='flex space-x-4'>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <BellIcon className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Notifications
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <SettingsIcon className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Settings
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>
      <main className='p-6 flex-1 container mx-auto'>
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>User Analytics</h2>
            <div className='space-x-4'>
              <Input
                placeholder='Search users...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full max-w-sm'
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    Filter by Status <ChevronDownIcon className='ml-2 w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('inactive')}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    Sort Order <ChevronDownIcon className='ml-2 w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSortChange(true)}>
                    Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange(false)}>
                    Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <Card className={`relative overflow-hidden bg-gradient-to-tr from-primary to-secondary ${shimmerEffect}`}>
            <CardContent className='py-6 px-4'>
              <div className='absolute inset-0 bg-black opacity-20 backdrop-blur-sm'></div>
              <div className='relative z-10 flex items-start justify-between'>
                <div>
                  <p className='text-xs uppercase tracking-wide'>Total Users</p>
                  <h3 className='text-2xl font-bold'>1,234</h3>
                </div>
                <ArrowUpIcon className='w-8 h-8 text-accent' />
              </div>
            </CardContent>
          </Card>
          <Card className={`relative overflow-hidden bg-gradient-to-br from-secondary to-accent ${shimmerEffect}`}>
            <CardContent className='py-6 px-4'>
              <div className='absolute inset-0 bg-black opacity-20 backdrop-blur-sm'></div>
              <div className='relative z-10 flex items-start justify-between'>
                <div>
                  <p className='text-xs uppercase tracking-wide'>Active Users</p>
                  <h3 className='text-2xl font-bold'>876</h3>
                </div>
                <ArrowUpIcon className='w-8 h-8 text-accent' />
              </div>
            </CardContent>
          </Card>
          <Card className={`relative overflow-hidden bg-gradient-to-tr from-accent to-primary ${shimmerEffect}`}>
            <CardContent className='py-6 px-4'>
              <div className='absolute inset-0 bg-black opacity-20 backdrop-blur-sm'></div>
              <div className='relative z-10 flex items-start justify-between'>
                <div>
                  <p className='text-xs uppercase tracking-wide'>Inactive Users</p>
                  <h3 className='text-2xl font-bold'>358</h3>
                </div>
                <ArrowDownIcon className='w-8 h-8 text-red-500' />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-8'>
          <Tabs defaultValue='overview'>
            <TabsList className='grid grid-cols-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='detailed'>Detailed</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='border-t border-primary/10'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[100px]'>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index} className='shadow-inner'>
                          <TableCell colSpan={5} className='h-24 relative'>
                            <Skeleton className='absolute inset-0' />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      paginatedUsers.map(user => (
                        <TableRow key={user.id} className='hover:bg-muted cursor-pointer group'>
                          <TableCell className='font-medium'>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={`${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-full`}>{user.status}</Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center space-x-2'>
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant='ghost' size='icon' aria-label='Edit User'>
                                      <PencilIcon className='w-4 h-4' />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Edit User
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant='ghost' size='icon' aria-label='Delete User'>
                                      <TrashIcon className='w-4 h-4' />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Delete User
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className='flex items-center justify-end mt-4'>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`disabled:opacity-50 ${currentPage !== 1 && 'hover:text-accent'}`}
                  >
                    <ArrowLeftIcon className='w-4 h-4' />
                  </button>
                  <span>{currentPage} of {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`disabled:opacity-50 ${currentPage !== totalPages && 'hover:text-accent'}`}
                  >
                    <ArrowRightIcon className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='detailed'>
              <div className='border-t border-primary/10'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[100px]'>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index} className='shadow-inner'>
                          <TableCell colSpan={5} className='h-24 relative'>
                            <Skeleton className='absolute inset-0' />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      users.map(user => (
                        <TableRow key={user.id} className='hover:bg-muted cursor-pointer group'>
                          <TableCell className='font-medium'>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={`${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-full`}>{user.status}</Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center space-x-2'>
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant='ghost' size='icon' aria-label='Edit User'>
                                      <PencilIcon className='w-4 h-4' />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Edit User
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant='ghost' size='icon' aria-label='Delete User'>
                                      <TrashIcon className='w-4 h-4' />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Delete User
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className='p-6 border-t border-primary/10'>
        <div className='container mx-auto flex items-center justify-between'>
          <p>&copy; 2023 Premium SaaS Company</p>
          <div className='flex space-x-4'>
            <a href='#' className='text-primary hover:underline'>Privacy Policy</a>
            <a href='#' className='text-primary hover:underline'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}