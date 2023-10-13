import { connectDatabase } from './configs/mongodb'

const init = async (): Promise<void> => {
  await connectDatabase()
}

export default init
