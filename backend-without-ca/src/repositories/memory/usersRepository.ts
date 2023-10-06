import crypto from 'crypto'
import { type IUserInserted, type IUser } from '../../interfaces'
import { type IUsersRepository } from '../repositoryInterfaces'
// import { type Id } from '../../interfaces/ids'
console.log('Memory repository in use')
let userListInMemory: Array<Required<IUserInserted>> = []

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
  },
  getByEmail: async (email: string): Promise<Required<IUserInserted> | null> => {
    const user = userListInMemory.find(user => user.email === email)
    if (!user) {
      return null
    }
    return user
  },
  deleteAll: async (): Promise<void> => {
    userListInMemory = []
  }
}

export { usersRepository }
