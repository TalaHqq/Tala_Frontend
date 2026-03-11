import { Link } from 'react-router-dom'
import { Home, FolderOpen, Clock, Users, Search, Bell, Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useState } from 'react'

export function LibraryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Placeholder for when we have data
  const hasItems = false

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      
      {/* Mobile Navbar */}
      <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
        <span className="text-xl font-bold font-mono text-foreground tracking-tight">TALA</span>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center px-6 lg:min-h-[4rem]">
          <span className="hidden text-2xl font-bold font-mono text-foreground tracking-tight lg:block">TALA</span>
        </div>
        
        <nav className="space-y-1 mt-6 px-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <Link to="/library" className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2 text-foreground transition-colors">
            <FolderOpen className="h-5 w-5" />
            <span className="text-sm font-medium">Library</span>
          </Link>
          <Link to="/timeline" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Timeline</span>
          </Link>
          <Link to="/team" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Team</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar (Desktop) */}
        <header className="hidden h-16 items-center justify-between border-b px-8 lg:flex">
          <div className="w-1/3">
             {/* Left space empty or can contain page specific breadcrumbs later */}
          </div>
          
          <div className="flex flex-1 items-center justify-center max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full bg-secondary/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex w-1/3 items-center justify-end gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-accent/20 border border-primary/10 flex items-center justify-center overflow-hidden cursor-pointer">
              {/* Avatar placeholder */}
              <span className="text-xs font-semibold text-primary">SA</span>
            </div>
          </div>
        </header>

        {/* Mobile Search - visible only on mobile below header */}
        <div className="p-4 border-b lg:hidden">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-secondary/50 pl-9 border-none"
              />
            </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground font-mono">Library</h1>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                New Item
              </Button>
            </div>

            {hasItems ? (
              // Grid Area for Items
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Placeholders for library cards */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer">
                    <div className="aspect-video bg-muted relative group-hover:bg-muted/80 transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <FolderOpen className="h-8 w-8 opacity-20" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1">Project Document {i}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Edited 2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 mb-4">
                  <FolderOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Your library is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Get started by creating a new document, uploading a file, or exploring templates.
                </p>
                <div className="mt-6 flex gap-4">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Create New
                  </Button>
                  <Button variant="outline">
                    Import Files
                  </Button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  )
}
