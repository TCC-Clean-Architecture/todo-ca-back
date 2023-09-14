import request from 'supertest'
import crypto from 'crypto'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { todoRepository } from '../../../repositories'
import { type ITodoCreated, type ITodoInserted } from '../../../interfaces'

describe('POST /todo testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  it('should return 200 with value', async () => {
    const uuid = crypto.randomUUID()
    const todoToInsert = {
      name: 'todo1',
      description: 'todo description',
      status: 'todo'
    }
    sandbox.stub(todoRepository, 'create').callsFake(async (todoToInsert: ITodoCreated): Promise<ITodoInserted> => {
      return { ...todoToInsert, createdAt: new Date(), _id: uuid }
    })

    const response = await request(server)
      .post('/todo')
      .send(todoToInsert)

    assert.strictEqual(response.statusCode, 200)
    assert.deepEqual(response.body, { ...todoToInsert, createdAt: new Date().toISOString(), _id: uuid })
  })

  it('should return 400 status when incorrect information is sent', async () => {
    const uuid = crypto.randomUUID()
    const todoToInsert = {
      name: 'todo1'
    }
    sandbox.stub(todoRepository, 'create').callsFake(async (todoToInsert: ITodoCreated): Promise<ITodoInserted> => {
      return { ...todoToInsert, createdAt: new Date(), _id: uuid }
    })
    const response = await request(server)
      .post('/todo')
      .send(todoToInsert)

    const expectedErrorMessage = {
      statusCode: 400,
      message: 'Bad Request',
      description: 'The sent contract is not correct.',
      content: {
        errors: 'status is a required field'
      }
    }

    assert.strictEqual(response.statusCode, 400)
    assert.deepEqual(response.body, expectedErrorMessage)
  })
})
