import { expect } from 'chai'
import request from 'supertest'

import { type IUser } from '@/entities/interfaces/user'
import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

describe('User routes testing', () => {
  before(async () => {
    await connectDatabase()
  })
  afterEach(async () => {
    await clearCollection('users')
  })
  it('should create a new user', async () => {
    const user: IUser = {
      name: 'teste',
      email: 'user@email.com',
      password: 'Password100'
    }
    const response = await request(app).post('/users/register').send(user)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include({
      name: user.name,
      email: user.email
    })
    expect(response.body.content).to.have.property('_id')
  })
})
