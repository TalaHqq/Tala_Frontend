import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, LogOut, User,
  Key, Shield, Clock, Sun, Moon,
  Bell as BellIcon, Eye, Activity, BarChart2, Save,
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingsPageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-neutral-900' : 'bg-neutral-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, description, children }: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-100">
        <h2 className="text-[14px] font-bold text-neutral-900">{title}</h2>
        <p className="text-[12px] text-neutral-400 mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-5 flex flex-col gap-5">
        {children}
      </div>
    </div>
  )
}

// ─── Text Field ───────────────────────────────────────────────────────────────

function TextField({ label, value, onChange }: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-neutral-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-200 rounded-lg px-3.5 py-2.5 text-[13px] text-neutral-800 bg-neutral-50 focus:outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-300"
      />
    </div>
  )
}

// ─── Action Row ───────────────────────────────────────────────────────────────

function ActionRow({
  label,
  description,
  badge,
  buttonLabel,
  buttonIcon: Icon,
  danger,
  onClick,
}: {
  label: string
  description: string
  badge?: string
  buttonLabel: string
  buttonIcon: React.ElementType
  danger?: boolean
  onClick?: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-neutral-800">{label}</span>
        <span className="text-[11px] text-neutral-400">{description}</span>
      </div>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {badge && (
          <span className="text-[11px] font-medium text-neutral-500">{badge}</span>
        )}
        <button
          onClick={onClick}
          className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
            danger
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Icon className="w-3 h-3" />
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  leftLabel,
  rightLabel,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  leftLabel?: string
  rightLabel?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-neutral-800">{label}</span>
        <span className="text-[11px] text-neutral-400">{description}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {leftLabel && (
          <span className="text-[11px] font-medium text-neutral-500">{leftLabel}</span>
        )}
        <Toggle checked={checked} onChange={onChange} />
        {rightLabel && (
          <span className="text-[11px] font-medium text-neutral-500">{rightLabel}</span>
        )}
      </div>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="h-px bg-neutral-100 -mx-6" />
}

// ─── Settings Main Content ────────────────────────────────────────────────────

function SettingsMainContent() {
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john.doe@example.com')
  const [username, setUsername] = useState('johndoe')
  const [darkMode, setDarkMode] = useState(false)
  const [profilePublic, setProfilePublic] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showEfficiency, setShowEfficiency] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5 max-w-[720px] mx-auto w-full">
      <h1 className="text-[18px] font-bold text-neutral-900 tracking-tight">Settings</h1>

      {/* Account Information */}
      <SectionCard
        title="Account Information"
        description="Update your account details and information"
      >
        <TextField label="Name" value={name} onChange={setName} />
        <TextField label="Email" value={email} onChange={setEmail} />
        <TextField label="Username" value={username} onChange={setUsername} />
      </SectionCard>

      {/* Security */}
      <SectionCard
        title="Security"
        description="Manage your account security settings"
      >
        <ActionRow
          label="Change Password"
          description="Update your password regularly for security"
          buttonLabel="Change"
          buttonIcon={Key}
        />
        <Divider />
        <ActionRow
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          badge="Enabled"
          buttonLabel="Manage"
          buttonIcon={Shield}
        />
        <Divider />
        <ActionRow
          label="Login History"
          description="View recent login activity"
          buttonLabel="View"
          buttonIcon={Clock}
        />
      </SectionCard>

      {/* Preferences */}
      <SectionCard
        title="Preferences"
        description="Customize your app experience"
      >
        <ToggleRow
          label="Theme"
          description="Choose between light and dark mode"
          checked={darkMode}
          onChange={setDarkMode}
          leftLabel="Light"
          rightLabel="Dark"
        />
        <Divider />
        <ActionRow
          label="Notification Preferences"
          description="Manage how you receive notifications"
          buttonLabel="Configure"
          buttonIcon={BellIcon}
        />
      </SectionCard>

      {/* Privacy */}
      <SectionCard
        title="Privacy"
        description="Control your privacy and data visibility"
      >
        <ToggleRow
          label="Profile Visibility"
          description="Make your profile public or private"
          checked={profilePublic}
          onChange={setProfilePublic}
          leftLabel="Private"
          rightLabel="Public"
        />
        <Divider />
        <ToggleRow
          label="Show Heatmap"
          description="Display activity heatmap on your profile"
          checked={showHeatmap}
          onChange={setShowHeatmap}
        />
        <Divider />
        <ToggleRow
          label="Show Efficiency Score"
          description="Display your efficiency metrics publicly"
          checked={showEfficiency}
          onChange={setShowEfficiency}
        />
      </SectionCard>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all ${
            saved ? 'bg-green-600' : 'bg-neutral-900 hover:bg-neutral-700'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export function SettingsPage({ sidebarExpanded, onToggleSidebar }: SettingsPageProps) {
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
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Settings</span>

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
          <SettingsMainContent />
        </main>
      </div>
    </div>
  )
}