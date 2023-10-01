import express from 'express'

import { todoRouter } from './todos'
import { userRouter } from './users'

const router = express.Router()

router.use('/todos', todoRouter)
router.use('/users', userRouter)

router.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  return res.json(healthcheck)
})

export { router }
