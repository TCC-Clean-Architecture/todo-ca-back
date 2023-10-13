import { MongoTodoRepository } from '../../external/repositories/MongoTodoRepository'
import { FindAllTodoUseCase } from '../../usecases/find-all-todos/find-all-todos'
import { FindAllTodoController } from '../../web-controllers/find-all-todo-controller'

const makeGetTodoController = (): FindAllTodoController => {
  const todoRepository = new MongoTodoRepository()
  const useCase = new FindAllTodoUseCase(todoRepository)
  const controller = new FindAllTodoController(useCase)
  return controller
}

export { makeGetTodoController }
