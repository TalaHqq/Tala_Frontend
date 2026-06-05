import { Link, useLocation } from 'react-router-dom'
import { Home, SquareStackIcon, TrendingUpDown, Workflow, ChevronLeft, CreditCard, Settings, ChevronRight, Users } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: SquareStackIcon, label: 'Library', path: '/library' },
  { icon: TrendingUpDown, label: 'Timeline', path: '/timeline' },
  {
    icon: Workflow,
    label: 'Workspace',
    path: '/workspace',
    children: [
      { icon: Users, label: 'Teams', path: '/workspace/teams' },
    ],
  },
]

const bottomNavItems = [
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Settings, label: 'Settings', path: '/profile' },
]

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  children?: { icon: React.ElementType; label: string; path: string }[]
}

interface SidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const [popover, setPopover] = useState<{ path: string; top: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (path: string) => {
    setOpenDropdowns(prev => ({ ...prev, [path]: !prev[path] }))
  }

  // Close popover on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopover(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close popover when sidebar expands
  useEffect(() => {
    if (isExpanded) setPopover(null)
  }, [isExpanded])

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path || item.children?.some(c => location.pathname === c.path)
    const Icon = item.icon
    const hasChildren = !!item.children?.length
    const isOpen = openDropdowns[item.path]

    if (isExpanded) {
      return (
        <div key={item.path}>
          {hasChildren ? (
            <button
              onClick={() => toggleDropdown(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="truncate flex-1 text-left">{item.label}</span>
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <Link
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )}

          {hasChildren && isOpen && (
            <div className="mt-0.5 ml-4 flex flex-col gap-0.5 border-l border-neutral-200 pl-3">
              {item.children!.map(child => {
                const ChildIcon = child.icon
                const childActive = location.pathname === child.path
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`
                      flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${childActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }
                    `}
                  >
                    <ChildIcon className="w-[15px] h-[15px] shrink-0" />
                    <span className="truncate">{child.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

 // ── Collapsed state ──
return (
  <div key={item.path} className="relative">
    <button
      onClick={(e) => {
        if (hasChildren) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          setPopover(prev =>
            prev?.path === item.path ? null : { path: item.path, top: rect.top }
          )
        } else if (item.path === location.pathname) {
          onToggle()
        }
      }}
      className={`
        flex items-center justify-center w-9 h-9 mx-auto rounded-lg
        transition-colors duration-150
        ${isActive
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
        }
      `}
      title={item.label}
    >
      {!hasChildren && item.path !== location.pathname ? (
        <Link to={item.path} className="flex items-center justify-center w-full h-full">
          <Icon className="w-[18px] h-[18px]" />
        </Link>
      ) : (
        <Icon className="w-[18px] h-[18px]" />
      )}
    </button>
  </div>
)
  }

  // Find the item that owns the current popover
  const popoverItem = popover
    ? [...navItems, ...bottomNavItems].find(i => i.path === popover.path)
    : null

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-[#F4F4F4]
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-56 pl-10' : 'w-[52px]'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-14 justify-center shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-bold font-mono text-foreground tracking-tight select-none">
              TALA
            </span>
          </Link>
          {isExpanded && (
            <button
              onClick={onToggle}
              className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-1 mt-2 px-2">
          {navItems.map(renderNavItem)}
        </nav>

        {/* Bottom nav */}
        <nav className="flex flex-col gap-1 mt-auto mb-4 px-2">
          {isExpanded && <div className="h-px bg-neutral-200 mb-2 -mx-1" />}
          {bottomNavItems.map(renderNavItem)}
        </nav>
      </aside>

      {/* Floating popover for collapsed sidebar */}
      {!isExpanded && popover && popoverItem && 'children' in popoverItem && (
        <div
          ref={popoverRef}
          className="fixed z-[60] bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 w-44"
          style={{ top: popover.top, left: '60px' }}
        >
          {/* Popover header */}
          <div className="px-3 py-1.5 mb-1 border-b border-neutral-100">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {popoverItem.label}
            </span>
          </div>

          {popoverItem.children!.map(child => {
            const ChildIcon = child.icon
            const childActive = location.pathname === child.path
            return (
              <Link
                key={child.path}
                to={child.path}
                onClick={() => setPopover(null)}
                className={`
                  flex items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-lg text-[13px] font-medium
                  transition-colors duration-150
                  ${childActive
                    ? 'bg-foreground text-background'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }
                `}
              >
                <ChildIcon className="w-[15px] h-[15px] shrink-0" />
                <span>{child.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}