'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

interface CryptoData {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const mockCryptoData: CryptoData[] = [
  { id: 1, symbol: 'BTC', name: 'Bitcoin', price: 45000, change: 1.2 },
  { id: 2, symbol: 'ETH', name: 'Ethereum', price: 3000, change: -0.5 },
  { id: 3, symbol: 'LTC', name: 'Litecoin', price: 150, change: 0.8 },
  // ... more mock data
];

export default function Home() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const router = useRouter();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCryptos(mockCryptoData);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCryptos = cryptos.filter((crypto) => {
    if (filter === 'positive') return crypto.change > 0;
    if (filter === 'negative') return crypto.change < 0;
    return true;
  }).filter((crypto) => crypto.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderCryptoCards = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className='bg-white/10 rounded-2xl overflow-hidden shadow-2xl mb-6 animate-pulse'>
          <Skeleton className='w-full h-[200px]' />
          <CardContent className='p-6'>
            <Skeleton className='w-full h-4 mb-2' />
            <Skeleton className='w-3/4 h-4' />
          </CardContent>
        </div>
      ));
    }

    if (filteredCryptos.length === 0) {
      return <div className='text-center text-gray-400 py-16'>No cryptocurrencies found</div>;
    }

    return filteredCryptos.map((crypto) => (
      <Card key={crypto.id} className='bg-white/10 rounded-2xl overflow-hidden shadow-2xl mb-6 group'>
        <CardHeader className='border-b border-white/10'>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Avatar className='bg-gradient-to-tr from-purple-600 to-gold-500 p-1 rounded-full'>
                <AvatarImage src={`https://robohash.org/${crypto.symbol}`} alt={`${crypto.symbol} Logo`} />
                <AvatarFallback>{crypto.symbol}</AvatarFallback>
              </Avatar>
              <span className='font-semibold'>{crypto.name}</span>
            </div>
            <Badge variant={crypto.change > 0 ? 'success' : 'destructive'} className='group-hover:bg-opacity-90'>
              {crypto.change.toFixed(2)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 flex items-center justify-between'>
          <div>
            <span className='text-2xl font-bold'>$ {crypto.price.toLocaleString()}</span>
            <Progress value={(crypto.price / 100000) * 100} className='mt-2' />
          </div>
          <Button onClick={() => router.push(`/crypto/${crypto.id}`)} className='bg-gradient-to-tr from-purple-600 to-gold-500 hover:bg-gradient-to-br'>
            View Details
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <main className='bg-background min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 pt-16 pb-8'>
      <header className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-bold'>Cryptocurrency Exchange</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='bg-gradient-to-tr from-purple-600 to-gold-500'>
                <Plus className='mr-2' /> Add New Coin
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-background p-8 rounded-2xl shadow-2xl max-w-md'>
              <h2 className='text-xl font-bold mb-4'>Add New Cryptocurrency</h2>
              <form className='space-y-4'>
                <div className='flex space-x-2'>
                  <Input placeholder='Symbol' className='grow' />
                  <Input placeholder='Name' className='grow' />
                </div>
                <Input placeholder='Price' type='number' className='w-full' />
                <Input placeholder='Change (%)' type='number' step='0.01' className='w-full' />
                <Button type='submit' className='bg-gradient-to-tr from-purple-600 to-gold-500'>Submit</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className='flex items-center space-x-4'>
          <Input
            placeholder='Search...'
            onChange={handleSearchChange}
            className='w-full sm:w-auto grow'
            icon={<Search size={18} />} />
          <Tabs defaultValue={filter} className='sm:min-w-[200px]'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='all' onClick={() => setFilter('all')}>
                All
              </TabsTrigger>
              <TabsTrigger value='positive' onClick={() => setFilter('positive')}>
                Positive
              </TabsTrigger>
              <TabsTrigger value='negative' onClick={() => setFilter('negative')}>
                Negative
              </TabsTrigger>
            </TabsList>
            <TabsContent value='all'></TabsContent>
            <TabsContent value='positive'></TabsContent>
            <TabsContent value='negative'></TabsContent>
          </Tabs>
        </div>
      </header>
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {renderCryptoCards()}
      </section>
      <footer className='mt-auto text-center mt-8'>
        <div className='text-sm text-muted-foreground'>© 2023 CryptoExchange. All rights reserved.</div>
      </footer>
    </main>
  );
}