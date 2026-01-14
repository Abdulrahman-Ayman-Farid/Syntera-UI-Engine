'use client'

import { useState, useEffect, useRef } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Video,
  Phone,
  Search,
  Bell,
  Users,
  Hash,
  Pin,
  Star,
  MoreVertical,
  ThumbsUp,
  Eye,
  Reply,
  Copy,
  Trash2,
  Edit,
  AtSign,
  Mic,
  Image as ImageIcon,
  FileText,
  Link,
  Code,
  Calendar,
  CheckCircle,
  Shield
} from 'lucide-react'

const initialMessages = [
  {
    id: '1',
    content: 'Hey team! Has anyone reviewed the latest design mockups?',
    sender: {
      id: 'alex',
      name: 'Alex Chen',
      avatar: 'AC',
      role: 'Design Lead',
      online: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    reactions: { '👍': 3, '🚀': 2 },
    pinned: true,
    attachments: []
  },
  {
    id: '2',
    content: 'Just finished reviewing them. The new dashboard layout looks amazing!',
    sender: {
      id: 'sarah',
      name: 'Sarah Miller',
      avatar: 'SM',
      role: 'Frontend Lead',
      online: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    reactions: { '❤️': 1 },
    pinned: false,
    attachments: []
  },
  {
    id: '3',
    content: 'I\'ve uploaded the updated design files to Figma. Let me know if you need access.',
    sender: {
      id: 'alex',
      name: 'Alex Chen',
      avatar: 'AC',
      role: 'Design Lead',
      online: true
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    reactions: {},
    pinned: false,
    attachments: [
      { name: 'dashboard-design.fig', type: 'figma', size: '2.4 MB' },
      { name: 'wireframes.pdf', type: 'pdf', size: '1.8 MB' }
    ]
  },
]

const channels = [
  { id: 'general', name: 'general', unread: 0, icon: Hash },
  { id: 'design', name: 'design', unread: 3, icon: Hash },
  { id: 'development', name: 'development', unread: 12, icon: Hash },
  { id: 'marketing', name: 'marketing', unread: 0, icon: Hash },
  { id: 'random', name: 'random', unread: 0, icon: Hash },
]

const teamMembers = [
  { id: 'alex', name: 'Alex Chen', role: 'Design Lead', online: true, status: 'Available' },
  { id: 'sarah', name: 'Sarah Miller', role: 'Frontend Lead', online: true, status: 'In a meeting' },
  { id: 'mike', name: 'Mike Johnson', role: 'Backend Dev', online: false, status: 'Offline' },
  { id: 'jessica', name: 'Jessica Lee', role: 'Product Manager', online: true, status: 'Focus mode' },
  { id: 'david', name: 'David Wilson', role: 'QA Engineer', online: true, status: 'Available' },
]

export default function ChatCollaborationPlatform() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState('design')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: 'current',
        name: 'You',
        avatar: 'ME',
        role: 'Team Member',
        online: true
      },
      timestamp: new Date(),
      reactions: {},
      pinned: false,
      attachments: []
    }

    setMessages([...messages, message])
    setNewMessage('')
    setShowEmojiPicker(false)
    setReplyTo(null)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji)
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions }
        reactions[emoji] = (reactions[emoji] || 0) + 1
        return { ...msg, reactions }
      }
      return msg
    }))
  }

  const togglePinMessage = (messageId: string) => {
    setMessages(messages.map(msg => ({
      ...msg,
      pinned: msg.id === messageId ? !msg.pinned : msg.pinned
    })))
  }

  const pinnedMessages = messages.filter(msg => msg.pinned)

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg'>
                <MessageCircle className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>CollabSpace</h1>
                <div className='flex items-center space-x-2'>
                  <Badge variant='outline' className='border-emerald-200 text-emerald-700'>
                    <Users className='w-3 h-3 mr-1' />
                    5 online
                  </Badge>
                  <span className='text-slate-600'>Team collaboration platform</span>
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='outline' className='border-slate-300'>
                <Video className='w-4 h-4 mr-2' />
                Start Call
              </Button>
              <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                <Users className='w-4 h-4 mr-2' />
                Invite Team
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='flex h-[calc(100vh-88px)]'>
        {/* Sidebar */}
        <div className='w-64 border-r border-slate-200 bg-white flex flex-col'>
          {/* Search */}
          <div className='p-4 border-b border-slate-200'>
            <Input
              placeholder='Search messages...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border-slate-300 focus:border-blue-500'
              startIcon={Search}
            />
          </div>

          {/* Channels */}
          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='mb-6'>
              <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                Channels
              </h3>
              <div className='space-y-1'>
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                      activeChannel === channel.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className='flex items-center'>
                      <channel.icon className='w-4 h-4 mr-3 text-slate-500' />
                      <span className='font-medium'>#{channel.name}</span>
                    </div>
                    {channel.unread > 0 && (
                      <Badge className='bg-gradient-to-r from-blue-500 to-purple-500 text-white'>
                        {channel.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pinned Messages */}
            <div className='mb-6'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                  Pinned Messages
                </h3>
                <Pin className='w-4 h-4 text-slate-500' />
              </div>
              <div className='space-y-2'>
                {pinnedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className='p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg'
                  >
                    <div className='flex items-center space-x-2 mb-2'>
                      <Avatar className='w-6 h-6'>
                        <AvatarFallback className='text-xs'>
                          {msg.sender.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm font-medium'>{msg.sender.name}</span>
                    </div>
                    <p className='text-sm text-slate-700 line-clamp-2'>{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className='border-t border-slate-200 p-4'>
            <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3'>
              Team Members
            </h3>
            <div className='space-y-2'>
              {teamMembers.map((member) => (
                <div key={member.id} className='flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg'>
                  <div className='flex items-center space-x-3'>
                    <div className='relative'>
                      <Avatar className='w-8 h-8'>
                        <AvatarFallback className='text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white'>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        member.online ? 'bg-emerald-500' : 'bg-slate-300'
                      }`} />
                    </div>
                    <div>
                      <div className='font-medium text-sm'>{member.name}</div>
                      <div className='text-xs text-slate-500'>{member.role}</div>
                    </div>
                  </div>
                  <Badge variant='outline' className='text-xs border-slate-300'>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col'>
          {/* Chat Header */}
          <div className='border-b border-slate-200 bg-white p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg'>
                  <Hash className='w-6 h-6 text-blue-700' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-slate-900'>design</h2>
                  <p className='text-slate-600'>Product design discussions and feedback</p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <Button variant='outline' size='icon' className='border-slate-300'>
                  <Bell className='w-4 h-4' />
                </Button>
                <Button variant='outline' size='icon' className='border-slate-300'>
                  <Star className='w-4 h-4' />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='icon' className='border-slate-300'>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Eye className='w-4 h-4 mr-2' />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin className='w-4 h-4 mr-2' />
                      Pin Channel
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className='w-4 h-4 mr-2' />
                      Notification Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-6 space-y-6'>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex space-x-4 group ${message.sender.id === 'current' ? 'justify-end' : ''}`}
                >
                  {message.sender.id !== 'current' && (
                    <Avatar className='w-10 h-10'>
                      <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 text-white'>
                        {message.sender.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex-1 max-w-2xl ${message.sender.id === 'current' ? 'items-end flex flex-col' : ''}`}>
                    <div className='flex items-center space-x-2 mb-1'>
                      {message.sender.id !== 'current' && (
                        <>
                          <span className='font-bold text-slate-900'>{message.sender.name}</span>
                          <Badge variant='outline' className='text-xs border-slate-300'>
                            {message.sender.role}
                          </Badge>
                        </>
                      )}
                      <span className='text-sm text-slate-500'>
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                      {message.pinned && (
                        <Pin className='w-4 h-4 text-amber-500' />
                      )}
                    </div>
                    <div
                      className={`relative p-4 rounded-2xl ${
                        message.sender.id === 'current'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-white border border-slate-200 shadow-sm'
                      }`}
                    >
                      <p className={message.sender.id === 'current' ? 'text-white' : 'text-slate-800'}>
                        {message.content}
                      </p>

                      {/* Attachments */}
                      {message.attachments.length > 0 && (
                        <div className='mt-4 space-y-2'>
                          {message.attachments.map((file, index) => (
                            <div
                              key={index}
                              className='flex items-center p-3 bg-white/20 rounded-lg'
                            >
                              <FileText className='w-5 h-5 mr-3' />
                              <div className='flex-1'>
                                <div className='font-medium'>{file.name}</div>
                                <div className='text-sm opacity-80'>{file.size}</div>
                              </div>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <Download className='w-4 h-4' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reactions */}
                      {Object.keys(message.reactions).length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-3'>
                          {Object.entries(message.reactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
                              className={`px-2 py-1 rounded-full text-sm ${
                                message.sender.id === 'current'
                                  ? 'bg-white/20'
                                  : 'bg-slate-100'
                              }`}
                            >
                              {emoji} {count}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      <div className={`absolute -bottom-2 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.sender.id === 'current' ? 'flex-row-reverse' : ''
                      }`}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 bg-white shadow border border-slate-300'
                                onClick={() => addReaction(message.id, '👍')}
                              >
                                <ThumbsUp className='w-4 h-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add reaction</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 bg-white shadow border border-slate-300'
                                onClick={() => setReplyTo(message)}
                              >
                                <Reply className='w-4 h-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reply</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 bg-white shadow border border-slate-300'
                                onClick={() => togglePinMessage(message.id)}
                              >
                                <Pin className='w-4 h-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {message.pinned ? 'Unpin message' : 'Pin message'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview */}
          {replyTo && (
            <div className='border-t border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <Reply className='w-4 h-4 text-blue-600' />
                  <div>
                    <div className='text-sm font-medium'>Replying to {replyTo.sender.name}</div>
                    <p className='text-sm text-slate-600 line-clamp-1'>{replyTo.content}</p>
                  </div>
                </div>
                <Button variant='ghost' size='icon' onClick={() => setReplyTo(null)}>
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className='border-t border-slate-200 bg-white p-4'>
            <div className='flex space-x-4'>
              <div className='flex-1 relative'>
                <div className='relative'>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${activeChannel}`}
                    className='min-h-[80px] max-h-[200px] border-slate-300 focus:border-blue-500 pr-24'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className='absolute right-2 bottom-2 flex items-center space-x-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <Smile className='w-4 h-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add emoji</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Paperclip className='w-4 h-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach file</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Mic className='w-4 h-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Voice message</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {showEmojiPicker && (
                  <div className='absolute bottom-16 right-0 z-50'>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                className='self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-[80px] px-8'
              >
                <Send className='w-5 h-5' />
              </Button>
            </div>
            <div className='flex items-center justify-between mt-3'>
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-slate-600'>Press Enter to send, Shift + Enter for new line</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Badge variant='outline' className='border-slate-300'>
                  <CheckCircle className='w-3 h-3 mr-1 text-emerald-500' />
                  End-to-end encrypted
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}