'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Plus, Search, Filter, FolderPlus, FileText, Loader2, XCircle } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  author: string;
  duration: string;
  progress: number;
}

const mockCourses: Course[] = [
  { id: 1, title: 'Introduction to Programming', author: 'John Doe', duration: '1 hour', progress: 75 },
  { id: 2, title: 'Advanced JavaScript', author: 'Jane Smith', duration: '2 hours', progress: 50 },
  { id: 3, title: 'Data Structures', author: 'Alice Johnson', duration: '1.5 hours', progress: 25 },
];

const EducationContentLibrary = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNewCourse = () => {
    // Logic to add new course
    setIsAddingCourse(true);
  };

  const cancelAddCourse = () => {
    setIsAddingCourse(false);
  };

  return (
    <div className='bg-gradient-to-tr from-[#E0F7FA] to-[#B2EBF2] min-h-screen text-black'>
      <header className='p-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Educational Content Library</h1>
        <div className='flex space-x-4'>
          <Input
            placeholder='Search courses...'
            onChange={handleSearchChange}
            value={searchTerm}
            className='border-t border-l rounded-xl shadow-md'
          />
          <Button onClick={addNewCourse} className='bg-accent hover:bg-accent-focus'>
            <Plus className='mr-2' /> Add New Course
          </Button>
        </div>
      </header>
      <main className='p-6'>
        <Tabs defaultValue='all-courses' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='all-courses'>All Courses</TabsTrigger>
            <TabsTrigger value='my-courses'>My Courses</TabsTrigger>
          </TabsList>
          <Separator className='mt-4' />
          <TabsContent value='all-courses'>
            {isLoading ? (
              <div className='space-y-4 mt-4'>
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className='h-16 rounded-xl' />
                ))}
              </div>
            ) : error ? (
              <div className='flex items-center space-x-2 text-red-500 mt-4'>
                <XCircle className='h-5 w-5' /> <span>{error}</span>
              </div>
            ) : (
              <div className='mt-4'>
                {filteredCourses.length > 0 ? (
                  <Table className='shadow-md'>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id} className='group cursor-pointer hover:bg-gray-50'>
                          <TableCell className='font-medium'>{course.title}</TableCell>
                          <TableCell>{course.author}</TableCell>
                          <TableCell>{course.duration}</TableCell>
                          <TableCell>
                            <Progress value={course.progress} className='transition-transform duration-300 group-hover:scale-105' />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className='flex items-center justify-center mt-4'>
                    <FileText className='h-6 w-6 mr-2' /> No courses found.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value='my-courses'>
            <div className='mt-4'>
              <Table className='shadow-md'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCourses.map((course) => (
                    <TableRow key={course.id} className='group cursor-pointer hover:bg-gray-50'>
                      <TableCell className='font-medium'>{course.title}</TableCell>
                      <TableCell>{course.author}</TableCell>
                      <TableCell>{course.duration}</TableCell>
                      <TableCell>
                        <Progress value={course.progress} className='transition-transform duration-300 group-hover:scale-105' />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-white p-6 text-center'>
        © 2023 Educational Content Library. All rights reserved.
      </footer>
      {isAddingCourse && (
        <Dialog.Root open={isAddingCourse} onOpenChange={setIsAddingCourse}>
          <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm' />
            <Dialog.Content className='fixed left-1/2 top-1/2 max-h-90 overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-2xl focus:outline-none animate-fade-in'>
              <Dialog.Title className='text-xl font-semibold mb-4'>Add New Course</Dialog.Title>
              <form className='space-y-4'>
                <div>
                  <label htmlFor='title' className='block text-sm font-medium'>
                    Title
                  </label>
                  <Input id='title' placeholder='Course Title' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div>
                  <label htmlFor='author' className='block text-sm font-medium'>
                    Author
                  </label>
                  <Input id='author' placeholder='Author Name' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div>
                  <label htmlFor='duration' className='block text-sm font-medium'>
                    Duration
                  </label>
                  <Input id='duration' placeholder='1 hour' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div>
                  <label htmlFor='progress' className='block text-sm font-medium'>
                    Progress
                  </label>
                  <Input id='progress' type='number' placeholder='75' className='mt-1 rounded-xl shadow-md' />
                </div>
                <div className='flex justify-end space-x-4'>
                  <Button variant='outline' onClick={cancelAddCourse}>
                    Cancel
                  </Button>
                  <Button type='submit' className='bg-accent hover:bg-accent-focus'>
                    Save
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};

export default EducationContentLibrary;