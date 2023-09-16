import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { todoFixture } from '../../fixtures/todo.fixture'

describe('PUT /todos testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  before(async () => {
    await initializeRepository()
  })
  beforeEach(async () => {
    await todoRepository.removeAll()
    sandbox = sinon.createSandbox()
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  it('should return 200 with value', async () => {
    const todoToInsert = todoFixture()
    const todoToInsert2 = todoFixture()
    const todoToUpdate = todoFixture()
    await todoRepository.create(todoToInsert)
    await todoRepository.create(todoToInsert2)
    const updateContent = {
      name: todoToUpdate.name,
      description: todoToUpdate.description,
      status: todoToUpdate.status,
      createdAt: todoToUpdate.createdAt
    }
    const response = await request(server)
      .put(`/todos/${todoToInsert._id.toString()}`)
      .send(updateContent)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.body.content.name, updateContent.name)
    assert.strictEqual(response.body.content.description, updateContent.description)
    assert.strictEqual(response.body.content.status, updateContent.status)
    assert.strictEqual(response.body.content.createdAt, updateContent.createdAt.toISOString())
  })
  it('should return 404 when not found', async () => {
    const response = await request(server)
      .put('/todos/abcde')

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
  it('should return 500 status when something went wrong on service', async () => {
    const todoToUpdate = {
      name: 'todo1',
      description: 'todo description',
      status: 'todo'
    }
    sandbox.stub(todoRepository, 'update').throws('Explosion')
    const response = await request(server)
      .put('/todos/abcde')
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
