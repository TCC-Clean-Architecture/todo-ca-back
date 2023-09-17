import dotenv from 'dotenv'
import { server } from './server'
import { connectDatabase } from './database'
import { initializeRepository } from './repositories'

dotenv.config()

const port = process.env.PORT ?? 3000
void (async () => {
  await connectDatabase()
  await initializeRepository()
  const serverInstance = server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })

  function shutdownProcedure (): void {
    console.log('*** App is now closing ***')
    serverInstance.close()
    process.exit(0)
  }

  process.on('SIGINT', (signal) => {
    console.log('*** Signal received ****')
    console.log('*** App will be closed in 3 sec ****')
    setTimeout(shutdownProcedure, 3000)
  })
  process.on('SIGTERM', (signal) => {
    console.log('*** Signal received ****')
    console.log('*** App will be closed in 3 sec ****')
    setTimeout(shutdownProcedure, 3000)
  })
})()
