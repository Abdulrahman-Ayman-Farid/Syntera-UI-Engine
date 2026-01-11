'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Slider } from '@radix-ui/react-slider'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Plus, Search, Filter, ChevronRight, GitBranch, FolderPlus, FileCode, FileText, Loader2, CheckCircle, XCircle, AlertTriangle, BarChart, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type Repo = {
  id: number
  name: string
  description: string
  branches: number
}

type User = {
  id: number
  name: string
  avatar: string
}

const mockRepos: Repo[] = [
  { id: 1, name: 'Project Alpha', description: 'The first project', branches: 3 },
  { id: 2, name: 'Beta Feature', description: 'Experimental feature branch', branches: 5 },
  { id: 3, name: 'Gamma Release', description: 'Stable release version', branches: 2 }
]

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' }
]

export default function CodeRepository() {
  const router = useRouter()
  const [repos, setRepos] = useState<Repo[]>(mockRepos)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState<string>('overview')
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
      if (Math.random() > 0.8) {
        setIsError(true)
      }
    }, 2000)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredRepos = repos.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className='bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-[#F5F5DC] via-[#8BC34A] to-[#CDDC39] min-h-screen text-gray-900'>
      <header className='sticky top-0 z-50 bg-white shadow-hard px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center'>
          <Button variant='ghost' aria-label='Toggle Navigation'>
            <ChevronRight className='w-6 h-6 transition-transform group-hover:-rotate-90 duration-300' />
          </Button>
          <span className='font-bold text-xl ml-4'>Code Repositories</span>
        </div>
        <div className='flex items-center space-x-4'>
          <Input
            placeholder='Search repositories...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='w-64 rounded-lg bg-gray-100 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'
          />
          <Button onClick={() => setIsDialogOpen(true)} className='rounded-lg bg-primary hover:bg-secondary text-white'>
            <Plus className='mr-2 w-4 h-4' /> New Repository
          </Button>
        </div>
      </header>
      <main className='p-6'>
        {isLoading ? (
          <div className='space-y-4'>
            {[1, 2, 3].map(n => (
              <Skeleton key={n} className='h-24 rounded-lg' />
            ))}
          </div>
        ) : isError ? (
          <div className='flex items-center justify-center p-8 rounded-lg bg-red-100 text-red-900'>
            <AlertTriangle className='w-6 h-6 mr-2' /> Failed to load repositories.
          </div>
        ) : (
          <div className='space-y-8'>
            <div className='flex items-center justify-between'>
              <Tabs defaultValue='overview' onValueChange={(value) => setSelectedTab(value)}>
                <TabsList className='grid grid-cols-3 w-full'>
                  <TabsTrigger value='overview' className='rounded-lg'>Overview</TabsTrigger>
                  <TabsTrigger value='branches' className='rounded-lg'>Branches</TabsTrigger>
                  <TabsTrigger value='commits' className='rounded-lg'>Commits</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className='flex items-center space-x-2'>
                <Button variant='ghost'>
                  <Info className='w-4 h-4' />
                </Button>
                <Button variant='default'>
                  <GitBranch className='w-4 h-4' /> Branches
                </Button>
              </div>
            </div>
            <div className='grid gap-8'>
              {filteredRepos.map(repo => (
                <Card key={repo.id} className='transition-transform transform hover:rotate-1 hover:scale-105 duration-300 rounded-2xl shadow-hard bg-white'>
                  <CardHeader>
                    <CardTitle>{repo.name}</CardTitle>
                    <CardDescription>{repo.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <FolderPlus className='w-4 h-4' /> {repo.branches} branches
                      </div>
                      <div className='flex items-center space-x-2'>
                        <FileCode className='w-4 h-4' /> Recent commit
                      </div>
                    </div>
                    <Progress value={75} className='rounded-full' /> {/* Example progress */}
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                    <Button variant='ghost'>View Details</Button>
                    <Button variant='secondary'>Edit</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className='bg-white p-6 mt-8 shadow-hard rounded-t-lg'>
        <div className='flex justify-center'>
          <span className='text-sm text-gray-600'>© 2023 Nature Inspired Code Repositories</span>
        </div>
      </footer>
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
          <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-lg bg-white shadow-hard backdrop-blur-sm'>
            <Dialog.Title className='text-xl font-bold mb-4'>Create New Repository</Dialog.Title>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <Input placeholder='Repository Name' className='w-full rounded-lg bg-gray-100 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent' />
              <Textarea placeholder='Description' className='w-full rounded-lg bg-gray-100 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent' />
              <div className='flex justify-end'>
                <Dialog.Close asChild>
                  <Button variant='secondary' className='mr-2'>Cancel</Button>
                </Dialog.Close>
                <Button type='submit'>Create</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}