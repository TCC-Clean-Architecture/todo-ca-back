import { type IUser, type IUserWithId } from '@/entities/interfaces/user'
import { getCollection } from '@/main/configs/mongodb'
import { type IUserRepository } from '@/shared/user-repository'

import { convertMongoIdToNormalId } from './helpers/convertMongoIdToNormalId'

class MongoUserRepository implements IUserRepository {
  async create (user: IUser): Promise<string> {
    const collection = getCollection('users')
    const { insertedId } = await collection.insertOne(user)
    return insertedId.toString()
  }

  async findByEmail (email: string): Promise<IUserWithId | null> {
    const todoListCollection = getCollection('users')
    const todo = await todoListCollection.findOne({
      email
    })
    if (!todo) {
      return null
    }
    return convertMongoIdToNormalId(todo)
  }
}

export { MongoUserRepository }
