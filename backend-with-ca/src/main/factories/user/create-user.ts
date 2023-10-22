import { MongoUserRepository } from '@/external-dependencies/repositories/mongo-user-repository'
import { Bcrypt } from '@/external-dependencies/security/bcrypt'
import { CreateUserUseCase } from '@/usecases/user/create-user'
import { CreateUserController } from '@/web-controllers/user/create-user-controller'

const makeCreateUserController = (): CreateUserController => {
  const repository = new MongoUserRepository()
  const hashProvider = new Bcrypt()
  const useCase = new CreateUserUseCase(repository, hashProvider)
  const controller = new CreateUserController(useCase)
  return controller
}

export { makeCreateUserController }
