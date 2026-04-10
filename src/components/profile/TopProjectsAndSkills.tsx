import { ExternalLink, Code2 } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  imageUrl?: string
  tags: string[]
}

function ProjectCard({ title, description, imageUrl, tags }: ProjectCardProps) {
  return (
    <div className="group flex-1 min-w-[300px] rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[16/10] bg-secondary flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/20 bg-gradient-to-br from-secondary to-muted">
            <Code2 className="w-12 h-12 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Project Visual</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button className="h-10 px-6 rounded-xl bg-white text-black text-[13px] font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
            View Details
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <h4 className="text-[16px] font-bold text-foreground group-hover:text-accent transition-colors">{title}</h4>
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-accent">
            {tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider">#{tag}</span>
            ))}
        </div>
      </div>
    </div>
  )
}

export function TopProjectsAndSkills() {
  const skills = ['Product Management', 'AI/ML', 'UX Design', 'Data Analytics', 'Strategic Planning', 'Agile']
  
  return (
    <div className="space-y-10">
      {/* Skills Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-foreground">Skills</h3>
            <button className="text-[12px] font-bold text-accent hover:underline">View All Skills</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span 
              key={skill} 
              className="px-4 py-2 rounded-xl bg-secondary/50 border border-border/30 text-[13px] font-semibold text-muted-foreground hover:bg-accent/5 hover:text-accent hover:border-accent/20 transition-all cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Top Projects Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-foreground">Top Projects</h3>
          <button className="text-[12px] font-bold text-accent hover:underline">See All Projects</button>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <ProjectCard 
            title="Design Canvas Project"
            description="AI enhanced design tool for making amazing canvases for designers. Streamlining creative workflows with intelligent suggestions."
            tags={['AI', 'Design', 'Product']}
          />
          <ProjectCard 
            title="TALA Logistics Hub"
            description="Comprehensive dashboard for managing international shipments, tracking real-time status and optimizing delivery routes."
            tags={['Logistics', 'Dashboard', 'React']}
          />
          <ProjectCard 
            title="CollabSphere"
            description="A platform for real-time collaboration between remote teams, featuring integrated file sharing and project tracking."
            tags={['SaaS', 'Web3', 'NodeJS']}
          />
        </div>
      </section>
    </div>
  )
}
