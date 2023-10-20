import { expect } from 'chai'
import request from 'supertest'

import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

import { loginTestHelper } from '../helper/before-test-helper'

interface IHelperParams {
  token: string
}

describe('Todo list routes testing', () => {
  let testHelpers: IHelperParams
  before(async () => {
    await connectDatabase()
  })
  beforeEach(async () => {
    const userAllParams = await loginTestHelper()
    testHelpers = {
      token: userAllParams.token
    }
  })
  afterEach(async () => {
    await clearCollection('todoLists')
    await clearCollection('users')
  })
  it('should create a new todo list', async () => {
    const todoList = {
      name: 'teste'
    }
    const response = await request(app).post('/todos/list')
      .set('x-access-token', testHelpers.token)
      .send(todoList)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todoList)
  })
  it('should delete a todo list', async () => {
    const todoList = {
      name: 'teste'
    }
    const postResponse = await request(app)
      .post('/todos/list')
      .set('x-access-token', testHelpers.token)
      .send(todoList)
    const id = postResponse.body.content._id
    const response = await request(app)
      .delete(`/todos/list/${id}`)
      .set('x-access-token', testHelpers.token)
      .send(todoList)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.equal({
      _id: id
    })
  })
  it('should get all lists', async () => {
    const todoList = {
      name: 'teste'
    }
    const postResponse1 = await request(app)
      .post('/todos/list')
      .set('x-access-token', testHelpers.token)
      .send(todoList)
    const postResponse2 = await request(app)
      .post('/todos/list')
      .set('x-access-token', testHelpers.token)
      .send(todoList)
    const response = await request(app)
      .get('/todos/lists')
      .set('x-access-token', testHelpers.token)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.equal([postResponse1.body.content, postResponse2.body.content])
  })
})
