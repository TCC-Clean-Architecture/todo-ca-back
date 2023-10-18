import crypto from 'crypto'

import { type IUser, type IUserWithId } from '@/entities/interfaces/user'
import { type IUserRepository } from '@/shared/user-repository'

class InMemoryUserRepository implements IUserRepository {
  public repository: IUserWithId[]
  constructor (initialValue: IUserWithId[]) {
    this.repository = initialValue
  }

  async create (user: IUser): Promise<string> {
    const id = crypto.randomUUID()
    this.repository.push({
      ...user,
      id
    })
    return id
  }

  async findByEmail (email: string): Promise<IUserWithId | null> {
    const user = this.repository.find(user => user.email === email)
    return user ?? null
  }
}

export { InMemoryUserRepository }
