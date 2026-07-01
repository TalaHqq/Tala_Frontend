import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, LogOut, User, CreditCard, Settings,
  Plus, Users, ChevronLeft, MoreVertical, Crown,
  Shield, Eye, Trash2, UserPlus, Copy,
  Check, Lock, Globe, ChevronDown, Send, X,
  CloudUpload, FileText, Share2, Heart,
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'

interface TeamsPageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TeamRole = 'owner' | 'maintainer' | 'member' | 'viewer'
type TeamVisibility = 'visible' | 'secret'

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: TeamRole
  joinedAt: string
}

interface Team {
  id: string
  name: string
  slug: string
  description: string
  visibility: TeamVisibility
  members: TeamMember[]
  projectCount: number
  createdAt: string
}

interface NotificationItem {
  id: string
  type: 'upload' | 'comment' | 'share' | 'favorite' | 'system'
  title: string
  description: string
  time: string
  read: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
]

const INITIAL_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Design System',
    slug: 'design-system',
    description: 'Responsible for the visual language, components, and design tokens across all products.',
    visibility: 'visible',
    projectCount: 3,
    createdAt: 'Jan 12, 2025',
    members: [
      { id: 'm1', name: 'Ama Owusu', avatar: AVATAR_URLS[0], role: 'owner', joinedAt: 'Jan 12, 2025' },
      { id: 'm2', name: 'Kweku Mensah', avatar: AVATAR_URLS[1], role: 'maintainer', joinedAt: 'Jan 14, 2025' },
      { id: 'm3', name: 'Efua Asante', avatar: AVATAR_URLS[2], role: 'member', joinedAt: 'Feb 1, 2025' },
    ],
  },
  {
    id: 't2',
    name: 'Frontend Engineering',
    slug: 'frontend-eng',
    description: 'Builds and maintains all client-facing web and mobile interfaces.',
    visibility: 'visible',
    projectCount: 5,
    createdAt: 'Feb 3, 2025',
    members: [
      { id: 'm4', name: 'Kofi Boateng', avatar: AVATAR_URLS[3], role: 'owner', joinedAt: 'Feb 3, 2025' },
      { id: 'm1', name: 'Ama Owusu', avatar: AVATAR_URLS[0], role: 'member', joinedAt: 'Feb 5, 2025' },
    ],
  },
  {
    id: 't3',
    name: 'Growth & Research',
    slug: 'growth-research',
    description: 'User research, analytics, and growth experiments. Internal only.',
    visibility: 'secret',
    projectCount: 2,
    createdAt: 'Mar 20, 2025',
    members: [
      { id: 'm2', name: 'Kweku Mensah', avatar: AVATAR_URLS[1], role: 'owner', joinedAt: 'Mar 20, 2025' },
      { id: 'm3', name: 'Efua Asante', avatar: AVATAR_URLS[2], role: 'maintainer', joinedAt: 'Mar 21, 2025' },
      { id: 'm4', name: 'Kofi Boateng', avatar: AVATAR_URLS[3], role: 'viewer', joinedAt: 'Apr 2, 2025' },
    ],
  },
]

const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', type: 'share',    title: 'Added to team',        description: 'You were added to "Frontend Engineering" as a member', time: '10 mins ago', read: false },
  { id: 'n2', type: 'comment',  title: 'Role changed',         description: 'Kweku Mensah promoted you to Maintainer in Design System', time: '1 hour ago',  read: false },
  { id: 'n3', type: 'share',    title: 'New invite accepted',  description: 'Efua Asante joined "Growth & Research"',                time: 'Yesterday',   read: false },
  { id: 'n4', type: 'favorite', title: 'Team milestone',       description: 'Design System just shipped its 3rd project',            time: '2 days ago',  read: true  },
  { id: 'n5', type: 'system',   title: 'Pending invite',       description: 'Your invite to Kofi Boateng is still pending',          time: '3 days ago',  read: true  },
]

function notificationIcon(type: NotificationItem['type']) {
  switch (type) {
    case 'upload': return <CloudUpload className="w-3.5 h-3.5" />
    case 'comment': return <FileText className="w-3.5 h-3.5" />
    case 'share': return <Share2 className="w-3.5 h-3.5" />
    case 'favorite': return <Heart className="w-3.5 h-3.5" />
    default: return <Bell className="w-3.5 h-3.5" />
  }
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

const ROLE_META: Record<TeamRole, { label: string; icon: React.ElementType; color: string }> = {
  owner:      { label: 'Owner',      icon: Crown,  color: 'text-amber-600 bg-amber-50 border-amber-200' },
  maintainer: { label: 'Maintainer', icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  member:     { label: 'Member',     icon: Users,  color: 'text-neutral-600 bg-neutral-100 border-neutral-200' },
  viewer:     { label: 'Viewer',     icon: Eye,    color: 'text-neutral-400 bg-neutral-50 border-neutral-200' },
}

function RoleBadge({ role }: { role: TeamRole }) {
  const { label, icon: Icon, color } = ROLE_META[role]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

// ─── Create Team Modal ────────────────────────────────────────────────────────

function CreateTeamModal({ onClose, onCreate }: { onClose: () => void; onCreate: (team: Team) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<TeamVisibility>('visible')
  const [inviteEmails, setInviteEmails] = useState('')
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleCreate = () => {
    if (!name.trim()) return
    const team: Team = {
      id: `t${Date.now()}`,
      name: name.trim(),
      slug,
      description: description.trim(),
      visibility,
      projectCount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      members: [
        { id: `m${Date.now()}`, name: 'You', avatar: AVATAR_URLS[3], role: 'owner', joinedAt: 'Just now' },
      ],
    }
    onCreate(team)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] h-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div>
            <h2 className="text-[15px] font-bold text-neutral-900">Create a new team</h2>
            <p className="text-[12px] text-neutral-400 mt-0.5">Teams let you collaborate on specific projects with focused members.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto">
          {/* Team name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-neutral-700">Team name <span className="text-red-400">*</span></label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Design System"
              className="border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
            />
            {slug && (
              <p className="text-[11px] text-neutral-400">Slug: <span className="font-mono text-neutral-600">{slug}</span></p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-neutral-700">Description <span className="text-neutral-300 font-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this team work on?"
              rows={2}
              className="border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
            />
          </div>

          {/* Visibility */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-neutral-700">Visibility</label>
            <div className="flex flex-col gap-2">
              {(['visible', 'secret'] as TeamVisibility[]).map(v => (
                <button
                  key={v}
                  onClick={() => setVisibility(v)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${visibility === v ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${visibility === v ? 'border-neutral-900' : 'border-neutral-300'}`}>
                    {visibility === v && <div className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      {v === 'visible' ? <Globe className="w-3.5 h-3.5 text-neutral-500" /> : <Lock className="w-3.5 h-3.5 text-neutral-500" />}
                      <span className="text-[13px] font-semibold text-neutral-800 capitalize">{v}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {v === 'visible' ? 'All workspace members can see this team and its projects.' : 'Only team members can see this team. Hidden from others.'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Invite */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-neutral-700">Invite members <span className="text-neutral-300 font-normal">(optional)</span></label>
            <input
              value={inviteEmails}
              onChange={e => setInviteEmails(e.target.value)}
              placeholder="name@email.com, name2@email.com"
              className="border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
            />
            <p className="text-[11px] text-neutral-400">Separate multiple emails with commas. They'll be added as members.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-neutral-600 hover:bg-neutral-50 border border-neutral-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-xl text-[12px] font-semibold bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Create team
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamRole>('member')
  const [copied, setCopied] = useState(false)
  const inviteLink = `https://tala.app/invite/${team.slug}/abc123`

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h2 className="text-[15px] font-bold text-neutral-900">Invite to {team.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Email invite */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-neutral-700">Invite by email</label>
            <div className="flex gap-2">
              <input
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="flex-1 border border-neutral-200 rounded-xl px-3 py-2 text-[13px] placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value as TeamRole)}
                className="border border-neutral-200 rounded-xl px-2 py-2 text-[12px] text-neutral-700 focus:outline-none focus:border-neutral-400 transition-colors bg-white"
              >
                {(['maintainer', 'member', 'viewer'] as TeamRole[]).map(r => (
                  <option key={r} value={r}>{ROLE_META[r].label}</option>
                ))}
              </select>
            </div>
            <button
              disabled={!email.trim()}
              className="self-end mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3 h-3" />Send invite
            </button>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Invite link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-neutral-700">Or share invite link</label>
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5">
              <span className="flex-1 text-[11px] font-mono text-neutral-500 truncate">{inviteLink}</span>
              <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex-shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Team Detail ──────────────────────────────────────────────────────────────

function TeamDetail({ team, onBack, onUpdate }: { team: Team; onBack: () => void; onUpdate: (t: Team) => void }) {
  const [showInvite, setShowInvite] = useState(false)
  const [activeTab, setActiveTab] = useState<'members' | 'projects' | 'settings'>('members')
  const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null)

  const handleRoleChange = (memberId: string, newRole: TeamRole) => {
    onUpdate({ ...team, members: team.members.map(m => m.id === memberId ? { ...m, role: newRole } : m) })
    setOpenRoleMenu(null)
  }

  const handleRemoveMember = (memberId: string) => {
    onUpdate({ ...team, members: team.members.filter(m => m.id !== memberId) })
  }

  const TABS = ['members', 'projects', 'settings'] as const

  return (
    <div className="flex flex-col gap-6 max-w-[860px] mx-auto w-full">
      <button onClick={onBack} className="flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit">
        <ChevronLeft className="w-4 h-4" />All teams
      </button>

      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl px-7 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[18px] font-bold text-neutral-900">{team.name}</h1>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${team.visibility === 'secret' ? 'text-neutral-500 bg-neutral-50 border-neutral-200' : 'text-neutral-500 bg-neutral-50 border-neutral-200'}`}>
                    {team.visibility === 'secret' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {team.visibility === 'secret' ? 'Secret' : 'Visible'}
                  </span>
                </div>
                <p className="text-[12px] text-neutral-400 font-mono">/{team.slug}</p>
              </div>
            </div>
            {team.description && <p className="text-[13px] text-neutral-500 max-w-lg">{team.description}</p>}
            <div className="flex items-center gap-4 text-[12px] text-neutral-400">
              <span>{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>{team.projectCount} project{team.projectCount !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>Created {team.createdAt}</span>
            </div>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white rounded-xl px-4 py-2 text-[12px] font-semibold transition-colors flex-shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />Invite
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Members tab */}
      {activeTab === 'members' && (
        <div className="flex flex-col gap-2">
          {team.members.map(member => (
            <div key={member.id} className="bg-white border border-neutral-200 rounded-xl px-5 py-3.5 flex items-center gap-4">
              <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-neutral-900">{member.name}</p>
                <p className="text-[11px] text-neutral-400">Joined {member.joinedAt}</p>
              </div>
              {/* Role dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenRoleMenu(openRoleMenu === member.id ? null : member.id)}
                  className="flex items-center gap-1.5"
                  disabled={member.role === 'owner'}
                >
                  <RoleBadge role={member.role} />
                  {member.role !== 'owner' && <ChevronDown className="w-3 h-3 text-neutral-400" />}
                </button>
                {openRoleMenu === member.id && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-white border border-neutral-200 rounded-xl shadow-xl p-1 z-20">
                    {(['maintainer', 'member', 'viewer'] as TeamRole[]).map(r => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(member.id, r)}
                        className="w-full text-left px-3 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        {member.role === r && <Check className="w-3 h-3 text-neutral-900" />}
                        <span className={member.role === r ? 'font-bold text-neutral-900' : ''}>{ROLE_META[r].label}</span>
                      </button>
                    ))}
                    <div className="h-px bg-neutral-100 my-1" />
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="w-full text-left px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 border border-dashed border-neutral-300 rounded-xl px-5 py-3.5 text-[13px] font-medium text-neutral-400 hover:text-neutral-700 hover:border-neutral-400 transition-colors"
          >
            <UserPlus className="w-4 h-4" />Add a member
          </button>
        </div>
      )}

      {/* Projects tab */}
      {activeTab === 'projects' && (
        <div className="flex flex-col gap-3">
          {team.projectCount === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl py-16 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-[13px] font-semibold text-neutral-700">No projects yet</p>
              <p className="text-[12px] text-neutral-400 text-center max-w-xs">Projects assigned to this team will appear here.</p>
            </div>
          ) : (
            Array.from({ length: team.projectCount }).map((_, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-xl px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-neutral-900">Project {i + 1}</p>
                  <p className="text-[11px] text-neutral-400">Assigned to {team.name}</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-neutral-700">Team name</label>
              <input defaultValue={team.name} className="border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-neutral-700">Description</label>
              <textarea defaultValue={team.description} rows={2} className="border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors resize-none" />
            </div>
            <div className="flex justify-end">
              <button className="px-5 py-2 rounded-xl text-[12px] font-semibold bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">
                Save changes
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-200 rounded-2xl px-6 py-5">
            <h3 className="text-[13px] font-bold text-red-600 mb-3">Danger zone</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-neutral-800">Delete this team</p>
                <p className="text-[11px] text-neutral-400">Once deleted, this team and all its settings are gone permanently.</p>
              </div>
              <button className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                Delete team
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvite && <InviteModal team={team} onClose={() => setShowInvite(false)} />}
    </div>
  )
}

// ─── Teams Main Content ───────────────────────────────────────────────────────

function TeamsMainContent({ onSelectTeam }: { onSelectTeam: (t: Team) => void }) {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-neutral-900">Teams</h1>
          <p className="text-[12px] text-neutral-400 mt-0.5">Organise members into focused groups to collaborate on projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search teams..."
              className="bg-white border border-neutral-200 rounded-lg pl-9 pr-4 py-2 text-[12px] w-56 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />New team
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total teams', value: teams.length },
          { label: 'Total members', value: [...new Set(teams.flatMap(t => t.members.map(m => m.id)))].length },
          { label: 'Total projects', value: teams.reduce((s, t) => s + t.projectCount, 0) },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-neutral-200 rounded-2xl px-5 py-4">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-[24px] font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Team cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(team => (
          <div
            key={team.id}
            onClick={() => onSelectTeam(team)}
            className="bg-white border border-neutral-200 rounded-2xl px-6 py-5 flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[14px] font-bold text-neutral-900">{team.name}</span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border text-neutral-500 bg-neutral-50 border-neutral-200`}>
                  {team.visibility === 'secret' ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                  {team.visibility === 'secret' ? 'Secret' : 'Visible'}
                </span>
              </div>
              {team.description && (
                <p className="text-[12px] text-neutral-400 truncate max-w-lg">{team.description}</p>
              )}
            </div>

            {/* Members stack */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex -space-x-2">
                {team.members.slice(0, 4).map((m, i) => (
                  <img key={i} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full ring-2 ring-white object-cover" />
                ))}
                {team.members.length > 4 && (
                  <div className="w-7 h-7 rounded-full ring-2 ring-white bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                    +{team.members.length - 4}
                  </div>
                )}
              </div>
              <span className="text-[12px] text-neutral-400">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Projects count */}
            <div className="text-right flex-shrink-0 w-20">
              <p className="text-[13px] font-bold text-neutral-900">{team.projectCount}</p>
              <p className="text-[11px] text-neutral-400">project{team.projectCount !== 1 ? 's' : ''}</p>
            </div>

            <ChevronDown className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors -rotate-90 flex-shrink-0" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[13px] text-neutral-400">No teams match your search.</div>
        )}
      </div>

      {showCreate && (
        <CreateTeamModal
          onClose={() => setShowCreate(false)}
          onCreate={team => setTeams(prev => [...prev, team])}
        />
      )}
    </div>
  )
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export function TeamsPage({ sidebarExpanded, onToggleSidebar }: TeamsPageProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

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

        {/* Header */}
        <header className="flex items-center justify-between h-14 px-8 border-b border-neutral-200/60 bg-[#F4F4F4]/80 backdrop-blur-md sticky top-0 z-30">
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Teams</span>
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
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-[340px] rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                    <p className="text-[12px] font-bold text-neutral-900">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-800 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[340px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-10">
                        <Bell className="w-6 h-6 text-neutral-200" />
                        <p className="text-[11px] font-medium text-neutral-400">You're all caught up</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-100">
                        {notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${!n.read ? 'bg-neutral-50/70' : ''}`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                              {notificationIcon(n.type)}
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <p className="text-[11.5px] font-bold text-neutral-900 truncate">{n.title}</p>
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 flex-shrink-0" />}
                              </div>
                              <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">{n.description}</p>
                              <p className="text-[10px] font-medium text-neutral-400 pt-0.5">{n.time}</p>
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
                        className="w-full text-center text-[10px] font-semibold text-neutral-400 hover:text-red-600 transition-colors"
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

        {/* Main */}
        <main className="flex-1 p-8 max-w-[1200px] w-full mx-auto">
          {selectedTeam ? (
            <TeamDetail
              team={selectedTeam}
              onBack={() => setSelectedTeam(null)}
              onUpdate={updated => setSelectedTeam(updated)}
            />
          ) : (
            <TeamsMainContent onSelectTeam={setSelectedTeam} />
          )}
        </main>
      </div>
    </div>
  )
}