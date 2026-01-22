import { Router } from 'express'

const router = Router()

router.get('/', async (_req, res) => {
  res.json({
    summary: { total: 0, successRate: 0, avgResponse: 0 },
    history: [],
    alerts: []
  })
})

export default router
