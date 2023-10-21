import { expect } from 'chai'
import request from 'supertest'

import { type IUser } from '@/entities/interfaces/user'
import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

describe('Authentication routes testing', () => {
  before(async () => {
    await connectDatabase()
  })
  afterEach(async () => {
    await clearCollection('users')
  })
  it('should authenticate user', async () => {
    const user: IUser = {
      name: 'teste',
      email: 'user@email.com',
      password: 'Password100'
    }
    await request(app).post('/users/register').send(user)
    const response = await request(app).post('/authenticate').send({
      email: user.email,
      password: user.password
    })
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include({
      name: user.name,
      email: user.email
    })
    expect(response.body.content).to.not.have.property('password')
    expect(response.body.content).to.have.property('token')
  })
  it('should not authenticate user', async () => {
    const user: IUser = {
      name: 'teste',
      email: 'user@email.com',
      password: 'Password100'
    }
    await request(app).post('/users/register').send(user)
    const response = await request(app).post('/authenticate').send({
      email: user.email,
      password: 'wrongpassword'
    })
    expect(response.statusCode).to.equal(400)
  })
})
