const STATUS_COLORS = {
  applied:   'bg-blue-100 text-blue-700 border-blue-200',
  interview: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  offer:     'bg-green-100 text-green-700 border-green-200',
  rejected:  'bg-red-100 text-red-600 border-red-200'
}

const STATUS_ICONS = {
  applied: '📨',
  interview: '🎯',
  offer: '🎉',
  rejected: '❌'
}

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500'
]

export default function JobCard({ job, onEdit, onDelete }) {
  const date = new Date(job.appliedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short'
  })

  const getInitials = (name) => name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??'
  const getColor = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${getColor(job.company)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {getInitials(job.company)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">{job.role}</h3>
          <p className="text-slate-500 text-xs truncate">{job.company}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[job.status]} flex items-center gap-1`}>
          {STATUS_ICONS[job.status]} {job.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1 mb-3">
        {job.location && (
          <p className="text-xs text-slate-400 flex items-center gap-1">📍 {job.location}</p>
        )}
        {job.salary && (
          <p className="text-xs text-slate-400 flex items-center gap-1">💰 {job.salary}</p>
        )}
        <p className="text-xs text-slate-400 flex items-center gap-1">🗓 Applied {date}</p>
      </div>

      {job.notes && (
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-2 py-1.5 mb-3 line-clamp-1">
          💬 {job.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg py-1.5 transition-colors font-medium"
        >
          ✏️ Edit
        </button>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-xs text-slate-500 hover:bg-slate-50 rounded-lg py-1.5 text-center transition-colors"
          >
            🔗 View
          </a>
        )}
        <button
          onClick={() => onDelete(job.id)}
          className="flex-1 text-xs text-red-400 hover:bg-red-50 rounded-lg py-1.5 transition-colors"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )
}