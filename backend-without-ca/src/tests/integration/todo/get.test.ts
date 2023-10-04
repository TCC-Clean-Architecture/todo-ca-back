import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { todoFixture } from '../../fixtures/todo.fixture'
import { type ITodoListBeforeInsert, type ITodoInserted } from '../../../interfaces'
import { todoService } from '../../../services/todoService'

describe('GET /todos testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  before(async () => {
    await initializeRepository()
  })
  beforeEach(async () => {
    await todoRepository.removeAllTodoLists()
    sandbox = sinon.createSandbox()
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  describe('Todo testing', () => {
    it('should get todo and return 200', async () => {
      const todoToInsert = todoFixture()
      const todoToInsert2 = todoFixture()
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: [todoToInsert, todoToInsert2]
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)

      const response = await request(server)
        .get(`/todos/list/${todoListCreated._id.toString()}`)

      assert.strictEqual(response.statusCode, 200)

      assert.deepEqual(response.body.content.todos.map((bodyItem: ITodoInserted) => ({
        _id: bodyItem._id,
        name: bodyItem.name,
        description: bodyItem.description,
        status: bodyItem.status,
        createdAt: new Date(bodyItem.createdAt)
      })), [todoToInsert, todoToInsert2])
    })

    it('should return 200 with empty array', async () => {
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: []
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)

      const response = await request(server)
        .get(`/todos/list/${todoListCreated._id.toString()}`)

      assert.strictEqual(response.statusCode, 200)

      assert.deepEqual(response.body.content.todos, [])
    })

    it('should return specific item on todo list', async () => {
      const todoToInsert = todoFixture()
      const todoToInsert2 = todoFixture()
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: [todoToInsert, todoToInsert2]
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)
      const response = await request(server)
        .get(`/todos/${todoToInsert._id.toString()}/list/${todoListCreated._id.toString()}`)

      assert.strictEqual(response.statusCode, 200)

      assert.deepEqual(response.body.content, JSON.parse(JSON.stringify(todoToInsert)))
    })

    it('should not found specific id and get 404', async () => {
      const todoToInsert = todoFixture()
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: [todoToInsert]
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)
      const response = await request(server)
        .get(`/todos/abcde/list/${todoListCreated._id.toString()}`)

      assert.strictEqual(response.statusCode, 404)

      assert.deepEqual(response.body, {
        statusCode: 404,
        message: 'Not Found',
        type: 'error',
        description: 'Id not found',
        content: {
        }
      })
    })

    it('should return 500 status when something went wrong on getById service', async () => {
      sandbox.stub(todoRepository, 'getById').throws('Explosion')
      const response = await request(server)
        .get('/todos/abcde/list/abcde')

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

    it('should return 500 status when something went wrong on listAll service', async () => {
      sandbox.stub(todoRepository, 'listAll').throws('Explosion')
      const response = await request(server)
        .get('/todos/list/abcde')

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

  describe('Todo list testing', () => {
    it('should return one list', async () => {
      const todoToInsert = todoFixture()
      const todoToInsert2 = todoFixture()
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: [todoToInsert, todoToInsert2]
      }
      await todoRepository.createTodoList(todoList)
      const response = await request(server)
        .get('/todos/lists')

      assert.strictEqual(response.statusCode, 200)
      assert.deepEqual(response.body.content.map(({ _id, ...rest }: any) => ({
        ...rest
      })), JSON.parse(JSON.stringify([todoList])))
    })
    it('should return an error on attempt to get lists', async () => {
      sandbox.stub(todoService, 'getTodoLists').throws('Explosion')
      const response = await request(server)
        .get('/todos/lists')
      assert.deepEqual(response.body, {
        statusCode: 500,
        type: 'error',
        message: 'Internal Server Error',
        description: 'Something went wrong',
        content: {
          error: {
            name: 'Explosion'
          }
        }
      })
    })
  })
})
