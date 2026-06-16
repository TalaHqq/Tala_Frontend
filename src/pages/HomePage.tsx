import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, LogOut, User, CreditCard, Settings,
  Plus, Users, FolderPlus, Upload, UserPlus,
  TrendingUp, Palette, Laptop, BarChart2,Speaker,
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'

interface HomePageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkflowState = 'Queued' | 'In Progress' | 'Completed'

interface Task {
  id: string
  name: string
  state: WorkflowState
  due: string
}

interface Project {
  id: string
  name: string
  team: string
  taskCount: number
  progress: number
  icon: React.ElementType
}

interface TeamSummary {
  id: string
  name: string
  memberCount: number
  projectCount: number
  visibility: 'visible' | 'secret'
  role: 'Owner' | 'Maintainer' | 'Member' | 'Viewer'
}

interface ActivityItem {
  id: string
  actor: string
  avatar: string
  action: string
  target: string
  time: string
}

// ─── Static data ──────────────────────────────────────────────────────────────

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
]

const TASKS: Task[] = [
  { id: 'tk1', name: 'Revise homepage hero copy',     state: 'Queued',      due: 'Today'  },
  { id: 'tk2', name: 'Design system token audit',     state: 'In Progress', due: 'Today'  },
  { id: 'tk3', name: 'Brand identity review',         state: 'Completed',   due: 'Done'   },
  { id: 'tk4', name: 'Q3 competitor analysis deck',   state: 'Queued',      due: 'Jun 17' },
  { id: 'tk5', name: 'Frontend onboarding flow',      state: 'In Progress', due: 'Jun 18' },
]

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Brand Redesign Q2',  team: 'Design System',        taskCount: 3, progress: 72, icon: Palette   },
  { id: 'p2', name: 'Web Platform v3',    team: 'Frontend Engineering',  taskCount: 8, progress: 41, icon: Laptop    },
  { id: 'p3', name: 'Growth Experiments', team: 'Growth & Research',     taskCount: 5, progress: 60, icon: BarChart2 },
]

const TEAMS: TeamSummary[] = [
  { id: 't1', name: 'Design System',        memberCount: 3, projectCount: 3, visibility: 'visible', role: 'Owner'  },
  { id: 't2', name: 'Frontend Engineering', memberCount: 2, projectCount: 5, visibility: 'visible', role: 'Member' },
  { id: 't3', name: 'Growth & Research',    memberCount: 3, projectCount: 2, visibility: 'secret',  role: 'Member' },
]

const ACTIVITY: ActivityItem[] = [
  { id: 'a1', actor: 'Kweku Mensah', avatar: AVATAR_URLS[1], action: 'uploaded',    target: 'Design_v3.png → Brand Redesign',    time: '2h ago' },
  { id: 'a2', actor: 'Efua Asante',  avatar: AVATAR_URLS[2], action: 'moved',       target: '"Token audit" to In Progress',       time: '4h ago' },
  { id: 'a3', actor: 'Kofi Boateng', avatar: AVATAR_URLS[3], action: 'commented on', target: '"Frontend onboarding flow"',         time: '6h ago' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATE_STYLES: Record<WorkflowState, string> = {
  'Queued':      'text-amber-700 bg-amber-50 border border-amber-200',
  'In Progress': 'text-blue-700 bg-blue-50 border border-blue-200',
  'Completed':   'text-green-700 bg-green-50 border border-green-200',
}

const STATE_DOT: Record<WorkflowState, string> = {
  'Queued':      'bg-amber-400',
  'In Progress': 'bg-blue-500',
  'Completed':   'bg-green-500',
}

function StateBadge({ state }: { state: WorkflowState }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${STATE_STYLES[state]}`}>
      {state}
    </span>
  )
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage({ sidebarExpanded, onToggleSidebar }: HomePageProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('tala_token')
    navigate('/login')
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans antialiased selection:bg-neutral-200">
      <Sidebar isExpanded={sidebarExpanded} onToggle={onToggleSidebar} />

      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarExpanded ? '14rem' : '52px' }}
      >
        {/* ── Header ── */}
        <header className="flex items-center justify-between h-14 px-8 border-b border-neutral-200/60 bg-[#F4F4F4]/80 backdrop-blur-md sticky top-0 z-30">
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Home</span>

          <div className="flex items-center gap-5">
            <button className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-0.5 rounded-full border border-neutral-300 hover:border-neutral-400 transition-all overflow-hidden"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white shadow-xl p-1.5 z-50">
                  <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                    <p className="text-[12px] font-bold">Ama Owusu</p>
                    <p className="text-[10px] text-neutral-400">Premium Account</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />Profile
                  </button>
                  <button
                    onClick={() => { navigate('/billing'); setProfileOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />Billing
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />Settings
                  </button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 p-8 max-w-[1200px] w-full mx-auto flex flex-col gap-6">

          {/* Greeting */}
          <div>
            <h1 className="text-[20px] font-bold text-neutral-900">Hey there, Ama </h1><Speaker/>
            <p className="text-[12px] text-neutral-400 mt-0.5">{today} · Here's what's on your plate today.</p>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-4 gap-4">
            {/* Active projects */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Active projects</p>
              <p className="text-[24px] font-bold text-neutral-900">8</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                <TrendingUp className="w-2.5 h-2.5" />2 this week
              </span>
            </div>

            {/* Tasks due today */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Tasks due today</p>
              <p className="text-[24px] font-bold text-neutral-900">4</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 mt-1">
                1 overdue
              </span>
            </div>

            {/* Efficiency score */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Efficiency score</p>
              <p className="text-[24px] font-bold text-neutral-900">87%</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 mt-1">
                +3 pts this month
              </span>
            </div>

            {/* Collaborators */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Collaborators</p>
              <p className="text-[24px] font-bold text-neutral-900">12</p>
              <p className="text-[11px] text-neutral-400 mt-1">across 3 teams</p>
            </div>
          </div>

          {/* ── Tasks + Projects ── */}
          <div className="grid grid-cols-[1fr_340px] gap-4">
            {/* Tasks due today */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold text-neutral-900">Tasks due today</h2>
                <button
                  onClick={() => navigate('/timeline')}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  View all →
                </button>
              </div>

              <div className="flex flex-col">
                {TASKS.map((task, i) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 py-2.5 ${i < TASKS.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATE_DOT[task.state]}`} />
                    <span className="text-[12px] font-semibold text-neutral-800 flex-1 min-w-0 truncate">{task.name}</span>
                    <StateBadge state={task.state} />
                    <span className="text-[10px] text-neutral-400 flex-shrink-0 w-12 text-right">{task.due}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active projects */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold text-neutral-900">Projects</h2>
                <button
                  onClick={() => navigate('/workspace')}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  All →
                </button>
              </div>

              <div className="flex flex-col">
                {PROJECTS.map((proj, i) => {
                  const Icon = proj.icon
                  return (
                    <div
                      key={proj.id}
                      className={`flex items-center gap-3 py-3 cursor-pointer group ${i < PROJECTS.length - 1 ? 'border-b border-neutral-100' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-neutral-900 truncate group-hover:text-neutral-600 transition-colors">{proj.name}</p>
                        <p className="text-[10px] text-neutral-400">{proj.team} · {proj.taskCount} tasks</p>
                      </div>
                      <div className="w-14 flex-shrink-0">
                        <p className="text-[11px] font-bold text-neutral-900 text-right mb-1">{proj.progress}%</p>
                        <div className="h-1 bg-neutral-100 rounded-full">
                          <div
                            className="h-1 bg-neutral-900 rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Teams + Activity + Quick actions ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Teams */}
            <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold text-neutral-900">Your teams</h2>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  Manage →
                </button>
              </div>

              <div className="flex flex-col">
                {TEAMS.map((team, i) => (
                  <div
                    key={team.id}
                    className={`flex items-center gap-3 py-3 ${i < TEAMS.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-neutral-900">{team.name}</p>
                      <p className="text-[10px] text-neutral-400">{team.memberCount} members · {team.projectCount} projects</p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        team.visibility === 'secret'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {team.visibility === 'secret' ? 'Secret' : team.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Recent activity */}
              <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5">
                <h2 className="text-[13px] font-bold text-neutral-900 mb-4">Recent activity</h2>
                <div className="flex flex-col">
                  {ACTIVITY.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 py-2.5 ${i < ACTIVITY.length - 1 ? 'border-b border-neutral-100' : ''}`}
                    >
                      <img
                        src={item.avatar}
                        alt={item.actor}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                      />
                      <p className="text-[11px] text-neutral-500 flex-1 leading-relaxed">
                        <span className="font-semibold text-neutral-800">{item.actor}</span>
                        {' '}{item.action}{' '}
                        <span className="text-neutral-600">{item.target}</span>
                      </p>
                      <span className="text-[10px] text-neutral-400 flex-shrink-0 mt-0.5">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5">
                <h2 className="text-[13px] font-bold text-neutral-900 mb-3">Quick actions</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'New task',      icon: Plus,       action: () => navigate('/timeline') },
                    { label: 'New project',   icon: FolderPlus, action: () => navigate('/workspace') },
                    { label: 'Upload asset',  icon: Upload,     action: () => navigate('/library') },
                    { label: 'Invite member', icon: UserPlus,   action: () => navigate('/teams') },
                  ].map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-neutral-300 rounded-xl text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 hover:border-neutral-500 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}