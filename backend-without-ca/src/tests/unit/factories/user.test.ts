import { expect } from 'chai'
import bcrypt from 'bcrypt'
import { userFactory } from '../../../factories'
import { type IUser } from '../../../interfaces'

describe('Todo factory testing', () => {
  it('should create user instance with hashed password', () => {
    const user: IUser = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com',
      password: '123456'
    }
    const userInstance = userFactory(user) as IUser
    const expectedUser = {
      name: user.name,
      email: user.email
    }
    expect(userInstance).to.deep.include(expectedUser)
    expect(bcrypt.compareSync('123456', userInstance.password)).to.equal(true)
  })

  it('should validate password and return an error', () => {
    const user: Omit<IUser, 'password'> = {
      name: 'Gustavo Hiroaki',
      email: 'gustavo@email.com'
    }
    const userInstance = userFactory(user as IUser) as Error
    expect(userInstance).to.be.an.instanceof(Error)
    expect(userInstance.message).to.be.equal('Error on create user instance: password is a required field')
  })
})
