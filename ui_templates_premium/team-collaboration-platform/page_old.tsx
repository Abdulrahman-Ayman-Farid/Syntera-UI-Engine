'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, ChevronRight, UserCircle2, Check, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TeamMember {
  id: number
  name: string
  role: string
  avatar: string
}

const mockData: TeamMember[] = [
  { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Jane Smith', role: 'Developer', avatar: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Alice Johnson', role: 'Designer', avatar: 'https://via.placeholder.com/150' }
]

const TeamCollaborationPlatform = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [members, setMembers] = useState<TeamMember[]>(mockData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('')

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setError(null)
    }, 2000)
  }, [])

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAddMember = () => {
    if (newMemberName && newMemberRole) {
      const newMember: TeamMember = {
        id: members.length + 1,
        name: newMemberName,
        role: newMemberRole,
        avatar: 'https://via.placeholder.com/150'
      }
      setMembers([...members, newMember])
      setIsAddingMember(false)
      setNewMemberName('')
      setNewMemberRole('')
    }
  }

  return (
    <div className='bg-gradient-to-bl from-[#E5B257] via-[#F1C232] to-[#FFF5EB] min-h-screen text-gray-900'>
      <header className='p-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Team Setup</h1>
        <button onClick={handlePrevStep} disabled={step === 1} className='bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300'>Previous Step</button>
      </header>
      <main className='p-6'>
        <Tabs defaultValue={`step-${step}`} className='w-full'>
          <TabsList className='grid grid-cols-3 w-full'>
            <TabsTrigger value='step-1' className={cn('focus-visible:outline-none', step !== 1 ? 'cursor-not-allowed opacity-50' : '')}>Step 1</TabsTrigger>
            <TabsTrigger value='step-2' className={cn('focus-visible:outline-none', step !== 2 ? 'cursor-not-allowed opacity-50' : '')}>Step 2</TabsTrigger>
            <TabsTrigger value='step-3' className={cn('focus-visible:outline-none', step !== 3 ? 'cursor-not-allowed opacity-50' : '')}>Step 3</TabsTrigger>
          </TabsList>
          <TabsContent value='step-1' className='mt-6'>
            <h2 className='text-2xl font-semibold mb-4'>General Settings</h2>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <div className='flex flex-col space-y-2'>
                <Label htmlFor='name'>Platform Name</Label>
                <Input id='name' placeholder='Enter platform name...' className='border-t border-l border-gray-300 rounded-xl' /> 
              </div>
              <div className='flex flex-col space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Input id='description' placeholder='Enter a brief description...' className='border-t border-l border-gray-300 rounded-xl' /> 
              </div>
              <Button type='submit' className='bg-[#8A5D2B] hover:bg-[#7A5027]'>Save Changes</Button>
            </form>
          </TabsContent>
          <TabsContent value='step-2' className='mt-6'>
            <h2 className='text-2xl font-semibold mb-4'>Invite Members</h2>
            <div className='mb-4'>
              <Input
                placeholder='Search by name...'
                onChange={(e) => setFilter(e.target.value)}
                className='border-t border-l border-gray-300 rounded-xl'
              />
              <Command>
                <CommandInput placeholder='Type to filter members...' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading='Suggestions'>
                    {mockData
                      .filter((member) => member.name.toLowerCase().includes(filter.toLowerCase()))
                      .map((member) => (
                        <CommandItem key={member.id} onSelect={() => console.log(member.name)}>
                          <UserCircle2 className='mr-2 h-4 w-4' />
                          {member.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {members.map((member) => (
                <Card key={member.id} className='hover:scale-105 transform-gpu transition-transform duration-300 shadow-2xl rounded-xl bg-white backdrop-blur-sm'>
                  <CardHeader className='flex flex-row items-center justify-between space-x-4'>
                    <Avatar className='w-14 h-14'>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <CardTitle className='text-sm'>{member.name}</CardTitle>
                      <CardDescription className='text-xs'>{member.role}</CardDescription>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge variant='default' className='bg-[#8A5D2B] text-white'>Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-4'>
                    <div className='flex items-center justify-between space-x-2'>
                      <Button size='icon' variant='ghost' className='transition-transform hover:rotate-90 duration-300'>
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                      <Button size='icon' variant='ghost' className='transition-transform hover:scale-110 duration-300'>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
              <DialogTrigger asChild>
                <Button className='mt-4 bg-[#8A5D2B] hover:bg-[#7A5027]'>
                  <Plus className='mr-2 h-4 w-4' /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                  <DialogDescription>
                    Enter the details below to add a new team member.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='name' className='text-right'>
                      Name
                    </Label>
                    <Input id='name' value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className='col-span-3 border-t border-l border-gray-300 rounded-xl' /> 
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='role' className='text-right'>
                      Role
                    </Label>
                    <Input id='role' value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className='col-span-3 border-t border-l border-gray-300 rounded-xl' /> 
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddMember} className='bg-[#8A5D2B] hover:bg-[#7A5027]'>Add Member</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent value='step-3' className='mt-6'>
            <h2 className='text-2xl font-semibold mb-4'>Final Steps</h2>
            <p className='mb-4'>Please review the settings before finalizing your setup.</p>
            <Progress value={step * 33.33} className='mb-6' />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Card className='hover:scale-105 transform-gpu transition-transform duration-300 shadow-2xl rounded-xl bg-white backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Platform Details</CardTitle>
                  <CardDescription>Review the general settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col space-y-2'>
                    <span className='font-medium'>Platform Name:</span>
                    <span>My Team Platform</span>
                  </div>
                  <div className='flex flex-col space-y-2 mt-2'>
                    <span className='font-medium'>Description:</span>
                    <span>A collaborative workspace for our team.</span>
                  </div>
                </CardContent>
              </Card>
              <Card className='hover:scale-105 transform-gpu transition-transform duration-300 shadow-2xl rounded-xl bg-white backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>View current team members.</CardDescription>
                </CardHeader>
                <CardContent>
                  {members.map((member) => (
                    <div key={member.id} className='flex items-center justify-between space-x-2 mb-2'>
                      <div className='flex items-center space-x-2'>
                        <Avatar className='w-8 h-8'>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className='space-y-1'>
                          <span className='text-sm'>{member.name}</span>
                          <span className='text-xs'>{member.role}</span>
                        </div>
                      </div>
                      <Badge variant='default' className='bg-[#8A5D2B] text-white'>Active</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='p-6 flex justify-end items-center'>
        <Button onClick={handleNextStep} className='bg-[#8A5D2B] hover:bg-[#7A5027]' aria-label='Next Step'>
          Next Step
          <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </footer>
    </div>
  )
}

export default TeamCollaborationPlatform