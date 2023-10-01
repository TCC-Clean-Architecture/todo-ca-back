import request from 'supertest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { assert } from 'chai'
import sinon from 'sinon'
import { server } from '../../../server'
import { initializeRepository, usersRepository } from '../../../repositories'
import { userFixture } from '../../fixtures/user.fixture'

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
  it('should authenticate user', async () => {
    const userToAuthenticate = {
      email: 'gustavo@email.com',
      password: '123456'
    }
    const expectedId = 'b543fc52-922a-4636-97dc-dcf9b27614aa'
    const expectedPassword = bcrypt.hashSync('123456', 10)
    const userToReturn = userFixture({ _id: expectedId, ...userToAuthenticate, password: expectedPassword })
    sandbox.stub(usersRepository, 'getByEmail').callsFake(async () => {
      return userToReturn
    })
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    sandbox.stub(jwt, 'sign').callsFake(() => fakeJwt)
    const response = await request(server)
      .post('/authenticate')
      .send(userToAuthenticate)

    assert.deepEqual(response.body, {
      statusCode: 200,
      type: 'success',
      message: 'OK',
      description: 'User authenticated',
      content: {
        _id: userToReturn._id,
        name: userToReturn.name,
        email: 'gustavo@email.com',
        token: fakeJwt
      }
    })
  })
  it('should return an error when missing required params (password)', async () => {
    const userToAuthenticate = {
      email: 'gustavo@email.com'
    }
    const response = await request(server)
      .post('/authenticate')
      .send(userToAuthenticate)

    const expectedResult = {
      statusCode: 400,
      type: 'error',
      message: 'Bad Request',
      description: 'Could not authenticate, missing params.',
      content: {
      }
    }
    assert.strictEqual(response.statusCode, 400)
    assert.deepEqual(response.body, expectedResult)
  })
  it('should return an error when missing required params (email)', async () => {
    const userToAuthenticate = {
      password: '123456'
    }
    const response = await request(server)
      .post('/authenticate')
      .send(userToAuthenticate)

    const expectedResult = {
      statusCode: 400,
      type: 'error',
      message: 'Bad Request',
      description: 'Could not authenticate, missing params.',
      content: {
      }
    }
    assert.strictEqual(response.statusCode, 400)
    assert.deepEqual(response.body, expectedResult)
  })
  it('should crash application and return 500', async () => {
    const authenticationPayload = {
      email: 'gustavo@email.com',
      password: '123456'
    }
    sandbox.stub(usersRepository, 'getByEmail').throws('Explosion')
    const response = await request(server)
      .post('/authenticate')
      .send(authenticationPayload)

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
