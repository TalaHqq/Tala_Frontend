import { MapPin, CheckCircle, Pencil, Eye } from 'lucide-react'

interface ProfileHeaderProps {
  isOwnProfile?: boolean
  avatarUrl?: string
  name: string
  role: string
  location?: string
  isAvailable?: boolean
}

export function ProfileHeader({
  isOwnProfile = true,
  avatarUrl,
  name,
  role,
  location,
  isAvailable = true
}: ProfileHeaderProps) {
  return (
    <div className="relative w-full rounded-3xl bg-card border border-border/50 p-8 shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-background bg-secondary shadow-lg flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                <span className="text-4xl font-bold text-muted-foreground/40">{name.charAt(0)}</span>
              </div>
            )}
          </div>
          {isAvailable && (
            <div className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full shadow-md">
              <div className="bg-emerald-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
              {isAvailable && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit mx-auto md:mx-0">
                  Open to Collaborations
                </span>
              )}
            </div>
            <p className="text-lg font-medium text-muted-foreground/80">{role}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[13px] font-medium text-muted-foreground/60">
            {location && (
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl bg-secondary/30 p-4 rounded-xl border border-border/10">
            Transforming complex ideas into elegant solutions. Passionate about AI-driven innovation and building products that make a difference. Always learning, always creating.
          </p>

          {isOwnProfile && (
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <button className="inline-flex items-center gap-2 h-10 px-6 rounded-xl border border-border bg-background text-[13px] font-bold hover:bg-secondary transition-all shadow-sm active:scale-95">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="inline-flex items-center gap-2 h-10 px-6 rounded-xl border border-border bg-background text-[13px] font-bold hover:bg-secondary transition-all shadow-sm active:scale-95">
                <Eye className="w-4 h-4" />
                View as Public
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
