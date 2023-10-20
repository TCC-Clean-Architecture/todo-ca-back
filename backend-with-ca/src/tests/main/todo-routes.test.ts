import { expect } from 'chai'
import request from 'supertest'

import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

import { insertList, loginTestHelper } from '../helper/before-test-helper'

interface IHelperParams {
  listId: string
  token: string
}

describe('Todo routes testing', () => {
  let testHelpers: IHelperParams
  before(async () => {
    await connectDatabase()
  })
  beforeEach(async () => {
    const userAllParams = await loginTestHelper()
    const list = await insertList(userAllParams.id)
    testHelpers = {
      token: userAllParams.token,
      listId: list.id
    }
  })
  afterEach(async () => {
    await clearCollection('todoLists')
    await clearCollection('users')
  })
  it('should create a new todo', async () => {
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
  it('should find all todos', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    await request(app)
      .post(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
      .send(todo)
    const response = await request(app)
      .get(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content.todos[0]).to.deep.include(todo)
  })
  it('should find one todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const insertedTodoResponse = await request(app).post(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
      .send(todo)
    const response = await request(app)
      .get(`/todos/${insertedTodoResponse.body.content._id}/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todo)
  })
  it('should delete one todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const insertedTodoResponse = await request(app)
      .post(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
      .send(todo)
    const insertedId = insertedTodoResponse.body.content._id
    const response = await request(app)
      .delete(`/todos/${insertedId}/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content._id).to.equal(insertedId)
    const exists = await request(app)
      .get(`/todos/${insertedTodoResponse.body.content._id}/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
    expect(exists.statusCode).to.equal(400)
  })
  it('should update one todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'todo'
    }
    const todoUpdatePayload = {
      name: 'updated',
      description: 'updated',
      status: 'done'
    }
    const insertedTodoResponse = await request(app)
      .post(`/todos/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
      .send(todo)
    const insertedId = insertedTodoResponse.body.content._id
    const response = await request(app)
      .put(`/todos/${insertedId}/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
      .send(todoUpdatePayload)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content._id).to.equal(insertedId)
    const verifyUpdate = await request(app)
      .get(`/todos/${insertedTodoResponse.body.content._id}/list/${testHelpers.listId}`)
      .set('x-access-token', testHelpers.token)
    expect(verifyUpdate.statusCode).to.equal(200)
    expect(verifyUpdate.body.content).to.deep.include(todoUpdatePayload)
  })
})
