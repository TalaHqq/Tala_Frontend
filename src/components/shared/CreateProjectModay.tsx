import React, { useState, useEffect, useRef } from 'react'
import {User,  Sun,ChevronDown, Plus, X,  Calendar, Paperclip} from 'lucide-react'

type ProjectTag = 'Personal' | 'Team' | 'Client'
const PROJECT_TAG_OPTIONS = ['Marketing', 'Product Design', 'Q3 Launch', 'Internal']

const COLLECTION_OPTIONS = [
  { id: 'c1', name: 'Q2 Asset Library' },
  { id: 'c2', name: 'Campaign Assets V3' },
  { id: 'c3', name: 'Design Files' },
]
// ─── Task Detail Modal Types ─────────────────────────────────────────────────
export function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [projectType, setProjectType] = useState<ProjectTag>('Team')
  const [selectedTags, setSelectedTags] = useState<string[]>(['Marketing', 'Product Design', 'Q3 Launch', 'Internal'])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [collaborators, setCollaborators] = useState([
    { id: 'm1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
    { id: 'm2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
    { id: 'm3', name: 'Mike Ross', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
  ])
  // @ts-ignore
  const [assignedTo, setAssignedTo] = useState('John Doe')
  const [linkedCollections, setLinkedCollections] = useState<string[]>(['c1', 'c2', 'c3'])
  const [insightsDismissed, setInsightsDismissed] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose()
  }

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])

  const removeCollaborator = (id: string) =>
    setCollaborators((prev) => prev.filter((c) => c.id !== id))

  const toggleCollection = (id: string) =>
    setLinkedCollections((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-[600px] mx-4 flex flex-col max-h-[92vh]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-[17px] font-bold text-neutral-900">Create New Project</h2>
            <p className="text-[12px] text-neutral-400 mt-0.5">Set up your team, channel assets, and plan your workflow.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Project Basics ── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
              <h3 className="text-[13px] font-bold text-neutral-800">Project Basics</h3>
            </div>

            {/* Project Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-neutral-700">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Product Launch Campaign"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-neutral-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your project goals, deliverables, and context..."
                rows={3}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[13px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 resize-none transition-colors"
              />
            </div>

            {/* Project Type + Tags */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-[12px] font-semibold text-neutral-700">Project Tags</label>
                {(['Personal', 'Team', 'Client'] as ProjectTag[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setProjectType(t)}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                      projectType === t
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-0.5">
                {PROJECT_TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                        : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                <button className="px-3 py-1.5 rounded-lg border border-dashed border-neutral-300 text-[12px] font-medium text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Tag
                </button>
              </div>
            </div>
          </section>

          {/* ── Timeline Setup ── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <h3 className="text-[13px] font-bold text-neutral-800">Timeline Setup</h3>
            </div>

            <div className="flex items-end gap-3">
              {/* Start Date */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-semibold text-neutral-700">Project Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[12px] text-neutral-700 focus:outline-none focus:border-neutral-400 transition-colors appearance-none pr-8"
                  />
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-semibold text-neutral-700">Project End Date (or 'Deadline)</label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[12px] text-neutral-700 focus:outline-none focus:border-neutral-400 transition-colors appearance-none pr-8"
                  />
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Auto-calculate */}
              <button className="flex-shrink-0 border border-neutral-200 rounded-lg px-3 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors whitespace-nowrap">
                Auto calculated
              </button>
            </div>

            <p className="text-[11px] text-neutral-400">
              TALA will automatically set up your project timeline based on these dates.
            </p>
          </section>

          {/* ── Invite Team Members ── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <h3 className="text-[13px] font-bold text-neutral-800">Invite Team Members</h3>
            </div>

            <div className="flex items-start gap-6">
              {/* Invite Collaborators */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-semibold text-neutral-700">Invite Collaborators</label>
                <div className="flex items-center gap-2 flex-wrap border border-neutral-200 rounded-lg px-3 py-2 min-h-[40px] bg-neutral-50/50">
                  {collaborators.map((c) => (
                    <div key={c.id} className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full pl-1 pr-2 py-0.5">
                      <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[11px] font-medium text-neutral-700">{c.name}</span>
                      <button onClick={() => removeCollaborator(c.id)} className="text-neutral-300 hover:text-neutral-500 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors ml-1">
                    Invite more...
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Assign Initial Task to */}
              <div className="flex flex-col gap-1.5 w-[160px] flex-shrink-0">
                <label className="text-[12px] font-semibold text-neutral-700">Assign Initial Task to</label>
                <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50/50 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
                      alt={assignedTo}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[12px] font-medium text-neutral-800">{assignedTo}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Attach Related Collections ── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <h3 className="text-[13px] font-bold text-neutral-800">Attach Related Collections</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-neutral-700">Link Assets and Collections</label>
              <div className="flex flex-wrap gap-2">
                {COLLECTION_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => toggleCollection(col.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-medium transition-colors ${
                      linkedCollections.includes(col.id)
                        ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                        : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                    </svg>
                    {col.name}
                  </button>
                ))}
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-neutral-300 text-[12px] font-medium text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add From Library
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                TALA will automatically suggest related assets for new tasks based on tags or team activity.
              </p>
            </div>
          </section>

          {/* ── TALA Insights ── */}
          {!insightsDismissed && (
            <div className="flex items-start justify-between gap-4 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[12px] font-bold text-neutral-700">TALA Insights</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <svg className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-[11px] text-neutral-500 leading-relaxed">Suggested project deadline based on past performance.</span>
                  </div>
                  <div className="flex items-start gap-2 flex-1">
                    <User className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-500 leading-relaxed">Suggested team composition based on similar tasks.</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                <button className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-semibold hover:bg-neutral-700 transition-colors">
                  Apply Insights
                </button>
                <button
                  onClick={() => setInsightsDismissed(true)}
                  className="text-[11px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-neutral-100 bg-neutral-50/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-300 text-[13px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-semibold hover:bg-neutral-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  )
}
