import { expect } from 'chai'

import { type IUser, type IUserWithId } from '@/entities/interfaces/user'
import { InvalidEmailError } from '@/entities/user/errors/InvalidEmailError'
import { Bcrypt } from '@/external/security/bcrypt'
import { type IUserRepository } from '@/shared/user-repository'
import { InMemoryUserRepository } from '@/usecases/shared/repository/in-memory-user-repository'
import { CreateUserUseCase } from '@/usecases/user/create-user'
import { UserAlreadyExists } from '@/usecases/user/errors/UserAlreadyExists'
import { UserCreateError } from '@/usecases/user/errors/UserCreateError'

describe('Create user use case testing', () => {
  it('should create an user with hashed password', async () => {
    const user: IUser = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([])
    const hashProvider = new Bcrypt()
    const useCase = new CreateUserUseCase(repository, hashProvider)
    const result = await useCase.execute(user)
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.have.property('id')
    expect(result.value).to.deep.include({ email: user.email })
    expect(result.value).to.not.have.property('password')
    const userInDb = await repository.findByEmail(user.email)
    expect(userInDb?.password).to.not.equal(user.password)
  })
  it('should not create invalid user', async () => {
    const user: IUser = {
      email: 'emailemail.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([])
    const hashProvider = new Bcrypt()
    const useCase = new CreateUserUseCase(repository, hashProvider)
    const result = await useCase.execute(user)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(InvalidEmailError)
  })
  it('should not create user', async () => {
    class MockUserRepository implements Partial<IUserRepository> {
      async create (user: IUser): Promise<string> {
        return 'string'
      }

      async findByEmail (email: string): Promise<IUserWithId | null> {
        return null
      }
    }
    const user: IUser = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const repository = new MockUserRepository() as IUserRepository
    const hashProvider = new Bcrypt()
    const useCase = new CreateUserUseCase(repository, hashProvider)
    const result = await useCase.execute(user)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UserCreateError)
  })
  it('should attempt to insert user already exists', async () => {
    const user: IUser = {
      email: 'email@email.com',
      password: 'Password100'
    }
    const repository = new InMemoryUserRepository([{ ...user, id: 'id' }])
    const hashProvider = new Bcrypt()
    const useCase = new CreateUserUseCase(repository, hashProvider)
    const result = await useCase.execute(user)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UserAlreadyExists)
  })
})
