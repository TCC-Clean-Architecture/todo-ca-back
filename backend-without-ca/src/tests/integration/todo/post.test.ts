import request from 'supertest'
import crypto from 'crypto'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, todoRepository } from '../../../repositories'
import { type ITodoBeforeInsert, type ITodoInserted } from '../../../interfaces'

describe('POST /todos testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  before(async () => {
    await initializeRepository()
  })
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
    sandbox.stub(todoRepository, 'create').callsFake(async (todoToInsert: ITodoBeforeInsert): Promise<ITodoInserted> => {
      return { ...todoToInsert, createdAt: new Date(), _id: uuid }
    })

    const response = await request(server)
      .post('/todos')
      .send(todoToInsert)

    assert.strictEqual(response.statusCode, 200)
    assert.deepEqual(response.body.content, { ...todoToInsert, createdAt: new Date().toISOString(), _id: uuid })
  })

  it('should return 400 status when incorrect information is sent', async () => {
    const uuid = crypto.randomUUID()
    const todoToInsert = {
      name: 'todo1'
    }
    sandbox.stub(todoRepository, 'create').callsFake(async (todoToInsert: ITodoBeforeInsert): Promise<ITodoInserted> => {
      return { ...todoToInsert, createdAt: new Date(), _id: uuid }
    })
    const response = await request(server)
      .post('/todos')
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

  it('should return 500 status when something went wrong on service', async () => {
    const todoToInsert = {
      name: 'todo1',
      description: 'todo description',
      status: 'todo'
    }
    sandbox.stub(todoRepository, 'create').throws('Explosion')
    const response = await request(server)
      .post('/todos')
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
