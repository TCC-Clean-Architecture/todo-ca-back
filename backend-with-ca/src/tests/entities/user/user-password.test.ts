import { expect } from 'chai'

import { InvalidPasswordError } from '@/entities/user/errors/InvalidPasswordError'
import { Password } from '@/entities/user/user-password'
import { type Either } from '@/shared/either'

describe('Entity user password testing', () => {
  describe('User password entity create method testing', () => {
    it('should create new user password', () => {
      const password = 'Password100'
      const todoInstance = Password.create(password) as Either<null, Password>
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(Password)
      expect(todoInstance.value?.value).to.equal(password)
    })
    it('should return an error when user email validation is false', () => {
      const password = 'ab'
      const todoInstance = Password.create(password)
      expect(todoInstance.isLeft()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(InvalidPasswordError)
    })
  })

  describe('User password entity validate method testing', () => {
    it('should validate user password and return true', () => {
      const password = 'Password100'
      expect(Password.validate(password)).to.equal(true)
    })
    it('should validate user password and return false', () => {
      const password = 'asd'
      expect(Password.validate(password)).to.equal(false)
      const passwordWithNumber = 'asdfg123'
      expect(Password.validate(passwordWithNumber)).to.equal(false)
      const withoutNumber = 'Passwordaa'
      expect(Password.validate(withoutNumber)).to.equal(false)
    })
  })
})
