import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import { assert } from 'chai'
import { initializeRepository, usersRepository } from '../../../repositories'
import { userFixture } from '../../fixtures/user.fixture'
import { authenticateService } from '../../../services/authenticationService'
import { userFactory } from '../../../factories'

describe('Users service testing', () => {
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
  it('should authenticate user correctly', async () => {
    const user = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com',
      password: '123456'
    }
    const userToValidate = userFactory(user)
    const userInserted = userFixture(userToValidate)
    sandbox.stub(usersRepository, 'getByEmail').callsFake(async () => {
      return userInserted
    })
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    sandbox.stub(jwt, 'sign').callsFake(() => fakeJwt)
    const result = await authenticateService.authenticate(user.email, user.password)
    const expectedResult = {
      statusCode: 200,
      type: 'success',
      message: 'OK',
      description: 'User authenticated',
      content: {
        _id: userInserted._id,
        name: userInserted.name,
        email: 'gustavo@email.com',
        token: fakeJwt
      }
    }
    assert.deepEqual(result, expectedResult)
  })
  it('should fail authentication when cannot find user', async () => {
    const user = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com',
      password: '123456'
    }
    sandbox.stub(usersRepository, 'getByEmail').callsFake(async () => {
      return null
    })
    const result = await authenticateService.authenticate(user.email, user.password)
    const expectedResult = {
      type: 'error',
      message: 'Bad Request',
      statusCode: 400,
      content: {
      },
      description: 'Authentication failed'
    }
    assert.deepEqual(result, expectedResult)
  })
  it('should authenticate user correctly', async () => {
    const user = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com',
      password: '123456'
    }
    const userToValidate = userFactory(user)
    const userInserted = userFixture(userToValidate)
    sandbox.stub(usersRepository, 'getByEmail').callsFake(async () => {
      return userInserted
    })
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    sandbox.stub(jwt, 'sign').callsFake(() => fakeJwt)
    const result = await authenticateService.authenticate(user.email, user.password)
    const expectedResult = {
      statusCode: 200,
      type: 'success',
      message: 'OK',
      description: 'User authenticated',
      content: {
        _id: userInserted._id,
        name: userInserted.name,
        email: 'gustavo@email.com',
        token: fakeJwt
      }
    }
    assert.deepEqual(result, expectedResult)
  })
})
