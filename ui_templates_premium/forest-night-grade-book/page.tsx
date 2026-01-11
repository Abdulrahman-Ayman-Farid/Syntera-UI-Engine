'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Search, Filter, ChevronRight, FileText, FolderPlus, User, Star, Loader2, AlertTriangle } from 'lucide-react'

interface Student {
  id: number
  name: string
  grade: string
}

const studentsData: Student[] = [
  { id: 1, name: 'John Doe', grade: 'A' },
  { id: 2, name: 'Jane Smith', grade: 'B+' },
  { id: 3, name: 'Alice Johnson', grade: 'A-' }
]

export default function GradeBookPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>(studentsData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(studentsData)
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false)
  const [newStudentName, setNewStudentName] = useState<string>('\'')
  const [newStudentGrade, setNewStudentGrade] = useState<string>('\'')
  const [isOpen, setIsOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)

  useEffect(() => {
    // Simulate data fetching delay
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setStudents(studentsData)
        setFilteredStudents(studentsData)
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students)
    } else {
      setFilteredStudents(
        students.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
  }, [searchTerm, students])

  const addStudent = () => {
    if (newStudentName && newStudentGrade) {
      const newStudent = {
        id: students.length + 1,
        name: newStudentName,
        grade: newStudentGrade
      }
      setStudents(prevStudents => [...prevStudents, newStudent])
      setFilteredStudents(prevStudents => [...prevStudents, newStudent])
      setNewStudentName('\'')
      setNewStudentGrade('\'')
      setIsAddingStudent(false)
    }
  }

  const handleDelete = (studentId: number) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId))
    setFilteredStudents(prevStudents => prevStudents.filter(student => student.id !== studentId))
  }

  const openModal = (student: Student) => {
    setCurrentStudent(student)
    setIsOpen(true)
  }

  return (
    <div className='bg-[#0F1A0F] text-white min-h-screen flex flex-col'>
      <header className='bg-gradient-to-br from-[#1B5E20] to-[#0F1A0F] p-6 shadow-sm'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Grade Book</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setIsAddingStudent(!isAddingStudent)} className='bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow-sm hover:bg-[#E0C200] transition-colors duration-300'>
                  <Plus size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent className='bg-black text-white p-2 rounded-lg'>Add New Student</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      <main className='p-6 flex-grow'>
        {isAddingStudent ? (
          <form onSubmit={(e) => e.preventDefault()} className='mb-4'>
            <div className='flex space-x-4'>
              <Input
                placeholder='Student Name'
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className='w-full'
              />
              <Input
                placeholder='Grade'
                value={newStudentGrade}
                onChange={(e) => setNewStudentGrade(e.target.value)}
                className='w-full'
              />
              <Button onClick={addStudent} variant='default' className='bg-[#FFD700] text-black hover:bg-[#E0C200]'>Add</Button>
            </div>
          </form>
        ) : null}
        <div className='relative w-full mb-4'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-slate-500 peer-focus:text-slate-900' />
          <Input
            placeholder='Search students...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 w-full rounded-lg shadow-sm'
          />
        </div>
        {isLoading ? (
          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className='h-12 rounded-lg' />
            ))}
          </div>
        ) : error ? (
          <div className='bg-red-500 text-white p-4 rounded-lg shadow-sm'>
            {error}
          </div>
        ) : filteredStudents.length > 0 ? (
          <Table className='border border-[#BDBD7A] rounded-lg overflow-hidden shadow-sm'>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className='hover:bg-[#1B5E20]/50 transition-colors duration-300'>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => openModal(student)} className='bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow-sm hover:bg-[#E0C200] transition-colors duration-300'>
                            <Star size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className='bg-black text-white p-2 rounded-lg'>Edit Grade</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <button onClick={() => handleDelete(student.id)} className='ml-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors duration-300'>
                      <AlertTriangle size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='text-center mt-8'>
            <FileText size={48} className='mx-auto mb-4 opacity-50' />
            <p>No students found.</p>
          </div>
        )}
      </main>
      <aside className='hidden sm:block w-64 p-6 bg-[#0F1A0F] shadow-sm border-l border-[#BDBD7A]'>
        <h2 className='text-xl font-semibold mb-4'>Filters</h2>
        <div className='mb-4'>
          <label htmlFor='grade-filter' className='block mb-2'>Grade</label>
          <Select>
            <SelectTrigger className='w-full rounded-lg shadow-sm'>
              <SelectValue placeholder='Select grade...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='a'>A</SelectItem>
              <SelectItem value='b+'>B+</SelectItem>
              <SelectItem value='a-'>A-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='mb-4'>
          <label htmlFor='name-filter' className='block mb-2'>Name</label>
          <Input
            placeholder='Filter by name...'
            className='w-full rounded-lg shadow-sm'
          />          
        </div>
      </aside>
      <footer className='bg-gradient-to-br from-[#1B5E20] to-[#0F1A0F] p-6 shadow-sm'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-300'>© 2023 Forest Night Education</span>
          <div className='space-x-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className='bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow-sm hover:bg-[#E0C200] transition-colors duration-300'>
                    <FolderPlus size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white p-2 rounded-lg'>Import Grades</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className='bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow-sm hover:bg-[#E0C200] transition-colors duration-300'>
                    <User size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white p-2 rounded-lg'>Manage Users</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </footer>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
          <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F1A0F] text-white rounded-lg shadow-sm w-full max-w-md p-6'>
            <Dialog.Title className='text-2xl font-bold mb-4'>Edit Grade</Dialog.Title>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <Input
                defaultValue={currentStudent?.name || ''}
                disabled
                className='w-full rounded-lg shadow-sm'
              />
              <Input
                defaultValue={currentStudent?.grade || ''}
                placeholder='Enter new grade'
                className='w-full rounded-lg shadow-sm'
              />
              <div className='flex justify-end'>
                <Dialog.Close asChild>
                  <Button variant='outline' className='mr-2'>Cancel</Button>
                </Dialog.Close>
                <Button variant='default' className='bg-[#FFD700] text-black hover:bg-[#E0C200]'>Save</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}