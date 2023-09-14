import express from 'express'

import { todoRouter } from './todo'

const router = express.Router()

router.use('/todo', todoRouter)

router.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  return res.json(healthcheck)
})

export { router }
