import { type Either, left, right } from '@/shared/either'

import { type IUser } from '../interfaces/user'
import { type InvalidEmailError } from './errors/InvalidEmailError'
import { type InvalidNameError } from './errors/InvalidNameError'
import { type InvalidPasswordError } from './errors/InvalidPasswordError'
import { Email } from './user-email'
import { UserName } from './user-name'
import { Password } from './user-password'

interface IStaticValidationSuccessReturn {
  userName: UserName
  userEmail: Email
  userPassword: Password
}

class User {
  public readonly name: string
  public readonly email: string
  public readonly password: string

  constructor (name: UserName, email: Email, password: Password) {
    this.name = name.value
    this.email = email.value
    this.password = password.value
  }

  static create (value: IUser): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
    const validationResult = User.validate(value)
    if (validationResult.isLeft()) {
      return left(validationResult.value)
    }
    return right(new User(validationResult.value.userName, validationResult.value.userEmail, validationResult.value.userPassword))
  }

  static validate (value: IUser): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, IStaticValidationSuccessReturn> {
    const userName = UserName.create(value.name)
    if (userName.isLeft()) {
      return left(userName.value)
    }
    const userEmail = Email.create(value.email)
    if (userEmail.isLeft()) {
      return left(userEmail.value)
    }
    const userPassword = Password.create(value.password)
    if (userPassword.isLeft()) {
      return left(userPassword.value)
    }
    return right({
      userName: userName.value,
      userEmail: userEmail.value,
      userPassword: userPassword.value
    })
  }
}

export { type IStaticValidationSuccessReturn, User }
