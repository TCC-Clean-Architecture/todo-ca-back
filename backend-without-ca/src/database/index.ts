import dotenv from 'dotenv'
import { type Document, MongoClient, ServerApiVersion, type Collection } from 'mongodb'

dotenv.config()
const uri = process.env.MONGO_URI ?? 'mongodb+srv://user:pass@xxxxx.xxxxxx.mongodb.net/'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
async function connectDatabase (): Promise<void> {
  await client.connect()
  await client.db('2do4u').command({ ping: 1 })
  console.debug('MongoDB connected')
}

function getCollection (collectionName: string): Collection<Document> {
  return client.db('2do4u').collection(collectionName)
}

export {
  connectDatabase,
  getCollection
}
