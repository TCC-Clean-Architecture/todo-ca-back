import { CreateUserUseCase } from '@/usecases/user/create-user'
import { CreateUserController } from '@/web-controllers/user/create-user-controller'

const makeCreateUserController = (): CreateUserController => {
  const repository = Mongo
  const useCase = CreateUserUseCase()
  const controller = CreateUserController()
}
