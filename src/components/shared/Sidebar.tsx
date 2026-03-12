import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, FolderOpen, Clock, Users, ChevronLeft } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: FolderOpen, label: 'Library', path: '/library' },
  { icon: Clock, label: 'Timeline', path: '/timeline' },
  { icon: Users, label: 'Team', path: '/team' },
]

interface SidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Overlay for mobile / when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-background
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-56' : 'w-[52px]'}
        `}
      >
        {/* Top area — spacer for navbar height */}
        <div className="flex items-center justify-between h-14 px-2 shrink-0">
          {isExpanded && (
            <span className="pl-2 text-sm font-bold font-mono text-foreground tracking-tight select-none">
              TALA
            </span>
          )}
          {isExpanded && (
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 mt-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return isExpanded ? (
              <Link
                key={item.path}
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
            ) : (
              <button
                key={item.path}
                onClick={item.path === location.pathname ? onToggle : undefined}
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
                {item.path !== location.pathname ? (
                  <Link to={item.path} className="flex items-center justify-center w-full h-full">
                    <Icon className="w-[18px] h-[18px]" />
                  </Link>
                ) : (
                  <Icon className="w-[18px] h-[18px]" />
                )}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
