import { Trophy, Award, Milestone, Star } from 'lucide-react'

interface AchievementBadgeProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
}

function AchievementBadge({ title, subtitle, icon, color }: AchievementBadgeProps) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-foreground">{title}</h4>
        <p className="text-[11px] font-medium text-muted-foreground/60">{subtitle}</p>
      </div>
    </div>
  )
}

export function RewardsAchievements() {
  return (
    <section className="space-y-6">
      <h3 className="text-[18px] font-bold text-foreground">Rewards & Achievements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AchievementBadge 
          title="Top Creator" 
          subtitle="Top 1% this month" 
          icon={<Trophy className="w-6 h-6 text-amber-500" />} 
          color="bg-amber-500/10"
        />
        <AchievementBadge 
          title="Quick Responder" 
          subtitle="Under 1hr average" 
          icon={<Star className="w-6 h-6 text-blue-500" />} 
          color="bg-blue-500/10"
        />
        <AchievementBadge 
          title="10 Projects" 
          subtitle="Execution milestone" 
          icon={<Milestone className="w-6 h-6 text-purple-500" />} 
          color="bg-purple-500/10"
        />
        <AchievementBadge 
          title="Team Player" 
          subtitle="15+ Collaborations" 
          icon={<Award className="w-6 h-6 text-emerald-500" />} 
          color="bg-emerald-500/10"
        />
      </div>
    </section>
  )
}
