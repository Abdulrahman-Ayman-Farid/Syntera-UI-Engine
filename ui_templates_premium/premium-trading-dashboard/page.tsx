'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastProvider, ToastViewport, ToastRoot, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, ChevronRight, ChartBarHorizontal, DollarSign, UserCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const mockData = [
  { id: 1, symbol: 'AAPL', price: 150.75, change: '+2.15%', volume: 123456 },
  { id: 2, symbol: 'GOOGL', price: 2800.25, change: '-0.30%', volume: 789101 },
  { id: 3, symbol: 'MSFT', price: 300.00, change: '+1.45%', volume: 456789 }
];

interface Stock {
  id: number;
  symbol: string;
  price: number;
  change: string;
  volume: number;
}

export default function TradingDashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStocks(mockData);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStocks = stocks.filter((stock) => stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <ToastProvider>
      <div className='bg-background text-text min-h-screen flex flex-col'>
        <header className='bg-primary/20 backdrop-blur-md sticky top-0 z-50 border-b border-b-accent/10 px-4 py-3'>
          <div className='container mx-auto flex items-center justify-between'>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle sidebar' className='md:hidden'>
              <ArrowRight className={`w-6 h-6 ${isSidebarOpen ? 'rotate-180' : ''}`} /> 
            </button>
            <h1 className='text-2xl font-bold'>Trading Dashboard</h1>
            <div className='flex space-x-4'>
              <Button variant='outline' className='hover:bg-secondary/20'>
                <Plus className='mr-2 w-4 h-4' /> Add Portfolio
              </Button>
              <Button variant='default' className='hover:bg-accent/20'>
                <ChartBarHorizontal className='mr-2 w-4 h-4' /> Analytics
              </Button>
            </div>
          </div>
        </header>
        <main className='flex flex-1 overflow-hidden'>
          <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 w-64 transform bg-primary/20 backdrop-blur-md border-r border-r-accent/10 transition-transform duration-300 ease-in-out`}> 
            <div className='p-4'>
              <h2 className='text-lg font-semibold mb-4'>Navigation</h2>
              <nav className='space-y-2'>
                <Button variant='ghost' className='w-full justify-start hover:bg-secondary/20'>
                  <DollarSign className='mr-2 w-4 h-4' /> Stocks
                </Button>
                <Button variant='ghost' className='w-full justify-start hover:bg-secondary/20'>
                  <UserCircle2 className='mr-2 w-4 h-4' /> Accounts
                </Button>
              </nav>
            </div>
          </aside>
          <section className='flex-1 p-4'>
            <div className='mb-4'>
              <Input
                placeholder='Search stocks...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='border-accent/20 focus:border-accent focus:ring-accent/20'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className='h-40 rounded-lg' />
                ))
              ) : (
                filteredStocks.map((stock) => (
                  <Card key={stock.id} className='bg-white/10 backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out'>
                    <CardHeader>
                      <CardTitle>{stock.symbol}</CardTitle>
                      <CardDescription>Current Price: ${stock.price.toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardContent className='text-center'>
                      <Progress value={(parseFloat(stock.change.replace('%', '')) + 100)} className='transform rotate-180' />
                      <p className='mt-2'>{stock.change}</p>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                      <p>Volume: {stock.volume.toLocaleString()}</p>
                      <Button variant='secondary' size='icon' className='hover:bg-secondary/20'>
                        <ChevronRight className='w-4 h-4' />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </section>
        </main>
        <footer className='bg-primary/20 backdrop-blur-md border-t border-t-accent/10 px-4 py-3'>
          <div className='container mx-auto flex items-center justify-between'>
            <p>&copy; 2023 Trading Platform Inc.</p>
            <div className='flex space-x-4'>
              <Button variant='link' className='hover:text-secondary'>Privacy Policy</Button>
              <Button variant='link' className='hover:text-secondary'>Terms of Service</Button>
            </div>
          </div>
        </footer>
      </div>
      <ToastViewport className='fixed bottom-0 right-0 m-4 flex w-auto max-w-[420px] flex-col-reverse space-y-4' />
    </ToastProvider>
  );
}