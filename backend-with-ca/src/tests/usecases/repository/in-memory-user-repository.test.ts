import { expect } from 'chai'

import { type IUser, type IUserWithId } from '@/entities/interfaces/user'
import { InMemoryUserRepository } from '@/usecases/shared/repository/in-memory-user-repository'

describe('In memory user repository test', () => {
  describe('Create method testing', () => {
    it('should create an user repository', async () => {
      const instance = new InMemoryUserRepository([])
      const user: IUser = {
        email: 'email@email.com',
        password: 'Password100'
      }
      const userCreated = await instance.create(user)
      expect(userCreated).to.be.a('string')
    })
  })
  describe('Find by email testing', () => {
    it('should find an user by email', async () => {
      const user: IUserWithId = {
        id: 'thisisid',
        email: 'email@email.com',
        password: 'Password100'
      }
      const instance = new InMemoryUserRepository([user])
      const userFound = await instance.findByEmail(user.email)
      expect(userFound).to.deep.equal(user)
    })
    it('should not find an user by email', async () => {
      const user: IUserWithId = {
        id: 'thisisid',
        email: 'email@email.com',
        password: 'Password100'
      }
      const instance = new InMemoryUserRepository([user])
      const userFound = await instance.findByEmail('thisiswrongemail@email.com')
      expect(userFound).to.equal(null)
    })
  })
})
