const STATUS_COLORS = {
  applied:   'bg-blue-100 text-blue-700',
  interview: 'bg-yellow-100 text-yellow-700',
  offer:     'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-700'
}

export default function JobCard({ job, onEdit, onDelete }) {
  const date = new Date(job.appliedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  })

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-slate-900 text-sm">{job.role}</h3>
          <p className="text-slate-500 text-sm">{job.company}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>
          {job.status}
        </span>
      </div>

      {job.location && (
        <p className="text-xs text-slate-400 mb-1">📍 {job.location}</p>
      )}
      {job.salary && (
        <p className="text-xs text-slate-400 mb-1">💰 {job.salary}</p>
      )}

      <p className="text-xs text-slate-400 mt-2">Applied {date}</p>

      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg py-1.5 transition-colors"
        >
          Edit
        </button>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-xs text-slate-500 hover:bg-slate-50 rounded-lg py-1.5 text-center transition-colors"
          >
            View Job
          </a>
        )}
        <button
          onClick={() => onDelete(job.id)}
          className="flex-1 text-xs text-red-400 hover:bg-red-50 rounded-lg py-1.5 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}