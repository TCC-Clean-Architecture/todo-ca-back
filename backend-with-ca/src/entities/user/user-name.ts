import { type Either, left, right } from '@/shared/either'

import { InvalidNameError } from './errors/InvalidNameError'

class UserName {
  public readonly value: string
  constructor (value: string) {
    this.value = value
  }

  public static create (name: string): Either<InvalidNameError, UserName> {
    if (!UserName.validate(name)) {
      return left(new InvalidNameError(name))
    }
    return right(new UserName(name))
  }

  public static validate (name: string): boolean {
    if (name.length < 3 || name.length > 100) {
      return false
    }
    return true
  }
}

export { UserName }
