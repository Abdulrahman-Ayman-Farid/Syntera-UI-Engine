'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import { Plus, Search, Filter, ChevronRight, Trash, Edit, Heart, ShoppingBag, UserCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/product1.jpg' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/product2.jpg' },
  { id: 3, name: 'Product 3', price: 19.99, image: '/product3.jpg' },
];

export default function WishlistManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <div className='bg-gradient-to-l from-cyan-50 to-sky-50 min-h-screen text-gray-900'>
      <header className='py-6 px-8 bg-white shadow-xl'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Wishlist</h1>
          <button className='flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'>
            <Plus /> Add New
          </button>
        </div>
      </header>

      <main className='p-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div className='relative w-full max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500' />
            <Input placeholder='Search...' className='pl-10' />
          </div>
          <div className='space-x-4'>
            <Button variant='outline'>
              <Filter className='mr-2 h-4 w-4' /> Filters
            </Button>
            <Button variant='outline'>Sort by Price</Button>
          </div>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className='aspect-video rounded-lg' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {products.map((product) => (
              <Card key={product.id} className='bg-white shadow-xl transition-transform hover:scale-105 rounded-lg overflow-hidden relative'>
                <CardContent className='relative'>
                  <img src={product.image} alt={product.name} className='w-full aspect-video object-cover' />
                  <div className='absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity'></div>
                  <div className='absolute bottom-4 left-4 right-4 space-y-2'>
                    <h2 className='text-xl font-semibold'>{product.name}</h2>
                    <p className='text-lg'>$ {product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between items-center'>
                  <Button onClick={() => handleEdit(product)} variant='ghost'>
                    <Edit className='mr-2 h-4 w-4' /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(product.id)} variant='ghost' className='text-red-500'>
                    <Trash className='mr-2 h-4 w-4' /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <aside className='fixed bottom-0 left-0 w-full sm:w-64 p-4 bg-white shadow-xl'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>Quick Actions</h3>
          <ChevronRight className='transform rotate-90' /> {/* Placeholder for collapsible trigger */}
        </div>
        <ul className='mt-4 space-y-2'>
          <li>
            <Button variant='outline' className='w-full'>
              <Heart className='mr-2 h-4 w-4' /> Save Selection
            </Button>
          </li>
          <li>
            <Button variant='outline' className='w-full'>
              <ShoppingBag className='mr-2 h-4 w-4' /> Move to Cart
            </Button>
          </li>
          <li>
            <Button variant='outline' className='w-full'>
              <UserCircle className='mr-2 h-4 w-4' /> Share List
            </Button>
          </li>
        </ul>
      </aside>

      <footer className='bg-white shadow-xl py-6 px-8'>
        <div className='container mx-auto flex justify-center'>
          <p>&copy; 2023 Wishlist Manager. All rights reserved.</p>
        </div>
      </footer>

      {isEditing && currentProduct && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className='max-w-sm p-8 bg-white rounded-lg shadow-2xl'>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update details for {currentProduct.name}</DialogDescription>
            <form className='mt-4 space-y-4'>
              <Input placeholder='Name' defaultValue={currentProduct.name} />
              <Input placeholder='Price' defaultValue={currentProduct.price.toString()} />
              <Input placeholder='Image URL' defaultValue={currentProduct.image} />
              <Button type='submit'>Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}