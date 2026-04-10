import { CheckSquare, Activity, Zap, Users } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="flex-1 min-w-[200px] rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      </div>
    </div>
  )
}

export function QuickStats() {
  return (
    <div className="flex flex-wrap gap-6 w-full">
      <StatCard 
        label="Projects Completed" 
        value={24} 
        icon={<CheckSquare className="w-5 h-5" />} 
        trend="+3 this month"
      />
      <StatCard 
        label="Active Projects" 
        value={3} 
        icon={<Activity className="w-5 h-5" />} 
      />
      <StatCard 
        label="Efficiency Score" 
        value="87%" 
        icon={<Zap className="w-5 h-5" />} 
        trend="Top 5%"
      />
      <StatCard 
        label="Collaborations" 
        value={12} 
        icon={<Users className="w-5 h-5" />} 
      />
    </div>
  )
}
