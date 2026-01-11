'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as DialogRadix from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, MessageCircle, User, Users, Settings, Check, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
}

const usersData: User[] = [
  { id: 1, name: 'John Doe', avatarUrl: 'https://via.placeholder.com/150', lastMessage: 'Hey there!', timestamp: '10:30 AM' },
  { id: 2, name: 'Jane Smith', avatarUrl: 'https://via.placeholder.com/150', lastMessage: 'How are you?', timestamp: 'Yesterday' },
  // More users...
];

const MessagingAppPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(usersData);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
      if (Math.random() < 0.1) {
        setIsError(true);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = usersData.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Navigate to chat page
    router.push(`/chat/${user.id}`);
  };

  return (
    <div className='bg-gradient-to-br from-primary to-secondary min-h-screen text-text flex'>
      <aside className='hidden sm:flex w-1/4 flex-col py-6 px-4 bg-background shadow-md relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Messages</h1>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon'>
              <Settings className='h-4 w-4' aria-hidden='true' />
              <span className='sr-only'>Settings</span>
            </Button>
          </DialogTrigger>
        </div>
        <form className='mb-4'>
          <Label htmlFor='search' className='sr-only'>Search</Label>
          <Input
            id='search'
            placeholder='Search chats...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-9 pr-2'
          />
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none' />
        </form>
        <Separator className='my-2' />
        <ul className='space-y-2'>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className='animate-pulse'>
                <div className='flex items-center space-x-2'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <Skeleton className='h-4 w-1/2 rounded' />
                </div>
              </li>
            ))
          ) : isError ? (
            <div className='flex items-center space-x-2 text-destructive'>
              <AlertTriangle className='h-4 w-4' aria-hidden='true' />
              <p>Failed to load chats.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p>No results found.</p>
          ) : (
            filteredUsers.map(user => (
              <li key={user.id} onClick={() => handleUserClick(user)} className='cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg p-2 transition-colors'>
                <div className='flex items-center space-x-2'>
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>{user.name}</p>
                    <p className='text-xs opacity-75'>{user.lastMessage}</p>
                  </div>
                  <p className='ml-auto text-xs opacity-50'>{user.timestamp}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>
      <main className='w-full flex flex-col px-6 py-8 overflow-y-scroll'>
        {!selectedUser && (
          <div className='flex flex-col items-center justify-center h-full'>
            <MessageCircle className='h-12 w-12 mb-2 text-muted-foreground' />
            <p className='text-lg'>Select a chat to start messaging</p>
          </div>
        )}
        {selectedUser && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold'>{selectedUser.name}</p>
                  <p className='text-sm opacity-75'>Online</p>
                </div>
              </div>
              <div className='flex space-x-2'>
                <Button variant='ghost' size='icon'>
                  <Filter className='h-4 w-4' aria-hidden='true' />
                  <span className='sr-only'>Filter</span>
                </Button>
                <DialogTrigger asChild>
                  <Button variant='default'>New Message</Button>
                </DialogTrigger>
              </div>
            </div>
            <div className='flex flex-col-reverse space-y-2 space-y-reverse'>
              {/* Chat messages */}
              {[1, 2, 3].map(id => (
                <div key={id} className={`flex ${id % 2 === 0 ? 'justify-end' : ''}`}>{
                  id % 2 === 0 ? (
                    <div className='max-w-[40%] rounded-lg bg-background p-4 shadow-md mr-2'>
                      <p>Hello!</p>
                      <p className='mt-1 text-right text-xs opacity-50'>10:30 AM</p>
                    </div>
                  ) : (
                    <div className='max-w-[40%] rounded-lg bg-accent p-4 shadow-md ml-2'>
                      <p>Hi there!</p>
                      <p className='mt-1 text-right text-xs opacity-50'>10:31 AM</p>
                    </div>
                  )}
                </div>
              ))}
              {/* Shimmer loading effect */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : ''}`}>{
                  index % 2 === 0 ? (
                    <div className='max-w-[40%] animate-pulse rounded-lg bg-background p-4 shadow-md mr-2'>
                      <Skeleton className='h-4 w-full mb-2' />
                      <Skeleton className='h-4 w-3/4' />
                    </div>
                  ) : (
                    <div className='max-w-[40%] animate-pulse rounded-lg bg-accent p-4 shadow-md ml-2'>
                      <Skeleton className='h-4 w-full mb-2' />
                      <Skeleton className='h-4 w-3/4' />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='border-t border-muted-foreground pt-4'>
              <form onSubmit={(e) => e.preventDefault()} className='flex space-x-2'>
                <Input placeholder='Type your message...' className='flex-1' />
                <Button type='submit'>Send</Button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create New Message</DialogTitle>
            <DialogDescription>Select recipients:</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <CommandDialog>
              <CommandInput placeholder='Search people...' />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='People'>
                  {usersData.map(user => (
                    <CommandItem key={user.id} onSelect={() => console.log(user.name)}>
                      <User className='mr-2 h-4 w-4' aria-hidden='true' />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </div>
          <DialogFooter>
            <Button type='submit'>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DialogRadix.Root>
        <DialogRadix.Trigger asChild>
          <Button variant='outline'>Open Modal</Button>
        </DialogRadix.Trigger>
        <DialogRadix.Portal>
          <DialogRadix.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
          <DialogRadix.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
            <DialogRadix.Title className='text-lg font-semibold'>Modal Title</DialogRadix.Title>
            <DialogRadix.Description className='mt-2 text-sm text-muted-foreground'>
              Description goes here.
            </DialogRadix.Description>
            <div className='mt-4'>
              <p>This is the content of the modal.</p>
            </div>
            <div className='mt-6 flex justify-end gap-4'>
              <DialogRadix.Close asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogRadix.Close>
              <Button type='submit'>Confirm</Button>
            </div>
          </DialogRadix.Content>
        </DialogRadix.Portal>
      </DialogRadix.Root>
    </div>
  );
};

export default MessagingAppPage;