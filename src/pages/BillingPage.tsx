import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
   Bell, LogOut, User,
  ArrowUp, X, Download, CreditCard, Settings,
} from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BillingPageProps {
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

interface Invoice {
  id: string
  number: string
  date: string
  amount: string
  status: 'Paid' | 'Pending' | 'Failed'
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: 'i1', number: 'INV-2025-001', date: 'February 15, 2025', amount: 'GHS 29.99', status: 'Paid' },
  { id: 'i2', number: 'INV-2025-002', date: 'January 15, 2025',  amount: 'GHS 29.99', status: 'Paid' },
  { id: 'i3', number: 'INV-2024-012', date: 'December 15, 2024', amount: 'GHS 29.99', status: 'Paid' },
]

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-5">
      {children}
    </div>
  )
}

// ─── Billing Main Content ─────────────────────────────────────────────────────

function BillingMainContent() {
    
  return (
    <div className="flex flex-col gap-5 max-w-[720px] mx-auto w-full">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[18px] font-bold text-neutral-900 tracking-tight">Billing &amp; Subscription</h1>
        <p className="text-[12px] text-neutral-400">Manage your subscription and payment details</p>
      </div>

      {/* Current Plan */}
      <SectionCard>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-[14px] font-bold text-neutral-900">Current Plan</h2>
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-bold text-neutral-900">Professional Plan</span>
              <span className="text-[11px] text-neutral-400">Active</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-[12px] text-neutral-700">
                <span className="font-semibold">Next renewal:</span> March 15, 2025
              </p>
              <p className="text-[12px] text-neutral-700">
                <span className="font-semibold">Billing cycle:</span> Monthly
              </p>
              <p className="text-[12px] text-neutral-700">
                <span className="font-semibold">Price:</span> GHS 29.99/month
              </p>
            </div>
          </div>
          <button className="flex-shrink-0 bg-neutral-900 hover:bg-neutral-700 text-white text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors">
            Change Plan
          </button>
        </div>
      </SectionCard>

      {/* Payment Method */}
      <SectionCard>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-[14px] font-bold text-neutral-900">Payment Method</h2>
            <div className="flex items-center gap-3">
              {/* Card icon */}
              <div className="w-10 h-7 bg-neutral-900 rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] font-extrabold tracking-wider">VISA</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-neutral-800 tracking-widest">
                  •••• •••• •••• 4242
                </span>
                <span className="text-[11px] text-neutral-400">Expires 12/2027</span>
              </div>
            </div>
          </div>
          <button className="flex-shrink-0 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors">
            Update Payment
          </button>
        </div>
      </SectionCard>

      {/* Billing History */}
      <SectionCard>
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-bold text-neutral-900">Billing History</h2>
          <div className="flex flex-col">
            {INVOICES.map((invoice, idx) => (
              <div key={invoice.id}>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-neutral-800">
                      Invoice #{invoice.number}
                    </span>
                    <span className="text-[11px] text-neutral-400">{invoice.date}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[13px] font-semibold text-neutral-800">{invoice.amount}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-600">
                      {invoice.status}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {idx < INVOICES.length - 1 && (
                  <div className="h-px bg-neutral-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white text-[12px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
          <ArrowUp className="w-3.5 h-3.5" />
          Upgrade Plan
        </button>
        <button className="flex items-center gap-2 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[12px] font-semibold px-5 py-2.5 rounded-xl transition-colors">
          <X className="w-3.5 h-3.5" />
          Cancel Subscription
        </button>
      </div>
    </div>
  )
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export function BillingPage({ sidebarExpanded, onToggleSidebar }: BillingPageProps) {
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
          <span className="text-[16px] font-semibold text-neutral-800 tracking-tight">Billing</span>

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
      <p className="text-[12px] font-bold">User</p>
      <p className="text-[10px] text-neutral-400">Premium Account</p>
    </div>
    
    <button
      onClick={() => { navigate('/profile'); setProfileOpen(false) }}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
    >
      <User className="w-3.5 h-3.5" />
      Profile
    </button>
    <button
      onClick={() => { navigate('/billing'); setProfileOpen(false) }}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
    >
      <CreditCard className="w-3.5 h-3.5" />
      Billing
    </button>
    <button
      onClick={() => { navigate('/settings'); setProfileOpen(false) }}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
    >
      <Settings className="w-3.5 h-3.5" />
      Settings
    </button>
    <div className="h-px bg-neutral-100 my-1" />
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
          <BillingMainContent />
        </main>
      </div>
    </div>
  )
}