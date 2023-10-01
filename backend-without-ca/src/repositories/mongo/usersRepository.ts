import { getCollection } from '../../database'
import { type IUser, type IUserInserted } from '../../interfaces'
import { type IUsersRepository } from '../repositoryInterfaces'
const usersCollection = getCollection('users')

const usersRepository: IUsersRepository = {
  create: async (user: IUser): Promise<IUserInserted | null> => {
    const { insertedId } = await usersCollection.insertOne(user)
    if (!insertedId) {
      return null
    }
    const insertedUser = await usersCollection.findOne<IUserInserted>({ _id: insertedId })
    return insertedUser
  },
  getByEmail: async (email: string): Promise<Required<IUserInserted> | null> => {
    const user = await usersCollection.findOne<Required<IUserInserted>>({
      email
    })
    if (!user) {
      return null
    }
    return user
  },
  deleteAll: async (): Promise<void> => {
    await usersCollection.deleteMany()
  }
}

export { usersRepository }
