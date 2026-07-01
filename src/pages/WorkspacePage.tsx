import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, LogOut, User, Filter, ChevronDown,
  List, LayoutGrid, Paperclip, MessageSquare,
  ChevronLeft, MoreVertical, Pencil, Send, CreditCard, Settings,
  Plus, LucideNotepadText, CloudUpload, FileText, Share2, Heart
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { CreateProjectModal } from '@/components/shared/CreateProjectModay'

interface WorkspacePageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

type ProjectStatus = 'Queued' | 'In Progress' | 'Completed'
type DisplayMode = 'list' | 'grid' | 'sticky'

interface WorkspaceProject {
  id: string
  name: string
  status: ProjectStatus
  dueDate: string
  progress: number
  assets: number
  members: string[]
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  detailAssets?: DetailAsset[]
  comments?: Comment[]
}

interface DetailAsset {
  id: string
  name: string
  size: string
  type: 'video' | 'audio' | 'image' | 'file'
}

interface Reply {
  id: string
  author: string
  avatar: string
  time: string
  text: string
  likes: number
}

interface Comment {
  id: string
  author: string
  avatar: string
  time: string
  text: string
  likes: number
  attachedAsset?: { name: string; size: string }
  replies?: Reply[]
}

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
]

const WORKSPACE_PROJECTS: WorkspaceProject[] = [
  {
    id: 'tp1',
    name: 'FinTech Mobile Dashboard',
    status: 'Queued',
    dueDate: 'Due Nov 14, 2025',
    progress: 65,
    assets: 2,
    members: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    priority: 'high',
    tags: ['design', 'tech'],
    detailAssets: [
      { id: 'a1', name: 'product_demo_v2.mp4', size: '56MB', type: 'video' },
      { id: 'a2', name: 'background_music.wav', size: '12MB', type: 'audio' },
    ],
    comments: [
      {
        id: 'c1',
        author: 'John Doe',
        avatar: AVATAR_URLS[1],
        time: '2 hours ago',
        text: 'The audio sync looks good. Ready for final review.',
        likes: 2,
        attachedAsset: { name: 'product_demo_v2.mp4', size: '56MB' },
        replies: [
          { id: 'r1', author: 'Jane Doe', avatar: AVATAR_URLS[2], time: '2 hours ago', text: 'Looks solid!', likes: 2 },
        ],
      },
      {
        id: 'c2',
        author: 'Jane Doe',
        avatar: AVATAR_URLS[2],
        time: '2 hours ago',
        text: 'Hello Team. I am done with the designs. Do check the Figma link',
        likes: 1,
      },
    ],
  },
  {
    id: 'tp2',
    name: 'E-commerce Redesign',
    status: 'In Progress',
    dueDate: 'Due Dec 4, 2025',
    progress: 72,
    assets: 5,
    members: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    priority: 'medium',
    tags: ['ux', 'frontend'],
    detailAssets: [
      { id: 'a3', name: 'wireframes_v3.fig', size: '8MB', type: 'file' },
      { id: 'a4', name: 'brand_guide.pdf', size: '3MB', type: 'file' },
    ],
    comments: [
      { id: 'c3', author: 'John Doe', avatar: AVATAR_URLS[1], time: '1 day ago', text: 'Wireframes look great. Can we refine the checkout flow?', likes: 3 },
    ],
  },
  {
    id: 'tp3',
    name: 'Startup Brand Identity',
    status: 'Completed',
    dueDate: 'Due Dec 4, 2025',
    progress: 100,
    assets: 5,
    members: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2]],
    priority: 'low',
    tags: ['branding', 'logo'],
    detailAssets: [{ id: 'a5', name: 'logo_final.svg', size: '120KB', type: 'image' }],
    comments: [],
  },
  {
    id: 'tp4',
    name: 'Analytics Platform',
    status: 'Queued',
    dueDate: 'Due Dec 4, 2025',
    progress: 30,
    assets: 5,
    members: [AVATAR_URLS[0], AVATAR_URLS[1], AVATAR_URLS[2], AVATAR_URLS[3]],
    priority: 'high',
    tags: ['data', 'charts'],
    detailAssets: [{ id: 'a6', name: 'dashboard_spec.pdf', size: '2MB', type: 'file' }],
    comments: [],
  },
]

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-[12px] font-medium bg-neutral-100 text-neutral-600">
      {status}
    </span>
  )
}

function PriorityBar({ priority }: { priority?: 'low' | 'medium' | 'high' }) {
  if (!priority) return null
  const colors: Record<string, string> = { low: 'bg-neutral-300', medium: 'bg-neutral-500', high: 'bg-neutral-900' }
  return <span className={`inline-block w-[3px] h-5 rounded-full ${colors[priority]}`} />
}

function AssetFileIcon({ type }: { type: DetailAsset['type'] }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
      {type === 'video' || type === 'audio' ? (
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
      ) : type === 'image' ? (
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
      ) : (
        <Paperclip className="w-4 h-4 text-neutral-500" />
      )}
    </div>
  )
}

// ─── Board (Kanban) ───────────────────────────────────────────────────────────

type ColId = 'queued' | 'inprogress' | 'completed'

const BOARD_COLUMNS: { id: ColId; label: string; statuses: ProjectStatus[] }[] = [
  { id: 'queued',     label: 'Queued',      statuses: ['Queued'] },
  { id: 'inprogress', label: 'In Progress', statuses: ['In Progress'] },
  { id: 'completed',  label: 'Completed',   statuses: ['Completed'] },
]

function BoardCard({
  project,
  onDragStart,
  onDragOver,
  onDrop,
  onClick,
}: {
  project: WorkspaceProject
  onDragStart: () => void
  onDragOver: (e: React.DragEvent, before: boolean) => void
  onDrop: (e: React.DragEvent, before: boolean) => void
  onClick: () => void
}) {
  const [dropSide, setDropSide] = useState<'above' | 'below' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const getSide = (e: React.DragEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    return rect ? e.clientY < rect.top + rect.height / 2 : true
  }

  return (
    <div
      ref={ref}
      draggable
      onClick={onClick}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setTimeout(onDragStart, 0) }}
      onDragEnd={() => setDropSide(null)}
      onDragOver={(e) => { e.preventDefault(); const b = getSide(e); setDropSide(b ? 'above' : 'below'); onDragOver(e, b) }}
      onDragLeave={() => setDropSide(null)}
      onDrop={(e) => { e.preventDefault(); const b = getSide(e); setDropSide(null); onDrop(e, b) }}
      className={[
        'bg-white rounded-xl p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing',
        'hover:shadow-sm transition-shadow select-none border-l-[3px]',
        project.priority === 'high'   ? 'border-l-neutral-900' :
        project.priority === 'medium' ? 'border-l-neutral-400' :
                                        'border-l-neutral-200',
        dropSide === 'above' ? 'border-t-2 border-t-neutral-900 rounded-tl-none' : '',
        dropSide === 'below' ? 'border-b-2 border-b-neutral-900 rounded-bl-none' : '',
      ].join(' ')}
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[13px] font-bold text-neutral-900 leading-snug">{project.name}</h3>
        <span className="text-[11px] text-neutral-400">{project.dueDate}</span>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="text-[10px] font-medium text-neutral-500 bg-neutral-100 rounded-md px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Members + assets */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.map((src, i) => (
            <img key={i} src={src} alt="" className="w-6 h-6 rounded-full ring-2 ring-white object-cover" />
          ))}
        </div>
        <div className="flex items-center gap-1 text-neutral-400">
          <Paperclip className="w-3 h-3" />
          <span className="text-[11px] text-neutral-400">{project.assets}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-[4px] bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${project.progress}%` }} />
        </div>
        <span className="text-[10px] text-neutral-400 flex-shrink-0">{project.progress}%</span>
      </div>
    </div>
  )
}

function BoardColumn({
  col,
  projects,
  onCardDragStart,
  onCardDrop,
  onEmptyDrop,
  onSelectProject,
}: {
  col: (typeof BOARD_COLUMNS)[number]
  projects: WorkspaceProject[]
  onCardDragStart: (id: string) => void
  onCardDrop: (toCol: ColId, targetId: string, before: boolean) => void
  onEmptyDrop: (toCol: ColId) => void
  onSelectProject: (p: WorkspaceProject) => void
}) {
  const [emptyHover, setEmptyHover] = useState(false)

  return (
    <div className="flex-1 min-w-[220px] bg-[#EFEFEF] rounded-2xl p-3 flex flex-col gap-2">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 py-1">
        <span className="text-[13px] font-semibold text-neutral-700">{col.label}</span>
        <span className="text-[11px] font-medium text-neutral-400 bg-white border border-neutral-200 rounded-full px-2.5 py-0.5">
          {projects.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {projects.map(project => (
          <BoardCard
            key={project.id}
            project={project}
            onDragStart={() => onCardDragStart(project.id)}
            onDragOver={() => {}}
            onDrop={(_e, before) => onCardDrop(col.id, project.id, before)}
            onClick={() => onSelectProject(project)}
          />
        ))}

        {/* Empty drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setEmptyHover(true) }}
          onDragLeave={() => setEmptyHover(false)}
          onDrop={(e) => { e.preventDefault(); setEmptyHover(false); onEmptyDrop(col.id) }}
          className={[
            'flex items-center justify-center rounded-xl min-h-[52px]',
            'text-[11px] border-[1.5px] border-dashed transition-colors',
            projects.length > 0 ? 'min-h-[36px]' : '',
            emptyHover
              ? 'border-neutral-400 text-neutral-500 bg-white'
              : 'border-neutral-300 text-neutral-300',
          ].join(' ')}
        >
          {projects.length === 0 ? 'Drop here' : ''}
        </div>
      </div>
    </div>
  )
}

function StickyBoard({ projects, onSelectProject }: { projects: WorkspaceProject[]; onSelectProject: (p: WorkspaceProject) => void }) {
  const buildState = (): Record<ColId, string[]> => {
    const s: Record<ColId, string[]> = { queued: [], inprogress: [], completed: [] }
    projects.forEach(p => {
      if (p.status === 'Queued') s.queued.push(p.id)
      else if (p.status === 'In Progress') s.inprogress.push(p.id)
      else if (p.status === 'Completed') s.completed.push(p.id)
    })
    return s
  }

  const [colState, setColState] = useState<Record<ColId, string[]>>(buildState)
  const dragging = useRef<{ id: string } | null>(null)
  const projectsMap = Object.fromEntries(projects.map(p => [p.id, p]))

  const removeFromAll = (state: Record<ColId, string[]>, id: string): Record<ColId, string[]> => {
    const next = { ...state }
    for (const col of BOARD_COLUMNS) next[col.id] = next[col.id].filter(i => i !== id)
    return next
  }

  const handleDragStart = (id: string) => { dragging.current = { id } }

  const handleCardDrop = (toCol: ColId, targetId: string, before: boolean) => {
    if (!dragging.current) return
    const { id } = dragging.current
    if (id === targetId) return
    setColState(prev => {
      const next = removeFromAll({ ...prev }, id)
      const list = [...next[toCol]]
      const idx = list.indexOf(targetId)
      if (idx === -1) list.push(id)
      else before ? list.splice(idx, 0, id) : list.splice(idx + 1, 0, id)
      return { ...next, [toCol]: list }
    })
    dragging.current = null
  }

  const handleEmptyDrop = (toCol: ColId) => {
    if (!dragging.current) return
    const { id } = dragging.current
    setColState(prev => {
      const next = removeFromAll({ ...prev }, id)
      return { ...next, [toCol]: [...next[toCol], id] }
    })
    dragging.current = null
  }

  return (
    <div className="flex gap-4 w-full overflow-x-auto pb-2">
      {BOARD_COLUMNS.map(col => {
        const colProjects = colState[col.id].map(id => projectsMap[id]).filter(Boolean) as WorkspaceProject[]
        return (
          <BoardColumn
            key={col.id}
            col={col}
            projects={colProjects}
            onCardDragStart={handleDragStart}
            onCardDrop={handleCardDrop}
            onEmptyDrop={handleEmptyDrop}
            onSelectProject={onSelectProject}
          />
        )
      })}
    </div>
  )
}

// ─── Project Card (Grid) ──────────────────────────────────────────────────────

function ProjectCard({ project, onClick }: { project: WorkspaceProject; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-bold text-neutral-900 leading-tight">{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-neutral-500">{project.dueDate}</span>
        <PriorityBar priority={project.priority} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2.5">
          {project.members.map((src, i) => (
            <img key={i} src={src} alt="" className="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Paperclip className="w-3.5 h-3.5" />
          <span className="text-[12px] font-medium text-neutral-500">{project.assets} assets</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-[5px] bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-900 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
        </div>
        <div className="text-[10px] font-medium text-neutral-500">{project.progress}%</div>
      </div>
    </div>
  )
}

// ─── Project List Row ─────────────────────────────────────────────────────────

function ProjectListRow({ project, onClick }: { project: WorkspaceProject; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white border border-neutral-200 rounded-xl px-5 py-4 flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[13px] font-bold text-neutral-900 truncate">{project.name}</span>
          <StatusBadge status={project.status} />
        </div>
      </div>
      <span className="text-[12px] text-neutral-500 flex-shrink-0 w-36">{project.dueDate}</span>
      <div className="flex -space-x-2.5 flex-shrink-0">
        {project.members.map((src, i) => (
          <img key={i} src={src} alt="" className="w-7 h-7 rounded-full ring-2 ring-white object-cover" />
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-neutral-400 flex-shrink-0 w-24 justify-end">
        <Paperclip className="w-3.5 h-3.5" />
        <span className="text-[12px] font-medium text-neutral-500">{project.assets} assets</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 w-40">
        <div className="flex-1 h-[5px] bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${project.progress}%` }} />
        </div>
        <PriorityBar priority={project.priority} />
        <MessageSquare className="w-4 h-4 text-neutral-300" />
      </div>
    </div>
  )
}

// ─── Project Detail ───────────────────────────────────────────────────────────

function WorkspaceProjectDetail({ project, onBack }: { project: WorkspaceProject; onBack: () => void }) {
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>(project.comments ?? [])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const commentInputRef = useRef<HTMLInputElement>(null)
  const priorityLabel: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High' }

  const handleSendComment = () => {
    if (!commentText.trim()) return
    setComments(prev => [...prev, { id: `c${Date.now()}`, author: 'You', avatar: AVATAR_URLS[3], time: 'Just now', text: commentText.trim(), likes: 0 }])
    setCommentText('')
  }

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: [...(c.replies ?? []), { id: `r${Date.now()}`, author: 'You', avatar: AVATAR_URLS[3], time: 'Just now', text: replyText.trim(), likes: 0 }] } : c))
    setReplyText('')
    setReplyingTo(null)
  }

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
  }

  return (
    <div className="flex flex-col gap-6 max-w-[860px] mx-auto w-full">
      <button onClick={onBack} className="flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit">
        <ChevronLeft className="w-4 h-4" />Back
      </button>
      <div className="bg-white border border-neutral-200 rounded-2xl px-7 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-6 bg-neutral-900 rounded-full flex-shrink-0" />
              <h1 className="text-[18px] font-bold text-neutral-900 leading-tight">{project.name}</h1>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[13px] text-neutral-500">Due: {project.dueDate.replace('Due ', '')}</span>
              {project.priority && (
                <span className="text-[13px] text-neutral-500">Priority: <span className="font-semibold text-neutral-800 capitalize">{priorityLabel[project.priority]}</span></span>
              )}
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((src, i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full ring-2 ring-white object-cover" />
                ))}
              </div>
              {project.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-[12px] font-medium text-neutral-600">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button className="flex items-center gap-2 border border-neutral-200 rounded-xl px-4 py-2 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Paperclip className="w-3.5 h-3.5" />Attach Assets
            </button>
            <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white rounded-xl px-4 py-2 text-[12px] font-semibold transition-colors">
              <Pencil className="w-3.5 h-3.5" />Edit Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold text-neutral-800">Assets</h2>
        <div className="flex flex-wrap gap-3">
          {(project.detailAssets ?? []).map(asset => (
            <div key={asset.id} className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 hover:shadow-sm transition-shadow cursor-pointer group min-w-[200px]">
              <AssetFileIcon type={asset.type} />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[12px] font-semibold text-neutral-800 truncate">{asset.name}</span>
                <span className="text-[11px] text-neutral-400">{asset.size}</span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-neutral-100 text-neutral-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[13px] font-bold text-neutral-800">Activity & Comments</h2>
        <div className="flex flex-col gap-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[13px] font-bold text-neutral-900">{comment.author}</span>
                    <span className="text-[11px] text-neutral-400">{comment.time}</span>
                  </div>
                  <p className="text-[13px] text-neutral-700 leading-relaxed">{comment.text}</p>
                  {comment.attachedAsset && (
                    <div className="flex items-center gap-2.5 mt-3 bg-white border border-neutral-200 rounded-xl px-3 py-2.5 w-fit group cursor-pointer hover:shadow-sm transition-shadow">
                      <div className="w-7 h-7 rounded-md bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-neutral-800">{comment.attachedAsset.name}</span>
                        <span className="text-[10px] text-neutral-400">{comment.attachedAsset.size}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pl-1">
                  <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
                    <span>👍</span><span className="font-medium">{comment.likes}</span>
                  </button>
                  <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-[12px] font-medium text-neutral-400 hover:text-neutral-700 underline underline-offset-2 transition-colors">
                    Reply {comment.replies?.length ? `(${comment.replies.length})` : ''}
                  </button>
                </div>
                {comment.replies && comment.replies.length > 0 && (
                  <div className="flex flex-col gap-2 pl-4 border-l-2 border-neutral-100 ml-1">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex gap-2.5">
                        <img src={reply.avatar} alt={reply.author} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="bg-neutral-50 border border-neutral-100 rounded-xl rounded-tl-sm px-3 py-2.5">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="text-[12px] font-bold text-neutral-900">{reply.author}</span>
                              <span className="text-[10px] text-neutral-400">{reply.time}</span>
                            </div>
                            <p className="text-[12px] text-neutral-700 leading-relaxed">{reply.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {replyingTo === comment.id && (
                  <div className="flex items-center gap-2 pl-4">
                    <img src={AVATAR_URLS[3]} alt="You" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 flex items-center border border-neutral-200 rounded-xl px-3 py-2 bg-white gap-2 focus-within:border-neutral-400 transition-colors">
                      <input type="text" autoFocus value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSendReply(comment.id) }} placeholder={`Reply to ${comment.author}...`} className="flex-1 text-[12px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none bg-transparent" />
                    </div>
                    <button onClick={() => handleSendReply(comment.id)} className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors">
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {comments.length === 0 && (
          <div className="text-center py-8 text-[13px] text-neutral-300">No comments yet. Be the first to comment.</div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-4 py-3 sticky bottom-4 shadow-lg">
        <img src={AVATAR_URLS[3]} alt="You" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <input ref={commentInputRef} type="text" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSendComment() }} placeholder="Write a comment" className="flex-1 text-[13px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none bg-transparent" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 border border-neutral-200 rounded-xl px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Paperclip className="w-3.5 h-3.5" />Attach
          </button>
          <button onClick={handleSendComment} className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-700 text-white rounded-xl px-4 py-1.5 text-[12px] font-semibold transition-colors">
            <Send className="w-3.5 h-3.5" />Send
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function WorkspaceMainContent({ onSelectProject }: { onSelectProject: (p: WorkspaceProject) => void }) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid')
  const [search, setSearch] = useState('')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const filtered = WORKSPACE_PROJECTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks, projects..." className="bg-white border border-neutral-200 rounded-lg pl-9 pr-4 py-2 text-[12px] w-72 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 shadow-2xs" />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 shadow-2xs transition-colors">
            <Filter className="w-3.5 h-3.5" />Filter
          </button>
          <div className="relative" ref={sortRef}>
            <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 shadow-2xs transition-colors">
              Sort<ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-neutral-200 rounded-xl shadow-xl p-1.5 z-20">
                {['Name', 'Due Date', 'Status', 'Progress'].map(opt => (
                  <button key={opt} className="w-full text-left px-3 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors">{opt}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-2xs">
            <button
              onClick={() => setDisplayMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-colors ${displayMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <List className="w-3.5 h-3.5" />List
            </button>
            <button
              onClick={() => setDisplayMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-colors border-l border-neutral-200 ${displayMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />Grid
            </button>
            <button
              onClick={() => setDisplayMode('sticky')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-colors border-l border-neutral-200 ${displayMode === 'sticky' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <LucideNotepadText className="w-3.5 h-3.5" />Board
            </button>
          </div>
        </div>
      </div>

      {displayMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(project => <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />)}
        </div>
      )}

      {displayMode === 'list' && (
        <div className="flex flex-col gap-3">
          {filtered.map(project => <ProjectListRow key={project.id} project={project} onClick={() => onSelectProject(project)} />)}
        </div>
      )}

      {displayMode === 'sticky' && (
        <StickyBoard projects={filtered} onSelectProject={onSelectProject} />
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[13px] text-neutral-400">No projects match your search.</div>
      )}
    </div>
  )
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export function WorkspacePage({ sidebarExpanded, onToggleSidebar }: WorkspacePageProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [showCreateProject, setShowCreateProject] = useState(false)

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

  const handleLogout = () => {
    localStorage.removeItem('tala_token')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans antialiased selection:bg-neutral-200">
      <Sidebar isExpanded={sidebarExpanded} onToggle={onToggleSidebar} />
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out" style={{ marginLeft: sidebarExpanded ? '14rem' : '52px' }}>
        <header className="flex items-center justify-between h-14 px-8 border-b border-neutral-200/60 bg-[#F4F4F4]/80 backdrop-blur-md sticky top-0 z-30">
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Projects</span>
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
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                    <User className="w-3.5 h-3.5" />Profile
                  </button>
                  <button onClick={() => { navigate('/billing'); setProfileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                    <CreditCard className="w-3.5 h-3.5" />Billing
                  </button>
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false) }} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                    <Settings className="w-3.5 h-3.5" />Settings
                  </button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-3.5 h-3.5" />Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
          {selectedProject ? (
            <WorkspaceProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
          ) : (
            <WorkspaceMainContent onSelectProject={setSelectedProject} />
          )}
        </main>

        {!selectedProject && (
          <button onClick={() => setShowCreateProject(true)} className="fixed bottom-7 right-7 w-12 h-12 bg-neutral-900 hover:bg-neutral-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-40">
            <Plus className="w-5 h-5" />
          </button>
        )}
        {showCreateProject && <CreateProjectModal onClose={() => setShowCreateProject(false)} />}
      </div>
    </div>
  )
}