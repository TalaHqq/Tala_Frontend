import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Plus, LogOut, User } from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'

type Tab = 'all' | 'favorites'

export function LibraryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const collections = [
    {
      id: '1',
      title: 'AFROBEAT',
      description: '12 curated Afrobeat instrumentals',
      assetCount: 12,
      updatedAt: '2 days ago',
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Product Demos',
      description: 'High-quality product demonstration videos',
      assetCount: 8,
      updatedAt: '5 days ago',
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Brand Assets 2025',
      description: 'Official brand guidelines and visual assets',
      assetCount: 24,
      updatedAt: '1 week ago',
      isFavorite: false,
    },
    {
      id: '4',
      title: 'Lo-Fi Beats',
      description: 'Chill lo-fi background music collection',
      assetCount: 16,
      updatedAt: '3 days ago',
      isFavorite: true,
    },
    {
      id: '5',
      title: 'Social Media Templates',
      description: 'Ready-to-use templates for all platforms',
      assetCount: 32,
      updatedAt: 'Today',
      isFavorite: false,
    },
    {
      id: '6',
      title: 'Tutorial Series',
      description: 'Step-by-step educational video content',
      assetCount: 15,
      updatedAt: '4 days ago',
      isFavorite: false,
    },
  ]

  const filteredCollections = collections.filter((c) => {
    const matchesTab = activeTab === 'all' || (activeTab === 'favorites' && c.isFavorite)
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('tala_token')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* Main Column — offset by sidebar width */}
      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarExpanded ? '14rem' : '52px' }}
      >
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-background">
          {/* Left: Page Title */}
          <div className="flex items-center gap-4">
            <span className="text-base font-medium text-foreground">
              Library
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Search">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Notifications">
              <Bell className="w-[18px] h-[18px]" />
            </button>
            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-border hover:border-foreground/30 transition-colors"
                title="Profile"
              >
                <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                  <User className="w-4 h-4 text-foreground/60" />
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-destructive hover:bg-secondary/60 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            {/* Collections Heading */}
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-8">
              Collections
            </h1>

            {/* Tabs Row + Search + Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              {/* Tabs */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Collections
                  {activeTab === 'all' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    activeTab === 'favorites'
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Favorites
                  {activeTab === 'favorites' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
                  )}
                </button>
              </div>

              {/* Search + Upload */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-[200px] sm:w-[260px] rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
                  />
                </div>
                <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
                  <Plus className="w-4.5 h-4.5" />
                  Upload
                </button>
              </div>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Create Collection Card */}
              <button className="group flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-border/70 bg-background hover:border-foreground/30 hover:bg-secondary/30 transition-all duration-200 cursor-pointer min-h-[200px]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-border/60 text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Create Collection
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start organizing your assets
                  </p>
                </div>
              </button>

              {/* Collection Cards */}
              {filteredCollections.map((collection) => (
                <div 
                  key={collection.id}
                  className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer min-h-[200px]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                      {collection.title}
                    </h3>
                    <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-8">
                    {collection.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                      <span>{collection.assetCount} assets</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Updated {collection.updatedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
