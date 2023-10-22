import { MongoTodoListRepository } from '@/external-dependencies/repositories/mongo-todo-list-repository'
import { UpdateTodoUseCase } from '@/usecases/todo/update-todo/update-todo'
import { UpdateTodoController } from '@/web-controllers/todo/update-todo-controller'

const makeUpdateTodoController = (): UpdateTodoController => {
  const repository = new MongoTodoListRepository()
  const useCase = new UpdateTodoUseCase(repository)
  const controller = new UpdateTodoController(useCase)
  return controller
}

export { makeUpdateTodoController }
