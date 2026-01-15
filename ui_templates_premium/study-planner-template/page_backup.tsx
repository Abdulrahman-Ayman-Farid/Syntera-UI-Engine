'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tab, Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, UserCircle, FolderOpen, CalendarIcon, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

const mockTasks: Task[] = [
  { id: 1, title: 'Math Homework', subject: 'Mathematics', dueDate: '2023-12-15', completed: false },
  { id: 2, title: 'Science Project', subject: 'Biology', dueDate: '2023-12-20', completed: true },
  { id: 3, title: 'History Essay', subject: 'History', dueDate: '2023-12-10', completed: false }
];

const StudyPlannerPage = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskSubject, setNewTaskSubject] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('\'\'');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterSubject(value);
  };

  const addTask = () => {
    if (!newTaskTitle || !newTaskSubject || !newTaskDueDate) {
      alert('Please fill in all fields.');
      return;
    }
    const newTask: Task = {
      id: tasks.length + 1,
      title: newTaskTitle,
      subject: newTaskSubject,
      dueDate: newTaskDueDate,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
    setNewTaskTitle('\'\'');
    setNewTaskSubject('\'\'');
    setNewTaskDueDate('\'\'');
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const filteredAndSearchedTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSubject === 'All' || task.subject === filterSubject)
  );

  return (
    <div className='bg-black text-white min-h-screen flex flex-col'>
      <header className='bg-gradient-to-l from-cyan-900 via-blue-800 to-violet-700 py-6 px-8 flex justify-between items-center shadow-xl'>
        <h1 className='text-3xl font-bold'>Study Planner</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' onClick={() => router.refresh()} className='hover:scale-105 transition-transform duration-300'>
                <RefreshCw className='h-4 w-4' /> <span className='sr-only'>Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Refresh Tasks
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      <main className='flex-1 flex overflow-hidden'>
        <aside className='hidden sm:block w-64 bg-neutral-900 border-r border-r-neutral-800 shadow-hard pr-4 pl-6 pt-6 pb-8'>
          <h2 className='text-xl font-semibold mb-4'>Filters</h2>
          <div className='mb-4'>
            <label htmlFor='search' className='block text-sm font-medium mb-2'>Search</label>
            <Input
              id='search'
              placeholder='Find tasks...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
            />
          </div>
          <div>
            <label htmlFor='subject' className='block text-sm font-medium mb-2'>Subject</label>
            <Select value={filterSubject} onValueChange={handleFilterChange}>
              <SelectTrigger className='focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'>
                <SelectValue placeholder='Select subject...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All</SelectItem>
                <SelectItem value='Mathematics'>Mathematics</SelectItem>
                <SelectItem value='Biology'>Biology</SelectItem>
                <SelectItem value='History'>History</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>
        <section className='flex-1 p-8'>
          <div className='flex justify-between mb-4'>
            <h2 className='text-2xl font-bold'>Your Tasks</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='default'
                    onClick={() => setIsAddingTask(true)}
                    className='group flex gap-x-2 hover:scale-105 transition-transform duration-300'
                  >
                    <Plus className='h-4 w-4' /><span>Add Task</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Add New Task
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className='aspect-video rounded-lg' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSearchedTasks.length > 0 ? (
                  filteredAndSearchedTasks.map(task => (
                    <TableRow key={task.id} className='border-b border-b-neutral-800 last:border-none'>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.subject}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        {task.completed ? (
                          <Badge variant='success'>Completed</Badge>
                        ) : (
                          <Badge variant='secondary'>Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                onClick={() => toggleTaskCompletion(task.id)}
                                className='hover:bg-neutral-800 rounded-full p-2 transition-colors duration-300'
                              >
                                {task.completed ? (
                                  <XCircle className='h-4 w-4 text-red-500' aria-label='Mark as Incomplete' />
                                ) : (
                                  <CheckCircle className='h-4 w-4 text-green-500' aria-label='Mark as Complete' />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8'>No tasks found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </section>
        <aside className='hidden sm:block w-64 bg-neutral-900 border-l border-l-neutral-800 shadow-hard pl-4 pr-6 pt-6 pb-8'>
          <h2 className='text-xl font-semibold mb-4'>Statistics</h2>
          <Card className='mb-4'>
            <CardHeader className='pb-2'>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className='relative'>
              <div className='absolute inset-0 opacity-20 bg-radial-gradient/[length:38%_38%] from-transparent via-neutral-800 to-transparent'></div>
              <Progress value={(tasks.filter(task => task.completed).length / tasks.length) * 100} className='transform-gpu translate-y-1/2 animate-[spin_4s_linear_infinite]' />{
                /* Morphing Blob Shape */
              }</CardContent>
          </Card>
          <Card className='mb-4'>
            <CardHeader className='pb-2'>
              <CardTitle>Next Due Date</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-center'>
              <CalendarIcon className='h-12 w-12 text-neutral-400 mb-2' />
              <p className='text-lg font-semibold'>Dec 15, 2023</p>
              <p className='text-neutral-400'>Math Homework</p>
            </CardContent>
          </Card>
        </aside>
      </main>
      <footer className='bg-neutral-800 text-neutral-200 py-4 px-8 mt-auto'>
        <div className='container mx-auto flex justify-between items-center'>
          <p>&copy; 2023 Study Planner. All rights reserved.</p>
          <a href='#' className='hover:text-cyan-500 transition-colors duration-300'>Privacy Policy</a>
        </div>
      </footer>
      <Dialog.Root open={isAddingTask} onOpenChange={setIsAddingTask}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/80 backdrop-blur-sm' />
          <Dialog.Content className='fixed left-[50%] top-[50%] max-h-[85vh] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-900 p-6 shadow-hard animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-90'>
            <Dialog.Title className='text-lg font-semibold mb-4'>Add New Task</Dialog.Title>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <div>
                <label htmlFor='task-title' className='block text-sm font-medium mb-2'>Title</label>
                <Input
                  id='task-title'
                  placeholder='Enter task title...'
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className='focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                />
              </div>
              <div>
                <label htmlFor='task-subject' className='block text-sm font-medium mb-2'>Subject</label>
                <Select value={newTaskSubject} onValueChange={setNewTaskSubject}>
                  <SelectTrigger className='focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'>
                    <SelectValue placeholder='Select subject...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Mathematics'>Mathematics</SelectItem>
                    <SelectItem value='Biology'>Biology</SelectItem>
                    <SelectItem value='History'>History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor='task-due-date' className='block text-sm font-medium mb-2'>Due Date</label>
                <Input
                  id='task-due-date'
                  type='date'
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className='focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                />
              </div>
              <div className='flex justify-end space-x-2'>
                <Dialog.Close asChild>
                  <Button variant='outline'>Cancel</Button>
                </Dialog.Close>
                <Button onClick={addTask}>Add Task</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default StudyPlannerPage;