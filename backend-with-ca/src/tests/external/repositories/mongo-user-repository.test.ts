import { expect } from 'chai'

import { type IUser } from '@/entities/interfaces/user'
import { MongoUserRepository } from '@/external/repositories/mongo-user-repository'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

describe('Mongo user repository testing', () => {
  before(async () => {
    await connectDatabase()
  })
  afterEach(async () => {
    await clearCollection('users')
  })
  describe('Create method testing', () => {
    it('should create user', async () => {
      const repositoryInstance = new MongoUserRepository()
      const result = await repositoryInstance.create({
        email: 'email@email.com',
        name: 'John Doe',
        password: '123456'
      })
      expect(result).to.be.a('string')
    })
  })
  describe('find by email method testing', () => {
    it('should find one user by email', async () => {
      const repositoryInstance = new MongoUserRepository()
      const user: IUser = {
        email: 'email@email.com',
        name: 'John Doe',
        password: '123456'
      }
      const expectedUser = Object.assign({}, user)
      await repositoryInstance.create(user)
      const result = await repositoryInstance.findByEmail(user.email)
      expect(result).to.deep.include(expectedUser)
      expect(result).to.have.property('id')
      expect(result?.id).to.be.a('string')
    })
    it('should not find one user by email', async () => {
      const repositoryInstance = new MongoUserRepository()
      const result = await repositoryInstance.findByEmail('')
      expect(result).to.equal(null)
    })
  })
})
