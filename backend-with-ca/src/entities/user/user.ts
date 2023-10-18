import { type Either, left, right } from '@/shared/either'

import { type IUser } from '../interfaces/user'
import { type InvalidEmailError } from './errors/InvalidEmailError'
import { type InvalidPasswordError } from './errors/InvalidPasswordError'
import { Email } from './user-email'
import { Password } from './user-password'

interface IStaticValidationSuccessReturn {
  userEmail: Email
  userPassword: Password
}

class User {
  public readonly email: string
  public readonly password: string

  constructor (email: Email, password: Password) {
    this.email = email.value
    this.password = password.value
  }

  static create (value: IUser): Either<InvalidEmailError | InvalidPasswordError, User> {
    const validationResult = User.validate(value)
    if (validationResult.isLeft()) {
      return left(validationResult.value)
    }
    return right(new User(validationResult.value.userEmail, validationResult.value.userPassword))
  }

  static validate (value: IUser): Either<InvalidEmailError | InvalidPasswordError, IStaticValidationSuccessReturn> {
    const userEmail = Email.create(value.email)
    if (userEmail.isLeft()) {
      return left(userEmail.value)
    }
    const userPassword = Password.create(value.password)
    if (userPassword.isLeft()) {
      return left(userPassword.value)
    }
    return right({
      userEmail: userEmail.value,
      userPassword: userPassword.value
    })
  }
}

export { type IStaticValidationSuccessReturn, User }
