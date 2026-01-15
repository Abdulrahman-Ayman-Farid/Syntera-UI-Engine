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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, CheckCircle, XCircle, AlertTriangle, Loader2, Folder, FileText, FolderPlus, FileMinus } from 'lucide-react';

const mockData = [
  { id: 1, title: 'Bug #1', status: 'Open', priority: 'High', assignee: 'John Doe' },
  { id: 2, title: 'Bug #2', status: 'In Progress', priority: 'Medium', assignee: 'Jane Smith' },
  { id: 3, title: 'Bug #3', status: 'Closed', priority: 'Low', assignee: 'Alice Johnson' }
];

const shimmerAnimation = `animate-shimmer bg-gradient-to-r from-transparent via-gray-700 to-transparent`;

export default function RoyalBugTracker() {
  const router = useRouter();
  const [bugs, setBugs] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const filteredBugs = bugs.filter((bug) => {
    if (filterStatus === 'All') return true;
    return bug.status.toLowerCase() === filterStatus.toLowerCase();
  }).filter((bug) => {
    return bug.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderBugs = () => {
    if (loading) {
      return Array.from({ length: 5 }, (_, index) => (
        <TableRow key={index} className='bg-background'>
          <TableCell colSpan={5} className={`p-4 ${shimmerAnimation}`}></TableCell>
        </TableRow>
      ));
    }
    if (filteredBugs.length === 0) {
      return (
        <TableRow className='bg-background'>
          <TableCell colSpan={5} className='p-4 text-center'>No bugs found</TableCell>
        </TableRow>
      );
    }
    return filteredBugs.map((bug) => (
      <TableRow key={bug.id} className='bg-background'>
        <TableCell className='font-medium'>{bug.title}</TableCell>
        <TableCell>{bug.status}</TableCell>
        <TableCell>{bug.priority}</TableCell>
        <TableCell>{bug.assignee}</TableCell>
        <TableCell>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' aria-label='Edit Bug'>
              <Folder className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='icon' aria-label='Delete Bug'>
              <FileMinus className='w-4 h-4 text-red-500' />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className='relative min-h-screen bg-[#1E1E2F] text-white overflow-hidden'>
      <header className='fixed w-full top-0 left-0 px-4 py-3 bg-[#1E1E2F] flex justify-between items-center z-50'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle Sidebar'>
            <FolderPlus className='w-6 h-6' />
          </Button>
          <h1 className='text-2xl font-bold'>Bug Tracker</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Input
            placeholder='Search bugs...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-48 md:w-64 lg:w-80'
            aria-label='Search Bugs'
          />          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='Filter by Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All</SelectItem>
              <SelectItem value='Open'>Open</SelectItem>
              <SelectItem value='In Progress'>In Progress</SelectItem>
              <SelectItem value='Closed'>Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      <aside className={`fixed top-16 bottom-0 left-0 w-64 bg-[#2A2A3C] p-4 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>        <nav className='space-y-2'>
          <button
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-[#4B0082] transition-colors duration-300 ${currentStep === 1 && 'bg-[#4B0082]'}`}
            onClick={() => setCurrentStep(1)}
            aria-label='Go to Step 1'
          >
            <CheckCircle className='w-4 h-4' /> Step 1
          </button>
          <button
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-[#4B0082] transition-colors duration-300 ${currentStep === 2 && 'bg-[#4B0082]'}`}
            onClick={() => setCurrentStep(2)}
            aria-label='Go to Step 2'
          >
            <AlertTriangle className='w-4 h-4' /> Step 2
          </button>
          <button
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-[#4B0082] transition-colors duration-300 ${currentStep === 3 && 'bg-[#4B0082]'}`}
            onClick={() => setCurrentStep(3)}
            aria-label='Go to Step 3'
          >
            <XCircle className='w-4 h-4' /> Step 3
          </button>
        </nav>
      </aside>
      <main className='pt-16 pl-4 pr-4 md:pl-64'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold'>Current Bugs</h2>
          <p className='mt-2 text-gray-400'>Track and manage your bugs efficiently.</p>
        </div>
        <div className='flex items-end justify-between mb-4'>
          <Tabs defaultValue='all' className='max-w-[400px]'>
            <TabsList className='grid grid-cols-3'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='open'>Open</TabsTrigger>
              <TabsTrigger value='closed'>Closed</TabsTrigger>
            </TabsList>
            <TabsContent value='all'>
              <p>All Bugs</p>
            </TabsContent>
            <TabsContent value='open'>
              <p>Open Bugs</p>
            </TabsContent>
            <TabsContent value='closed'>
              <p>Closed Bugs</p>
            </TabsContent>
          </Tabs>
          <Button variant='default' size='lg' className='flex items-center gap-2'>
            <Plus className='w-4 h-4' /> New Bug
          </Button>
        </div>
        <div className='overflow-auto rounded-lg border border-slate-700 shadow-xl'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderBugs()}</TableBody>
          </Table>
        </div>
        <div className='mt-8'>
          <h3 className='text-2xl font-bold mb-4'>Statistics</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Card className='border border-slate-700 shadow-xl bg-gradient-to-br from-[#4B0082] to-[#2A2A3C] p-6'>
              <CardHeader>
                <CardTitle>Total Bugs</CardTitle>
              </CardHeader>
              <CardContent className='text-3xl font-bold'>123</CardContent>
            </Card>
            <Card className='border border-slate-700 shadow-xl bg-gradient-to-br from-[#4B0082] to-[#2A2A3C] p-6'>
              <CardHeader>
                <CardTitle>Open Bugs</CardTitle>
              </CardHeader>
              <CardContent className='text-3xl font-bold'>45</CardContent>
            </Card>
            <Card className='border border-slate-700 shadow-xl bg-gradient-to-br from-[#4B0082] to-[#2A2A3C] p-6'>
              <CardHeader>
                <CardTitle>Closed Bugs</CardTitle>
              </CardHeader>
              <CardContent className='text-3xl font-bold'>78</CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className='fixed bottom-0 left-0 right-0 bg-[#1E1E2F] p-4 text-gray-400 text-center'>
        <span>&copy; 2023 Royal Bug Tracker</span>
      </footer>
    </div>
  );
}