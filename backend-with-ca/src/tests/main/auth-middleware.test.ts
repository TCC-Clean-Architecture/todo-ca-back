import { expect } from 'chai'
import request from 'supertest'

import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

import { insertList, loginTestHelper } from '../helper/before-test-helper'

interface IHelperParams {
  listId: string
  token: string
}

describe('Auth middleware testing', () => {
  let testHelpers: IHelperParams
  before(async () => {
    await connectDatabase()
  })
  beforeEach(async () => {
    const userAllParams = await loginTestHelper()
    const list = await insertList()
    testHelpers = {
      token: userAllParams.token,
      listId: list.id
    }
  })
  afterEach(async () => {
    await clearCollection('todoLists')
    await clearCollection('users')
  })
  it('should authenticate', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const response = await request(app)
      .post(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
      .send(todo)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todo)
  })
  it('should not authenticate not sending token', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const response = await request(app)
      .post(`/todos/list/${testHelpers.listId}`)
      .send(todo)
    expect(response.statusCode).to.equal(403)
    expect(response.body).deep.include({ description: 'A token is required for authentication' })
  })

  it('should not authenticate sending wrong token', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const response = await request(app)
      .post(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', 'Invalid Token')
      .send(todo)
    expect(response.statusCode).to.equal(401)
    expect(response.body).deep.include({ description: 'Invalid Token' })
  })
})
