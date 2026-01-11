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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Product A', image: '/images/product-a.jpg', price: 29.99, rating: 4.5, reviews: 120 },
  { id: 2, name: 'Product B', image: '/images/product-b.jpg', price: 39.99, rating: 4.7, reviews: 180 },
  { id: 3, name: 'Product C', image: '/images/product-c.jpg', price: 49.99, rating: 4.6, reviews: 220 }
];

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-background min-h-screen flex flex-col'>
      <header className='p-4 bg-primary text-white shadow-lg'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <ArrowLeft size={24} className='cursor-pointer hover:text-accent' onClick={() => router.back()} aria-label='Go Back' />
            <h1 className='font-bold text-2xl'>Product Comparison</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={handleSearch}
              className='border-none outline-none focus:outline-none focus:ring-0 focus:border-none'
            />
            <Filter size={20} className='drop-shadow-lg' aria-label='Filter Products' />
          </div>
        </nav>
      </header>
      <main className='flex-1 p-4'>
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='specs'>Specs</TabsTrigger>
            <TabsTrigger value='reviews'>Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            <div className='mt-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    {filteredProducts.map((product) => (
                      <TableHead key={product.id}>{product.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className='font-medium'>Price</TableCell>
                    {filteredProducts.map((product) => (
                      <TableCell key={product.id}>${product.price.toFixed(2)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium'>Rating</TableCell>
                    {filteredProducts.map((product) => (
                      <TableCell key={product.id}>
                        <div className='flex items-center space-x-2'>
                          <StarIcon size={16} /> {product.rating}/5 ({product.reviews} reviews)
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* Additional rows can be added here */}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value='specs'>
            <div className='mt-4'>
              <h2 className='mb-4 font-bold'>Specifications</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    {filteredProducts.map((product) => (
                      <TableHead key={product.id}>{product.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className='font-medium'>Material</TableCell>
                    {filteredProducts.map((product) => (
                      <TableCell key={product.id}>Polyester</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium'>Weight</TableCell>
                    {filteredProducts.map((product) => (
                      <TableCell key={product.id}>200g</TableCell>
                    ))}
                  </TableRow>
                  {/* Additional rows can be added here */}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value='reviews'>
            <div className='mt-4'>
              <h2 className='mb-4 font-bold'>Customer Reviews</h2>
              {filteredProducts.map((product) => (
                <Card key={product.id} className='bg-background mb-4 p-4'>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {[...Array(product.reviews)].map((_, index) => (
                        <div key={index} className='flex items-center space-x-2'>
                          <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${index}`} alt='User avatar' />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className='flex-grow'>
                            <p className='text-sm'>Great product!</p>
                            <span className='text-xs text-muted-foreground'>By User {index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='p-4 bg-secondary text-white shadow-lg'>
        <nav className='flex items-center justify-center'>
          <ChevronLeft size={24} className='cursor-pointer hover:text-accent mr-2' aria-label='Previous Page' />
          <span className='mr-2'>Page 1 of 5</span>
          <ChevronRight size={24} className='cursor-pointer hover:text-accent ml-2' aria-label='Next Page' />
        </nav>
      </footer>
    </div>
  );
}

const StarIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#FFD700' width='16' height='16' className='inline-block'>
    <path d='M12 .587l3.668 7.242 8.416 1.254-6.094 5.87 1.425 7.91L12 18.38l-6.502 3.91 1.425-7.91-6.094-5.87 8.416-1.254z' />
  </svg>
);