import { MongoTodoRepository } from '../../external/repositories/MongoTodoRepository'
import { UpdateTodoUseCase } from '../../usecases/update-todo/update-todo'
import { UpdateTodoController } from '../../web-controllers/update-todo-controller'

const makeUpdateTodoController = (): UpdateTodoController => {
  const todoRepository = new MongoTodoRepository()
  const useCase = new UpdateTodoUseCase(todoRepository)
  const controller = new UpdateTodoController(useCase)
  return controller
}

export { makeUpdateTodoController }
