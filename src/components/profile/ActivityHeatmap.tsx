interface ActivityHeatmapProps {
  data?: number[] // Array of 365 values (0-4 intensity)
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Generate mock data if none provided
  const activityData = data || Array.from({ length: 364 }, () => Math.floor(Math.random() * 5))
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-secondary/40' // No activity
      case 1: return 'bg-accent/20'    // Low
      case 2: return 'bg-accent/40'    // Medium-Low
      case 3: return 'bg-accent/70'    // Medium-High
      case 4: return 'bg-accent'       // High
      default: return 'bg-secondary/40'
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-foreground">Activity</h3>
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(l => (
              <div key={l} className={`w-3 h-3 rounded-sm ${getColor(l)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border/50 overflow-x-auto no-scrollbar shadow-inner">
        <div className="flex gap-2 min-w-[700px]">
          {/* Day Labels */}
          <div className="grid grid-rows-7 gap-1 mt-6 text-[10px] font-bold text-muted-foreground/40 pr-2">
            {days.map((day, i) => (
              <div key={i} className="h-3 flex items-center leading-none">{day}</div>
            ))}
          </div>

          <div className="flex-1 space-y-2">
            {/* Month Labels */}
            <div className="flex justify-between text-[11px] font-bold text-muted-foreground/40 px-1">
              {months.map(month => (
                <span key={month}>{month}</span>
              ))}
            </div>

            {/* The Grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {activityData.map((level, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer hover:shadow-md ${getColor(level)}`}
                  title={`Activity Level: ${level}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-[12px] text-muted-foreground/50 italic text-center">
        “Consistency is the foundation of excellence.” — Showing activity from the past 12 months.
      </p>
    </section>
  )
}
