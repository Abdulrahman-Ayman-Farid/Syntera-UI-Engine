'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com' }
];

const AnalyticsDashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFilteredUsers(mockUsers);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const results = mockUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / 5);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='bg-gradient-to-tl from-indigo-500 via-peach-300 to-white min-h-screen text-gray-900'>
      <header className='p-4 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
        <div className='flex space-x-2'>
          <Button variant='outline'>Settings</Button>
          <Button onClick={() => setModalOpen(true)}>Add New</Button>
        </div>
      </header>

      <main className='p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <Card className='shadow-xl rounded-2xl overflow-hidden bg-gradient-to-tl from-indigo-600 via-peach-300 to-indigo-400 animate-morph'>
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>Total Users</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>1,234</span>
          </CardContent>
        </Card>

        <Card className='shadow-xl rounded-2xl overflow-hidden bg-gradient-to-tl from-indigo-600 via-peach-300 to-indigo-400 animate-morph'>
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>Active Users</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>876</span>
          </CardContent>
        </Card>

        <Card className='shadow-xl rounded-2xl overflow-hidden bg-gradient-to-tl from-indigo-600 via-peach-300 to-indigo-400 animate-morph'>
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>New Signups</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>123</span>
          </CardContent>
        </Card>

        <Card className='shadow-xl rounded-2xl overflow-hidden bg-gradient-to-tl from-indigo-600 via-peach-300 to-indigo-400 animate-morph'>
          <CardHeader className='p-6'>
            <CardTitle className='text-white'>Churn Rate</CardTitle>
          </CardHeader>
          <CardContent className='text-center py-6'>
            <span className='text-4xl font-bold text-white'>5%</span>
          </CardContent>
        </Card>

        <Card className='col-span-full shadow-xl rounded-2xl overflow-hidden bg-white'>
          <CardHeader className='p-6'>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            {isLoading ? (
              <Skeleton className='h-20 w-full' />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice((currentPage - 1) * 5, currentPage * 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant='default'>Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='outline' disabled={currentPage === 1} onClick={handlePrevPage}>Previous</Button>
              <Button variant='outline' disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 z-50 bg-black opacity-50' />n          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-full p-6 shadow-xl rounded-2xl bg-white'>
            <Dialog.Title className='text-2xl font-bold'>Add New User</Dialog.Title>
            <form className='space-y-4 mt-4'>
              <Input placeholder='Name' required />
              <Input placeholder='Email' required />
              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button type='submit' className='w-full'>Submit</Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <footer className='p-4 text-center'>
        <p>&copy; 2023 Premium Analytics Inc.</p>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;