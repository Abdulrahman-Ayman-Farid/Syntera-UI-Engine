'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Search, Filter, ChevronRight, GitBranch, GitCommit, GitPullRequest, GitMerge, AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface Commit {
  id: number
  message: string
  author: string
  date: string
}

const commits: Commit[] = [
  { id: 1, message: 'Initial commit', author: 'John Doe', date: '2023-10-01' },
  { id: 2, message: 'Add login feature', author: 'Jane Smith', date: '2023-10-02' },
  { id: 3, message: 'Fix bug #123', author: 'John Doe', date: '2023-10-03' }
]

export default function VersionControlPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCommits, setFilteredCommits] = useState(commits)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate data fetching delay
    const fetchData = setTimeout(() => {
      try {
        // Data fetched successfully
        setFilteredCommits(commits)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
        setError(true)
        setIsLoading(false)
      }
    }, 2000)

    return () => clearTimeout(fetchData)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    setFilteredCommits(
      commits.filter(commit => commit.message.toLowerCase().includes(term))
    )
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Skeleton className='w-full max-w-4xl h-96 animate-pulse' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
        <AlertTriangle size={48} className='text-red-500' />
        <p className='text-red-500'>Failed to load commits.</p>
      </div>
    )
  }

  return (
    <div className='bg-black text-white min-h-screen relative overflow-hidden'>
      <header className='bg-gradient-to-b from-[#1A1A1A] to-[#333333] py-6 px-8'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Version Control</h1>
          <Button variant='default' onClick={() => setIsDialogOpen(true)}><Plus className='mr-2' /> New Branch</Button>
        </div>
      </header>
      <div className='bg-gradient-to-b from-[#1A1A1A] to-[#333333] pb-6 px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between my-4'>
            <Input
              placeholder='Search commits...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='border border-gray-700 rounded-lg w-full sm:w-1/2'
            />
            <Select defaultValue='all' onValueChange={(value) => console.log(value)}>
              <SelectTrigger className='border border-gray-700 rounded-lg ml-4'>
                <SelectValue placeholder='Filter by...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='bugfixes'>Bug Fixes</SelectItem>
                <SelectItem value='features'>Features</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue='commits'>
            <TabsList className='grid grid-cols-3'>
              <TabsTrigger value='commits'>Commits</TabsTrigger>
              <TabsTrigger value='branches'>Branches</TabsTrigger>
              <TabsTrigger value='pullrequests'>Pull Requests</TabsTrigger>
            </TabsList>
            <TabsContent value='commits'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommits.map((commit) => (
                    <TableRow key={commit.id} className='hover:bg-gray-800 cursor-pointer'>
                      <TableCell>{commit.message}</TableCell>
                      <TableCell>{commit.author}</TableCell>
                      <TableCell>{commit.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value='branches'>
              <div className='space-y-4'>
                {[1, 2, 3].map(id => (
                  <Card key={id} className='bg-gray-800 shadow-lg rounded-lg p-6'>
                    <CardHeader>
                      <CardTitle>Feature Branch {id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Latest commit: <span className='font-medium'>Update README.md</span></p>
                      <div className='mt-4 flex space-x-2'>
                        <Button variant='outline'><GitPullRequest className='mr-2' /> Pull Request</Button>
                        <Button variant='outline'><GitMerge className='mr-2' /> Merge</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value='pullrequests'>
              <div className='space-y-4'>
                {[1, 2, 3].map(id => (
                  <Card key={id} className='bg-gray-800 shadow-lg rounded-lg p-6'>
                    <CardHeader>
                      <CardTitle>Pull Request #{id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>From: <span className='font-medium'>feature-branch-{id}</span></p>
                      <p>To: <span className='font-medium'>main</span></p>
                      <Progress value={Math.random() * 100} className='my-4' />
                      <div className='mt-4 flex space-x-2'>
                        <Button variant='success'><GitMerge className='mr-2' /> Approve</Button>
                        <Button variant='destructive'><AlertTriangle className='mr-2' /> Reject</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <footer className='bg-gradient-to-b from-[#1A1A1A] to-[#333333] py-6 px-8 mt-6'>
        <div className='max-w-7xl mx-auto'>
          <p className='text-center'>© 2023 Version Control Inc.</p>
        </div>
      </footer>
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm' />
          <Dialog.Content className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'>
            <Dialog.Title className='text-2xl font-semibold'>Create New Branch</Dialog.Title>
            <form onSubmit={(e) => e.preventDefault()} className='mt-6'>
              <div className='mb-4'>
                <label htmlFor='branchName' className='block text-sm font-medium'>Branch Name</label>
                <Input type='text' id='branchName' className='mt-1 block w-full border border-gray-700 rounded-lg' required />
              </div>
              <div className='flex justify-end space-x-4'>
                <Dialog.Close asChild>
                  <Button variant='outline'>Cancel</Button>
                </Dialog.Close>
                <Button type='submit'>Create Branch</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden'>
        <svg width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'>
          <defs>
            <radialGradient id='gradient1' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#B83227' />
              <stop offset='100%' stopColor='#1A1A1A' />
            </radialGradient>
          </defs>
          <circle cx='25' cy='25' r='20' fill='url(#gradient1)' opacity='0.3' transform='translate(0, 0)' className='animate-morph1' />
          <circle cx='75' cy='75' r='30' fill='url(#gradient1)' opacity='0.3' transform='translate(0, 0)' className='animate-morph2' />
        </svg>
      </div>
    </div>
  )
}

<style jsx global>{`
@keyframes morph1 {
  0%, 100% { transform: translateY(-10%) rotate(0deg); }
  50% { transform: translateY(10%) rotate(360deg); }
}

@keyframes morph2 {
  0%, 100% { transform: translateX(-10%) rotate(0deg); }
  50% { transform: translateX(10%) rotate(-360deg); }
}

.animate-morph1 {
  animation: morph1 15s infinite ease-in-out;
}

.animate-morph2 {
  animation: morph2 20s infinite ease-in-out;
}
`}</style>