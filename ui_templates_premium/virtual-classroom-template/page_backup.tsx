'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { ProgressBar } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@radix-ui/react-switch';
import { Slider } from '@radix-ui/react-slider';
import { Plus, Search, Filter, ChevronRight, ClockIcon, UserCircle2 } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  time: string;
  completed: boolean;
}

const coursesMockData: Course[] = [
  { id: 1, title: 'Introduction to Programming', instructor: 'John Doe', time: '10:00 AM', completed: true },
  { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', time: '12:00 PM', completed: false },
  { id: 3, title: 'React Fundamentals', instructor: 'Alice Johnson', time: '2:00 PM', completed: true },
];

const VirtualClassroomPage = () => {
  const [courses, setCourses] = useState<Course[]>(coursesMockData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(coursesMockData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching delay
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setCourses(coursesMockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCourses(courses);
      return;
    }
    setFilteredCourses(
      courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, courses]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/classroom/${courseId}`);
  };

  const renderCourseCard = (course: Course) => (
    <div className='group relative rounded-2xl overflow-hidden shadow-xl shadow-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/75 transition-transform duration-300 transform hover:scale-105'>
      <Card className='bg-gradient-to-tl from-pink-500 via-orange-500 to-yellow-500 text-white'>
        <CardHeader className='pb-2'>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent className='pt-2'>
          <div className='flex items-center justify-between'>
            <p>Instructor: {course.instructor}</p>
            <p>Time: {course.time}</p>
          </div>
          <ProgressBar value={course.completed ? 100 : 50} className='mt-4' />
        </CardContent>
        <div className='absolute bottom-2 right-2'>
          <Button variant='ghost' onClick={() => handleCourseClick(course.id)} aria-label={`Go to ${course.title}`} className='hover:bg-pink-600/20'>
            <ChevronRight className='w-4 h-4' /> Details
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className='relative min-h-screen bg-gradient-to-tl from-pink-500 via-orange-500 to-yellow-500 text-black'>
      <header className='sticky top-0 z-50 bg-white/30 backdrop-blur-md shadow-xl shadow-pink-500/50 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <UserCircle2 className='w-10 h-10 text-pink-500' />
          <h1 className='font-bold text-2xl'>Virtual Classroom</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Input
            type='text'
            placeholder='Search courses...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='border-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md'
          />
          <Search className='absolute left-4 w-5 h-5 text-gray-500 pointer-events-none' />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='default'>Filters <ChevronRight className='ml-2 w-4 h-4' /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem className='cursor-pointer'>Upcoming</DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className='relative pt-24 pb-12 px-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {isLoading && Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className='aspect-video rounded-2xl bg-white/10 backdrop-blur-md' />
          ))}
          {!isLoading && !isError && filteredCourses.length > 0 ? (
            filteredCourses.map(renderCourseCard)
          ) : (
            <div className='col-span-full text-center'>
              {isError ? (
                <p className='text-red-500'>Failed to load courses. Please try again later.</p>
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <aside className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
        <Button variant='default' className='bg-gradient-to-tl from-pink-500 via-orange-500 to-yellow-500 text-white hover:bg-pink-600/80'>
          <Plus className='mr-2 w-4 h-4' /> New Course
        </Button>
      </aside>
      <footer className='sticky bottom-0 z-50 bg-white/30 backdrop-blur-md shadow-xl shadow-pink-500/50 px-6 py-4 flex items-center justify-center'>
        <p>&copy; 2023 Virtual Classroom Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VirtualClassroomPage;