import { TrendingUp, Clock, ShieldCheck } from 'lucide-react'

interface PerformanceMetricProps {
  label: string
  value: string
  percent: number
  icon: React.ReactNode
  color: string
}

function PerformanceMetric({ label, value, percent, icon, color }: PerformanceMetricProps) {
  return (
    <div className="flex-1 min-w-[280px] p-6 rounded-2xl bg-card border border-border/50 space-y-4 hover:border-accent/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[12px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function EfficiencyPerformance() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-foreground">Efficiency & Performance</h3>
        <span className="text-[12px] font-medium text-muted-foreground/50">Last 6 Months</span>
      </div>
      
      <div className="flex flex-wrap gap-6">
        <PerformanceMetric 
          label="On-Time Completion" 
          value="High" 
          percent={94} 
          icon={<Clock className="w-5 h-5" />} 
          color="bg-emerald-500"
        />
        <PerformanceMetric 
          label="Reliability Signal" 
          value="Strong" 
          percent={88} 
          icon={<ShieldCheck className="w-5 h-5" />} 
          color="bg-accent"
        />
        <PerformanceMetric 
          label="Growth Trend" 
          value="+12%" 
          percent={72} 
          icon={<TrendingUp className="w-5 h-5" />} 
          color="bg-blue-500"
        />
      </div>

      <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-xl">💡</span>
        </div>
        <div>
            <p className="text-[13px] font-bold text-accent mb-1">TALA Insight</p>
            <p className="text-[13px] text-muted-foreground/80 leading-relaxed">
                You're most productive on Tuesdays. Want to schedule focus blocks midweek? Your efficiency has increased by 5% since February.
            </p>
        </div>
      </div>
    </section>
  )
}
