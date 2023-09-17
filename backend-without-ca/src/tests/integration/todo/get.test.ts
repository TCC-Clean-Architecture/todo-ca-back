import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { todoFixture } from '../../fixtures/todo.fixture'
import { type ITodoInserted } from '../../../interfaces'

describe('GET /todos testing', () => {
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
    await todoRepository.create(todoToInsert)
    await todoRepository.create(todoToInsert2)

    const response = await request(server)
      .get('/todos')

    assert.strictEqual(response.statusCode, 200)

    assert.deepEqual(response.body.content.map((bodyItem: ITodoInserted) => ({
      _id: bodyItem._id,
      name: bodyItem.name,
      description: bodyItem.description,
      status: bodyItem.status,
      createdAt: new Date(bodyItem.createdAt)
    })), [todoToInsert, todoToInsert2])
  })

  it('should return 200 with empty array', async () => {
    const response = await request(server)
      .get('/todos')

    assert.strictEqual(response.statusCode, 200)

    assert.deepEqual(response.body.content, [])
  })

  it('should return specific item on todo list', async () => {
    const todoToInsert = todoFixture()
    const todoToInsert2 = todoFixture()
    await todoRepository.create(todoToInsert)
    await todoRepository.create(todoToInsert2)

    const response = await request(server)
      .get(`/todos/${todoToInsert._id.toString()}`)

    assert.strictEqual(response.statusCode, 200)

    assert.deepEqual(response.body.content, JSON.parse(JSON.stringify(todoToInsert)))
  })

  it('should not found specific id and get 404', async () => {
    const todoToInsert = todoFixture()
    await todoRepository.create(todoToInsert)

    const response = await request(server)
      .get('/todos/abcde')

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
    sandbox.stub(todoRepository, 'getById').throws('Explosion')
    const response = await request(server)
      .get('/todos/abcde')

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
  it('should return 500 status when something went wrong on service', async () => {
    sandbox.stub(todoRepository, 'listAll').throws('Explosion')
    const response = await request(server)
      .get('/todos')

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
