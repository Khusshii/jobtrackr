import { useState } from 'react'
import client from '../api/client'

export default function AIPanel({ job, onClose }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await client.post('/ai/cover-letter', {
        company: job.company,
        role: job.role,
        jobDescription: job.jobDescription,
        notes: job.notes
      })
      setCoverLetter(res.data.coverLetter)
    } catch {
      setError('Failed to generate. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(coverLetter)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900">AI Cover Letter</h2>
            <p className="text-xs text-slate-500">{job.role} at {job.company}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!coverLetter && !loading && (
            <div className="text-center mt-12">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-slate-600 text-sm mb-1">Generate a tailored cover letter</p>
              <p className="text-slate-400 text-xs">
                Tip: Add a job description to the job for better results.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center mt-12">
              <div className="animate-spin text-3xl mb-4">⏳</div>
              <p className="text-slate-500 text-sm">Writing your cover letter...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {coverLetter && (
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={copy}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-200">
                {coverLetter}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200">
          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {coverLetter ? 'Regenerate' : 'Generate Cover Letter'}
          </button>
        </div>
      </div>
    </div>
  )
}