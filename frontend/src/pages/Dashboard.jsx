import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import KanbanBoard from '../components/KanbanBoard'
import JobModal from '../components/JobModal'
import AIPanel from '../components/AIPanel'
import client from '../api/client'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [aiJob, setAiJob] = useState(null)

  const fetchJobs = async () => {
    try {
      const res = await client.get('/jobs')
      setJobs(res.data.jobs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSave = async (form) => {
    if (editingJob) {
      const res = await client.put(`/jobs/${editingJob.id}`, form)
      setJobs(prev => prev.map(j => j.id === editingJob.id ? res.data.job : j))
    } else {
      const res = await client.post('/jobs', form)
      setJobs(prev => [res.data.job, ...prev])
    }
    setEditingJob(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    await client.delete(`/jobs/${id}`)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const openEdit = (job) => { setEditingJob(job); setShowModal(true) }
  const openAdd = () => { setEditingJob(null); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingJob(null) }

  const stats = [
    { label: 'Total Applied', value: jobs.length,  color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Interviews', value: jobs.filter(j => j.status === 'interview').length,  color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Offers', value: jobs.filter(j => j.status === 'offer').length,  color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rejected', value: jobs.filter(j => j.status === 'rejected').length,  color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Application Board </h1>
            <p className="text-slate-400 text-sm">Track and manage all your job applications</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg flex items-center gap-2"
          >
            + Add Application
          </button>
        </div>

        {/* Stats Row */}
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3 mt-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-slate-800 bg-opacity-60 backdrop-blur rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3"></div>
            <p className="text-slate-400">Loading your applications...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4"></div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No applications yet</h2>
            <p className="text-slate-400 text-sm mb-6">Start tracking your job search or discover new openings</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={openAdd}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + Add Application
              </button>
              <a
                href="/discover"
                className="border border-slate-300 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                🔍 Discover Jobs
              </a>
            </div>
          </div>
        ) : (
          <KanbanBoard jobs={jobs} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </main>

      {showModal && (
        <JobModal job={editingJob} onSave={handleSave} onClose={closeModal} onAI={setAiJob} />
      )}
      {aiJob && <AIPanel job={aiJob} onClose={() => setAiJob(null)} />}
    </div>
  )
}
