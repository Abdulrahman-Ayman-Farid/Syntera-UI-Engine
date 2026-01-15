'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Pencil, Plus, Search, X } from 'lucide-react'

interface Student {
  id: number
  name: string
  score: number
}

const studentsMockData: Student[] = [
  { id: 1, name: 'Alice Johnson', score: 88 },
  { id: 2, name: 'Bob Smith', score: 92 },
  { id: 3, name: 'Charlie Brown', score: 76 },
  { id: 4, name: 'David Wilson', score: 85 }
]

export default function GradeBookPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [newScore, setNewScore] = useState<number>(0)
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setStudents(studentsMockData)
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleEditClick = (studentId: number, studentScore: number) => {
    setIsEditing(true)
    setEditingStudentId(studentId)
    setNewScore(studentScore)
  }

  const handleSaveClick = () => {
    if (editingStudentId !== null) {
      const updatedStudents = students.map((student) =>
        student.id === editingStudentId ? { ...student, score: newScore } : student
      )
      setStudents(updatedStudents)
      setIsEditing(false)
      setEditingStudentId(null)
    }
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    setEditingStudentId(null)
  }

  return (
    <div className='bg-[#121212] text-[#E0E0E0] min-h-screen'>
      <header className='p-6 flex justify-between items-center bg-gradient-to-r from-[#2D0C57] to-[#00BFFF] shadow-inner shadow-black'>
        <div>
          <h1 className='text-4xl font-bold'>Grade Book</h1>
          <p className='mt-2 text-lg'>Manage your class grades efficiently.</p>
        </div>
        <Button variant='outline' onClick={() => router.back()} aria-label='Back to Dashboard'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>
      </header>
      <div className='relative h-[300px] bg-cover bg-center' style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}>
        <div className='absolute inset-0 bg-gradient-to-r from-[#2D0C57]/70 via-[#00BFFF]/70 to-[#2D0C57]/70 flex items-center justify-center'>
          <h2 className='text-white text-4xl font-extrabold'>Welcome to the Grade Book</h2>
        </div>
      </div>
      <main className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-4'>
            <Input
              placeholder='Search...'
              className='w-full max-w-sm'
              icon={<Search className='ml-2 h-4 w-4 text-muted-foreground' />}
            />
            <Select>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='above-90'>Above 90</SelectItem>
                <SelectItem value='below-70'>Below 70</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant='default' onClick={() => {}} aria-label='Add New Student'>
            <Plus className='mr-2 h-4 w-4' /> Add Student
          </Button>
        </div>
        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className='aspect-video rounded-xl' />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className='transition-transform hover:scale-105 duration-300 cursor-pointer'>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {isEditing && editingStudentId === student.id ? (
                      <Input
                        type='number'
                        value={newScore}
                        onChange={(e) => setNewScore(Number(e.target.value))}
                        className='w-24'
                      />
                    ) : (
                      <span>{student.score}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing && editingStudentId === student.id ? (
                      <div className='flex gap-2'>
                        <Button size='icon' variant='success' onClick={handleSaveClick} aria-label='Save Changes'>
                          <CheckCircle className='h-4 w-4' />
                        </Button>
                        <Button size='icon' variant='destructive' onClick={handleCancelClick} aria-label='Cancel Edit'>
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <Button size='icon' variant='secondary' onClick={() => handleEditClick(student.id, student.score)} aria-label='Edit Score'>
                        <Pencil className='h-4 w-4' />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
      <aside className='hidden sm:block w-64 p-6 bg-[#121212] shadow-inner shadow-black sticky top-24 rounded-lg'>
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span>Average Score:</span>
              <span className='font-semibold'>{students.length > 0 ? students.reduce((acc, curr) => acc + curr.score, 0) / students.length.toFixed(2) : '-'}</span>
            </div>
            <Progress value={students.length > 0 ? (students.reduce((acc, curr) => acc + curr.score, 0) / students.length) : 0} className='h-4' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {students.slice(0, 3).map((student) => (
              <div key={student.id} className='flex items-center gap-2'>
                <Avatar className='border border-[#2D0C57]'>
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${student.id}`} alt={student.name} />
                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium'>{student.name}</p>
                  <p className='text-xs text-muted-foreground'>Scored {student.score}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
      <footer className='p-6 bg-gradient-to-r from-[#2D0C57] to-[#00BFFF] shadow-inner shadow-black text-white'>
        <div className='flex justify-between items-center'>
          <div>
            <p>&copy; 2023 Education Corp. All rights reserved.</p>
          </div>
          <div>
            <a href='#' className='text-white hover:underline'>Privacy Policy</a>
            <span className='mx-2'>|</span>
            <a href='#' className='text-white hover:underline'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}