import jwt from 'jsonwebtoken'

import { type Either, left, right } from '@/shared/either'
import { type IJwtPayload, type IJwtProvider, type ITokenPayload } from '@/shared/security-repository'

import { InvalidTokenError } from './error/InvalidTokenError'

class Jwt implements IJwtProvider {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  sign (payload: IJwtPayload): string {
    const token = jwt.sign(payload, this.secret)
    return token
  }

  verify (token: string): Either<InvalidTokenError, ITokenPayload> {
    try {
      const validate = jwt.verify(token, this.secret) as ITokenPayload
      return right(validate)
    } catch (err) {
      return left(new InvalidTokenError())
    }
  }
}

export { Jwt }
