import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, LogOut, User,
  MapPin, Pencil, Eye, Trophy, Zap, GitMerge,
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfilePageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = ['Product Management', 'AI/ML', 'UX Design', 'Data Analytics']

const TOP_PROJECTS = [
  {
    id: 'p1',
    name: 'Design Canvas Project',
    description: 'AI enhanced design tool for making amazing canvases for designers',
  },
  {
    id: 'p2',
    name: 'Project A',
    description: 'AI enhanced design tool for making amazing canvases for designers',
  },
  {
    id: 'p3',
    name: 'Project B',
    description: 'AI enhanced design tool for making amazing canvases for designers',
  },
]

// Generate a 12-month activity heatmap (Jan–Dec)
// Each month has ~5 weeks of 7 days
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function generateHeatmap() {
  return MONTHS.map((month) => ({
    month,
    weeks: Array.from({ length: 5 }, () =>
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    ),
  }))
}

const HEATMAP_DATA = generateHeatmap()

function intensityClass(v: number) {
  if (v === 0) return 'bg-neutral-100'
  if (v === 1) return 'bg-neutral-300'
  if (v === 2) return 'bg-neutral-400'
  if (v === 3) return 'bg-neutral-600'
  return 'bg-neutral-900'
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value }: {
  icon: React.ElementType
  label: string
  value: string | number
}) {
  return (
    <div className="flex-1 bg-white border border-neutral-200 rounded-2xl px-5 py-4 flex flex-col gap-3 ">
      <div className="flex items-center gap-2 text-neutral-500">
        <Icon className="w-4 h-4" />
        <span className="text-[12px] font-medium">{label}</span>
      </div>
      <span className="text-[26px] font-bold text-neutral-900 leading-none">{value}</span>
    </div>
  )
}

// ─── Profile Main Content ─────────────────────────────────────────────────────

function ProfileMainContent() {
  return (
    <div className="flex flex-col gap-6 max-w-[860px] mx-auto w-full">

      {/* ── Profile Header Card ── */}
      <div className="bg-white border border-neutral-200 rounded-2xl px-7 py-6 flex flex-col gap-4">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <User className="w-10 h-10 text-neutral-400" />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-neutral-900 leading-tight">John Doe</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[13px] text-neutral-500 font-medium">Senior Product Manager</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md border border-neutral-200 bg-neutral-50 text-[11px] font-medium text-neutral-600">
                Open to Collaborations
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[12px]">North Legon, Ghana</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[13px] text-neutral-600 leading-relaxed max-w-[620px]">
          Transforming complex ideas into elegant solutions. Passionate about AI-driven innovation and building products that make a difference. Always learning, always creating.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-4 py-2 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
            <Pencil className="w-3 h-3" />
            Edit Profile
          </button>
          <button className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-4 py-2 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
            <Eye className="w-3 h-3" />
            View as Public
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="flex items-stretch gap-4">
        <StatCard icon={GitMerge} label="Projects Completed" value={24} />
        <StatCard icon={Zap} label="Efficiency Score" value="87%" />
        <StatCard icon={Trophy} label="Achievements" value={12} />
      </div>

      {/* ── Skills ── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-neutral-900">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[12px] font-medium text-neutral-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Top Projects ── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-neutral-900">Top Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOP_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-shadow cursor-pointer"
            >
              {/* Thumbnail placeholder */}
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[12px] font-bold text-neutral-900 leading-tight">{project.name}</span>
                <span className="text-[11px] text-neutral-400 leading-snug">{project.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity Heatmap ── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-neutral-900">Activity (Past 12 Months)</h2>
        <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-5 overflow-x-auto">
          <div className="flex flex-col gap-2 min-w-[600px]">
            {/* Month labels */}
            <div className="flex gap-1.5 mb-1">
              {HEATMAP_DATA.map(({ month }) => (
                <div key={month} className="flex-1 text-[10px] text-neutral-400 font-medium">
                  {month}
                </div>
              ))}
            </div>

            {/* Grid: 7 rows (days), columns per month's weeks */}
            {Array.from({ length: 7 }).map((_, dayIdx) => (
              <div key={dayIdx} className="flex gap-1.5">
                {HEATMAP_DATA.map(({ month, weeks }) => (
                  <div key={month} className="flex gap-1 flex-1">
                    {weeks.map((week, wIdx) => (
                      <div
                        key={wIdx}
                        className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${intensityClass(week[dayIdx])}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-1.5 justify-end mt-2">
              <span className="text-[10px] text-neutral-400">Less</span>
              {[0, 1, 2, 3, 4].map((v) => (
                <div key={v} className={`w-2.5 h-2.5 rounded-sm ${intensityClass(v)}`} />
              ))}
              <span className="text-[10px] text-neutral-400">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export function ProfilePage({ sidebarExpanded, onToggleSidebar }: ProfilePageProps) {
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

  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans antialiased selection:bg-neutral-200">
      <Sidebar isExpanded={sidebarExpanded} onToggle={onToggleSidebar} />

      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarExpanded ? '14rem' : '52px' }}
      >
        {/* ── Header ── */}
        <header className="flex items-center justify-between h-14 px-8 border-b border-neutral-200/60 bg-[#F4F4F4]/80 backdrop-blur-md sticky top-0 z-30">
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Profile</span>

          <div className="flex items-center gap-5">
            <button className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors">
              <Search className="w-4 h-4" />
            </button>
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
                    <p className="text-[12px] font-bold">User</p>
                    <p className="text-[10px] text-neutral-400">Premium Account</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
          <ProfileMainContent />
        </main>
      </div>
    </div>
  )
}