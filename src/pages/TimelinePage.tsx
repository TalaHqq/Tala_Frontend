import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, LogOut, User, List, Sun, Clock,
  ChevronDown, ChevronRight, ChevronLeft, Plus, MessageSquare,
  X, Pencil, Calendar, Tag, Paperclip, AtSign, Send, ImageIcon, FileText, CreditCard, Settings,
  CloudUpload, Share2, Heart
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { CreateProjectModal } from '@/components/shared/CreateProjectModay'

type TimeFilter = 'Week' | 'Month' | 'Quarter'
type ViewMode = 'gantt' | 'calendar' | 'effective'

interface TimelinePageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

interface GanttTask {
  name: string
  status: 'Queued' | 'in progress' | 'completed'
  startDay: number
  endDay: number
  color: string
}

interface Project {
  id: string
  name: string
  taskCount: number
  completionRate: number
  members: { name: string; avatar: string }[]
  tasks: GanttTask[]
  subtasks?: { name: string; status: string }[]
}

interface EffectiveTask {
  title: string
  status: 'in progress' | 'completed' | 'queued'
  time: string
  project: string
  efficiency: number
  members: string[]
  count: number
  taskNum: number
  accentColor: string
}

interface EffectiveDay {
  day: number
  name: string
  tasks: EffectiveTask[]
}

type CalTaskStatus = 'queued' | 'in progress' | 'completed'

interface CalTask {
  id: string
  title: string
  status?: CalTaskStatus
  dot?: string
  members?: string[]
  comments?: number
  isNew?: boolean
  accent?: string
  isToday?: boolean
  featured?: boolean
}

interface CalDay {
  date: number
  isCurrentMonth: boolean
  isToday?: boolean
  number?: number
  tasks: CalTask[]
}

interface LinkedAsset {
  name: string
  type: 'image' | 'audio' | 'file'
  status: 'In Progress' | 'Completed' | 'Queued'
}

interface ActivityItem {
  avatar: string
  author: string
  time: string
  text: string
  isTimestamped?: boolean
  timestamp?: string
  links?: string[]
  bgHighlight?: boolean
}

interface TaskDetail {
  id: string
  title: string
  status: 'In Progress' | 'Completed' | 'Queued'
  assignedTo: { name: string; avatar: string }
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  tags: string[]
  description: string
  linkedAssets: LinkedAsset[]
  activity: ActivityItem[]
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'p1', name: 'Website Redesign', taskCount: 4, completionRate: 75,
    members: [
      { name: 'User 1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
      { name: 'User 2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
    ],
    subtasks: [
      { name: 'Mechanics', status: 'HIK complete' },
      { name: 'High Santry', status: 'PIK complete' },
      { name: 'Prototyping', status: 'HIK complete' },
      { name: 'User Testing', status: 'HIK complete' },
    ],
    tasks: [
      { name: 'Wireframes', status: 'Queued', startDay: 3, endDay: 12, color: 'bg-neutral-900' },
      { name: 'High-Fidelity', status: 'in progress', startDay: 9, endDay: 15, color: 'bg-neutral-400' },
      { name: 'Prototyping', status: 'in progress', startDay: 12, endDay: 20, color: 'bg-neutral-300' },
      { name: 'User Testing', status: 'completed', startDay: 1, endDay: 5, color: 'bg-neutral-300' },
    ],
  },
  {
    id: 'p2', name: 'Mobile App', taskCount: 16, completionRate: 75,
    members: [
      { name: 'User 3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
      { name: 'User 4', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
    ],
    tasks: [],
  },
  {
    id: 'p3', name: 'Video Editing', taskCount: 2, completionRate: 44,
    members: [
      { name: 'User 1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
      { name: 'User 4', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
    ],
    tasks: [],
  },
  {
    id: 'p4', name: 'Music Class', taskCount: 4, completionRate: 50,
    members: [
      { name: 'User 2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
      { name: 'User 3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
    ],
    tasks: [],
  },
]

const DAYS_COLUMN = [
  { day: 1, label: '1', sub: 'Oct 2025' }, { day: 2, label: '2', sub: 'Tue' },
  { day: 3, label: '3', sub: 'Wed' }, { day: 4, label: '4', sub: 'Thu' },
  { day: 5, label: '5', sub: 'Fri' }, { day: 6, label: '6', sub: 'Sat' },
  { day: 7, label: '7', sub: 'Sun' }, { day: 9, label: '9', sub: 'Mon' },
  { day: 10, label: '10', sub: 'Tue' }, { day: 11, label: '11', sub: 'Wed' },
  { day: 12, label: '12', sub: 'Thu' }, { day: 13, label: '13', sub: 'Fri' },
  { day: 14, label: '14', sub: 'Sat' }, { day: 16, label: '16', sub: 'Sun' },
  { day: 17, label: '17', sub: 'Mon' }, { day: 18, label: '18', sub: 'Tue' },
  { day: 20, label: '20', sub: 'Wed' }, { day: 21, label: '21', sub: 'Thu' },
  { day: 22, label: '22', sub: 'Fri' }, { day: 23, label: '23', sub: 'Sat' },
]

const EFFECTIVE_DAYS: EffectiveDay[] = [
  {
    day: 5, name: 'TUE',
    tasks: [
      { title: 'Design System Review', status: 'in progress', time: '9:00 AM – 11:30 AM', project: 'Project Alpha', efficiency: 47, members: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'], count: 220, taskNum: 226, accentColor: '#9CA3AF' },
      { title: 'Client Presentation Prep', status: 'completed', time: '2:00 PM – 4:00 PM', project: 'Project Beta', efficiency: 88, members: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60'], count: 136, taskNum: 47, accentColor: '#1A1A1A' },
    ],
  },
  {
    day: 6, name: 'WED',
    tasks: [
      { title: 'Code Review Session', status: 'queued', time: '10:00 AM – 12:30 PM', project: 'Project Gemina', efficiency: 9, members: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'], count: 136, taskNum: 45, accentColor: '#D1D5DB' },
      { title: 'Database Migration', status: 'completed', time: '3:00 PM – 5:00 PM', project: 'Project Alpha', efficiency: 9, members: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'], count: 136, taskNum: 136, accentColor: '#1A1A1A' },
    ],
  },
  {
    day: 7, name: 'THU',
    tasks: [
      { title: 'Team Standup Meeting', status: 'in progress', time: '9:30 AM – 10:00 PM', project: 'All Friends', efficiency: 8, members: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'], count: 136, taskNum: 46, accentColor: '#9CA3AF' },
    ],
  },
]

const OCTOBER_2025_WEEKS: CalDay[][] = [
  [
    { date: 28, isCurrentMonth: false, tasks: [] },
    { date: 29, isCurrentMonth: false, tasks: [] },
    { date: 30, isCurrentMonth: false, tasks: [] },
    { date: 1, isCurrentMonth: true, number: 119, tasks: [{ id: 't1', title: 'Design Review', status: 'queued', accent: '#F59E0B' }] },
    { date: 2, isCurrentMonth: true, tasks: [{ id: 't2', title: 'Client Meeting', dot: 'bg-red-400' }] },
    { date: 3, isCurrentMonth: true, tasks: [] },
    { date: 4, isCurrentMonth: true, tasks: [{ id: 't3', title: 'Client Meeting', dot: 'bg-amber-400' }, { id: 't4', title: 'Code Review', dot: 'bg-amber-400' }] },
  ],
  [
    { date: 5, isCurrentMonth: true, tasks: [] },
    { date: 6, isCurrentMonth: true, tasks: [{ id: 't5', title: 'Training Press', dot: 'bg-amber-400' }] },
    { date: 7, isCurrentMonth: true, tasks: [] },
    { date: 8, isCurrentMonth: true, tasks: [{ id: 't6', title: 'Team Months', dot: 'bg-neutral-400' }, { id: 't7', title: 'Team Monlrs...', dot: 'bg-neutral-400' }, { id: 't8', title: '+1 more', dot: undefined }] },
    { date: 9, isCurrentMonth: true, tasks: [] },
    { date: 10, isCurrentMonth: true, tasks: [{ id: 't9', title: 'System Review', dot: 'bg-neutral-400' }] },
    { date: 11, isCurrentMonth: true, tasks: [] },
  ],
  [
    { date: 12, isCurrentMonth: true, tasks: [] },
    { date: 13, isCurrentMonth: true, tasks: [{ id: 't10', title: 'Planning', dot: 'bg-neutral-400' }] },
    { date: 14, isCurrentMonth: true, tasks: [] },
    { date: 15, isCurrentMonth: true, tasks: [{ id: 't11', title: 'Development', dot: 'bg-neutral-400' }] },
    { date: 16, isCurrentMonth: true, number: 135, tasks: [{ id: 't12', title: 'Video Editing - Product Demo', status: 'completed', members: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'], comments: 2, isNew: true, featured: true, accent: '#ef4444' }] },
    { date: 17, isCurrentMonth: true, tasks: [] },
    { date: 18, isCurrentMonth: true, tasks: [] },
  ],
  [
    { date: 19, isCurrentMonth: true, tasks: [] },
    { date: 20, isCurrentMonth: true, tasks: [] },
    { date: 21, isCurrentMonth: true, tasks: [{ id: 't13', title: 'Milestone', dot: 'bg-neutral-400' }] },
    { date: 22, isCurrentMonth: true, tasks: [] },
    { date: 23, isCurrentMonth: true, number: 118, tasks: [] },
    { date: 24, isCurrentMonth: true, tasks: [] },
    { date: 25, isCurrentMonth: true, tasks: [] },
  ],
  [
    { date: 26, isCurrentMonth: true, isToday: true, tasks: [{ id: 't14', title: 'Prototype Final', accent: '#F59E0B', isToday: true }] },
    { date: 27, isCurrentMonth: true, isToday: true, tasks: [{ id: 't15', title: 'Prototype Final', accent: '#ef4444', isToday: true }] },
    { date: 28, isCurrentMonth: true, tasks: [] },
    { date: 29, isCurrentMonth: true, tasks: [] },
    { date: 30, isCurrentMonth: true, tasks: [] },
    { date: 31, isCurrentMonth: true, tasks: [] },
    { date: 1, isCurrentMonth: false, tasks: [] },
  ],
]

const MOCK_TASK_DETAIL: TaskDetail = {
  id: 'td1',
  title: 'Video Editing - Product Demo',
  status: 'In Progress',
  assignedTo: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  dueDate: '2025-10-14',
  priority: 'High',
  tags: ['Marketing', 'Audio Edit', 'Urgent'],
  description: '',
  linkedAssets: [
    { name: 'Design_v3.png', type: 'image', status: 'In Progress' },
    { name: 'background_music.wav', type: 'audio', status: 'Completed' },
  ],
  activity: [
    { avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', author: 'John Doe', time: '2 hours ago', text: 'John Doe linked Design_v3.png' },
    { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', author: 'John Doe', time: '1 hours ago', text: 'Task moved to In Progress' },
    { avatar: '', author: 'Timestamped Media Comment', time: '', text: 'The audio sync looks good. Ready for final review.', isTimestamped: true, timestamp: '00:42', links: ['184', '185'], bgHighlight: true },
  ],
}

// ─── Asset Icon ───────────────────────────────────────────────────────────────

function AssetIcon({ type }: { type: 'image' | 'audio' | 'file' }) {
  if (type === 'image') return (
    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
    </div>
  )
  if (type === 'audio') return (
    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
    </div>
  )
  return (
    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
      <Paperclip className="w-4 h-4 text-neutral-500" />
    </div>
  )
}

// ─── Task Detail Modal ────────────────────────────────────────────────────────

function TaskDetailModal({ task, onClose }: { task: TaskDetail; onClose: () => void }) {
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState(task.status)
  const overlayRef = useRef<HTMLDivElement>(null)
setStatus(task.status)

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === overlayRef.current) onClose() }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const statusColors: Record<string, string> = {
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Queued': 'bg-amber-50 text-amber-700 border-amber-200',
  }
  const statusDot: Record<string, string> = {
    'In Progress': 'bg-blue-500', 'Completed': 'bg-emerald-500', 'Queued': 'bg-amber-500',
  }
  const assetStatusStyle = (s: string) =>
    s === 'Completed' ? 'bg-emerald-50 text-emerald-700' : s === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-neutral-100 text-neutral-500'

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
      {/* Fixed height modal with pinned header + footer, scrollable body */}
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-[580px] mx-4 h-[500px] flex flex-col overflow-hidden">

        {/* ── Header (pinned) ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-100 flex-shrink-0">
          <h2 className="text-[15px] font-bold text-neutral-900 leading-tight">{task.title}</h2>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${statusColors[status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
              {status}
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </div>
            <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <User className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold text-neutral-500">Assigned To</span>
              </div>
              <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50/50 hover:bg-white transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-[12px] font-medium text-neutral-800">{task.assignedTo.name}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold text-neutral-500">Due Date</span>
              </div>
              <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50/50 hover:bg-white transition-colors cursor-pointer">
                <span className="text-[12px] font-medium text-neutral-800">{task.dueDate}</span>
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 3h18v12l-9 6-9-6V3z" /></svg>
                <span className="text-[11px] font-semibold text-neutral-500">Priority</span>
              </div>
              <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50/50 hover:bg-white transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-red-500 flex-shrink-0" />
                  <span className="text-[12px] font-medium text-neutral-800">{task.priority}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold text-neutral-500">Tags</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 border border-neutral-200 rounded-lg px-3 py-1.5 bg-neutral-50/50 min-h-[36px]">
                {task.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">{tag}</span>
                ))}
                <button className="flex items-center gap-0.5 text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors ml-auto">
                  <Plus className="w-3 h-3" />Add Tag
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-neutral-500">Description</span>
            <textarea placeholder="Add task details or notes here..." defaultValue={task.description} rows={3} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[12px] text-neutral-700 placeholder:text-neutral-300 bg-neutral-50/50 focus:outline-none focus:border-neutral-400 resize-none transition-colors" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-neutral-500">Linked Assets</span>
            <div className="flex flex-col gap-2">
              {task.linkedAssets.map((asset, i) => (
                <div key={i} className="flex items-center gap-3 border border-neutral-200 rounded-xl px-3 py-2.5 bg-neutral-50/40 hover:bg-white transition-colors cursor-pointer">
                  <AssetIcon type={asset.type} />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[12px] font-semibold text-neutral-800 truncate">{asset.name}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md w-fit ${assetStatusStyle(asset.status)}`}>{asset.status}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-1 rounded-md hover:bg-neutral-200 text-neutral-400 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button className="p-1 rounded-md hover:bg-neutral-200 text-neutral-400 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                    </button>
                  </div>
                </div>
              ))}
              <button className="flex items-center justify-center gap-1.5 border border-dashed border-neutral-300 rounded-xl px-3 py-2.5 text-[12px] font-medium text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />Add Asset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold text-neutral-500">Activity & Comments Feed</span>
            <div className="flex flex-col gap-3">
              {task.activity.map((item, i) => (
                <div key={i} className={`flex gap-3 ${item.bgHighlight ? 'bg-amber-50 rounded-xl p-3 -mx-1' : ''}`}>
                  {item.isTimestamped ? (
                    <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  ) : (
                    <img src={item.avatar} alt={item.author} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-neutral-800">{item.author}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.timestamp && <span className="text-[11px] font-mono text-neutral-500">{item.timestamp}</span>}
                        {item.time && <span className="text-[11px] text-neutral-400">{item.time}</span>}
                        {item.links && item.links.map(link => (
                          <button key={link} className="text-[11px] text-blue-500 hover:underline font-medium">{link}</button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer (pinned) ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/40 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div className="flex-1 flex items-center border border-neutral-200 rounded-xl px-3 py-2 bg-white gap-2 focus-within:border-neutral-400 transition-colors">
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 text-[12px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none bg-transparent" />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors"><AtSign className="w-3.5 h-3.5" /></button>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors"><Paperclip className="w-3.5 h-3.5" /></button>
              <span className="text-neutral-300 text-xs">Attach asset</span>
            </div>
          </div>
          <button className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors flex-shrink-0">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Create Task Modal ────────────────────────────────────────────────────────

type NewTaskPriority = 'Low' | 'Medium' | 'High'
type NewTaskWorkflow = 'Queued' | 'In Progress' | 'Completed'

const MOCK_MEMBERS = [
  { id: 'm1', name: 'jane', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  { id: 'm2', name: 'mark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
  { id: 'm3', name: 'sara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
  { id: 'm4', name: 'alex', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
]

interface NewTaskAsset { name: string; type: 'image' | 'doc' }

function CreateTaskModal({ onClose, onCreateAndOpen }: { onClose: () => void; onCreateAndOpen?: () => void }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['m1', 'm2'])
  const [assets, setAssets] = useState<NewTaskAsset[]>([
    { name: 'asset_one.png', type: 'image' },
    { name: 'document_two.pdf', type: 'doc' },
    { name: 'asset...', type: 'doc' },
  ])
  const [workflow, setWorkflow] = useState<NewTaskWorkflow>('Queued')
  const [priority, setPriority] = useState<NewTaskPriority>('Medium')
  const [showMemberPicker, setShowMemberPicker] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const memberPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (memberPickerRef.current && !memberPickerRef.current.contains(e.target as Node)) setShowMemberPicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === overlayRef.current) onClose() }
  const toggleMember = (id: string) => setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  const removeMember = (id: string) => setSelectedMembers(prev => prev.filter(m => m !== id))
  const removeAsset = (name: string) => setAssets(prev => prev.filter(a => a.name !== name))

  const workflowColors: Record<NewTaskWorkflow, string> = {
    Queued: 'bg-amber-100 text-amber-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-emerald-100 text-emerald-700',
  }
  const priorities: NewTaskPriority[] = ['Low', 'Medium', 'High']
  const priorityDots = (p: NewTaskPriority) => p === 'Low' ? 'text-neutral-300' : p === 'Medium' ? 'text-neutral-500' : 'text-neutral-900'

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
      {/* Fixed height modal with pinned header + footer, scrollable body */}
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-[640px] mx-4 h-[500px] flex flex-col overflow-hidden">

        {/* ── Header (pinned) ── */}
        <div className="px-6 pt-6 pb-5 border-b border-neutral-100 flex-shrink-0">
          <h2 className="text-[17px] font-bold text-neutral-900">Create New Task</h2>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5 ">

          <div className="flex gap-4 items-start">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-neutral-800">Task Title</label>
                <span className="text-[11px] text-red-400 font-medium">* Required</span>
              </div>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Design homepage hero section" className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-500 transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5 w-[180px]">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-neutral-800">Due Date</label>
                <span className="text-[11px] text-red-400 font-medium">* Required</span>
              </div>
              <div className="relative">
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-[13px] text-neutral-800 focus:outline-none focus:border-neutral-500 transition-colors appearance-none pr-8" />
                <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-neutral-800">Description <span className="font-normal text-neutral-400">(optional)</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[13px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 resize-none transition-colors" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-800">Assigned Members</label>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative" ref={memberPickerRef}>
                <button onClick={() => setShowMemberPicker(!showMemberPicker)} className="flex items-center gap-1.5 border border-neutral-300 rounded-full px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" />Add Member
                </button>
                {showMemberPicker && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl p-2 z-20 w-44">
                    {MOCK_MEMBERS.filter(m => !selectedMembers.includes(m.id)).map(m => (
                      <button key={m.id} onClick={() => { toggleMember(m.id); setShowMemberPicker(false) }} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors">
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-[12px] font-medium text-neutral-700 capitalize">{m.name}</span>
                      </button>
                    ))}
                    {MOCK_MEMBERS.filter(m => !selectedMembers.includes(m.id)).length === 0 && (
                      <p className="text-[11px] text-neutral-400 text-center py-2">All members added</p>
                    )}
                  </div>
                )}
              </div>
              {selectedMembers.map(id => {
                const member = MOCK_MEMBERS.find(m => m.id === id)
                if (!member) return null
                return (
                  <div key={id} className="flex items-center gap-1.5 border border-neutral-200 rounded-full pl-1 pr-2.5 py-1 bg-white hover:bg-neutral-50 transition-colors group">
                    <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[12px] font-medium text-neutral-700">{member.name}</span>
                    <button onClick={() => removeMember(id)} className="ml-0.5 text-neutral-300 hover:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-800">Linked Assets</label>
            <div className="flex items-center gap-2 flex-wrap">
              {assets.map(asset => (
                <div key={asset.name} className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-neutral-50 transition-colors group cursor-pointer">
                  {asset.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" /> : <FileText className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />}
                  <span className="text-[12px] font-medium text-neutral-700 max-w-[100px] truncate">{asset.name}</span>
                  <button onClick={() => removeAsset(asset.name)} className="ml-0.5 text-neutral-300 hover:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <button className="flex items-center gap-1.5 border border-dashed border-neutral-300 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />Add Asset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-800">Workflow State</label>
            <div className="flex items-center gap-2">
              {(['Queued', 'In Progress', 'Completed'] as NewTaskWorkflow[]).map(w => (
                <button key={w} onClick={() => setWorkflow(w)} className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${workflow === w ? workflowColors[w] : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}>{w}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-800">Priority</label>
            <div className="flex items-center gap-1">
              {priorities.map(p => (
                <button key={p} onClick={() => setPriority(p)} className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl border transition-all ${priority === p ? 'border-neutral-300 bg-neutral-100 text-neutral-900' : 'border-neutral-200 bg-white text-neutral-400 hover:bg-neutral-50'}`}>
                  <span className={`text-[14px] font-bold tracking-widest ${priorityDots(p)}`}>•••</span>
                  <span className="text-[11px] font-medium">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer (pinned) ── */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-neutral-100 bg-neutral-50/60 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-neutral-300 text-[13px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-700 transition-colors">Create Task</button>
          <button onClick={() => { onCreateAndOpen?.(); onClose() }} className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-700 transition-colors">Create & Open</button>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'in progress') return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-700">In Progress</span>
  if (status === 'completed') return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-700">Done</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-700">Queued</span>
}

// ─── Gantt View ───────────────────────────────────────────────────────────────

function GanttView({ expandedProjects, toggleProject, onTaskClick }: { expandedProjects: Record<string, boolean>; toggleProject: (id: string) => void; onTaskClick: () => void }) {
  const total = DAYS_COLUMN.length
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1200px] flex flex-col">
          <div className="flex border-b border-neutral-200 bg-neutral-50/50">
            <div className="w-[280px] min-w-[280px] px-5 py-3 text-[12px] font-semibold text-neutral-500 border-r border-neutral-200 flex items-center">Project & Tasks</div>
            <div className="flex flex-1">
              {DAYS_COLUMN.map((col, idx) => (
                <div key={idx} className="flex-1 min-w-[45px] text-center border-r border-neutral-100 last:border-r-0 py-2 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-neutral-700">{col.label}</span>
                  <span className="text-[9px] text-neutral-400 font-medium whitespace-nowrap mt-0.5">{col.sub}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-neutral-200">
            {PROJECTS_DATA.map(project => {
              const isExpanded = !!expandedProjects[project.id]
              return (
                <div key={project.id} className="flex flex-col">
                  <div className="flex items-center bg-white group hover:bg-neutral-50/40 transition-colors">
                    <div className="w-[280px] min-w-[280px] px-5 py-3 border-r border-neutral-200 flex items-center justify-between">
                      <button onClick={() => toggleProject(project.id)} className="flex flex-col items-start text-left gap-0.5 group focus:outline-none">
                        <div className="flex items-center gap-1.5">
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                          <span className="text-[13px] font-bold text-neutral-800">{project.name}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 pl-5 font-medium">{project.taskCount} Tasks • {project.completionRate}% complete</span>
                      </button>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {project.members.map((m, mIdx) => <img key={mIdx} className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover" src={m.avatar} alt={m.name} />)}
                      </div>
                    </div>
                    <div className="flex flex-1 relative h-[52px]">
                      {DAYS_COLUMN.map((_, idx) => <div key={idx} className="flex-1 border-r border-neutral-100 last:border-r-0 h-full" />)}
                      {project.id === 'p1' && <>
                        <div className="absolute left-[8%] right-[60%] top-[22px] h-[6px] bg-neutral-400 rounded-full" />
                        <div className="absolute left-[72%] right-[0%] top-[22px] h-[6px] bg-neutral-800 rounded-full" />
                      </>}
                    </div>
                  </div>
                  {isExpanded && project.tasks.map((task, tIdx) => (
                    <div key={tIdx} onClick={onTaskClick} className="flex items-center bg-[#FAFAFA] hover:bg-neutral-50 transition-colors cursor-pointer">
                      <div className="w-[280px] min-w-[280px] pl-10 pr-5 py-2.5 border-r border-neutral-200 flex flex-col justify-center">
                        <span className="text-[12px] font-semibold text-neutral-700">{task.name}</span>
                        <span className="text-[10px] text-neutral-400 capitalize font-medium">{task.status}</span>
                      </div>
                      <div className="flex flex-1 relative h-[56px]">
                        {DAYS_COLUMN.map((_, idx) => <div key={idx} className="flex-1 border-r border-neutral-100/60 last:border-r-0 h-full" />)}
                        <div className={`absolute h-[6px] rounded-full top-[25px] ${task.color}`} style={{ left: `${(task.startDay / total) * 100}%`, right: `${100 - (task.endDay / total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Effective View ───────────────────────────────────────────────────────────

function EffectiveView({ onTaskClick }: { onTaskClick: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      {EFFECTIVE_DAYS.map(dayData => (
        <div key={dayData.day}>
          <div className="flex items-baseline gap-3 mb-3 pl-1">
            <span className="text-[32px] font-light text-neutral-800 leading-none">{dayData.day}</span>
            <span className="text-[11px] font-semibold text-neutral-400 tracking-widest uppercase">{dayData.name}</span>
          </div>
          <div className="flex gap-0">
            <div className="w-px bg-neutral-200 mx-4 flex-shrink-0" />
            <div className="flex flex-col gap-3 flex-1">
              {dayData.tasks.map((task, tIdx) => (
                <div key={tIdx} onClick={onTaskClick} className="bg-white border border-neutral-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-[3px] h-9 rounded-full flex-shrink-0" style={{ background: task.accentColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-neutral-800 truncate">{task.title}</span>
                        <StatusBadge status={task.status} />
                        <span className="text-[11px] text-neutral-300 font-mono">{task.taskNum}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span className="text-[11px] text-neutral-400">{task.time}</span>
                        <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">{task.project}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-neutral-400">Efficiency</span>
                      <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full">{task.efficiency}%</span>
                    </div>
                    <div className="flex -space-x-2">
                      {task.members.map((src, mIdx) => <img key={mIdx} src={src} alt="" className="w-6 h-6 rounded-full ring-2 ring-white object-cover" />)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      <span className="font-medium text-neutral-500">{task.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white border border-neutral-100 rounded-xl px-5 py-4 mt-1">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[12px] font-bold text-neutral-700">TALA Insights</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {['2 high-priority tasks are unassigned', 'Efficiency dropped by 8% this week. Suggest rescheduling', 'You have 3 queued tasks pending start'].map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-neutral-500">
              <span className="mt-[5px] w-1 h-1 rounded-full bg-neutral-400 flex-shrink-0" />{insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Calendar View ────────────────────────────────────────────────────────────

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function CalTaskPill({ task, onTaskClick }: { task: CalTask; onTaskClick: () => void }) {
  if (task.featured) return (
    <div onClick={onTaskClick} className="rounded-lg border border-neutral-200 bg-white p-2 text-[11px] shadow-sm cursor-pointer hover:shadow-md transition-shadow relative">
      <div className="font-semibold text-neutral-800 mb-1 leading-tight">{task.title}</div>
      <StatusBadge status="completed" />
      <div className="flex items-center justify-between mt-2">
        <div className="flex -space-x-1.5">
          {(task.members ?? []).map((src, i) => <img key={i} src={src} alt="" className="w-5 h-5 rounded-full ring-2 ring-white object-cover" />)}
        </div>
        {task.comments != null && (
          <div className="flex items-center gap-0.5 text-neutral-400">
            <MessageSquare className="w-3 h-3" />
            <span className="text-[10px]">{task.comments} new</span>
          </div>
        )}
      </div>
      {task.accent && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: task.accent }} />}
    </div>
  )
  if (task.accent && task.isToday) return (
    <div onClick={onTaskClick} className="flex items-center gap-1.5 rounded-md bg-white border border-neutral-200 px-1.5 py-1 text-[10px] shadow-sm overflow-hidden relative cursor-pointer hover:shadow-md transition-shadow">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md" style={{ background: task.accent }} />
      <span className="pl-1 font-medium text-neutral-700 truncate">{task.title}</span>
    </div>
  )
  if (task.accent && task.status) return (
    <div onClick={onTaskClick} className="flex flex-col gap-0.5 rounded-md bg-neutral-50 border border-neutral-100 px-1.5 py-1 text-[10px] relative overflow-hidden cursor-pointer hover:bg-white transition-colors">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md" style={{ background: task.accent }} />
      <span className="pl-1 font-medium text-neutral-800 truncate">{task.title}</span>
      <StatusBadge status={task.status} />
    </div>
  )
  return (
    <div onClick={onTaskClick} className="flex items-center gap-1 text-[10px] text-neutral-600 truncate px-0.5 cursor-pointer hover:text-neutral-900 transition-colors">
      {task.dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.dot}`} />}
      <span className="truncate">{task.title}</span>
    </div>
  )
}

function CalendarView({ onTaskClick, onAddTask }: { onTaskClick: () => void; onAddTask: () => void }) {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({ p1: true })
  const toggleProj = (id: string) => setExpandedProjects(p => ({ ...p, [id]: !p[id] }))

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="flex min-h-[600px]">
        <div className="w-[220px] min-w-[220px] border-r border-neutral-200 flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-100">
            <span className="text-[12px] font-semibold text-neutral-500">Projects & Tasks</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {PROJECTS_DATA.map(proj => {
              const isOpen = !!expandedProjects[proj.id]
              return (
                <div key={proj.id}>
                  <button onClick={() => toggleProj(proj.id)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 transition-colors group">
                    <div className="flex flex-col items-start gap-0.5">
                      <div className="flex items-center gap-1.5">
                        {isOpen ? <ChevronDown className="w-3 h-3 text-neutral-400" /> : <ChevronRight className="w-3 h-3 text-neutral-400" />}
                        <span className="text-[12px] font-bold text-neutral-800">{proj.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 pl-4">{proj.taskCount} Tasks • {proj.completionRate}% complete</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1.5">
                        {proj.members.slice(0, 2).map((m, i) => <img key={i} src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full ring-1 ring-white object-cover" />)}
                      </div>
                    </div>
                  </button>
                  {isOpen && proj.subtasks && proj.subtasks.map((sub, sIdx) => (
                    <div key={sIdx} className="flex flex-col pl-8 pr-4 py-1.5 hover:bg-neutral-50 transition-colors">
                      <span className="text-[11px] font-medium text-neutral-700 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0" />{sub.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 pl-3">{sub.status}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <span className="text-[13px] font-bold text-neutral-800 tracking-wide uppercase">October 2025</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded-md hover:bg-neutral-100 transition-colors text-neutral-500"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 rounded-md hover:bg-neutral-100 transition-colors text-neutral-500"><ChevronRight className="w-4 h-4" /></button>
              <span className="text-[12px] font-semibold text-neutral-700 ml-1">10</span>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-neutral-100">
            {DOW_LABELS.map(d => <div key={d} className="text-center py-2 text-[11px] font-semibold text-neutral-500 border-r border-neutral-100 last:border-r-0">{d}</div>)}
          </div>
          <div className="flex-1 grid grid-rows-5 divide-y divide-neutral-100">
            {OCTOBER_2025_WEEKS.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 divide-x divide-neutral-100 min-h-[100px]">
                {week.map((day, dIdx) => (
                  <div key={dIdx} className={`relative p-1.5 flex flex-col gap-1 min-h-[100px] transition-colors ${!day.isCurrentMonth ? 'bg-neutral-50/60' : 'bg-white hover:bg-neutral-50/40'} ${day.isToday ? 'ring-2 ring-inset ring-red-400/60' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-semibold leading-none ${!day.isCurrentMonth ? 'text-neutral-300' : day.isToday ? 'text-red-500' : 'text-neutral-600'}`}>
                        {day.date}{day.isToday && <span className="ml-1 text-[9px] font-bold text-red-400 bg-red-50 px-1 py-0.5 rounded">Today</span>}
                      </span>
                      {day.number != null && <span className="text-[11px] font-semibold text-neutral-400">{day.number}</span>}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      {day.tasks.map(task => <div key={task.id}><CalTaskPill task={task} onTaskClick={onTaskClick} /></div>)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 px-5 py-3 flex items-start justify-between gap-4 bg-neutral-50/40">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[12px] font-bold text-neutral-700">TALA Insights</span>
          </div>
          {['2 High-priority tasks are undesigned', 'Efficiency increased by 3% this week.', 'Review 2 high-priority tasks pending review.'].map((ins, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-500">
              <span className="mt-[5px] w-1 h-1 rounded-full bg-neutral-400 flex-shrink-0" />{ins}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0 items-end">
          <button onClick={onAddTask} className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            Add Project
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function TimelinePage({ sidebarExpanded, onToggleSidebar }: TimelinePageProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({ p1: true })
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month')
  const [viewMode, setViewMode] = useState<ViewMode>('gantt')
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  interface NotificationItem {
    id: string
    type: 'upload' | 'comment' | 'share' | 'favorite' | 'system'
    title: string
    description: string
    time: string
    read: boolean
  }

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n1', type: 'upload', title: 'Upload complete', description: '"Q4_Financial_Report.pdf" finished uploading to Reports', time: '5 mins ago', read: false },
    { id: 'n2', type: 'comment', title: 'New comment', description: 'Sena Duodu commented on "Product Launch Trailer"', time: '1 hour ago', read: false },
    { id: 'n3', type: 'share', title: 'Collection shared', description: 'Bervelyn Amoako shared "Brand Assets" with you', time: 'Yesterday', read: false },
    { id: 'n4', type: 'favorite', title: 'Added to favorites', description: 'Kofi TALA favorited "Landing Page Banner.png"', time: '2 days ago', read: true },
    { id: 'n5', type: 'system', title: 'Storage update', description: "You've used 68% of your storage plan", time: '3 days ago', read: true },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const notificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'upload': return <CloudUpload className="w-4 h-4" />
      case 'comment': return <FileText className="w-4 h-4" />
      case 'share': return <Share2 className="w-4 h-4" />
      case 'favorite': return <Heart className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => { localStorage.removeItem('tala_token'); navigate('/login') }
  const toggleProject = (id: string) => setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }))
  const openTaskDetail = () => setSelectedTask(MOCK_TASK_DETAIL)
  const closeTaskDetail = () => setSelectedTask(null)

  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans antialiased selection:bg-neutral-200">
      <Sidebar isExpanded={sidebarExpanded} onToggle={onToggleSidebar} />
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out" style={{ marginLeft: sidebarExpanded ? '14rem' : '52px' }}>

        <header className="flex items-center justify-between h-14 px-8 border-b border-neutral-200/60 bg-[#F4F4F4]/80 backdrop-blur-md sticky top-0 z-30">
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Timeline</span>
          <div className="flex items-center gap-5">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  if (!notificationsOpen) setProfileOpen(false)
                }}
                className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-neutral-900 rounded-full border border-[#F4F4F4]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-[360px] rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                    <p className="text-[13px] font-bold text-neutral-900">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-12">
                        <Bell className="w-8 h-8 text-neutral-200" />
                        <p className="text-[12px] font-medium text-neutral-400">You're all caught up</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-100">
                        {notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${!n.read ? 'bg-neutral-50/60' : ''}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                              {notificationIcon(n.type)}
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <p className="text-[12.5px] font-bold text-neutral-900 truncate">{n.title}</p>
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 flex-shrink-0" />}
                              </div>
                              <p className="text-[12px] text-neutral-500 leading-snug line-clamp-2">{n.description}</p>
                              <p className="text-[10.5px] font-medium text-neutral-400 pt-0.5">{n.time}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-neutral-100">
                      <button
                        onClick={clearNotifications}
                        className="w-full text-center text-[11px] font-semibold text-neutral-500 hover:text-red-600 transition-colors"
                      >
                        Clear all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  if (!profileOpen) setNotificationsOpen(false)
                }}
                className="flex items-center gap-2 p-0.5 rounded-full border border-neutral-300 hover:border-neutral-400 transition-all overflow-hidden"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                </div>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white shadow-xl p-1.5 z-50">
                  <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                    <p className="text-[12px] font-bold">User</p>
                    <p className="text-[10px] text-neutral-400">Premium Account</p>
                  </div>
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"><User className="w-3.5 h-3.5" />Profile</button>
                  <button onClick={() => { navigate('/billing'); setProfileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"><CreditCard className="w-3.5 h-3.5" />Billing</button>
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"><Settings className="w-3.5 h-3.5" />Settings</button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut className="w-3.5 h-3.5" />Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          <div className="flex items-center justify-between">
{viewMode !== 'effective'?(
  <div className="bg-[#EAEAEA] p-0.5 rounded-lg flex items-center gap-0.5">
    {(['Week', 'Month', 'Quarter'] as TimeFilter[]).map(f => (
      <button key={f} onClick={() => setTimeFilter(f)} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${timeFilter === f ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>{f}</button>
    ))}
  </div>
)
:<>
<div></div>
</>
}
            <div className="flex items-center gap-2.5">
              <button className="bg-white border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-2 shadow-2xs hover:bg-neutral-50">
                Filter by Status <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div className="bg-[#EAEAEA] p-0.5 rounded-lg flex items-center gap-0.5">
                {([{ key: 'calendar', label: 'Calendar' }, { key: 'gantt', label: 'Gantt' }, { key: 'effective', label: 'Overview' }] as { key: ViewMode; label: string }[]).map(({ key, label }) => (
                  <button key={key} onClick={() => setViewMode(key)} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${viewMode === key ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>{label}</button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search apps on projects" className="bg-white border border-neutral-200 rounded-lg pl-8 pr-3 py-1.5 text-[12px] w-56 focus:outline-none focus:border-neutral-400 transition-colors shadow-2xs placeholder:text-neutral-400" />
              </div>
            </div>
          </div>

          {viewMode === 'effective' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <List className="w-4 h-4 text-neutral-400" />, label: 'Active Tasks', value: '12', sub: '10 since last week', subColor: 'text-neutral-400' },
                { icon: <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-400 flex items-center justify-center text-[8px] font-bold">✓</div>, label: 'Completed Tasks', value: '34', sub: '7 since last week', subColor: 'text-neutral-400' },
                { icon: <Clock className="w-4 h-4 text-neutral-400" />, label: 'Pending Reviews', value: '5', sub: '2 since last week', subColor: 'text-neutral-400' },
                { icon: <Sun className="w-4 h-4 text-neutral-400" />, label: 'Efficiency Score', value: '85%', sub: '+5% last month', subColor: 'text-emerald-600 font-medium' },
              ].map((card, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between min-h-[110px]">
                  <div className="flex items-center gap-2 text-neutral-500">
                    {card.icon}
                    <span className="text-[12px] font-medium tracking-tight">{card.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-semibold tracking-tight">{card.value}</span>
                    <span className={`text-[11px] ${card.subColor}`}>{card.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'gantt' && <GanttView expandedProjects={expandedProjects} toggleProject={toggleProject} onTaskClick={openTaskDetail} />}
          {viewMode === 'effective' && <EffectiveView onTaskClick={openTaskDetail} />}
          {viewMode === 'calendar' && <CalendarView onTaskClick={openTaskDetail} onAddTask={() => setShowCreateTask(true)} />}
        </main>
      </div>

      <button onClick={() => setShowCreateTask(true)} className="fixed bottom-7 right-7 w-12 h-12 bg-neutral-900 hover:bg-neutral-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-40">
        <Plus className="w-5 h-5" />
      </button>

      {selectedTask && <TaskDetailModal task={selectedTask} onClose={closeTaskDetail} />}
      {showCreateTask && <CreateTaskModal onClose={() => setShowCreateTask(false)} onCreateAndOpen={() => { setShowCreateTask(false); openTaskDetail() }} />}
      {showCreateProject && <CreateProjectModal onClose={() => setShowCreateProject(false)} />}
    </div>
  )
}