import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { todoFixture } from '../../fixtures/todo.fixture'
import { type ITodoListBeforeInsert } from '../../../interfaces'
import { todoService } from '../../../services/todoService'
import { authenticateService } from '../../../services/authenticationService'

describe('DELETE /todos testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  before(async () => {
    await initializeRepository()
  })
  beforeEach(async () => {
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
  describe('Todo testing', () => {
    it('should delete todo and return 200', async () => {
      const todoToInsert = todoFixture()
      const todoToInsert2 = todoFixture()
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: [todoToInsert, todoToInsert2]
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)

      const response = await request(server)
        .delete(`/todos/${todoToInsert2._id.toString()}/list/${todoListCreated._id.toString()}`)
        .set('x-access-token', 'thisistoken')

      assert.strictEqual(response.statusCode, 200)
      assert.strictEqual(response.body.content._id, todoToInsert2._id.toString())

      const allTodo = await todoRepository.listAll(todoListCreated._id)
      assert.deepEqual(allTodo, [todoToInsert])
    })
    it('should return 404 when not todo not found', async () => {
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: []
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)

      const response = await request(server)
        .delete(`/todos/abcde/list/${todoListCreated._id.toString()}`)
        .set('x-access-token', 'thisistoken')

      assert.strictEqual(response.statusCode, 404)

      assert.deepEqual(response.body, {
        statusCode: 404,
        message: 'Not Found',
        type: 'error',
        description: `Todo id abcde not found in list ${todoListCreated._id.toString()}`,
        content: {
        }
      })
    })
    it('should return 404 when not list not found', async () => {
      const listId = 'fghij'
      const response = await request(server)
        .delete(`/todos/abcde/list/${listId}`)
        .set('x-access-token', 'thisistoken')

      assert.strictEqual(response.statusCode, 404)

      assert.deepEqual(response.body, {
        statusCode: 404,
        message: 'Not Found',
        type: 'error',
        description: `Id ${listId} of list not found`,
        content: {
        }
      })
    })
    it('should return 500 status when something went wrong on service', async () => {
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: []
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)
      sandbox.stub(todoRepository, 'getTodoListById').throws('Explosion')
      const response = await request(server)
        .delete(`/todos/abcde/list/${todoListCreated._id.toString()}`)
        .set('x-access-token', 'thisistoken')

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
  describe('List testing', () => {
    it('should remove list', async () => {
      const todoList: ITodoListBeforeInsert = {
        name: 'list',
        createdAt: new Date(),
        todos: []
      }
      const todoListCreated = await todoRepository.createTodoList(todoList)
      const response = await request(server)
        .delete(`/todos/list/${todoListCreated._id.toString()}`)
        .set('x-access-token', 'thisistoken')
      assert.strictEqual(response.body.content._id, todoListCreated._id)
    })
    it('should return an error on attempt to remove list', async () => {
      sandbox.stub(todoService, 'deleteTodoList').throws('Explosion')
      const response = await request(server)
        .delete('/todos/list/abcde')
        .set('x-access-token', 'thisistoken')
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
