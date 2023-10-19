import { type IUser, type IUserWithoutPassword } from '@/entities/interfaces/user'
import { type InvalidEmailError } from '@/entities/user/errors/InvalidEmailError'
import { type InvalidPasswordError } from '@/entities/user/errors/InvalidPasswordError'
import { User } from '@/entities/user/user'
import { type Either, left, right } from '@/shared/either'
import { type IHashProvider } from '@/shared/security-repository'
import { type IUserRepository } from '@/shared/user-repository'

import { type IUseCase } from '../shared/ports/use-case'
import { UserAlreadyExists } from './errors/UserAlreadyExists'
import { UserCreateError } from './errors/UserCreateError'

class CreateUserUseCase implements IUseCase {
  private readonly userRepository: IUserRepository
  private readonly hashProvider: IHashProvider
  constructor (userRepository: IUserRepository, hashProvider: IHashProvider) {
    this.userRepository = userRepository
    this.hashProvider = hashProvider
  }

  async execute (user: IUser): Promise<Either<InvalidEmailError | InvalidPasswordError | UserAlreadyExists | UserCreateError, IUserWithoutPassword>> {
    const userInstance = User.create(user)
    if (userInstance.isLeft()) {
      return left(userInstance.value)
    }
    const userExists = await this.userRepository.findByEmail(user.email)
    if (userExists) {
      return left(new UserAlreadyExists(user.email))
    }
    const userWithHashedPassword = {
      ...userInstance.value,
      password: await this.hashProvider.hash(userInstance.value.password)
    }
    await this.userRepository.create(userWithHashedPassword)
    const userAfterCreate = await this.userRepository.findByEmail(user.email)
    if (!userAfterCreate) {
      return left(new UserCreateError(user.email))
    }
    const { password, ...userWithoutPassword } = userAfterCreate
    return right(userWithoutPassword)
  }
}

export { CreateUserUseCase }
