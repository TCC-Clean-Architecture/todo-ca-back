import { expect } from 'chai'
import sinon from 'sinon'
import crypto from 'crypto'
import { initializeRepository, usersRepository } from '../../../repositories'
import { userFactory } from '../../../factories'
import { type IUser } from '../../../interfaces'

describe('Todo repository testing', () => {
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
  describe('create user testing', () => {
    it('should create an user', async () => {
      const expectedId = 'acf3cd0a-8817-455c-8eaa-3caba8d54481'
      sandbox.stub(crypto, 'randomUUID').callsFake(() => expectedId)
      const user = userFactory({
        name: 'Gustavo',
        email: 'gustavo@email.com',
        password: '123456'
      }) as IUser
      const result = await usersRepository.create(user)
      const expectedResult = {
        _id: expectedId,
        name: user.name,
        email: user.email
      }
      expect(result).to.be.deep.equal(expectedResult)
    })
  })
})
