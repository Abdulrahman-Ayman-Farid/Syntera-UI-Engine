'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, ArrowUpRight, CreditCard, DollarSign, Users, BarChart } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', balance: 1234.56 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', balance: 5678.90 },
  // Add more mock users here...
];

const shimmerAnimation = `animate-shimmer bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent`;

export default function BankingDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
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

  return (
    <div className='bg-white text-black min-h-screen flex flex-col'>
      <header className='bg-emerald-500 p-6 text-white'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Banking Dashboard</h1>
          <div className='space-x-4'>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle sidebar' className='md:hidden'>
              <ChevronRight className={`w-6 h-6 ${isSidebarOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>
            <Button variant='default' onClick={() => router.push('/settings')}>
              Settings
            </Button>
          </div>
        </div>
      </header>
      <main className='flex-1 flex overflow-hidden'>
        <aside className={`w-64 bg-emerald-100 px-4 py-6 space-y-6 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}> <!-- Sidebar -->
          <h2 className='text-lg font-semibold'>Navigation</h2>
          <ul className='space-y-2'>
            <li><a href='#dashboard' className='hover:text-emerald-500'>Dashboard</a></li>
            <li><a href='#accounts' className='hover:text-emerald-500'>Accounts</a></li>
            <li><a href='#transactions' className='hover:text-emerald-500'>Transactions</a></li>
            <li><a href='#reports' className='hover:text-emerald-500'>Reports</a></li>
          </ul>
        </aside>
        <section className='flex-1 p-6'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-2xl font-semibold'>Overview</h2>
            <div className='space-x-4'>
              <Input placeholder='Search...' value={searchTerm} onChange={handleSearchChange} className='w-64' />
              <Button variant='outline'>
                <Filter className='mr-2 w-4 h-4' /> Filters
              </Button>
            </div>
          </div>
          <div className='grid gap-6 mb-8'> <!-- Stats Cards -->
            <Card className='relative bg-gradient-to-bl from-emerald-500 to-emerald-300 shadow-2xl rounded-xl overflow-hidden'>
              <CardContent className='p-6'>
                <div className='absolute inset-0 pointer-events-none bg-cover opacity-20' style={{ backgroundImage: 'url(https://source.unsplash.com/random?abstract)' }}></div>
                <div className='relative'>
                  <h3 className='text-xl font-bold text-white'>Total Balance</h3>
                  <p className='mt-1 text-3xl font-extrabold text-white'>$23,456.78</p>
                  <div className='mt-4 flex items-center space-x-2'>
                    <ArrowUpRight className='w-4 h-4 text-white' /> <span className='text-sm text-white'>+15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-bl from-gold-500 to-gold-300 shadow-2xl rounded-xl overflow-hidden'>
              <CardContent className='p-6'>
                <h3 className='text-xl font-bold text-white'>Active Accounts</h3>
                <p className='mt-1 text-3xl font-extrabold text-white'>15</p>
                <div className='mt-4 flex items-center space-x-2'>
                  <Users className='w-4 h-4 text-white' /> <span className='text-sm text-white'>2 New</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='mb-8'> <!-- Transactions Table -->
            <h3 className='text-xl font-semibold mb-4'>Recent Transactions</h3>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className='h-24 rounded-lg' />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>Checking</TableCell>
                      <TableCell>2023-10-{String(index + 1).padStart(2, '0')}</TableCell>
                      <TableCell>Purchase from Amazon</TableCell>
                      <TableCell>$123.45</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <div className='mb-8'> <!-- User List -->
            <h3 className='text-xl font-semibold mb-4'>Customers</h3>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className='h-32 rounded-lg' />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredUsers.map((user) => (
                  <Card key={user.id} className='shadow-lg rounded-xl'>
                    <CardContent className='p-6'>
                      <div className='flex items-center space-x-4'>
                        <Avatar className='border-2 border-emerald-300'>
                          <img src='https://via.placeholder.com/48' alt={`${user.name}'s avatar`} />
                        </Avatar>
                        <div>
                          <h4 className='font-semibold'>{user.name}</h4>
                          <p className='text-sm'>{user.email}</p>
                        </div>
                      </div>
                      <div className='mt-4'>
                        <Badge variant='outline'>Balance: ${user.balance.toFixed(2)}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className='bg-emerald-500 p-6 text-white'>
        <p>&copy; 2023 Luxury Bank. All rights reserved.</p>
      </footer>
    </div>
  );
}