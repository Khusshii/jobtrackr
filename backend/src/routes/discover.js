import express from 'express'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

const fetchAdzuna = async (query, location, page, appId, appKey) => {
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&sort_by=relevance&content-type=application/json`
  const response = await fetch(url)
  const data = await response.json()
  return data.results || []
}

router.get('/', authenticate, async (req, res) => {
  try {
    const { keywords = 'software developer', location = 'india', page = 1, experience = 'all' } = req.query
    const appId = process.env.ADZUNA_APP_ID
    const appKey = process.env.ADZUNA_APP_KEY

    let jobs = []
    let total = 0

    if (experience === 'fresher') {
      // Fetch internships and entry level separately then merge
      const [internships, entryLevel, trainees] = await Promise.all([
        fetchAdzuna(`${keywords} internship`, location, page, appId, appKey),
        fetchAdzuna(`${keywords} entry level`, location, page, appId, appKey),
        fetchAdzuna(`${keywords} trainee`, location, page, appId, appKey),
      ])
      // Merge and remove duplicates by id
      const merged = [...internships, ...entryLevel, ...trainees]
      const seen = new Set()
      jobs = merged.filter(job => {
        if (seen.has(job.id)) return false
        seen.add(job.id)
        return true
      })
      total = jobs.length
    } else if (experience === 'senior') {
      const [senior, lead] = await Promise.all([
        fetchAdzuna(`senior ${keywords}`, location, page, appId, appKey),
        fetchAdzuna(`lead ${keywords}`, location, page, appId, appKey),
      ])
      const merged = [...senior, ...lead]
      const seen = new Set()
      jobs = merged.filter(job => {
        if (seen.has(job.id)) return false
        seen.add(job.id)
        return true
      })
      total = jobs.length
    } else {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(keywords)}&where=${encodeURIComponent(location)}&sort_by=relevance&content-type=application/json`
      const response = await fetch(url)
      const data = await response.json()
      jobs = data.results || []
      total = data.count || 0
    }

    res.json({ jobs, total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

export default router