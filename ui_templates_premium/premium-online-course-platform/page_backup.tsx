'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { MenuIcon, Plus, Search, Filter, ChevronRight, Info, UserCircle2 } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  progress: number;
}

const mockCourses: Course[] = [
  { id: 1, title: 'Introduction to AI', description: 'Learn the basics of Artificial Intelligence.', instructor: 'Dr. Jane Doe', progress: 75 },
  { id: 2, title: 'Full Stack Development', description: 'Build full stack web applications.', instructor: 'John Smith', progress: 50 },
  { id: 3, title: 'Data Science Essentials', description: 'Explore the fundamentals of Data Science.', instructor: 'Alice Johnson', progress: 25 }
];

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterInstructor, setFilterInstructor] = useState<string>('\'all\'');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      try {
        setCourses(mockCourses);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
    }, 1500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterInstructor(event.target.value);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterInstructor === '\'all\'' || course.instructor.toLowerCase().includes(filterInstructor.toLowerCase()))
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOrder === 'asc') return a.progress - b.progress;
    return b.progress - a.progress;
  });

  const paginatedCourses = sortedCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='bg-white text-gray-900 min-h-screen flex flex-col'>
      <header className='bg-gradient-to-b from-blue-50 to-white shadow-2xl px-6 py-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <button className='md:hidden'>
              <MenuIcon className='w-6 h-6 text-gray-800' />n            </button>
            <h1 className='text-2xl font-bold'>Course Dashboard</h1>
          </div>
          <div className='flex items-center gap-4'>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='w-6 h-6 text-gray-600 cursor-pointer' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get information about your courses here.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Avatar className='cursor-pointer'>
              <AvatarImage src='/avatars/01.png' alt='@vercel' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <aside className='hidden md:block w-64 border-r border-gray-200 p-6'>
        <Accordion type='single' collapsible className='space-y-1'>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='font-semibold'>Filters</AccordionTrigger>
            <AccordionContent>
              <div className='mt-2'>
                <label htmlFor='instructors' className='block text-sm font-medium leading-6 text-gray-900'>Instructors</label>
                <Select onValueChange={handleFilterChange} defaultValue='all'>
                  <SelectTrigger className='w-full mt-2'>
                    <SelectValue placeholder='All Instructors' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Instructors</SelectItem>
                    <SelectItem value='dr-jane-doe'>Dr. Jane Doe</SelectItem>
                    <SelectItem value='john-smith'>John Smith</SelectItem>
                    <SelectItem value='alice-johnson'>Alice Johnson</SelectItem>
                  </SelectContent>
                </Select>
                <label htmlFor='sort-order' className='block text-sm font-medium leading-6 text-gray-900 mt-4'>Sort Order</label>
                <div className='flex space-x-2 mt-2'>
                  <Button variant='outline' onClick={() => handleSortChange('asc')} size='sm'>ASC</Button>
                  <Button variant='outline' onClick={() => handleSortChange('desc')} size='sm'>DESC</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </aside>
      <main className='flex-grow p-6 relative'>
        <div className='mb-6'>
          <Input
            type='text'
            placeholder='Search Courses...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>
        <Tabs defaultValue='overview' className='max-w-2xl mx-auto w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='enrolled-courses'>Enrolled Courses</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            <Card className='border-t border-l border-blue-100 rounded-lg overflow-hidden'>
              <CardContent className='p-6'>
                <h2 className='text-xl font-semibold'>Welcome Back!</h2>
                <p className='mt-2 text-gray-600'>Here is an overview of your enrolled courses and recent activity.</p>
                <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Card className='bg-gradient-to-b from-blue-50 via-blue-100 to-white rounded-lg shadow-lg p-4'>
                    <CardHeader>
                      <CardTitle>Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent className='flex justify-between'>
                      <h3 className='text-3xl font-bold'>{mockCourses.length}</h3>
                      <UserCircle2 className='w-12 h-12 text-blue-500' />
                    </CardContent>
                  </Card>
                  <Card className='bg-gradient-to-b from-green-50 via-green-100 to-white rounded-lg shadow-lg p-4'>
                    <CardHeader>
                      <CardTitle>Completed Courses</CardTitle>
                    </CardHeader>
                    <CardContent className='flex justify-between'>
                      <h3 className='text-3xl font-bold'>{mockCourses.filter(course => course.progress === 100).length}</h3>
                      <CheckCircle className='w-12 h-12 text-green-500' />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='enrolled-courses'>
            <div className='overflow-x-auto'>
              {isLoading ? (
                <Skeleton className='h-48 rounded-lg' />
              ) : isError ? (
                <p className='text-red-500'>Failed to load courses.</p>
              ) : paginatedCourses.length === 0 ? (
                <p className='text-gray-500'>No courses found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCourses.map(course => (
                      <TableRow key={course.id} className='hover:bg-gray-50 transition-colors duration-300'>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>
                          <Progress value={course.progress} className='w-full h-2' />
                        </TableCell>
                        <TableCell>
                          <Button variant='link'>View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className='flex justify-between items-center mt-4'>
              <Button variant='outline' disabled={currentPage === 1} onClick={handlePreviousPage}>
                Previous
              </Button>
              <span className='text-gray-500'>
                Page {currentPage} of {totalPages}
              </span>
              <Button variant='outline' disabled={currentPage === totalPages} onClick={handleNextPage}>
                Next
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-gray-50 text-gray-600 px-6 py-4'>
        <div className='text-center'>
          &copy; 2023 Premium Online Course Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}