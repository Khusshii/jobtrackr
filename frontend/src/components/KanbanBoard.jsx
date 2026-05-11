import JobCard from './JobCard'

const COLUMNS = [
  { key: 'applied',   label: 'Applied',   color: 'bg-blue-500' },
  { key: 'interview', label: 'Interview',  color: 'bg-yellow-500' },
  { key: 'offer',     label: 'Offer',      color: 'bg-green-500' },
  { key: 'rejected',  label: 'Rejected',   color: 'bg-red-400' }
]

export default function KanbanBoard({ jobs, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map(col => {
        const colJobs = jobs.filter(j => j.status === col.key)
        return (
          <div key={col.key} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
              <h2 className="text-sm font-medium text-slate-700">{col.label}</h2>
              <span className="ml-auto text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                {colJobs.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 min-h-[200px]">
              {colJobs.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center min-h-[120px]">
                  <p className="text-xs text-slate-400">No applications</p>
                </div>
              )}
              {colJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}