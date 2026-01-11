'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import * as TabsRadix from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import { Plus, Search, Filter, ChevronRight, User, Briefcase, FileText, CreditCard, Loader2 } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  status: string;
}

const initialUsers: UserData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Pending' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Approved' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'Rejected' }
];

const LoanApplicationPortal = () => {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true);
    setTimeout(() => {
      setUsers(initialUsers);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const filteredUsers = users.filter((user) => {
    if (filterStatus !== 'all' && user.status.toLowerCase() !== filterStatus) return false;
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderUserRow = (user: UserData) => (
    <TableRow key={user.id} className='hover:bg-slate-800'>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.status === 'Approved' ? 'success' : user.status === 'Rejected' ? 'destructive' : 'default'}>{user.status}</Badge>
      </TableCell>
      <TableCell className='flex justify-end gap-x-2'>
        <Button variant='ghost' aria-label={`View ${user.name}'s details`} onClick={() => router.push(`/users/${user.id}`)}>
          <FileText size={16} />
        </Button>
        <Button variant='ghost' aria-label={`Edit ${user.name}'s information`}>Edit</Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className='bg-gradient-to-b from-cyan-900 via-purple-900 to-magenta-900 min-h-screen flex flex-col items-center text-white'>
      <header className='w-full bg-black p-4 shadow-2xl backdrop-blur-md sticky top-0 z-50'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <button className='p-2 rounded-full hover:bg-gray-700 transition-colors'>
              <ChevronRight size={20} />
            </button>
            <h1 className='text-2xl font-bold'>Loan Applications</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Input
              placeholder='Search users...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='bg-gray-800 rounded-full pr-10 pl-3 py-2 focus:outline-none focus:border-cyan-500 focus:shadow-md'
            />
            <Search size={16} className='absolute right-3 top-3 text-gray-500' />
          </div>
          <div className='flex items-center gap-4'>
            <Avatar className='border-2 border-cyan-500'>
              <AvatarImage src='/avatar.jpg' alt='@vercel' />
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
            <div className='hidden sm:block'>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant='ghost' className='rounded-full'>
                    <CreditCard size={16} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className='bg-black rounded-md p-2 shadow-lg w-48'>
                    <DropdownMenu.Item className='py-2 px-4 hover:bg-gray-800 rounded-md'>Profile</DropdownMenu.Item>
                    <DropdownMenu.Item className='py-2 px-4 hover:bg-gray-800 rounded-md'>Settings</DropdownMenu.Item>
                    <DropdownMenu.Separator className='my-1 bg-gray-700' />
                    <DropdownMenu.Item className='py-2 px-4 hover:bg-gray-800 rounded-md'>Logout</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      </header>
      <main className='container mx-auto mt-8 flex gap-8'>
        <aside className='hidden lg:block w-1/4 bg-black rounded-lg p-4 shadow-lg backdrop-blur-sm'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Filters</h2>
            <Select onValueChange={handleFilterChange} defaultValue={filterStatus}>
              <SelectTrigger className='bg-gray-800 rounded-full pr-10 pl-3 py-2 focus:outline-none focus:border-cyan-500 focus:shadow-md'>
                <SelectValue placeholder='All Statuses' />
              </SelectTrigger>
              <SelectContent className='bg-black rounded-md p-2 shadow-lg'>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Statistics</h2>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <span>Total Applications:</span>
                <span>120</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Pending:</span>
                <span>40</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Approved:</span>
                <span>60</span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Rejected:</span>
                <span>20</span>
              </div>
            </div>
          </div>
        </aside>
        <div className='w-full'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold'>Applications</h2>
            <Button variant='outline' className='transition-transform hover:scale-105'>
              <Plus size={16} /> New Application
            </Button>
          </div>
          {isLoading ? (
            <div className='grid grid-cols-1 gap-4'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-20 rounded-lg' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? filteredUsers.map(renderUserRow) : <TableRow><TableCell colSpan={4} className='text-center'>No applications found</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </div>
        <aside className='hidden lg:block w-1/4 bg-black rounded-lg p-4 shadow-lg backdrop-blur-sm'>
          <h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
          <ul className='space-y-2'>
            <li>
              <Button variant='ghost' className='w-full text-left rounded-full hover:bg-gray-800 transition-colors'>
                <User size={16} className='mr-2' /> View Profile
              </Button>
            </li>
            <li>
              <Button variant='ghost' className='w-full text-left rounded-full hover:bg-gray-800 transition-colors'>
                <Briefcase size={16} className='mr-2' /> Manage Accounts
              </Button>
            </li>
            <li>
              <Button variant='ghost' className='w-full text-left rounded-full hover:bg-gray-800 transition-colors'>
                <CreditCard size={16} className='mr-2' /> Payment History
              </Button>
            </li>
          </ul>
        </aside>
      </main>
      <footer className='w-full bg-black p-4 shadow-2xl backdrop-blur-md fixed bottom-0 z-50'>
        <div className='container mx-auto flex justify-center items-center'>
          <p>&copy; 2023 LoanApp Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoanApplicationPortal;