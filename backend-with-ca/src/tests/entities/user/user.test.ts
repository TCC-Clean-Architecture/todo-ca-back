import { expect } from 'chai'

import { type IUser } from '@/entities/interfaces/user'
import { InvalidEmailError } from '@/entities/user/errors/InvalidEmailError'
import { InvalidPasswordError } from '@/entities/user/errors/InvalidPasswordError'
import { type IStaticValidationSuccessReturn, User } from '@/entities/user/user'
import { Email } from '@/entities/user/user-email'
import { Password } from '@/entities/user/user-password'

describe('Entity user testing', () => {
  describe('create method testing', () => {
    it('should create user instance correctly', () => {
      const user: IUser = {
        email: 'email@email.com',
        password: 'Password100'
      }
      const userInstance = User.create(user)
      const userValue = userInstance.value as User
      expect(userInstance.isRight()).to.equal(true)
      expect(userValue).to.be.instanceOf(User)
    })
    it('should not create user instance correctly', () => {
      const user: IUser = {
        email: 'email@email.com',
        password: 'a'
      }
      const userInstance = User.create(user)
      const userValue = userInstance.value as InvalidPasswordError
      expect(userInstance.isLeft()).to.equal(true)
      expect(userValue).to.be.instanceOf(InvalidPasswordError)
    })
  })
  describe('validate method testing', () => {
    it('should validate all parameters and return the user data', () => {
      const user: IUser = {
        email: 'email@email.com',
        password: 'Password100'
      }
      const userInstance = User.validate(user)
      const instanceValue = userInstance.value as IStaticValidationSuccessReturn
      expect(userInstance.isRight()).to.equal(true)
      expect(instanceValue.userEmail).to.be.instanceOf(Email)
      expect(instanceValue.userPassword).to.be.instanceOf(Password)
    })
    it('should validate email and return email error', () => {
      const user: IUser = {
        email: 'a',
        password: 'Password100'
      }
      const userInstance = User.validate(user)
      expect(userInstance.isLeft()).to.equal(true)
      expect(userInstance.value).to.be.instanceOf(InvalidEmailError)
    })
    it('should validate password and return password error', () => {
      const user: IUser = {
        email: 'email@email.com',
        password: 'a'
      }
      const userInstance = User.validate(user)
      expect(userInstance.isLeft()).to.equal(true)
      expect(userInstance.value).to.be.instanceOf(InvalidPasswordError)
    })
  })
})
