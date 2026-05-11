import express from 'express'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// POST /api/ai/cover-letter
router.post('/cover-letter', authenticate, async (req, res) => {
  try {
    const { company, role } = req.body

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' })
    }

    // AI feature disabled - add ANTHROPIC_API_KEY to enable
    res.json({ 
      coverLetter: `Cover letter generation requires an Anthropic API key. Please add your ANTHROPIC_API_KEY to the .env file to enable this feature.` 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate cover letter' })
  }
})

export default router