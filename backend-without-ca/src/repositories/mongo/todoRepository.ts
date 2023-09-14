import { ObjectId } from 'mongodb'
import { getCollection } from '../../database'
import { type ITodoCreated, type ITodoInserted } from '../../interfaces'
import { type ITodoRepository } from '../repositoryInterfaces'
console.log('Mongo repository in use')
const todoCollection = getCollection('todo')

const todoRepository: ITodoRepository = {
  create: async (todoToInsert: ITodoCreated): Promise<ITodoInserted> => {
    const { insertedId } = await todoCollection.insertOne(todoToInsert)
    const result = await todoCollection.findOne({ _id: insertedId }) as ITodoInserted
    return result
  },
  listAll: async (): Promise<ITodoInserted[] | []> => {
    const result = await todoCollection.find().toArray() as ITodoInserted[]
    return result
  },
  removeAll: async (): Promise<boolean> => {
    const success = await todoCollection.deleteMany()
    if (success.deletedCount > 0) {
      return true
    } else {
      return false
    }
  },
  getById: async (id: string | ObjectId): Promise<ITodoInserted | null> => {
    const result = await todoCollection.findOne({
      _id: typeof id === 'string' ? new ObjectId(id) : id
    }) as ITodoInserted

    return result
  },
  delete: async (id: string | ObjectId): Promise<ObjectId | string | null> => {
    const result = await todoCollection.deleteOne({
      _id: typeof id === 'string' ? new ObjectId(id) : id
    })
    if (!result) {
      return null
    }

    return id
  },
  update: async (id: string | ObjectId, content: Omit<ITodoInserted, '_id'>): Promise<ITodoInserted | null> => {
    const idConverted = typeof id === 'string' ? new ObjectId(id) : id
    const updateResult = await todoCollection.updateOne({
      _id: idConverted
    }, content)
    if (!updateResult) {
      return null
    }
    const result = await todoCollection.findOne({ _id: idConverted }) as ITodoInserted
    return result
  }
}

export { todoRepository }
