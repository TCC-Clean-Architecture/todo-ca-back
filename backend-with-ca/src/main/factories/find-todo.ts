import { FindAllTodoUseCase } from '../../usecases/find-all-todos/find-all-todos'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { FindAllTodoController } from '../../web-controllers/find-all-todo-controller'

const makeGetTodoController = (): FindAllTodoController => {
  const todoRepository = new InMemoryTodoRepository([])
  const useCase = new FindAllTodoUseCase(todoRepository)
  const controller = new FindAllTodoController(useCase)
  return controller
}

export { makeGetTodoController }
