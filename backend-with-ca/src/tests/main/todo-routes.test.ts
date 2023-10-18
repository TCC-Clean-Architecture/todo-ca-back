import { expect } from 'chai'
import request from 'supertest'

import { type ITodoList } from '@/entities/interfaces/todo-list'
import app from '@/main/configs/express'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'

interface ITodoListWith_id extends ITodoList {
  _id: string
}

describe('Todo routes testing', () => {
  let list: ITodoListWith_id
  before(async () => {
    await connectDatabase()
  })
  beforeEach(async () => {
    const todoList = {
      name: 'teste'
    }
    list = (await request(app).post('/todos/list').send(todoList)).body.content
  })
  afterEach(async () => {
    await clearCollection('todos')
    await clearCollection('todoLists')
  })
  it('should create a new todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const response = await request(app).post(`/todos/list/${list._id}`).send(todo)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todo)
  })
  it('should find all todos', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    await request(app).post(`/todos/list/${list._id}`).send(todo)
    const response = await request(app).get(`/todos/list/${list._id}`)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content[0]).to.deep.include(todo)
  })
  it('should find one todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const insertedTodoResponse = await request(app).post(`/todos/list/${list._id}`).send(todo)
    const response = await request(app).get(`/todos/${insertedTodoResponse.body.content._id}/list/${list._id}`)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content).to.deep.include(todo)
  })
  it('should delete one todo', async () => {
    const todo = {
      name: 'teste',
      description: 'this is description',
      status: 'done'
    }
    const insertedTodoResponse = await request(app).post(`/todos/list/${list._id}`).send(todo)
    const insertedId = insertedTodoResponse.body.content._id
    const response = await request(app).delete(`/todos/${insertedId}/list/${list._id}`)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content._id).to.equal(insertedId)
    const exists = await request(app).get(`/todos/${insertedTodoResponse.body.content._id}/list/${list._id}`)
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
    const insertedTodoResponse = await request(app).post(`/todos/list/${list._id}`).send(todo)
    const insertedId = insertedTodoResponse.body.content._id
    const response = await request(app).put(`/todos/${insertedId}/list/${list._id}`).send(todoUpdatePayload)
    expect(response.statusCode).to.equal(200)
    expect(response.body.content._id).to.equal(insertedId)
    const verifyUpdate = await request(app).get(`/todos/${insertedTodoResponse.body.content._id}/list/${list._id}`)
    expect(verifyUpdate.statusCode).to.equal(200)
    expect(verifyUpdate.body.content).to.deep.include(todoUpdatePayload)
  })
})
