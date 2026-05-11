import express from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All routes require auth
router.use(authenticate)

// GET /api/jobs — get all jobs for current user
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId },
      orderBy: { appliedAt: 'desc' }
    })
    res.json({ jobs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/jobs — create a new job
router.post('/', async (req, res) => {
  try {
    const { company, role, status, location, salary, url, notes, jobDescription } = req.body

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' })
    }

    const job = await prisma.job.create({
      data: {
        userId: req.userId,
        company,
        role,
        status: status || 'applied',
        location: location || null,
        salary: salary || null,
        url: url || null,
        notes: notes || null,
        jobDescription: jobDescription || null
      }
    })

    res.status(201).json({ job })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/jobs/:id — update a job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Make sure the job belongs to the user
    const existing = await prisma.job.findFirst({
      where: { id, userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const { company, role, status, location, salary, url, notes, jobDescription } = req.body

    const job = await prisma.job.update({
      where: { id },
      data: {
        company,
        role,
        status,
        location: location || null,
        salary: salary || null,
        url: url || null,
        notes: notes || null,
        jobDescription: jobDescription || null
      }
    })

    res.json({ job })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/jobs/:id — delete a job
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.job.findFirst({
      where: { id, userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Job not found' })
    }

    await prisma.job.delete({ where: { id } })

    res.json({ message: 'Job deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router