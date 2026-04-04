import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Plus, X, Folder, ChevronDown, CloudUpload, Trash2, LogOut, User, ChevronRight, Download, MoreVertical, Heart, Music, Video, Image as ImageIcon, FileText, Play, Loader2, AlertCircle, Pencil, Share2 } from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { useCollections } from '../hooks/useCollections'
import { useCollectionDetails } from '../hooks/useCollectionDetails'
import googleDriveIcon from '../assets/ICONS/GOOGLE DRIVE/google-drive.png'
import dropboxIcon from '../assets/ICONS/DROPBOX/dropbox.png'

type Tab = 'all' | 'favorites'
type AssetTab = 'all' | 'docs' | 'images' | 'video' | 'audio' | 'favorites'

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Recently';
  if (dateStr.includes('ago') || dateStr === 'Recently') return dateStr;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function LibraryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [activeAssetTab, setActiveAssetTab] = useState<AssetTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCollectionData, setNewCollectionData] = useState({ title: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<any[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [activeAssetMenuId, setActiveAssetMenuId] = useState<string | null>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mockTeamMembers = ['Randy Russell', 'Sena Duodu', 'Bervelyn Amoako', 'Kofi TALA']

  const { collections, isLoading: isLoadingCollections, error: errorCollections, createCollection, deleteCollection, toggleFavorite, renameCollection } = useCollections()
  const { collection: selectedCollection, isLoading: isLoadingDetails, error: errorDetails, toggleAssetFavorite, deleteAsset } = useCollectionDetails(selectedCollectionId)

  const processFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type.includes('image') ? 'Image' : file.type.includes('video') ? 'Video' : file.type.includes('audio') ? 'Audio' : 'Document',
      progress: 0,
      status: 'Processing',
      tags: []
    }));
    setUploadFiles(prev => [...prev, ...newFiles]);

    // Simulate progress
    newFiles.forEach(file => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 30;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setUploadFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: 100, status: 'Uploaded' } : f));
        } else {
          setUploadFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: p } : f));
        }
      }, 400);
    });
  }

  const allAssets = selectedCollection?.assets || []
  const assets = allAssets.filter(asset => {
    if (activeAssetTab === 'all') return true;
    if (activeAssetTab === 'favorites') return asset.isFavorite;
    if (activeAssetTab === 'docs') return asset.type === 'Document';
    if (activeAssetTab === 'images') return asset.type === 'Image';
    if (activeAssetTab === 'audio') return asset.type === 'Audio';
    if (activeAssetTab === 'video') return asset.type === 'Video';
    return true;
  })
  const selectedAsset = assets.find(a => a.id === selectedAssetId)

  const filteredCollections = collections.filter((c) => {
    const matchesTab = activeTab === 'all' || (activeTab === 'favorites' && c.isFavorite)
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesTab && matchesSearch
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (activeMenuId && !(event.target as Element).closest('.menu-container')) {
        setActiveMenuId(null)
      }
      if (activeAssetMenuId && !(event.target as Element).closest('.asset-menu-container')) {
        setActiveAssetMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeMenuId])

  const handleLogout = () => {
    localStorage.removeItem('tala_token')
    navigate('/login')
  }

  const handleDeleteCollection = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this collection?')) {
      await deleteCollection(id);
      setActiveMenuId(null);
    }
  }

  const handleToggleFavoriteAction = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleFavorite(id);
    setActiveMenuId(null);
  }

  const handleRenameCollectionAction = async (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    const newTitle = window.prompt('Enter new collection name:', currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      await renameCollection(id, newTitle);
    }
    setActiveMenuId(null);
  }

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  }

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollectionData.title.trim()) return

    setIsCreating(true)
    setCreateError(null)

    const result = await createCollection(newCollectionData.title, newCollectionData.description)

    setIsCreating(false)
    if (result.success) {
      setIsCreateModalOpen(false)
      setNewCollectionData({ title: '', description: '' })
      setSelectedCollaborators([])
    } else {
      setCreateError(result.error || 'Failed to create collection')
    }
  }

  const assetTabStyles: Record<AssetTab, { left: string; width: string }> = {
    all: { left: '0', width: '22px' },
    docs: { left: '54px', width: '38px' },
    images: { left: '124px', width: '52px' },
    video: { left: '208px', width: '42px' },
    audio: { left: '282px', width: '42px' },
    favorites: { left: '356px', width: '65px' }
  }

  const toggleCollaborator = (name: string) => {
    if (selectedCollaborators.includes(name)) {
      setSelectedCollaborators(prev => prev.filter(c => c !== name))
    } else {
      setSelectedCollaborators(prev => [...prev, name])
    }
  }

  const renderAssetDetails = () => {
    if (!selectedAsset || !selectedCollection) return null

    return (
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/60 mb-8 border-b border-border/10 pb-4">
          <button
            onClick={() => { setSelectedCollectionId(null); setSelectedAssetId(null); }}
            className="hover:text-foreground transition-colors"
          >
            Collections
          </button>
          <ChevronRight className="w-2.5 h-2.5 opacity-50" />
          <button
            onClick={() => setSelectedAssetId(null)}
            className="hover:text-foreground transition-colors"
          >
            {selectedCollection.title}
          </button>
          <ChevronRight className="w-2.5 h-2.5 opacity-50" />
          <span className="text-foreground/80 truncate max-w-[200px]">{selectedAsset.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Preview Section */}
            <div className="aspect-video w-full rounded-2xl bg-[#1a1a1a] shadow-2xl overflow-hidden mb-10 border border-white/5 flex items-center justify-center group relative">
              {selectedAsset.type === 'Audio' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 relative">
                  <div className="flex items-end gap-1 mb-8 h-24">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white/20 rounded-full hover:bg-white/50 transition-colors"
                        style={{ height: `${20 + Math.random() * 80}%` }}
                      />
                    ))}
                  </div>
                  <button className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex justify-between text-[11px] font-bold text-white/40 mb-2">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-white" />
                    </div>
                  </div>
                </div>
              ) : selectedAsset.type === 'Video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <div className="absolute inset-0 bg-cover bg-center brightness-50" style={{ backgroundImage: 'radial-gradient(circle, #333 0%, #000 100%)' }} />
                  <button className="relative w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-2xl">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                  <p className="absolute bottom-24 text-[12px] font-bold text-white/60">Click to play video</p>
                </div>
              ) : selectedAsset.type === 'Image' ? (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="w-24 h-24 text-white/10">
                    <ImageIcon className="w-full h-full" />
                  </div>
                  <p className="absolute text-[12px] font-bold text-white/40">High-resolution preview unavailable in dummy mode</p>
                </div>
              ) : (
                <div className="w-full h-full flex bg-[#efefef]">
                  <div className="w-48 h-full border-r border-black/5 bg-white p-4 flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-[3/4] w-full bg-[#f5f5f5] rounded border border-black/10 shadow-sm" />
                    ))}
                  </div>
                  <div className="flex-1 flex items-center justify-center text-black/20">
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-[12px] font-bold">PDF Preview - Page 1 of 12</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Asset Info Section */}
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">{selectedAsset.name}</h1>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
                    {selectedAsset.type === 'Audio' ? 'A calming ambient soundscape featuring natural forest sounds, perfect for meditation, relaxation, or background atmosphere. Recorded in high quality with professional equipment.' :
                      selectedAsset.type === 'Video' ? 'Product demonstration showcasing new features and capabilities introduced in the 4th quarter of 2026. This video covers UI improvements and performance.' :
                        selectedAsset.type === 'Image' ? 'High-resolution banner image for the main product landing page. Features the latest product showcase with modern design elements.' :
                          'Comprehensive financial analysis and performance metrics for the 4th quarter of 2026, including revenue breakdown and expense reports.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl border border-border/60 hover:text-foreground hover:bg-secondary transition-all shadow-sm">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-xl border border-border/60 hover:text-foreground hover:bg-secondary transition-all shadow-sm">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-xl border border-border/60 hover:text-foreground hover:bg-secondary transition-all shadow-sm">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border bg-background text-foreground text-[12px] font-bold hover:bg-secondary/50 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add Tag
                </button>
                {selectedAsset.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/30 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Comment Section Mockup */}
              <div className="pt-10 border-t border-border/20">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border/50 shrink-0 overflow-hidden">
                    <User className="w-5 h-5 text-foreground/30" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden focus-within:ring-2 focus-within:ring-foreground/5 transition-all">
                      <textarea
                        placeholder="Add a comment..."
                        className="w-full h-24 p-4 bg-transparent resize-none text-[14px] focus:outline-none placeholder:text-muted-foreground/40"
                      />
                      <div className="px-4 py-3 border-t border-border/10 bg-secondary/5 flex items-center justify-between">
                        <button className="text-[11px] font-bold text-muted-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          Attach file
                        </button>
                        <button className="h-8 px-4 rounded-lg bg-foreground text-background text-[12px] font-bold hover:opacity-90 transition-opacity">
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[360px] space-y-8">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="text-[15px] font-bold mb-6">Asset Details</h3>
              <div className="space-y-4">
                <DetailItem label="File Format" value={selectedAsset.type === 'Audio' ? 'MP3' : selectedAsset.type === 'Video' ? 'MP4' : selectedAsset.type === 'Image' ? 'PNG' : 'PDF'} />
                <DetailItem label="File Size" value={selectedAsset.type === 'Audio' ? '8.7 MB' : selectedAsset.type === 'Video' ? '42.5 MB' : selectedAsset.type === 'Image' ? '4.2 MB' : '2.4 MB'} />
                <DetailItem label={selectedAsset.type === 'Audio' ? 'Duration' : selectedAsset.type === 'Video' ? 'Duration' : selectedAsset.type === 'Image' ? 'Dimensions' : 'Pages'} value={selectedAsset.metadata || '-'} />
                <DetailItem label="Created" value="March 02, 2026" />
                <DetailItem label="Modified" value="March 02, 2026" />
                <div className="pt-4 border-t border-border/10 mt-6">
                  <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-3">Created By</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border/50">
                      <User className="w-4 h-4 text-foreground/40" />
                    </div>
                    <span className="text-[14px] font-bold">{selectedAsset.creator || 'System'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">Status</p>
                  <span className="inline-flex px-2 px-1 rounded bg-secondary/50 text-[10px] font-bold text-muted-foreground/80">COMPLETED</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="text-[15px] font-bold mb-6">Recent Activity</h3>
              <div className="space-y-6">
                <ActivityItem user="Randy Russell" action="downloaded this asset" time="2 hours ago" />
                <ActivityItem user="Bervelyn Amoako" action="updated the description" time="1 day ago" />
                <ActivityItem user="Kofi TALA" action="added tags" time="2 days ago" />
                <ActivityItem user="Randy Russell" action="downloaded this asset" time="2 hours ago" />
                <ActivityItem user="Bervelyn Amoako" action="updated the description" time="1 day ago" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">{label}</p>
      <p className="text-[14px] font-bold text-foreground/80">{value}</p>
    </div>
  )

  const ActivityItem = ({ user, action, time }: { user: string, action: string, time: string }) => (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-secondary shrink-0 border border-border/50 overflow-hidden flex items-center justify-center">
        <User className="w-4 h-4 text-foreground/30" />
      </div>
      <div className="space-y-0.5 min-w-0">
        <p className="text-[13px] text-foreground/80 leading-tight">
          <span className="font-bold">{user}</span> {action}
        </p>
        <p className="text-[11px] font-medium text-muted-foreground/50">{time}</p>
      </div>
    </div>
  )

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
              Library
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
          {selectedAssetId && selectedAsset ? renderAssetDetails() : selectedCollectionId && selectedCollection ? (
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground/60">Loading collection assets...</p>
                </div>
              ) : errorDetails ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <AlertCircle className="w-10 h-10 text-destructive/40" />
                  <p className="text-sm font-medium text-destructive/60">{errorDetails}</p>
                </div>
              ) : (
                <>
                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/60 mb-6">
                    <button
                      onClick={() => setSelectedCollectionId(null)}
                      className="hover:text-foreground transition-colors"
                    >
                      Collections
                    </button>
                    <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                    <span className="text-foreground/80">{selectedCollection.title}</span>
                  </nav>

                  {/* Header Section */}
                  <div className="flex flex-col gap-6 mb-10">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="space-y-4 flex-1 max-w-4xl">
                        <h1 className="text-4xl font-bold text-foreground tracking-tight">
                          {selectedCollection.title}
                        </h1>
                        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-3xl">
                          {selectedCollection.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-muted-foreground/50">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{selectedCollection.assetCount} assets</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span>Updated {formatDate(selectedCollection.updatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>Created by {selectedCollection.ownerId || 'System'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search collections..."
                            className="h-10 w-[240px] lg:w-[320px] rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all border-foreground/10"
                          />
                        </div>
                        <button
                          onClick={() => setIsUploadModalOpen(true)}
                          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border bg-background text-foreground text-[13px] font-semibold hover:bg-secondary/50 transition-colors border-foreground/10"
                        >
                          <Plus className="w-4 h-4" />
                          Add Files
                        </button>
                        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-[13px] font-bold hover:opacity-90 transition-opacity">
                          <Download className="w-4 h-4" />
                          Download All
                        </button>
                      </div>
                    </div>

                    {/* Sub Tabs */}
                    <div className="flex items-center gap-8 border-b border-border/40 overflow-x-auto no-scrollbar pt-2 relative">
                      {(['all', 'docs', 'images', 'video', 'audio', 'favorites'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveAssetTab(tab)}
                          className={`relative pb-4 text-[14px] font-medium transition-colors whitespace-nowrap capitalize ${activeAssetTab === tab
                            ? 'text-foreground font-bold'
                            : 'text-muted-foreground/70 hover:text-foreground'
                            }`}
                        >
                          {tab === 'docs' ? 'Docs' : tab === 'favorites' ? 'Favorites' : tab}
                        </button>
                      ))}
                      {/* Sliding Underline for Assets */}
                      <div
                        className="absolute bottom-0 h-[3px] bg-foreground rounded-full transition-all duration-300 ease-in-out"
                        style={{
                          left: assetTabStyles[activeAssetTab].left,
                          width: assetTabStyles[activeAssetTab].width
                        }}
                      />
                    </div>
                  </div>

                  {/* Assets List Table */}
                  <div className="overflow-hidden border-t border-border/40">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/10 border-b border-border/40">
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest w-[40%]">Asset</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest hidden sm:table-cell">Type</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest hidden md:table-cell">Metadata</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest hidden lg:table-cell">Tags</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {assets.map((asset) => (
                          <tr
                            key={asset.id}
                            onClick={() => setSelectedAssetId(asset.id)}
                            className="group hover:bg-secondary/20 transition-all duration-150 cursor-pointer"
                          >
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-[#262626] flex items-center justify-center text-white flex-shrink-0 shadow-sm transition-transform group-hover:scale-[1.02]">
                                  {asset.type === 'Audio' && <Music className="w-5 h-5" />}
                                  {asset.type === 'Video' && <Video className="w-5 h-5" />}
                                  {asset.type === 'Image' && <ImageIcon className="w-5 h-5" />}
                                  {asset.type === 'Document' && <FileText className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <p className="text-[14px] font-bold text-foreground truncate tracking-tight">{asset.name}</p>
                                    {/* {asset.isFavorite && <Heart className="w-3 h-3 text-red-500 fill-current" />} */}
                                  </div>
                                  <p className="text-[12px] text-muted-foreground/60 truncate">{asset.creator || 'System'} • {formatDate(asset.updatedAt)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                              <span className="text-[12px] font-medium text-muted-foreground/80">{asset.type}</span>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <span className="text-[12px] text-muted-foreground/60">{asset.metadata || '-'}</span>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1.5">
                                {(asset.tags || []).map((tag, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-secondary/50 text-[10px] font-medium text-muted-foreground/70">{tag}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAssetFavorite(asset.id);
                                  }}
                                  className={`p-2 rounded-lg transition-all ${asset.isFavorite ? 'text-red-500 bg-red-500/5' : 'text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/5'}`}
                                >
                                  <Heart className={`w-4 h-4 ${asset.isFavorite ? 'fill-current' : ''}`} />
                                </button>
                                <div className="relative asset-menu-container">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveAssetMenuId(activeAssetMenuId === asset.id ? null : asset.id);
                                    }}
                                    className={`p-2 rounded-lg transition-all ${activeAssetMenuId === asset.id ? 'text-foreground bg-secondary' : 'text-muted-foreground/40 hover:text-foreground hover:bg-secondary'}`}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {activeAssetMenuId === asset.id && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedAssetId(asset.id); setActiveAssetMenuId(null); }}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                                      >
                                        <Play className="w-4 h-4 opacity-50" />
                                        Preview
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setActiveAssetMenuId(null); }}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                                      >
                                        <Pencil className="w-4 h-4 opacity-50" />
                                        Rename
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setActiveAssetMenuId(null); }}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                                      >
                                        <Download className="w-4 h-4 opacity-50" />
                                        Download
                                      </button>
                                      <div className="h-px bg-border/50 my-1" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Delete this asset?')) {
                                            deleteAsset(asset.id);
                                            setActiveAssetMenuId(null);
                                          }
                                        }}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-10">
                Collections
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                <div className="flex items-center gap-10 relative border-b border-border/10">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`relative pb-3 text-[14px] font-medium transition-colors ${activeTab === 'all'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground/70 hover:text-foreground'
                      }`}
                  >
                    All Collections
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`relative pb-3 text-[14px] font-medium transition-colors ${activeTab === 'favorites'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground/70 hover:text-foreground'
                      }`}
                  >
                    Favorites
                  </button>
                  {/* Sliding Underline */}
                  <div
                    className="absolute bottom-0 h-[3px] bg-foreground rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      left: activeTab === 'all' ? '0' : '132px', // Approx 92px for 'All Collections' + 40px gap
                      width: activeTab === 'all' ? '92px' : '65px'
                    }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search collections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-[240px] rounded-lg border border-foreground/10 bg-background pl-10 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all"
                    />
                  </div>
                  <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-[13px] font-bold hover:opacity-90 transition-opacity">
                    <Plus className="w-4.5 h-4.5" />
                    Upload
                  </button>
                </div>
              </div>

              {isLoadingCollections ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground/60">Fetching your collections...</p>
                </div>
              ) : errorCollections ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
                  <AlertCircle className="w-10 h-10 text-destructive/40 mb-2" />
                  <p className="text-base font-semibold text-destructive/70">Something went wrong</p>
                  <p className="text-sm text-muted-foreground/60 max-w-xs mt-1">{errorCollections}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-6 h-9 px-4 rounded-lg bg-secondary text-foreground text-[12px] font-bold hover:bg-secondary/80 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed border-border/50 bg-background hover:border-foreground/20 hover:bg-secondary/10 transition-all duration-300 cursor-pointer min-h-[220px]"
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-border/40 text-muted-foreground/50 group-hover:border-foreground/30 group-hover:text-foreground/70 transition-all duration-300">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-[15px] font-bold text-foreground/80">
                        Create Collection
                      </p>
                      <p className="text-[12px] text-muted-foreground/50 mt-1">
                        Start organizing your assets
                      </p>
                    </div>
                  </button>

                  {filteredCollections.map((collection) => (
                    <div
                      key={collection.id}
                      onClick={() => setSelectedCollectionId(collection.id)}
                      className="group flex flex-col p-8 rounded-2xl border border-border/60 bg-card hover:border-foreground/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer min-h-[220px] relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                            {collection.title}
                          </h3>

                        </div>
                        <div className="relative menu-container">
                          <button
                            onClick={(e) => handleMenuClick(e, collection.id)}
                            className={`p-1.5 rounded-lg transition-all ${activeMenuId === collection.id
                              ? 'text-foreground bg-secondary'
                              : 'text-muted-foreground/40 hover:text-foreground hover:bg-secondary'}`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === collection.id && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedCollectionId(collection.id); setActiveMenuId(null); }}
                                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Play className="w-4 h-4 opacity-50" />
                                Open
                              </button>
                              <button
                                onClick={(e) => handleRenameCollectionAction(e, collection.id, collection.title)}
                                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Pencil className="w-4 h-4 opacity-50" />
                                Rename
                              </button>
                              <button
                                onClick={(e) => handleToggleFavoriteAction(e, collection.id)}
                                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Heart className={`w-4 h-4 text-red-500 ${collection.isFavorite ? 'text-foreground fill-current' : 'opacity-50'}`} />
                                {collection.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
                                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Share2 className="w-4 h-4 opacity-50" />
                                Share
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
                                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4 opacity-50" />
                                Download Zip
                              </button>
                              <div className="h-px bg-border/50 my-1" />
                              <button
                                onClick={(e) => handleDeleteCollection(e, collection.id)}
                                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[13px] text-muted-foreground/70 line-clamp-2 mb-10 leading-relaxed font-medium">
                        {collection.description}
                      </p>
                      <div className="mt-auto pt-5 border-t border-border/20 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground/50">
                          <FileText className="w-4 h-4" />
                          <span>{collection.assetCount || 0} assets</span>
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground/40">
                          {formatDate(collection.updatedAt)}
                        </span>
                        {collection.isFavorite && (
                          <Heart className="w-3.5 h-3.5 text-foreground fill-current" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#00000080] backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="w-full max-w-[540px] rounded-[12px] bg-white p-0 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-[#404040]" />
                  <h2 className="text-[18px] font-semibold text-[#1A1A1A]">New Collection</h2>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-md text-[#A0A0A0] hover:text-[#404040] hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="p-8 space-y-6 overflow-y-auto">
                {createError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[13px]">
                    {createError}
                  </div>
                )}
                {/* Collection Name */}
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-[#404040]">Collection Name</label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g., Edit product launch trailer"
                    className="w-full h-[44px] px-4 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#1A1A1A] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#E08210] focus:ring-1 focus:ring-[#E08210] transition-all"
                    value={newCollectionData.title}
                    onChange={(e) => setNewCollectionData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-[#404040]">Description</label>
                  <textarea
                    placeholder="Briefly describe what this task or project involves..."
                    className="w-full h-[120px] p-4 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#1A1A1A] placeholder:text-[#A0A0A0] resize-none focus:outline-none focus:border-[#E08210] focus:ring-1 focus:ring-[#E08210] transition-all leading-relaxed"
                    value={newCollectionData.description}
                    onChange={(e) => setNewCollectionData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Assign Collaborators */}
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-[#404040]">Assign Collaborators</label>
                  <div className="relative group">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleCollaborator(e.target.value)
                          e.target.value = "" // Reset select
                        }
                      }}
                      className="w-full h-[44px] px-4 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#404040] appearance-none focus:outline-none focus:border-[#E08210] focus:ring-1 focus:ring-[#E08210] transition-all cursor-pointer"
                    >
                      <option value="">Select team members</option>
                      {mockTeamMembers.filter(m => !selectedCollaborators.includes(m)).map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] pointer-events-none group-hover:text-[#404040] transition-colors" />
                  </div>

                  {/* Avatar Row */}
                  {selectedCollaborators.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 ml-1 animate-in fade-in slide-in-from-left-2 duration-300">
                      {selectedCollaborators.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleCollaborator(name)}
                          title={`Remove ${name}`}
                          className="group relative w-8 h-8 rounded-full border border-[#E5E5E5] bg-secondary flex items-center justify-center overflow-hidden hover:border-destructive/30 transition-all"
                        >
                          <User className="w-4 h-4 text-muted-foreground/60 group-hover:text-destructive/60 transition-colors" />
                          <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <X className="w-3 h-3 text-destructive/80" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtle Spacer to match Design height */}
                <div className="pt-2"></div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!newCollectionData.title.trim() || isCreating}
                  className="w-full h-[48px] rounded-[8px] bg-[#1A1A1A] text-white text-[14px] font-semibold hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md mt-4 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : 'Create Collection'}
                </button>
              </form>
            </div>
          </div>
        )}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#00000080] backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="w-full max-w-[800px] rounded-[16px] bg-white p-0 shadow-3xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col max-h-[95vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-10 py-8 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-4">
                  <Folder className="w-6 h-6 text-[#404040]" />
                  <h2 className="text-[20px] font-bold text-[#1A1A1A]">Upload Asset</h2>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-lg text-[#A0A0A0] hover:text-[#404040] hover:bg-secondary/50 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                {/* Drag and Drop Zone */}
                <div className="relative group">
                  <div
                    className="flex flex-col items-center justify-center p-12 rounded-[12px] border-2 border-dashed border-[#E5E5E5] bg-white hover:border-[#1A1A1A]/30 transition-all cursor-pointer"
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#1A1A1A'; }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#E5E5E5'; }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#E5E5E5';
                      processFiles(Array.from(e.dataTransfer.files));
                    }}
                  >
                    <div className="w-14 h-14 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                      <CloudUpload className="w-7 h-7 text-muted-foreground/60" />
                    </div>
                    <p className="text-[15px] font-semibold text-[#1A1A1A] mb-1 text-center">
                      Drag and drop your files here or <span className="text-foreground border-b border-foreground/30 hover:border-foreground transition-colors">browse to upload</span>
                    </p>
                    <p className="text-[13px] text-[#A0A0A0] mb-6">Supports images, videos, audio, and documents</p>

                    <div className="flex gap-6 text-[12px] font-medium text-muted-foreground/60 mb-8">
                      <div className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Images</div>
                      <div className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Videos</div>
                      <div className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" /> Audio</div>
                      <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Documents</div>
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-[140px] h-[40px] rounded-[6px] bg-[#1A1A1A] text-white text-[13px] font-bold hover:bg-[#333333] transition-all shadow-md"
                    >
                      Browse Files
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          processFiles(Array.from(e.target.files));
                          e.target.value = ''; // Reset to allow same file selection
                        }
                      }}
                    />
                  </div>
                </div>

                {/* External Imports */}
                <div className="flex gap-4">
                  <button
                    onClick={() => window.open('https://drive.google.com', '_blank')}
                    className="flex-1 h-[48px] rounded-[10px] border border-[#E5E5E5] bg-white flex items-center justify-center gap-3 text-[13px] font-bold text-[#404040] hover:bg-secondary/30 transition-colors"
                  >
                    <img src={googleDriveIcon} alt="Google Drive" className="w-5 h-5 flex-shrink-0" />
                    Import from Google Drive
                  </button>
                  <button
                    onClick={() => window.open('https://www.dropbox.com', '_blank')}
                    className="flex-1 h-[48px] rounded-[10px] border border-[#E5E5E5] bg-white flex items-center justify-center gap-3 text-[13px] font-bold text-[#404040] hover:bg-secondary/30 transition-colors"
                  >
                    <img src={dropboxIcon} alt="Dropbox" className="w-5 h-5 flex-shrink-0" />
                    Import from Dropbox
                  </button>
                </div>

                {/* Uploaded Files List */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wider opacity-60">Uploaded Files</h3>
                    <div className="space-y-3">
                      {uploadFiles.map((file) => (
                        <div key={file.id} className="relative p-5 rounded-[12px] border border-[#F0F0F0] bg-white group hover:border-[#1A1A1A]/10 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-[8px] bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                              {file.type === 'Audio' ? <Music className="w-5 h-5 text-white" /> :
                                file.type === 'Video' ? <Video className="w-5 h-5 text-white" /> :
                                  file.type === 'Image' ? <ImageIcon className="w-5 h-5 text-white" /> :
                                    <FileText className="w-5 h-5 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="text-[14px] font-bold text-[#1A1A1A] truncate">{file.name}</h4>
                                <span className={`text-[11px] font-bold ${file.status === 'Uploaded' ? 'text-green-600' : 'text-amber-500'}`}>{file.status}</span>
                              </div>
                              <p className="text-[12px] text-muted-foreground/40 mb-3">{file.size} • {file.type}</p>

                              <div className="flex items-center gap-4">
                                {/* Progress Bar */}
                                <div className="relative h-1 w-full max-w-[240px] bg-secondary/50 rounded-full overflow-hidden">
                                  <div
                                    className="absolute left-0 top-0 h-full bg-[#1A1A1A] transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>

                                {/* Tags inline */}
                                <div className="flex flex-wrap gap-2">
                                  {file.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 rounded bg-[#F8F8F8] border border-[#EEE] text-[10px] font-bold text-[#666]">{tag}</span>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const tag = prompt('Enter a new tag:');
                                      if (tag) {
                                        setUploadFiles(prev => prev.map(f => f.id === file.id ? { ...f, tags: [...f.tags, tag] } : f));
                                      }
                                    }}
                                    className="px-2 py-0.5 rounded border border-dashed border-[#DDD] text-[10px] font-bold text-muted-foreground hover:border-[#AAA] transition-all"
                                  >
                                    + Add Tag
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setUploadFiles(prev => prev.filter(f => f.id !== file.id))}
                              className="p-2 rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-[#404040]">Description</label>
                  <textarea
                    placeholder="Briefly describe what this task or project involves..."
                    className="w-full h-[120px] p-6 rounded-[12px] border border-[#E5E5E5] bg-white text-[14px] text-[#1A1A1A] placeholder:text-[#A0A0A0] resize-none focus:outline-none focus:border-[#E08210] focus:ring-1 focus:ring-[#E08210] transition-all leading-relaxed"
                  />
                </div>

                {/* Assign Collaborators */}
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-[#404040]">Assign Collaborators</label>
                  <div className="relative group">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleCollaborator(e.target.value)
                          e.target.value = "" // Reset select
                        }
                      }}
                      className="w-full h-[48px] px-6 rounded-[12px] border border-[#E5E5E5] bg-white text-[14px] text-[#404040] appearance-none focus:outline-none focus:border-[#E08210] focus:ring-1 focus:ring-[#E08210] transition-all cursor-pointer"
                    >
                      <option value="">Select team members</option>
                      {mockTeamMembers.filter(m => !selectedCollaborators.includes(m)).map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] pointer-events-none group-hover:text-[#404040] transition-colors" />
                  </div>

                  {selectedCollaborators.length > 0 && (
                    <div className="flex items-center gap-2.5 mt-6 ml-1 animate-in fade-in slide-in-from-left-2 duration-300">
                      {selectedCollaborators.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleCollaborator(name)}
                          className="group relative w-10 h-10 rounded-full border border-[#E5E5E5] bg-secondary flex items-center justify-center overflow-hidden hover:border-destructive/30 transition-all"
                        >
                          <User className="w-5 h-5 text-muted-foreground/60 group-hover:text-destructive/60 transition-colors" />
                          <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <X className="w-3.5 h-3.5 text-destructive/80" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 px-10 border-t border-[#F0F0F0] flex gap-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 h-[52px] rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] font-bold text-[#404040] hover:bg-secondary/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={uploadFiles.length === 0}
                  className="flex-1 h-[52px] rounded-[10px] bg-[#1A1A1A] text-white text-[14px] font-bold hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  Upload Assets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
