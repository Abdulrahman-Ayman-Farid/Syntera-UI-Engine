'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { lucide } from 'lucide-react';
import { ArrowRight, ArrowLeft, Plus, Search, Filter, ChevronRight, Loader2 } from 'lucide-react';

interface Investment {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
}

const investmentsMockData: Investment[] = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', price: 150.75, change: 2.34 },
  { id: 2, name: 'Microsoft Corporation', symbol: 'MSFT', price: 330.12, change: -1.23 },
  { id: 3, name: 'Tesla, Inc.', symbol: 'TSLA', price: 720.56, change: 4.56 },
];

const RetroInvestmentTracker = () => {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvestments(investmentsMockData);
      setLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredInvestments = investments.filter((investment) => {
    if (filter === 'positive') return investment.change > 0;
    if (filter === 'negative') return investment.change < 0;
    return true;
  }).filter((investment) => investment.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderTableRows = () => {
    if (loading) {
      return Array.from({ length: 5 }, (_, index) => (
        <TableRow key={index} className='bg-gray-800 rounded-lg'>
          <TableCell className='p-4'><Skeleton className='w-full h-4'/></TableCell>
          <TableCell className='p-4'><Skeleton className='w-full h-4'/></TableCell>
          <TableCell className='p-4'><Skeleton className='w-full h-4'/></TableCell>
          <TableCell className='p-4'><Skeleton className='w-full h-4'/></TableCell>
        </TableRow>
      ));
    }

    if (filteredInvestments.length === 0 && !error) {
      return (
        <TableRow className='bg-gray-800 rounded-lg'>
          <TableCell colSpan={4} className='text-center p-4 text-red-500'>No investments found</TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow className='bg-gray-800 rounded-lg'>
          <TableCell colSpan={4} className='text-center p-4 text-red-500'>Error loading investments</TableCell>
        </TableRow>
      );
    }

    return filteredInvestments.map((investment) => (
      <TableRow key={investment.id} className='hover:bg-gray-700 rounded-lg transition-colors duration-300'>
        <TableCell className='p-4'>{investment.name}</TableCell>
        <TableCell className='p-4'>{investment.symbol}</TableCell>
        <TableCell className='p-4'>{investment.price.toFixed(2)}</TableCell>
        <TableCell className={`p-4 ${investment.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{investment.change.toFixed(2)}%</TableCell>
      </TableRow>
    ));
  };

  return (
    <div className='bg-gradient-to-bl from-cyan-900 via-magenta-900 to-yellow-900 min-h-screen flex flex-col overflow-hidden'>
      <header className='bg-black/50 backdrop-blur-md py-6 px-8 sticky top-0 z-50'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-white'>Portfolio Tracker</h1>
          <div className='flex gap-4'>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' aria-label='Refresh Investments' className='transition-transform hover:scale-105'>
                    <Loader2 className='animate-spin w-5 h-5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Loading...</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant='outline' className='border-t border-l bg-gradient-to-bl from-cyan-900 via-magenta-900 to-yellow-900 text-white shadow-2xl rounded-xl hover:scale-105 transition-transform duration-300'>
              New Investment
              <Plus className='ml-2 w-4 h-4' />
            </Button>
          </div>
        </div>
      </header>
      <main className='p-8 overflow-x-auto'>
        <section className='mb-8'>
          <Card className='bg-black/50 backdrop-blur-md shadow-glow rounded-2xl p-6'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-2xl text-white'>Overview</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              <div className='bg-gray-800 rounded-lg p-6 shadow-glow flex flex-col justify-between'>
                <div className='space-y-2'>
                  <h3 className='text-lg text-white'>Total Value</h3>
                  <p className='text-2xl font-bold text-white'>$2,500,000</p>
                </div>
                <Progress value={75} className='mt-4' /> <!-- Placeholder for actual chart -->
              </div>
              <div className='bg-gray-800 rounded-lg p-6 shadow-glow flex flex-col justify-between'>
                <div className='space-y-2'>
                  <h3 className='text-lg text-white'>Profit/Loss</h3>
                  <p className='text-2xl font-bold text-green-500'>$50,000</p>
                </div>
                <Progress value={85} className='mt-4' /> <!-- Placeholder for actual chart -->
              </div>
              <div className='bg-gray-800 rounded-lg p-6 shadow-glow flex flex-col justify-between'>
                <div className='space-y-2'>
                  <h3 className='text-lg text-white'>Annual Return</h3>
                  <p className='text-2xl font-bold text-white'>10%</p>
                </div>
                <Progress value={90} className='mt-4' /> <!-- Placeholder for actual chart -->
              </div>
            </CardContent>
          </Card>
        </section>
        <section className='mb-8'>
          <Card className='bg-black/50 backdrop-blur-md shadow-glow rounded-2xl p-6'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-2xl text-white'>Investments</CardTitle>
              <div className='flex space-x-2'>
                <Input placeholder='Search...' value={searchQuery} onChange={handleSearchChange} className='w-full max-w-xs' /> <!-- Search functionality -->
                <Select value={filter} onValueChange={handleFilterChange} className='max-w-xs'>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Filter by performance...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='positive'>Positive</SelectItem>
                    <SelectItem value='negative'>Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className='overflow-x-auto'>
              <Table className='bg-gray-800 rounded-lg shadow-glow'>
                <TableHeader className='text-white'>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows()}</TableBody>
              </Table>
            </CardContent>
            <CardFooter className='pt-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <ArrowLeft className='mr-2 w-5 h-5 text-white cursor-pointer' onClick={() => console.log('Previous Page')} /> <!-- Pagination functionality -->
                  <span className='text-white'>Page 1 of 5</span>
                  <ArrowRight className='ml-2 w-5 h-5 text-white cursor-pointer' onClick={() => console.log('Next Page')} /> <!-- Pagination functionality -->
                </div>
                <Button variant='outline' className='border-t border-l bg-gradient-to-bl from-cyan-900 via-magenta-900 to-yellow-900 text-white shadow-glow rounded-xl hover:scale-105 transition-transform duration-300'>
                  Export Data
                </Button>
              </div>
            </CardFooter>
          </Card>
        </section>
      </main>
      <footer className='bg-black/50 backdrop-blur-md py-4 px-8 mt-auto'>
        <div className='flex justify-between items-center'>
          <span className='text-white'>© 2023 Portfolio Tracker</span>
          <div className='flex space-x-4'>
            <a href='#' className='text-white hover:text-cyan-500 transition-colors duration-300'>Privacy Policy</a>
            <a href='#' className='text-white hover:text-cyan-500 transition-colors duration-300'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RetroInvestmentTracker;