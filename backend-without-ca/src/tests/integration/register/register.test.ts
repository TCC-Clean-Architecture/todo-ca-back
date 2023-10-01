import request from 'supertest'
import crypto from 'crypto'
import { server } from '../../../server'
import { assert } from 'chai'
import sinon from 'sinon'
import { initializeRepository, usersRepository } from '../../../repositories'

describe('POST /register testing', () => {
  let sandbox: sinon.SinonSandbox
  before(async () => {
    await initializeRepository()
  })
  beforeEach(async () => {
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })
  it('should register new user', async () => {
    const newUser = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com',
      password: '123456'
    }
    const expectedId = 'b543fc52-922a-4636-97dc-dcf9b27614aa'
    sandbox.stub(crypto, 'randomUUID').callsFake(() => expectedId)
    const response = await request(server)
      .post('/users/register')
      .send(newUser)

    assert.deepEqual(response.body, {
      statusCode: 200,
      type: 'success',
      message: 'OK',
      description: 'User created successfully',
      content: {
        _id: expectedId,
        name: 'Gustavo Hiroaki',
        email: 'gustavo@email.com'
      }
    })
  })
  it('should return an error when missing required params', async () => {
    const newUser = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com'
    }
    const response = await request(server)
      .post('/users/register')
      .send(newUser)

    const expectedResult = {
      statusCode: 400,
      type: 'error',
      message: 'Bad Request',
      description: 'Could not create user, missing params.',
      content: {
        error: 'Error on create user instance: password is a required field'
      }
    }
    assert.strictEqual(response.statusCode, 400)
    assert.deepEqual(response.body, expectedResult)
  })
  it('should crash application and return 500', async () => {
    const newUser = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com',
      password: '123456'
    }
    sandbox.stub(usersRepository, 'create').throws('Explosion')
    const response = await request(server)
      .post('/users/register')
      .send(newUser)

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

    assert.deepEqual(response.body, expectedErrorMessage)
  })
})
