import crypto from 'crypto'
import { type IUserInserted, type IUser } from '../../interfaces'
import { type IUsersRepository } from '../repositoryInterfaces'
// import { type Id } from '../../interfaces/ids'
console.log('Memory repository in use')
const userListInMemory: IUserInserted[] = []

const usersRepository: IUsersRepository = {
  create: async (user: IUser): Promise<IUserInserted | null> => {
    const newUser = {
      _id: crypto.randomUUID(),
      ...user
    }
    userListInMemory.push(newUser)
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  }
}

export { usersRepository }
