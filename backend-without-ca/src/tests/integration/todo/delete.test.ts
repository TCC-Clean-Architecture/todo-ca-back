import request from 'supertest'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { todoFixture } from '../../fixtures/todo.fixture'

describe('DELETE /todo testing', () => {
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
      .delete(`/todo/${todoToInsert2._id.toString()}`)

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.body, todoToInsert2._id.toString())

    const allTodo = await todoRepository.listAll()
    assert.deepEqual(allTodo, [todoToInsert])
  })
  it('should return 404 when not found', async () => {
    const response = await request(server)
      .delete('/todo/abcde')

    assert.strictEqual(response.statusCode, 404)

    assert.deepEqual(response.body, {
      statusCode: 404,
      message: 'Not found',
      description: 'Id not found',
      content: {
      }
    })
  })
})
