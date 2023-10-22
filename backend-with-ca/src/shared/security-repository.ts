import { type JwtPayload } from 'jsonwebtoken'

import { type InvalidTokenError } from '@/external-dependencies/security/error/InvalidTokenError'

import { type Either } from './either'

export interface IHashProvider {
  hash(value: string): Promise<string>
  compare(data: string, encrypted: string): Promise<boolean>
}

export interface IJwtPayload {
  userId: string
}

export interface ITokenPayload extends JwtPayload {
  userId: string
}

export interface IJwtProvider {
  sign(payload: IJwtPayload): string
  verify(token: string): Either<InvalidTokenError, ITokenPayload>
}
