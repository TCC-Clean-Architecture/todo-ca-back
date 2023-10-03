import request from 'supertest'
import crypto from 'crypto'
import { server } from '../../../server'
import { assert, expect } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { type ITodoListBeforeInsert, type ITodoListInserted } from '../../../interfaces'
import { authenticateService } from '../../../services/authenticationService'

describe('POST /todos testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  before(async () => {
    await initializeRepository()
  })
  beforeEach(async () => {
    await todoRepository.removeAllTodoLists()
    sandbox = sinon.createSandbox()
    sandbox.stub(authenticateService, 'validate').callsFake(() => {
      return {
        iat: 9999999,
        userId: 'abcde'
      }
    })
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  describe('Todo routes testing', () => {
    it('should create todo succesfuly', async () => {
      const TodoListPayload = {
        name: 'todo1'
      }
      const todoListResponse = await request(server)
        .post('/todos/list')
        .set('x-access-token', 'thisistoken')
        .send(TodoListPayload)
      const listId = todoListResponse.body.content._id
      assert.isOk(listId)

      const todoToInsert = {
        name: 'todo1',
        description: 'todo description',
        status: 'todo'
      }

      const response = await request(server)
        .post(`/todos/list/${listId}`)
        .set('x-access-token', 'thisistoken')
        .send(todoToInsert)

      assert.strictEqual(response.statusCode, 200)
      expect(response.body.content).to.deep.contain({ ...todoToInsert, createdAt: new Date().toISOString() })
      assert.strictEqual(response.body.description, `Inserted on list ${listId}`)
    })
    it('should return 400 status when incorrect information is sent', async () => {
      const todoToInsert = {
        name: 'todo1'
      }
      const response = await request(server)
        .post('/todos/list/abcde')
        .set('x-access-token', 'thisistoken')
        .send(todoToInsert)

      const expectedErrorMessage = {
        statusCode: 400,
        message: 'Bad Request',
        description: 'The sent contract is not correct.',
        type: 'error',
        content: {
          error: 'Error on create todo instance: status is a required field'
        }
      }

      assert.strictEqual(response.statusCode, 400)
      assert.deepEqual(response.body, expectedErrorMessage)
    })
    it('should return 400 status when not found list id', async () => {
      const listId = 'abcde'
      const todoToInsert = {
        name: 'todo1',
        description: 'todo description',
        status: 'todo'
      }
      sandbox.stub(todoRepository, 'updateTodoList').throws('Explosion')
      const response = await request(server)
        .post(`/todos/list/${listId}`)
        .set('x-access-token', 'thisistoken')
        .send(todoToInsert)

      const expectedErrorMessage = {
        statusCode: 400,
        message: 'Bad Request',
        description: `Id ${listId} of list not found`,
        type: 'error',
        content: {
        }
      }

      assert.strictEqual(response.statusCode, 400)
      assert.deepEqual(response.body, expectedErrorMessage)
    })
    it('should return 500 status when something went wrong on service', async () => {
      const todoListToInsert = {
        name: 'todo1'
      }
      const todoListResponse = await request(server)
        .post('/todos/list')
        .set('x-access-token', 'thisistoken')
        .send(todoListToInsert)
      const listId = todoListResponse.body.content._id
      assert.isOk(listId)

      const todoToInsert = {
        name: 'todo1',
        description: 'todo description',
        status: 'todo'
      }

      sandbox.stub(todoRepository, 'updateTodoList').throws('Explosion')
      const response = await request(server)
        .post(`/todos/list/${listId}`)
        .set('x-access-token', 'thisistoken')
        .send(todoToInsert)

      const expectedErrorMessage = {
        statusCode: 500,
        message: 'Internal Server Error',
        description: 'Something went wrong',
        type: 'error',
        content: {
          error: {
            name: 'Explosion'
          }
        }
      }

      assert.strictEqual(response.statusCode, 500)
      assert.deepEqual(response.body, expectedErrorMessage)
    })
  })

  describe('Todo list routes testing', () => {
    it('should create a list of todos without todo', async () => {
      const uuid = crypto.randomUUID()
      const todoListToInsert = {
        name: 'todo1'
      }

      sandbox.stub(todoRepository, 'createTodoList').callsFake(async (todoList: ITodoListBeforeInsert): Promise<ITodoListInserted> => {
        return { ...todoList, todos: [], createdAt: new Date(), _id: uuid }
      })

      const response = await request(server)
        .post('/todos/list')
        .set('x-access-token', 'thisistoken')
        .send(todoListToInsert)

      assert.strictEqual(response.statusCode, 200)
      assert.deepEqual(response.body.content, { ...todoListToInsert, todos: [], createdAt: new Date().toISOString(), _id: uuid })
    })
    it('should return 400 status when incorrect information is sent', async () => {
      const todoListToInsert = {
      }
      const response = await request(server)
        .post('/todos/list')
        .set('x-access-token', 'thisistoken')
        .send(todoListToInsert)

      const expectedErrorMessage = {
        statusCode: 400,
        message: 'Bad Request',
        description: 'The sent contract is not correct.',
        type: 'error',
        content: {
          error: 'Error on create todo list instance: name is a required field'
        }
      }

      assert.strictEqual(response.statusCode, 400)
      assert.deepEqual(response.body, expectedErrorMessage)
    })
    it('should return 500 status when something went wrong on service', async () => {
      const todoListToInsert = {
        name: 'todo1'
      }
      sandbox.stub(todoRepository, 'createTodoList').throws('Explosion')
      const response = await request(server)
        .post('/todos/list')
        .set('x-access-token', 'thisistoken')
        .send(todoListToInsert)

      const expectedErrorMessage = {
        statusCode: 500,
        message: 'Internal Server Error',
        description: 'Something went wrong',
        type: 'error',
        content: {
          error: {
            name: 'Explosion'
          }
        }
      }

      assert.strictEqual(response.statusCode, 500)
      assert.deepEqual(response.body, expectedErrorMessage)
    })
  })
})
