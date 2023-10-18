import { expect } from 'chai'

import { InvalidEmailError } from '@/entities/user/errors/InvalidEmailError'
import { Email } from '@/entities/user/user-email'
import { type Either } from '@/shared/either'

describe('Entity user email testing', () => {
  describe('User email entity create method testing', () => {
    it('should create new user email', () => {
      const userEmail = 'user@email.com'
      const todoInstance = Email.create(userEmail) as Either<null, Email>
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(Email)
      expect(todoInstance.value?.value).to.equal(userEmail)
    })
    it('should return an error when user email validation is false', () => {
      const userEmail = 'ab'
      const todoInstance = Email.create(userEmail)
      expect(todoInstance.isLeft()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(InvalidEmailError)
    })
  })

  describe('User email entity validate method testing', () => {
    it('should validate user email and return true', () => {
      const userEmail = 'user@email.com'
      expect(Email.validate(userEmail)).to.equal(true)
    })
    it('should validate user email and return false', () => {
      const userEmail = 'useremail.com'
      expect(Email.validate(userEmail)).to.equal(false)
    })
  })
})
