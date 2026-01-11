'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, Heart, Share2, MessageCircle, User, Users } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
}

const mockPosts: Post[] = [
  { id: 1, author: 'John Doe', content: 'This is the first post.', likes: 25, comments: 10, shares: 5 },
  { id: 2, author: 'Jane Smith', content: 'Another great post!', likes: 40, comments: 15, shares: 8 },
  { id: 3, author: 'Alice Johnson', content: 'Check out my latest project.', likes: 30, comments: 5, shares: 3 }
];

const SocialMediaFeedPage = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts);
      return;
    }
    setFilteredPosts(
      posts.filter(post =>
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, posts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='bg-background text-text min-h-screen flex flex-col'>
      <header className='bg-primary text-accent px-6 py-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Social Media Feed</h1>
          <button onClick={handleToggleSidebar} className='md:hidden'>
            <Users size={24} />
          </button>
        </div>
      </header>
      <main className='flex-1 flex overflow-hidden'>
        <aside
          className={`w-64 hidden md:block bg-secondary text-text fixed h-screen shadow-lg transition-transform duration-300 ${
isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
}}`
        >
          <div className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Filters</h2>
            <form>
              <div className='mb-4'>
                <label htmlFor='search' className='block text-sm font-medium mb-1'>
                  Search
                </label>
                <Input
                  id='search'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='w-full'
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='sort' className='block text-sm font-medium mb-1'>
                  Sort By
                </label>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Date' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='date'>Date</SelectItem>
                    <SelectItem value='likes'>Likes</SelectItem>
                    <SelectItem value='comments'>Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant='default' className='w-full'>Apply Filters</Button>
            </form>
          </div>
        </aside>
        <div className='flex-1 p-6 overflow-y-auto relative'>
          <div className='absolute inset-0 bg-gradient-to-bl from-primary via-secondary to-accent opacity-10 z-[-1]' />{
            isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className='text-center mt-10'>
                <h2 className='text-xl font-semibold'>No posts found.</h2>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className='bg-accent text-text shadow-lg mb-6 rounded-xl'>
                  <CardHeader className='border-b border-t border-l border-burgundy'>
                    <div className='flex space-x-4'>
                      <Avatar>
                        <AvatarImage src='https://via.placeholder.com/40' alt={`${post.author}'s avatar`} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{post.author}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='py-4'>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className='flex justify-between items-center'>
                    <div className='flex space-x-4'>
                      <button aria-label='Like post'>
                        <Heart size={20} />
                      </button>
                      <span>{post.likes}</span>
                    </div>
                    <div className='flex space-x-4'>
                      <button aria-label='Comment on post'>
                        <MessageCircle size={20} />
                      </button>
                      <span>{post.comments}</span>
                    </div>
                    <div className='flex space-x-4'>
                      <button aria-label='Share post'>
                        <Share2 size={20} />
                      </button>
                      <span>{post.shares}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
        </div>
      </main>
      <footer className='bg-primary text-accent px-6 py-4'>
        <div className='flex justify-center'>
          <p>&copy; 2023 Social Media Feed</p>
        </div>
      </footer>
    </div>
  );
};

export default SocialMediaFeedPage;