import { expect } from 'chai'

import { InvalidNameError } from '@/entities/user/errors/InvalidNameError'
import { type Email } from '@/entities/user/user-email'
import { UserName } from '@/entities/user/user-name'
import { type Either } from '@/shared/either'

describe('Entity user name testing', () => {
  describe('User name entity create method testing', () => {
    it('should create new user name', () => {
      const userName = 'Gustavo Hiroaki'
      const todoInstance = UserName.create(userName) as Either<null, Email>
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(UserName)
      expect(todoInstance.value?.value).to.equal(userName)
    })
    it('should return an error when user email validation is false', () => {
      const userEmail = 'ab'
      const todoInstance = UserName.create(userEmail)
      expect(todoInstance.isLeft()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(InvalidNameError)
    })
  })

  describe('User name entity validate method testing', () => {
    it('should validate user name and return true', () => {
      const userName = 'Gustavo Hiroaki'
      expect(UserName.validate(userName)).to.equal(true)
    })
    it('should validate user name and return false by length less than 3', () => {
      const userName = 'A'
      expect(UserName.validate(userName)).to.equal(false)
    })
    it('should validate user name and return false by length more than 100', () => {
      const userName = 'A'.repeat(101)
      expect(UserName.validate(userName)).to.equal(false)
    })
  })
})
