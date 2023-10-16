import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { CreateNewTodoUseCase } from '@/usecases/todo/create-new-todo/create-new-todo'
import { CreateTodoController } from '@/web-controllers/todo/create-todo-controller'

const makeCreateTodoController = (): CreateTodoController => {
  const repository = new MongoTodoListRepository()
  const useCase = new CreateNewTodoUseCase(repository)
  const controller = new CreateTodoController(useCase)
  return controller
}

export { makeCreateTodoController }
