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
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, ArrowUpRight, UserCircle2, Folder, CheckSquare, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatar: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/48' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/48' }
];

const mockPipelineData = [
  { id: 1, stage: 'Prospect', users: [mockUsers[0]], progress: 40 },
  { id: 2, stage: 'Qualified', users: [mockUsers[1]], progress: 70 },
  { id: 3, stage: 'Negotiation', users: [], progress: 0 }
];

export default function SalesPipelineTracker() {
  const router = useRouter();
  const [pipelineData, setPipelineData] = useState(mockPipelineData);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStageChange = (value: string) => {
    setSelectedStage(value);
  };

  const filteredData = pipelineData.filter((item) => {
    if (selectedStage !== 'All' && item.stage !== selectedStage) return false;
    if (!item.users.some((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const handleAddUserToStage = (stageId: number) => {
    const updatedData = pipelineData.map((item) => {
      if (item.id === stageId) {
        item.users.push(mockUsers[0]);
      }
      return item;
    });
    setPipelineData(updatedData);
  };

  const handleRemoveUserFromStage = (stageId: number, userId: number) => {
    const updatedData = pipelineData.map((item) => {
      if (item.id === stageId) {
        item.users = item.users.filter((user) => user.id !== userId);
      }
      return item;
    });
    setPipelineData(updatedData);
  };

  return (
    <div className='bg-white min-h-screen flex flex-col'>
      <header className='bg-gradient-to-tr from-primary to-secondary text-white py-6 px-4 sm:px-8'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Sales Pipeline Tracker</h1>
          <button className='flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-transform transform hover:rotate-6'>
            <Plus size={24} /> New Deal
          </button>
        </div>
      </header>
      <div className='flex-grow flex'>
        <aside className='hidden sm:block w-1/5 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto'>
          <div className='mb-6'>
            <label htmlFor='search' className='block text-sm font-medium text-gray-700'>Search Deals</label>
            <Input
              id='search'
              placeholder='Enter deal name...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='mt-1 block w-full p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='stage' className='block text-sm font-medium text-gray-700'>Filter by Stage</label>
            <Select onValueChange={handleStageChange} defaultValue='All'>
              <SelectTrigger className='w-full mt-1'>
                <SelectValue placeholder='Select a stage...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All</SelectItem>
                <SelectItem value='Prospect'>Prospect</SelectItem>
                <SelectItem value='Qualified'>Qualified</SelectItem>
                <SelectItem value='Negotiation'>Negotiation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>
        <main className='w-full p-4 sm:p-8 flex flex-col gap-6'>
          <Tabs defaultValue='overview'>
            <TabsList className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='deals'>Deals</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Card className='shadow-2xl rounded-2xl p-4 bg-gradient-to-tr from-primary to-secondary text-white'>
                  <CardHeader>
                    <CardTitle>Total Deals</CardTitle>
                  </CardHeader>
                  <CardContent className='text-4xl font-bold'>$100K</CardContent>
                </Card>
                <Card className='shadow-2xl rounded-2xl p-4 bg-gradient-to-tr from-primary to-secondary text-white'>
                  <CardHeader>
                    <CardTitle>Closed Deals</CardTitle>
                  </CardHeader>
                  <CardContent className='text-4xl font-bold'>$50K</CardContent>
                </Card>
                <Card className='shadow-2xl rounded-2xl p-4 bg-gradient-to-tr from-primary to-secondary text-white'>
                  <CardHeader>
                    <CardTitle>Open Deals</CardTitle>
                  </CardHeader>
                  <CardContent className='text-4xl font-bold'>$50K</CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='deals'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[10rem]'>Deal Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>{deal.stage}</TableCell>
                        <TableCell>
                          <Progress value={deal.progress} className='w-full' />
                        </TableCell>
                        <TableCell className='flex space-x-2'>
                          {deal.users.map((user) => (
                            <TooltipProvider key={user.id} delayDuration={300}>
                              <TooltipRoot>
                                <TooltipTrigger>
                                  <Avatar src={user.avatar}>{user.name.charAt(0)}</Avatar>
                                </TooltipTrigger>
                                <TooltipContent>{user.name}</TooltipContent>
                              </TooltipRoot>
                            </TooltipProvider>
                          ))}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' onClick={() => handleAddUserToStage(deal.id)}>
                            <Plus size={16} className='mr-2' /> Assign User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value='analytics'>
              <Card className='p-6 shadow-2xl rounded-2xl backdrop-blur-sm bg-white/50'>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='border p-4 rounded-lg bg-white/30 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='font-semibold'>Conversion Rate</h3>
                    <p className='text-2xl font-bold'>30%</p>
                  </div>
                  <div className='border p-4 rounded-lg bg-white/30 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='font-semibold'>Average Deal Value</h3>
                    <p className='text-2xl font-bold'>$20K</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <footer className='bg-gray-100 py-4 px-4 sm:px-8 text-gray-600'>
        <div className='container mx-auto'>
          &copy; 2023 Sales Pipeline Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}