import { expect } from 'chai'

import { type IUserAuth } from '@/entities/interfaces/user'
import { Bcrypt } from '@/external-dependencies/security/bcrypt'
import { Jwt } from '@/external-dependencies/security/jwt'
import { AuthenticationUseCase } from '@/usecases/auth/authentication'
import { InMemoryUserRepository } from '@/usecases/shared/repository/in-memory-user-repository'
import { AuthenticationController } from '@/web-controllers/auth/authentication-controller'

describe('Authentication controller testing', () => {
  it('should authenticate user', async () => {
    const user = {
      name: 'John Doe',
      email: 'email@email.com',
      password: '$2b$10$KmB2nDWRbw4iblHM19qYt.9Ncl.VGAwGE44Y0Em0tu48H51KqAJQi',
      id: '0cc41817-70f4-4013-934c-6b887cf746c3'
    }
    const login: IUserAuth = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([user])
    const jwtProvider = new Jwt('abcde')
    const hashProvider = new Bcrypt()
    const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
    const controller = new AuthenticationController(useCase)
    const response = await controller.handler({
      body: login,
      tokenData: {
        userId: 'userId'
      }
    })
    expect(response.description).to.equal('User authenticated successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.include({
      _id: user.id,
      email: login.email,
      name: user.name
    })
    expect(response.content).to.exist.property('token')
  })
  it('should not authenticate user', async () => {
    const login: IUserAuth = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([])
    const jwtProvider = new Jwt('abcde')
    const hashProvider = new Bcrypt()
    const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
    const controller = new AuthenticationController(useCase)
    const response = await controller.handler({
      body: login,
      tokenData: {
        userId: 'userId'
      }
    })
    expect(response.description).to.equal('Error on authenticate user')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({ message: 'User not found: email@email.com.' })
  })
})
