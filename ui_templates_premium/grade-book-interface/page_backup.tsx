'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  score: number;
}

const mockStudents: Student[] = [
  { id: 1, name: 'John Doe', score: 85 },
  { id: 2, name: 'Jane Smith', score: 92 },
  { id: 3, name: 'Alice Johnson', score: 78 },
  { id: 4, name: 'Bob Brown', score: 90 },
];

export default function GradeBookPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='bg-white text-gray-900 min-h-screen relative'>
      {/* Background Overlay */}
      <div className='absolute inset-0 bg-gradient-to-tl from-pink-50 via-white to-pink-50 opacity-20'></div>
      {/* Header */}
      <header className='relative z-10 bg-white px-6 py-4 shadow-lg flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Grade Book</h1>
        <div className='flex space-x-4'>
          <Input
            placeholder='Search students...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-64'
          />
          <Button onClick={handleAddStudent} aria-label='Add Student'>
            <Plus className='mr-2 w-4 h-4' /> Add Student
          </Button>
        </div>
      </header>
      {/* Sidebar */}
      <aside className='fixed sm:relative sm:w-64 bg-white shadow-lg transform translate-x-0 sm:translate-x-0 duration-300 ease-in-out'>
        <nav className='p-6'>
          <ul className='space-y-2'>
            <li>
              <Button variant='ghost' className='justify-start w-full text-left pl-4 pr-6'>
                <span className='font-semibold'>Dashboard</span>
              </Button>
            </li>
            <li>
              <Button variant='ghost' className='justify-start w-full text-left pl-4 pr-6'>
                <span>Grades</span>
              </Button>
            </li>
            <li>
              <Button variant='ghost' className='justify-start w-full text-left pl-4 pr-6'>
                <span>Reports</span>
              </Button>
            </li>
            <li>
              <Button variant='ghost' className='justify-start w-full text-left pl-4 pr-6'>
                <span>Settings</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className='ml-0 sm:ml-64 p-6 pt-24 relative z-10'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold'>Class Grades Overview</h2>
          <p className='mt-2 text-gray-600'>Manage and track your class grades efficiently.</p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
          <Card className='shadow-lg bg-gradient-to-tl from-pink-50 via-white to-pink-50 p-6 rounded-2xl overflow-hidden relative animate-slide-up'>
            <CardContent className='relative'>
              <div className='absolute top-0 right-0 mt-2 mr-2'>
                <Badge variant='default'>Average</Badge>
              </div>
              <div className='text-5xl font-extrabold'>$86.5</div>
              <p className='mt-2 text-gray-600'>Overall Average Score</p>
              <Progress value={86.5} className='mt-4' />
            </CardContent>
          </Card>
          <Card className='shadow-lg bg-gradient-to-tl from-pink-50 via-white to-pink-50 p-6 rounded-2xl overflow-hidden relative animate-slide-up'>
            <CardContent className='relative'>
              <div className='absolute top-0 right-0 mt-2 mr-2'>
                <Badge variant='success'>High</Badge>
              </div>
              <div className='text-5xl font-extrabold'>$92.0</div>
              <p className='mt-2 text-gray-600'>Highest Score</p>
              <Progress value={92} className='mt-4' />
            </CardContent>
          </Card>
        </div>
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden relative animate-slide-up'>
          <Table className='border-none'>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='p-6'>Name</TableHead>
                <TableHead className='p-6'>Score</TableHead>
                <TableHead className='p-6'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className='animate-pulse'>
                    <TableCell className='p-6'><Skeleton className='h-4 w-full' /></TableCell>
                    <TableCell className='p-6'><Skeleton className='h-4 w-full' /></TableCell>
                    <TableCell className='p-6'><Skeleton className='h-4 w-full' /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className='hover:bg-gray-50 transition-colors duration-300'>
                    <TableCell className='p-6 flex items-center gap-2'>
                      <Avatar className='bg-pink-50'>
                        <AvatarImage src={`https://via.placeholder.com/32?text=${student.name.charAt(0).toUpperCase()}`} alt={`${student.name}'s avatar`} />
                        <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {student.name}
                    </TableCell>
                    <TableCell className='p-6'>{student.score}</TableCell>
                    <TableCell className='p-6'>
                      <Button variant='outline' size='icon' onClick={() => handleEditStudent(student)} aria-label={`Edit ${student.name}`}> <Filter className='w-4 h-4' /> </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className='p-6 flex justify-between items-center'>
            <div className='flex items-center'>
              <Button variant='outline' size='icon' disabled aria-label='Previous Page'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
              <p className='mx-2'>Page 1 of 5</p>
              <Button variant='outline' size='icon' aria-label='Next Page'>
                <ArrowRight className='w-4 h-4' />
              </Button>
            </div>
            <div className='flex items-center'>
              <p className='mr-2'>Rows per page:</p>
              <Select defaultValue='10' onValueChange={(value) => console.log(value)}> <SelectTrigger className='w-24'> <SelectValue placeholder='Rows per page...' /> </SelectTrigger> <SelectContent> <SelectItem value='10'>10</SelectItem> <SelectItem value='20'>20</SelectItem> <SelectItem value='50'>50</SelectItem> </SelectContent> </Select>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className='fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg flex justify-between items-center'>
        <p>&copy; 2023 Educational Systems Inc.</p>
        <div className='flex space-x-4'>
          <Button variant='link' onClick={() => router.push('/about')} aria-label='About Us'>About Us</Button>
          <Button variant='link' onClick={() => router.push('/contact')} aria-label='Contact Us'>Contact Us</Button>
        </div>
      </footer>
      {/* Dialog for Adding/Editing Students */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black bg-opacity-50 fixed inset-0 z-40' />
          <Dialog.Content className='bg-white rounded-2xl max-w-md mx-auto my-20 p-6 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl animate-slide-up'>
            <Dialog.Title className='text-xl font-bold mb-4'> {selectedStudent ? 'Edit Student' : 'Add New Student'} </Dialog.Title>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <div className='space-y-1'>
                <label htmlFor='name' className='text-sm font-medium'>Name</label>
                <Input id='name' defaultValue={selectedStudent?.name || ''} required className='focus:ring-pink-500' /> <small className='text-red-500 hidden'>This field is required.</small>
              </div>
              <div className='space-y-1'>
                <label htmlFor='score' className='text-sm font-medium'>Score</label>
                <Input id='score' type='number' defaultValue={selectedStudent?.score.toString() || ''} required className='focus:ring-pink-500' /> <small className='text-red-500 hidden'>This field is required.</small>
              </div>
              <div className='flex justify-end space-x-4'>
                <Button variant='outline' onClick={handleCloseDialog} aria-label='Cancel'> Cancel </Button>
                <Button type='submit' className='bg-pink-500 hover:bg-pink-600 text-white'> Save </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}