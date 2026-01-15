'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Plus, Search, Filter, ChevronRight, Bell, X } from 'lucide-react'

const mockData = [
  { id: 1, title: 'Fix login issue', status: 'open', priority: 'high', assignee: 'John Doe' },
  { id: 2, title: 'Update API endpoint', status: 'closed', priority: 'medium', assignee: 'Jane Smith' },
  { id: 3, title: 'Optimize database queries', status: 'in-progress', priority: 'low', assignee: 'Alice Johnson' }
]

export default function BugTrackingTool() {
  const router = useRouter()
  const [bugs, setBugs] = useState(mockData)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  const handleSearch = () => {
    if (!searchQuery) return setBugs(mockData)
    setBugs(mockData.filter(bug => bug.title.toLowerCase().includes(searchQuery.toLowerCase())))
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
    if (value === 'all') {
      setBugs(mockData)
    } else {
      setBugs(mockData.filter(bug => bug.status === value))
    }
  }

  return (
    <div className='bg-background text-white min-h-screen flex flex-col relative'>
      {/* Header */}
      <header className='bg-primary py-6 px-8 shadow-xl shadow-secondary/50 z-10 sticky top-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button onClick={() => setShowSidebar(!showSidebar)} className='md:hidden'>
              <ChevronRight size={24} />
            </button>
            <h1 className='text-3xl font-bold'>Bug Tracker</h1>
          </div>
          <div className='flex items-center gap-4'>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Bell size={24} className='cursor-pointer hover:text-accent' />
                </TooltipTrigger>
                <TooltipContent className='bg-background text-text'>
                  Notifications
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Avatar className='border-2 border-accent/50'>
              <AvatarImage src='/avatars/01.png' alt='@vercel' />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 flex overflow-hidden'>
        {/* Sidebar */}
        <aside className={`w-64 bg-secondary/50 backdrop-blur-sm transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative top-0 bottom-0 left-0 z-20`}>\n          <div className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Filters</h2>
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select defaultValue={filter} onValueChange={handleFilterChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='All statuses...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='open'>Open</SelectItem>
                  <SelectItem value='in-progress'>In Progress</SelectItem>
                  <SelectItem value='closed'>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className='flex-1 p-8 overflow-auto'>
          <div className='mb-6'>
            <div className='relative'>
              <Input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Search bugs...'
                className='pl-10 w-full'
              />
              <Search className='absolute top-3 left-3 text-muted-foreground' />
            </div>
            <Button variant='outline' className='mt-2' onClick={handleSearch}>
              Search
            </Button>
          </div>

          <div className='overflow-x-auto'>
            {loading ? (
              <div className='grid grid-cols-1 gap-4'>
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className='h-[150px]' />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bugs.map(bug => (
                    <TableRow key={bug.id} className='transition-colors hover:bg-primary/10'>
                      <TableCell>{bug.title}</TableCell>
                      <TableCell>
                        <Badge className={`badge badge-${bug.status}`}>{bug.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`badge badge-${bug.priority}`}>{bug.priority.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{bug.assignee}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-primary py-4 px-8 shadow-xl shadow-secondary/50'>
        <p className='text-center'>© 2023 Bug Tracker Inc.</p>
      </footer>

      {/* Floating Action Button */}
      <div className='fixed bottom-6 right-6'>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button variant='default' className='shadow-2xl shadow-secondary/50'>
                    <Plus size={24} />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm' />
                  <Dialog.Content className='fixed top-[50%] left-[50%] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-8 shadow-2xl shadow-secondary/50'>
                    <Dialog.Title className='text-xl font-semibold mb-4'>Add New Bug</Dialog.Title>
                    <form className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input id='title' type='text' placeholder='Bug title' className='focus:ring-2 focus:ring-offset-2 focus:ring-accent' />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <textarea
                          id='description'
                          placeholder='Describe the bug in detail.'
                          className='w-full resize-none h-24 p-4 bg-secondary text-text rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-accent'
                        ></textarea>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='priority'>Priority</Label>
                        <Select>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select priority...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='low'>Low</SelectItem>
                            <SelectItem value='medium'>Medium</SelectItem>
                            <SelectItem value='high'>High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='assignee'>Assignee</Label>
                        <Input id='assignee' type='text' placeholder='Assigned to' className='focus:ring-2 focus:ring-offset-2 focus:ring-accent' />
                      </div>
                      <div className='flex justify-end'>
                        <Dialog.Close asChild>
                          <Button variant='outline' className='mr-2'>Cancel</Button>
                        </Dialog.Close>
                        <Button type='submit' className='bg-accent hover:bg-accent/90'>Submit</Button>
                      </div>
                    </form>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </TooltipTrigger>
            <TooltipContent className='bg-background text-text'>
              Add Bug
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}