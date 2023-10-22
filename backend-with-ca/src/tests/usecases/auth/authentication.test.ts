import { expect } from 'chai'

import { type IUserAuth } from '@/entities/interfaces/user'
import { Bcrypt } from '@/external-dependencies/security/bcrypt'
import { Jwt } from '@/external-dependencies/security/jwt'
import { AuthenticationUseCase } from '@/usecases/auth/authentication'
import { AuthenticationFailedError } from '@/usecases/auth/errors/AuthenticationFailedError'
import { InMemoryUserRepository } from '@/usecases/shared/repository/in-memory-user-repository'
import { UserNotFoundError } from '@/usecases/user/errors/UserNotFoundError'

describe('Authentication use case testing', () => {
  const user = {
    name: 'John Doe',
    email: 'email@email.com',
    password: '$2b$10$KmB2nDWRbw4iblHM19qYt.9Ncl.VGAwGE44Y0Em0tu48H51KqAJQi',
    id: '0cc41817-70f4-4013-934c-6b887cf746c3'
  }
  it('should authenticate user', async () => {
    const repository = new InMemoryUserRepository([user])
    const jwtProvider = new Jwt('abcde')
    const hashProvider = new Bcrypt()
    const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
    const login: IUserAuth = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const response = await useCase.execute(login)
    expect(response.isRight()).to.equal(true)
    expect(response.value).to.deep.include({
      id: user.id,
      email: login.email,
      name: user.name
    })
    expect(response.value).to.exist.property('token')
  })
  it('should return user not found error', async () => {
    const repository = new InMemoryUserRepository([])
    const jwtProvider = new Jwt('abcde')
    const hashProvider = new Bcrypt()
    const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
    const login: IUserAuth = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const response = await useCase.execute(login)
    expect(response.isLeft()).to.equal(true)
    expect(response.value).to.be.instanceOf(UserNotFoundError)
  })

  it('should return authentication fail', async () => {
    const repository = new InMemoryUserRepository([user])
    const jwtProvider = new Jwt('abcde')
    const hashProvider = new Bcrypt()
    const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
    const login: IUserAuth = {
      email: 'email@email.com',
      password: 'wrongpassword'
    }
    const response = await useCase.execute(login)
    expect(response.isLeft()).to.equal(true)
    expect(response.value).to.be.instanceOf(AuthenticationFailedError)
  })
})
