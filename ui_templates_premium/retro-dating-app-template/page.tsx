'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, User, Users, Heart, MessageCircle, Settings, HelpCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  image: string;
  status: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', image: 'https://via.placeholder.com/150', status: 'Online' },
  { id: 2, name: 'Jane Smith', image: 'https://via.placeholder.com/150', status: 'Offline' },
  { id: 3, name: 'Alice Johnson', image: 'https://via.placeholder.com/150', status: 'Away' }
];

const RetroDatingAppTemplate = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      try {
        setFilteredUsers(mockUsers);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setIsLoading(false);
      }
    }, 1500);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(mockUsers);
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openUserDetails = (userId: number) => {
    console.log(`Opening details for user ${userId}`);
    router.push(`/users/${userId}`);
  };

  return (
    <div className='bg-[#121212] text-white min-h-screen flex flex-col'>
      <header className='p-6 bg-[#00FFFF] bg-radial-gradient-from-center via-transparent to-black text-black'>
        <div className='flex justify-between items-center'>
          <h1 className='text-4xl font-bold'>MatchMaker</h1>
          <div className='space-x-4'>
            <button className='bg-[#FF00FF] hover:bg-[#FF80FF] px-4 py-2 rounded-xl transition-colors duration-300'>Messages</button>
            <button className='bg-[#FFFF00] hover:bg-[#FFFF80] px-4 py-2 rounded-xl transition-colors duration-300'>Notifications</button>
            <Button variant='default'>Settings</Button>
          </div>
        </div>
      </header>
      <nav className='border-b border-t border-[#00FFFF]'>
        <div className='container mx-auto p-4'>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-fit gap-2'>
              <TabsTrigger value='matches'>Matches</TabsTrigger>
              <TabsTrigger value='messages'>Messages</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>
      <main className='flex-1 p-6'>
        <TabsContent value='matches'>
          <div className='mb-4'>
            <Label htmlFor='search' className='sr-only'>
              Search
            </Label>
            <Input
              id='search'
              placeholder='Search matches...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full bg-[#1E1E1E] border border-[#00FFFF] focus:border-[#FF00FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF00FF]/50 rounded-xl'
            />
          </div>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {[1, 2, 3].map(skeletonId => (
                <Skeleton key={skeletonId} className='h-40 animate-pulse rounded-xl bg-[#1E1E1E]' />
              ))}
            </div>
          ) : error ? (
            <div className='text-red-500'>{error}</div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {filteredUsers.map(user => (
                <Card key={user.id} className='transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => openUserDetails(user.id)}>
                  <CardContent className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] opacity-20 rounded-xl'></div>
                    <Avatar className='mx-auto mb-4 rounded-full border-2 border-[#00FFFF]'>
                      <AvatarImage src={user.image} alt={`${user.name}'s avatar`} className='drop-shadow-lg' />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex justify-between items-center'>
                      <div className='font-semibold text-xl'>{user.name}</div>
                      <Badge className={`rounded-full ${user.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}>{user.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value='messages'>
          <div className='mb-4'>
            <Input
              placeholder='Search conversations...'
              className='w-full bg-[#1E1E1E] border border-[#00FFFF] focus:border-[#FF00FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF00FF]/50 rounded-xl'
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[10%]'>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Button size='icon' variant='ghost' aria-label='Message'>
                      <MessageCircle className='h-4 w-4' />\
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value='settings'>
          <form className='space-y-8'>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input id='username' placeholder='johndoe123' className='bg-[#1E1E1E] border border-[#00FFFF] focus:border-[#FF00FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF00FF]/50 rounded-xl' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' placeholder='john.doe@example.com' className='bg-[#1E1E1E] border border-[#00FFFF] focus:border-[#FF00FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF00FF]/50 rounded-xl' />
            </div>
            <Button type='submit' className='bg-[#FF00FF] hover:bg-[#FF80FF]'>Save changes</Button>
          </form>
        </TabsContent>
      </main>
      <footer className='p-6 bg-[#00FFFF] bg-radial-gradient-from-center via-transparent to-black text-black'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center'>
            <span>&copy; 2023 MatchMaker Inc.</span>
            <div className='space-x-4'>
              <HelpCircle className='cursor-pointer hover:text-[#FF00FF]' size={24} aria-label='Help' />
              <Settings className='cursor-pointer hover:text-[#FF00FF]' size={24} aria-label='Settings' />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RetroDatingAppTemplate;