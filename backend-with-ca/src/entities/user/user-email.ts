import { type Either, left, right } from '@/shared/either'

import { InvalidEmailError } from './errors/InvalidEmailError'

class Email {
  public readonly value: string
  constructor (value: string) {
    this.value = value
  }

  public static create (userEmail: string): Either<InvalidEmailError, Email> {
    if (!Email.validate(userEmail)) {
      return left(new InvalidEmailError(userEmail))
    }
    return right(new Email(userEmail))
  }

  public static validate (userEmail: string): boolean {
    if (!userEmail.match(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm)) {
      return false
    }
    return true
  }
}

export { Email }
