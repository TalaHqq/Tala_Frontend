import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, Bell, User, LogOut } from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { QuickStats } from '../components/profile/QuickStats'
import { TopProjectsAndSkills } from '../components/profile/TopProjectsAndSkills'
import { EfficiencyPerformance } from '../components/profile/EfficiencyPerformance'
import { RewardsAchievements } from '../components/profile/RewardsAchievements'
import { ActivityHeatmap } from '../components/profile/ActivityHeatmap'

export function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const isOwnProfile = !username || username === 'me'

  const mockUser = {
    name: 'Kofi Appiah',
    role: 'Senior Developer',
    location: 'East Legon Hills, Ghana',
    isAvailable: true,
    avatarUrl: undefined // Will use fallback
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
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
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarExpanded ? '14rem' : '52px' }}
      >
        <header className="flex items-center justify-between h-14 px-10 border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <span className="text-[18px] font-bold text-foreground/90 tracking-tight">
              Profile
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-foreground rounded-full border-2 border-background" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-0.5 rounded-full border border-border/50 hover:border-foreground/20 transition-all overflow-hidden"
              >
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-foreground/40" />
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-[13px] font-bold">User</p>
                    <p className="text-[11px] text-muted-foreground">Premium Account</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] font-medium text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Profile Header */}
            <ProfileHeader
              isOwnProfile={isOwnProfile}
              name={mockUser.name}
              role={mockUser.role}
              location={mockUser.location}
              isAvailable={mockUser.isAvailable}
            />

            {/* 2. Quick Stats */}
            <QuickStats />

            {/* 3 & 4. Projects and Skills */}
            <TopProjectsAndSkills />

            {/* 5. Efficiency & Performance */}
            <EfficiencyPerformance />

            {/* 6. Rewards & Achievements */}
            <RewardsAchievements />

            {/* 7. Activity Heatmap */}
            <ActivityHeatmap />

            <div className="pt-10 border-t border-border/10 flex items-center justify-center gap-6 pb-20">
              <p className="text-[13px] text-muted-foreground/40">© 2026 TALA Inc. All rights reserved.</p>
              <div className="flex gap-4">
                <button className="text-[11px] font-bold text-muted-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">Privacy Policy</button>
                <button className="text-[11px] font-bold text-muted-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">Terms of Service</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
