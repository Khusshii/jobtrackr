import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import client from '../api/client'

const TECH_ROLES = [
  'Software Developer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'AI Engineer', 'ML Engineer',
  'Data Scientist', 'DevOps Engineer', 'Mobile Developer',
  'React Developer', 'Node.js Developer', 'Python Developer',
  'Java Developer', 'Android Developer', 'iOS Developer'
]

const EXPERIENCE_LEVELS = [
  { key: 'all', label: 'All Levels' },
  { key: 'fresher', label: 'Entry Level & Internships' },
  { key: 'senior', label: 'Senior' }
]

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500'
]

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

export default function Discover() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState('Software Developer')
  const [location, setLocation] = useState('india')
  const [total, setTotal] = useState(0)
  const [saved, setSaved] = useState({})
  const [experience, setExperience] = useState('all')
  const [error, setError] = useState(null)

  const isRecent = (dateStr) => {
    if (!dateStr) return true
    const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
    return days <= 30
  }

  const fetchJobs = async (overrideKeywords, overrideExperience) => {
    setLoading(true)
    setError(null)
    try {
      const res = await client.get('/discover', {
        params: {
          keywords: overrideKeywords ?? keywords,
          location,
          experience: overrideExperience ?? experience
        }
      })
      const filtered = (res.data.jobs || []).filter(job => isRecent(job.created))
      setJobs(filtered)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch jobs. Please try again.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleRoleClick = (role) => {
    setKeywords(role)
    fetchJobs(role, experience)
  }

  const handleExperienceClick = (level) => {
    setExperience(level)
    fetchJobs(keywords, level)
  }

  const saveJob = async (job) => {
    try {
      await client.post('/jobs', {
        company: job.company?.display_name || 'Unknown',
        role: job.title,
        status: 'applied',
        location: job.location?.display_name || location,
        url: job.redirect_url,
        salary: job.salary_min
          ? `${Math.round(job.salary_min / 100000)}L - ${Math.round(job.salary_max / 100000)}L PA`
          : null
      })
      setSaved(prev => ({ ...prev, [job.id]: true }))
    } catch (err) {
      console.error(err)
    }
  }

  const getInitials = (name) => name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : null
  const getColor = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length]
  const getDaysAgo = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Find Your Next Role</h1>
          <p className="text-slate-400 text-sm mb-6">
            {total.toLocaleString()} live openings across India
          </p>
          <div className="flex gap-3 max-w-2xl">
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              placeholder="Job title, role or keyword"
              className="border-0 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 shadow-sm"
            />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              placeholder="Location"
              className="border-0 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 shadow-sm"
            />
            <button
              onClick={() => fetchJobs()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm">
          {/* Experience Level */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest w-28">Experience</p>
            <div className="flex gap-2">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level.key}
                  onClick={() => handleExperienceClick(level.key)}
                  className={`text-xs px-4 py-1.5 rounded-md border font-medium transition-colors ${
                    experience === level.key
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role Pills */}
          <div className="flex items-start gap-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest w-28 pt-1.5">Role</p>
            <div className="flex flex-wrap gap-2">
              {TECH_ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleClick(role)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    keywords === role
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{jobs.length}</span> results for{' '}
              <span className="font-medium text-slate-700">"{keywords}"</span>
              <span className="text-slate-400 ml-1">(last 30 days)</span>
            </p>
            <p className="text-xs text-slate-400">Sorted by relevance</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200 mb-4">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Job Cards */}
        {loading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Searching for jobs...</p>
          </div>
        ) : jobs.length === 0 && !error ? (
          <div className="text-center py-24 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-700 font-medium mb-1">No recent results found</p>
            <p className="text-slate-400 text-sm">Try a different role, keyword or location</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-slate-300 transition-all">
                {/* Company header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${getColor(job.company?.display_name)} flex items-center justify-center flex-shrink-0`}>
                    {getInitials(job.company?.display_name) ? (
                      <span className="text-white text-xs font-bold">{getInitials(job.company?.display_name)}</span>
                    ) : (
                      <BuildingIcon />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-0.5">{job.title}</h3>
                    <p className="text-slate-500 text-xs font-medium">{job.company?.display_name || 'Company'}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                    {job.location?.display_name}
                  </span>
                  {job.salary_min && (
                    <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1 font-medium">
                      {Math.round(job.salary_min / 100000)}L - {Math.round(job.salary_max / 100000)}L PA
                    </span>
                  )}
                  {job.created && (
                    <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                      {getDaysAgo(job.created)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-xs text-center text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-md py-2 transition-colors font-medium"
                  >
                    View Job
                  </a>
                  <button
                    onClick={() => saveJob(job)}
                    disabled={saved[job.id]}
                    className={`flex-1 text-xs rounded-md py-2 transition-colors font-medium ${
                      saved[job.id]
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {saved[job.id] ? '✓ Saved' : 'Save to Board'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
