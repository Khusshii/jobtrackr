import { useState } from 'react'

const STATUSES = ['applied', 'interview', 'offer', 'rejected']

export default function JobModal({ job, onSave, onClose, onAI }) {
  const [form, setForm] = useState({
    company: job?.company || '',
    role: job?.role || '',
    status: job?.status || 'applied',
    location: job?.location || '',
    salary: job?.salary || '',
    url: job?.url || '',
    notes: job?.notes || '',
    jobDescription: job?.jobDescription || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company || !form.role) {
      setError('Company and role are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">
            {job ? 'Edit Application' : 'Add Application'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Company *</label>
              <input
                type="text"
                placeholder="Google"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Role *</label>
              <input
                type="text"
                placeholder="Frontend Engineer"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Bangalore, India"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Salary / CTC</label>
              <input
                type="text"
                placeholder="₹12 LPA"
                value={form.salary}
                onChange={e => setForm({ ...form, salary: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Job URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Job Description
              <span className="text-slate-400 font-normal ml-1">(for AI cover letter)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Paste the job description here..."
              value={form.jobDescription}
              onChange={e => setForm({ ...form, jobDescription: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              rows={2}
              placeholder="Interview notes, contacts, deadlines..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : job ? 'Save changes' : 'Add application'}
            </button>

            {job && onAI && (
              <button
                type="button"
                onClick={() => { onClose(); onAI(job) }}
                className="flex-1 border border-blue-300 text-blue-600 rounded-lg py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                ✨ Cover Letter
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}