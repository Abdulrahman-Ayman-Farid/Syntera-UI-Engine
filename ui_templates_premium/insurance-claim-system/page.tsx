'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Pending' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Approved' },
  { id: 3, name: 'Sam Johnson', email: 'sam@example.com', status: 'Rejected' }
];

const shimmerEffect = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite_forwards] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

function shimmer() {
  return `
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;
}

export default function InsuranceClaimSystem() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (Math.random() > 0.9) {
        setError('Failed to fetch data. Please try again later.');
      }
    }, 2000);

    return () => clearTimeout(timer);
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

  const handleUserClick = (userId: number) => {
    router.push(`/claims/${userId}`);
  };

  return (
    <div className='bg-black text-white min-h-screen'>
      <style>{shimmer()}</style>
      <header className='flex justify-between items-center p-6 bg-gradient-to-bl from-gray-800 to-gray-900 shadow-xl'>
        <div className='flex items-center gap-4'>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='md:hidden'>
            <Plus size={24} aria-label='Toggle Sidebar' />
          </button>
          <h1 className='text-2xl font-bold'>Insurance Claims</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Input
            type='text'
            placeholder='Search claims...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='border-none outline-none focus:outline-none focus:ring-0'
            aria-label='Search claims'
          />
          <Filter size={20} aria-label='Filter claims' />          <Bell size={20} aria-label='Notifications' />
          <Avatar className='cursor-pointer'>
            <AvatarImage src='/avatars/01.png' alt='@vercel' />
            <AvatarFallback>VV</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className='flex flex-col md:flex-row p-6 gap-6'>
        <aside
          className={`${'md:w-64'} ${
            isSidebarOpen ? 'w-64' : 'hidden md:block'
          } transition-transform duration-300 ease-in-out fixed md:static bg-gray-800 p-6 rounded-2xl shadow-xl`}
        >
          <h2 className='mb-4 text-xl font-semibold'>Filters</h2>
          <div className='space-y-4'>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='property'>Property Damage</SelectItem>
                <SelectItem value='liability'>Liability</SelectItem>
                <SelectItem value='personal'>Personal Injury</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='default' className='w-full'>Apply Filters</Button>
          </div>
        </aside>
        <section className='flex-1 space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Claims List</h2>
            <Button variant='default' onClick={() => router.push('/new-claim')}>
              <Plus size={20} className='mr-2' /> New Claim
            </Button>
          </div>
          <Card className='overflow-hidden rounded-2xl shadow-xl'>
            <CardContent className='p-0'>
              {isLoading && (
                <Table className='border-none'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='pl-6'>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3].map((index) => (
                      <TableRow key={index} className='border-b border-gray-700'>
                        <TableCell className='py-4 pl-6 animate-pulse'>
                          <Skeleton className='h-4 w-24 rounded-full' />
                        </TableCell>
                        <TableCell className='py-4 animate-pulse'>
                          <Skeleton className='h-4 w-24 rounded-full' />
                        </TableCell>
                        <TableCell className='py-4 animate-pulse'>
                          <Skeleton className='h-4 w-24 rounded-full' />
                        </TableCell>
                        <TableCell className='py-4 pr-6'>
                          <Skeleton className='h-4 w-24 rounded-full' />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!isLoading && !error && (
                <Table className='border-none'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='pl-6'>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className='border-b border-gray-700'>
                        <TableCell className='py-4 pl-6 cursor-pointer hover:text-orange-300' onClick={() => handleUserClick(user.id)}>
                          {user.name}
                        </TableCell>
                        <TableCell className='py-4'>{user.email}</TableCell>
                        <TableCell className='py-4'>
                          <Badge variant={user.status === 'Pending' ? 'secondary' : user.status === 'Approved' ? 'success' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='py-4 pr-6'>
                          <ChevronRight size={16} className='cursor-pointer hover:text-orange-300' onClick={() => handleUserClick(user.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {error && <p className='p-6 text-red-500'>{error}</p>}
            </CardContent>
          </Card>
          <div className='flex justify-end'>
            <Pagination />
          </div>
        </section>
      </main>
      <footer className='bg-gray-800 p-6 text-center'>
        <p>&copy; 2023 Insurance Claims Inc.</p>
      </footer>
    </div>
  );
}

function Pagination() {
  return (
    <div className='inline-flex items-center -space-x-px'>
      <a
        href='#'
        className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700'
      >
        Previous
      </a>
      <a
        href='#'
        className='z-10 block px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
      >
        1
      </a>
      <a
        href='#'
        className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
      >
        2
      </a>
      <a
        href='#'
        className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
      >
        3
      </a>
      <a
        href='#'
        className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700'
      >
        Next
      </a>
    </div>
  );
}