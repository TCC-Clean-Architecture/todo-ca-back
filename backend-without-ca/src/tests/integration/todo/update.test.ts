import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { todoFixture } from '../../fixtures/todo.fixture'
import { type ITodoListBeforeInsert } from '../../../interfaces'
import { authenticateService } from '../../../services/authenticationService'

describe('PUT /todos testing', () => {
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
        userId: 'thisisuserid'
      }
    })
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  it('should update todo and return 200', async () => {
    const todoToInsert = todoFixture()
    const todoToInsert2 = todoFixture()
    const todoList: ITodoListBeforeInsert = {
      name: 'list',
      createdAt: new Date(),
      userId: 'thisisuserid',
      todos: [todoToInsert, todoToInsert2]
    }
    const todoListCreated = await todoRepository.createTodoList(todoList)

    const todoToUpdate = todoFixture()
    const updateContent = {
      name: todoToUpdate.name,
      description: todoToUpdate.description,
      status: todoToUpdate.status,
      createdAt: todoToUpdate.createdAt
    }
    const response = await request(server)
      .put(`/todos/${todoToInsert._id.toString()}/list/${todoListCreated._id.toString()}`)
      .set('x-access-token', 'thisistoken')
      .send(updateContent)
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.body.content.name, updateContent.name)
    assert.strictEqual(response.body.content.description, updateContent.description)
    assert.strictEqual(response.body.content.status, updateContent.status)
    assert.strictEqual(response.body.content.createdAt, updateContent.createdAt.toISOString())
  })
  it('should return 404 when not found', async () => {
    const todoList: ITodoListBeforeInsert = {
      name: 'list',
      createdAt: new Date(),
      userId: 'thisisuserid',
      todos: []
    }
    const todoListCreated = await todoRepository.createTodoList(todoList)
    const listId = todoListCreated._id.toString()
    const response = await request(server)
      .put(`/todos/abcde/list/${listId}`)
      .set('x-access-token', 'thisistoken')

    assert.strictEqual(response.statusCode, 404)

    assert.deepEqual(response.body, {
      statusCode: 404,
      message: 'Not Found',
      type: 'error',
      description: `Todo id abcde not found in list ${listId}`,
      content: {
      }
    })
  })
  it('should return 500 status when something went wrong on service', async () => {
    const todoToUpdate = {
      name: 'todo1',
      description: 'todo description',
      status: 'todo'
    }
    sandbox.stub(todoRepository, 'getTodoListById').throws('Explosion')
    const response = await request(server)
      .put('/todos/abcde/list/abcde')
      .set('x-access-token', 'thisistoken')
      .send(todoToUpdate)

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
