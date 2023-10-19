import { type IUser, type IUserWithId } from '@/entities/interfaces/user'
import { type InvalidEmailError } from '@/entities/user/errors/InvalidEmailError'
import { type InvalidPasswordError } from '@/entities/user/errors/InvalidPasswordError'
import { User } from '@/entities/user/user'
import { type Either, left, right } from '@/shared/either'
import { type IUserRepository } from '@/shared/user-repository'

import { type IUseCase } from '../shared/ports/use-case'
import { UserAlreadyExists } from './errors/UserAlreadyExists'
import { UserCreateError } from './errors/UserCreateError'

class CreateUserUseCase implements IUseCase {
  private readonly userRepository: IUserRepository
  constructor (userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute (user: IUser): Promise<Either<InvalidEmailError | InvalidPasswordError | UserAlreadyExists | UserCreateError, IUserWithId>> {
    const userInstance = User.create(user)
    if (userInstance.isLeft()) {
      return left(userInstance.value)
    }
    const userExists = await this.userRepository.findByEmail(user.email)
    if (userExists) {
      return left(new UserAlreadyExists(user.email))
    }
    await this.userRepository.create(userInstance.value)
    const userAfterCreate = await this.userRepository.findByEmail(user.email)
    if (!userAfterCreate) {
      return left(new UserCreateError(user.email))
    }
    return right(userAfterCreate)
  }
}

export { CreateUserUseCase }