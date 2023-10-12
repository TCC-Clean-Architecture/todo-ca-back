import express from 'express'
import { makeCreateTodoController } from './factories/create-todo'
import { expressRouteAdapter } from './adapters/express-route-adapter'

const app = express()

app.use(express.json())
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  return res.json(healthcheck)
})
app.post('/todos', expressRouteAdapter(makeCreateTodoController()))

export default app
