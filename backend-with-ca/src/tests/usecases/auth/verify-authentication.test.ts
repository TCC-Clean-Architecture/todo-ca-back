import { expect } from 'chai'

import { type IUserAuth, type IUserAuthResponse } from '@/entities/interfaces/user'
import { Bcrypt } from '@/external/security/bcrypt'
import { InvalidTokenError } from '@/external/security/error/InvalidTokenError'
import { Jwt } from '@/external/security/jwt'
import { AuthenticationUseCase } from '@/usecases/auth/authentication'
import { VerifyAuthenticationUseCase } from '@/usecases/auth/verify-authentication'
import { InMemoryUserRepository } from '@/usecases/shared/repository/in-memory-user-repository'

describe('Verify authentication use case', () => {
  it('should verify as success the authentication', async () => {
    const user = {
      name: 'John Doe',
      email: 'email@email.com',
      password: '$2b$10$KmB2nDWRbw4iblHM19qYt.9Ncl.VGAwGE44Y0Em0tu48H51KqAJQi',
      id: '0cc41817-70f4-4013-934c-6b887cf746c3'
    }
    const repository = new InMemoryUserRepository([user])
    const jwtProvider = new Jwt('abcde')
    const hashProvider = new Bcrypt()
    const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
    const login: IUserAuth = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const response = await useCase.execute(login)
    const responseValue = response.value as IUserAuthResponse
    const authUseCase = new VerifyAuthenticationUseCase(jwtProvider)
    const jwtPayload = await authUseCase.execute(responseValue.token)
    expect(jwtPayload.value).to.deep.include({
      userId: user.id
    })
  })
})

it('should verify as fail the authentication', async () => {
  const user = {
    name: 'John Doe',
    email: 'email@email.com',
    password: '$2b$10$KmB2nDWRbw4iblHM19qYt.9Ncl.VGAwGE44Y0Em0tu48H51KqAJQi',
    id: '0cc41817-70f4-4013-934c-6b887cf746c3'
  }
  const repository = new InMemoryUserRepository([user])
  const jwtProvider = new Jwt('abcde')
  const hashProvider = new Bcrypt()
  const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
  const login: IUserAuth = {
    email: 'email@email.com',
    password: 'Password100'
  }
  const response = await useCase.execute(login)
  const responseValue = response.value as IUserAuthResponse
  const otherJwtProvider = new Jwt('bcdef')
  const authUseCase = new VerifyAuthenticationUseCase(otherJwtProvider)
  const jwtPayload = await authUseCase.execute(responseValue.token)
  expect(jwtPayload.value).to.be.instanceOf(InvalidTokenError)
})
