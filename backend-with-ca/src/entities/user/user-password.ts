import { type Either, left, right } from '@/shared/either'

import { InvalidPasswordError } from './errors/InvalidPasswordError'

class Password {
  public readonly value: string
  constructor (value: string) {
    this.value = value
  }

  public static create (password: string): Either<InvalidPasswordError, Password> {
    if (!Password.validate(password)) {
      return left(new InvalidPasswordError())
    }
    return right(new Password(password))
  }

  public static validate (userEmail: string): boolean {
    if (!userEmail.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/gm)) {
      return false
    }
    return true
  }
}

export { Password }
