import dotenv from 'dotenv'

import { connectDatabase } from '@/main/configs/mongodb'

const init = async (): Promise<void> => {
  dotenv.config()
  await connectDatabase()
}

export default init
