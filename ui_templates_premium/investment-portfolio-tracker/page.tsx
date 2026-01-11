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
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ChevronsUpDownIcon, ArrowLeftIcon, ArrowRightIcon, PlusIcon, SearchIcon, FilterIcon, DollarSignIcon, ChartBarIcon, MoreHorizontalIcon, Loader2Icon, XCircleIcon } from 'lucide-react';
import clsx from 'clsx';

interface Investment {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
}

const investments: Investment[] = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', price: 150.75, change: 1.2 },
  { id: 2, name: 'Microsoft Corporation', symbol: 'MSFT', price: 310.12, change: -0.5 },
  { id: 3, name: 'Amazon.com, Inc.', symbol: 'AMZN', price: 3389.25, change: 0.8 },
  { id: 4, name: 'Alphabet Inc.', symbol: 'GOOGL', price: 2850.75, change: 0.3 },
  { id: 5, name: 'Tesla, Inc.', symbol: 'TSLA', price: 745.99, change: 2.1 }
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredInvestments = investments.filter((investment) =>
    investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='bg-background text-text min-h-screen flex flex-col relative overflow-hidden'>
      {/* Hero Section */}
      <div className='relative h-[300px] bg-gradient-to-tl from-primary to-secondary overflow-hidden'>
        <svg className='absolute inset-0 w-full h-full opacity-20' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
          <pattern id='dots' x={0} y={0} width={10} height={10} patternUnits='userSpaceOnUse'>
            <circle cx={5} cy={5} r={2} fill='#fff' />
          </pattern>
          <rect width={120} height={120} fill='url(#dots)' />
        </svg>
        <div className='flex items-center justify-between px-6 py-8'>
          <div className='space-y-2'>
            <h1 className='text-4xl font-bold'>Your Portfolio</h1>
            <p className='text-muted-foreground'>Track your investments in one place.</p>
          </div>
          <button
            className='bg-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-accent-foreground transition-colors duration-300'
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ArrowLeftIcon /> : <PlusIcon />}
          </button>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background'></div>
      </div>

      {/* Main Content */}
      <main className='p-6 flex-grow flex space-x-6'>
        {/* Sidebar */}
        <aside className={clsx('w-64 hidden lg:block', isSidebarOpen && 'block')}>n          <div className='sticky top-16 space-y-4'>
            <div className='p-4 bg-card rounded-lg shadow-lg'>
              <h2 className='font-semibold text-base mb-2'>Filters</h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='stocks'>Stocks</SelectItem>
                  <SelectItem value='crypto'>Crypto</SelectItem>
                  <SelectItem value='mutual-funds'>Mutual Funds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='p-4 bg-card rounded-lg shadow-lg'>
              <h2 className='font-semibold text-base mb-2'>Recent Activity</h2>
              <ul className='space-y-2'>
                <li className='flex items-center justify-between'>
                  <span>Apple Inc. bought</span>
                  <span>$150.75</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span>Tesla, Inc. sold</span>
                  <span>$745.99</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className='flex-grow'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex space-x-2'>
              <Input
                type='text'
                placeholder='Search investments...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full sm:w-64'
              />
              <Button variant='outline' aria-label='Search Investments'>
                <SearchIcon className='mr-2' />
                Search
              </Button>
            </div>
            <div className='flex space-x-2'>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' aria-label='Add New Investment'>
                      <PlusIcon className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add New Investment</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' aria-label='Filter Investments'>
                      <FilterIcon className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter Investments</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className='shadow-lg'>
            <TabsList className='bg-card rounded-lg'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='performance'>Performance</TabsTrigger>
              <TabsTrigger value='transactions'>Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value='overview'>
              <div className='mt-4'>
                {isLoading ? (
                  <div className='grid grid-cols-1 gap-4'>
                    {[1, 2, 3].map((item) => (
                      <Skeleton key={item} className='h-48 rounded-lg' />
                    ))}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <Card className='overflow-hidden'>
                      <CardContent className='py-6 px-4'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <h3 className='font-semibold text-base'>Total Value</h3>
                            <p className='text-muted-foreground'>$1,000,000</p>
                          </div>
                          <DollarSignIcon className='text-4xl' />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='overflow-hidden'>
                      <CardContent className='py-6 px-4'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <h3 className='font-semibold text-base'>Annual Return</h3>
                            <p className='text-green-500'>8%</p>
                          </div>
                          <ChartBarIcon className='text-4xl' />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='overflow-hidden'>
                      <CardContent className='py-6 px-4'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <h3 className='font-semibold text-base'>Risk Level</h3>
                            <p className='text-orange-500'>Moderate</p>
                          </div>
                          <MoreHorizontalIcon className='text-4xl' />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value='performance'>
              <div className='mt-4'>
                {isLoading ? (
                  <Skeleton className='h-80 rounded-lg' />
                ) : (
                  <div className='bg-card rounded-lg p-4'>
                    <h3 className='font-semibold text-base mb-4'>Performance Overview</h3>
                    <div className='border-t border-dashed border-primary mt-2 pt-4'>
                      <div className='flex items-center justify-between'>
                        <span>This Year</span>
                        <span>+10%</span>
                      </div>
                      <Progress value={10} className='mt-2' />
                    </div>
                    <div className='border-t border-dashed border-primary mt-4 pt-4'>
                      <div className='flex items-center justify-between'>
                        <span>Last Year</span>
                        <span>-5%</span>
                      </div>
                      <Progress value={95} className='mt-2' />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value='transactions'>
              <div className='mt-4'>
                {isLoading ? (
                  <Skeleton className='h-80 rounded-lg' />
                ) : (
                  <div className='bg-card rounded-lg p-4'>
                    <h3 className='font-semibold text-base mb-4'>Transaction History</h3>
                    <Table className='mt-4'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2023-10-01</TableCell>
                          <TableCell>Purchase</TableCell>
                          <TableCell>AAPL</TableCell>
                          <TableCell>5</TableCell>
                          <TableCell>$150.75</TableCell>
                          <TableCell>$753.75</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-09-15</TableCell>
                          <TableCell>Sale</TableCell>
                          <TableCell>TSLA</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell>$745.99</TableCell>
                          <TableCell>$2,237.97</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-card p-4 text-center'>
        <p>&copy; 2023 Investment Portfolio Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}