import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import Navbar from '../components/Navbar'
import client from '../api/client'

const STATUS_COLORS = {
  applied:   '#3b82f6',
  interview: '#f59e0b',
  offer:     '#22c55e',
  rejected:  '#f87171'
}

export default function Analytics() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/jobs')
      .then(res => setJobs(res.data.jobs))
      .finally(() => setLoading(false))
  }, [])

  // Metrics
  const total = jobs.length
  const interviews = jobs.filter(j => j.status === 'interview' || j.status === 'offer').length
  const offers = jobs.filter(j => j.status === 'offer').length
  const responseRate = total > 0 ? Math.round((interviews / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0

  // Pie chart data
  const statusCounts = ['applied', 'interview', 'offer', 'rejected'].map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: jobs.filter(j => j.status === status).length,
    color: STATUS_COLORS[status]
  })).filter(d => d.value > 0)

  // Bar chart: applications per week (last 8 weeks)
  const weeklyData = (() => {
    const weeks = []
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - i * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      const count = jobs.filter(j => {
        const d = new Date(j.appliedAt)
        return d >= weekStart && d < weekEnd
      }).length
      weeks.push({
        week: `W${8 - i}`,
        applications: count
      })
    }
    return weeks
  })()

  const metrics = [
    { label: 'Total applied', value: total, color: 'text-blue-600' },
    { label: 'Interviews', value: interviews, color: 'text-yellow-600' },
    { label: 'Offers', value: offers, color: 'text-green-600' },
    { label: 'Response rate', value: `${responseRate}%`, color: 'text-slate-700' },
    { label: 'Offer rate', value: `${offerRate}%`, color: 'text-slate-700' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="text-center py-20 text-slate-400">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Analytics</h1>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {metrics.map(m => (
            <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className={`text-2xl font-semibold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-slate-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-slate-700 mb-4">Applications per week</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-slate-700 mb-4">Status breakdown</h2>
            {statusCounts.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusCounts.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

