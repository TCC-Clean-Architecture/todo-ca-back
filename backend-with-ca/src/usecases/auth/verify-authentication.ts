import { InvalidTokenError } from '@/external-dependencies/security/error/InvalidTokenError'
import { type Either, left, right } from '@/shared/either'
import { type IJwtProvider, type ITokenPayload } from '@/shared/security-repository'

import { type IUseCase } from '../shared/ports/use-case'

class VerifyAuthenticationUseCase implements IUseCase {
  private readonly jwtProvider: IJwtProvider
  constructor (jwtProvider: IJwtProvider) {
    this.jwtProvider = jwtProvider
  }

  async execute (token: string): Promise<Either<InvalidTokenError, ITokenPayload>> {
    const verifyResult = this.jwtProvider.verify(token)
    if (verifyResult.isLeft()) {
      return left(new InvalidTokenError())
    }
    return right(verifyResult.value)
  }
}

export { VerifyAuthenticationUseCase }
