'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ArrowRight, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'inactive' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', status: 'pending' }
];

const TestPlatformDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(mockUsers);
    } else {
      setFilteredUsers(
        mockUsers.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='bg-background min-h-screen flex flex-col'>
      <header className='p-4 bg-primary text-text shadow-xl'>
        <div className='flex justify-between items-center'>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='lg:hidden'>
            <ArrowRight className='w-6 h-6' /> Toggle Sidebar
          </button>
          <h1 className='text-2xl font-bold'>Testing Platform</h1>
          <div className='flex space-x-2'>
            <Button variant='outline' size='icon' className='drop-shadow-lg'>
              <RefreshCcw className='w-4 h-4' />
            </Button>
            <Button variant='default' size='icon' className='drop-shadow-lg'>
              <Plus className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </header>
      <main className='flex-1 flex'>
        <aside className={`bg-secondary w-64 p-4 overflow-y-auto ${isSidebarOpen ? '' : 'hidden lg:block'} transition-transform duration-300 ease-in-out`}>n          <div className='mb-4'>
            <Input
              placeholder='Search...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='border-accent focus:border-accent focus:ring-accent focus:ring-offset-2'
            />
          </div>
          <nav aria-label='Main Navigation'>
            <ul className='space-y-2'>
              <li>
                <Button variant='ghost' className='justify-start w-full gap-2'>
                  <CheckCircle className='w-4 h-4' /> Active Tests
                </Button>
              </li>
              <li>
                <Button variant='ghost' className='justify-start w-full gap-2'>
                  <XCircle className='w-4 h-4' /> Failed Tests
                </Button>
              </li>
              <li>
                <Button variant='ghost' className='justify-start w-full gap-2'>
                  <Filter className='w-4 h-4' /> Filters
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className='flex-1 p-4'>
          <section className='mb-8'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Recent Users</h2>
              <Button variant='outline' size='sm'>View All</Button>
            </div>
            <Card className='mt-2'>
              <CardContent className='p-0'>
                {isLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {[1, 2, 3, 4].map((item) => (
                      <Skeleton key={item} className='h-24 rounded-lg' />
                    ))}
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className='relative overflow-hidden rounded-lg'>
                        <div className='absolute inset-0 bg-conic-from-violet via-purple to-pink opacity-10 backdrop-blur-sm'></div>
                        <CardContent className='relative z-10 p-4'>
                          <div className='flex items-center space-x-4'>
                            <Avatar>
                              <AvatarImage src={`https://robohash.org/${user.id}`} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                              <h3 className='font-medium'>{user.name}</h3>
                              <p className='text-sm text-muted-foreground'>{user.email}</p>
                            </div>
                          </div>
                          <Badge className={`ml-auto mt-2 ${user.status === 'active' ? 'bg-green-500' : user.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'}`}>{user.status}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center py-8'>
                    <p className='text-muted-foreground'>No users found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          <section className='mb-8'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Test Results Overview</h2>
              <Button variant='outline' size='sm'>View Report</Button>
            </div>
            <Card className='mt-2'>
              <CardContent className='p-0'>
                <Tabs defaultValue='overview' className='w-full'>
                  <TabsList className='grid grid-cols-3'>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='details'>Details</TabsTrigger>
                    <TabsTrigger value='statistics'>Statistics</TabsTrigger>
                  </TabsList>
                  <TabsContent value='overview' className='p-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <Card className='shadow-lg'>
                        <CardHeader className='pb-2'>
                          <CardTitle>Active Tests</CardTitle>
                          <CardDescription>Total active test cases</CardDescription>
                        </CardHeader>
                        <CardContent className='text-2xl font-bold'>24</CardContent>
                      </Card>
                      <Card className='shadow-lg'>
                        <CardHeader className='pb-2'>
                          <CardTitle>Failed Tests</CardTitle>
                          <CardDescription>Total failed test cases</CardDescription>
                        </CardHeader>
                        <CardContent className='text-2xl font-bold'>5</CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value='details' className='p-4'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4].map((test) => (
                          <TableRow key={test}>
                            <TableCell>Test Case {test}</TableCell>
                            <TableCell><Badge variant='outline'>Passed</Badge></TableCell>
                            <TableCell>2m 30s</TableCell>
                            <TableCell className='text-right'>
                              <Button variant='ghost' size='sm'>Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value='statistics' className='p-4'>
                    <Progress value={80} className='w-full' />
                    <p className='mt-2 text-center'>Success Rate: 80%</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <footer className='p-4 bg-primary text-text'>
        <p className='text-center'>© 2023 Testing Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TestPlatformDashboard;