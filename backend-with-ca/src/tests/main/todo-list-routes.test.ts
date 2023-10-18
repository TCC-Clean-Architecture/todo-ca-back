import { expect } from 'chai'
import request from 'supertest'

import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

describe('Todo list routes testing', () => {
  before(async () => {
    await connectDatabase()
  })
  afterEach(async () => {
    await clearCollection('todoLists')
  })
  it('should create a new todo list', async () => {
    const todoList = {
      name: 'teste'
    }
    const response = await request(app).post('/todos/list').send(todoList)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todoList)
  })
  it('should delete a todo list', async () => {
    const todoList = {
      name: 'teste'
    }
    const postResponse = await request(app).post('/todos/list').send(todoList)
    const id = postResponse.body.content._id
    const response = await request(app).delete(`/todos/list/${id}`).send(todoList)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.equal({
      _id: id
    })
  })
  it('should get all lists', async () => {
    const todoList = {
      name: 'teste'
    }
    const postResponse1 = await request(app).post('/todos/list').send(todoList)
    const postResponse2 = await request(app).post('/todos/list').send(todoList)
    const response = await request(app).get('/todos/lists')
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.equal([postResponse1.body.content, postResponse2.body.content])
  })
})
