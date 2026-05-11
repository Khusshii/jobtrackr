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

  useEffect(() => {
    fetchJobs()
  }, [])

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

  const openEdit = (job) => {
    setEditingJob(job)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditingJob(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingJob(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Application Board</h1>
            <p className="text-sm text-slate-500">{jobs.length} total applications</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Application
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading your applications...</div>
        ) : (
          <KanbanBoard
            jobs={jobs}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showModal && (
        <JobModal
          job={editingJob}
          onSave={handleSave}
          onClose={closeModal}
          onAI={setAiJob}
        />
      )}

      {aiJob && (
        <AIPanel
          job={aiJob}
          onClose={() => setAiJob(null)}
        />
      )}
    </div>
  )
}