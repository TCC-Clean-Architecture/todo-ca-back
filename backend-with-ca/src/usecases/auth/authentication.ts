import { type IUserAuth, type IUserAuthResponse } from '@/entities/interfaces/user'
import { type Either, left, right } from '@/shared/either'
import { type IHashProvider, type IJwtProvider } from '@/shared/security-repository'
import { type IUserRepository } from '@/shared/user-repository'

import { type IUseCase } from '../shared/ports/use-case'
import { UserNotFoundError } from '../user/errors/UserNotFoundError'
import { AuthenticationFailedError } from './errors/AuthenticationFailedError'

class AuthenticationUseCase implements IUseCase {
  private readonly userRepository: IUserRepository
  private readonly hashProvider: IHashProvider
  private readonly jwtProvider: IJwtProvider
  constructor (userRepository: IUserRepository, hashProvider: IHashProvider, jwtProvider: IJwtProvider) {
    this.userRepository = userRepository
    this.hashProvider = hashProvider
    this.jwtProvider = jwtProvider
  }

  async execute (auth: IUserAuth): Promise<Either<UserNotFoundError | AuthenticationFailedError, IUserAuthResponse>> {
    const userFound = await this.userRepository.findByEmail(auth.email)
    if (!userFound) {
      return left(new UserNotFoundError(auth.email))
    }
    if (!await this.hashProvider.compare(auth.password, userFound.password)) {
      return left(new AuthenticationFailedError())
    }
    const token = this.jwtProvider.sign({
      userId: userFound.id
    })
    return right({
      id: userFound.id,
      email: auth.email,
      name: userFound.name,
      token
    })
  }
}

export { AuthenticationUseCase }
