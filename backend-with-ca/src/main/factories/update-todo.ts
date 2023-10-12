import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { UpdateTodoUseCase } from '../../usecases/update-todo/update-todo'
import { UpdateTodoController } from '../../web-controllers/update-todo-controller'

const makeUpdateTodoController = (): UpdateTodoController => {
  const todoRepository = new InMemoryTodoRepository([])
  const useCase = new UpdateTodoUseCase(todoRepository)
  const controller = new UpdateTodoController(useCase)
  return controller
}

export { makeUpdateTodoController }
