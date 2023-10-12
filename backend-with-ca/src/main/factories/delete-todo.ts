import { DeleteTodoUseCase } from '../../usecases/delete-todo/delete-todo'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { DeleteTodoController } from '../../web-controllers/delete-todo-controller'

const makeDeleteTodoController = (): DeleteTodoController => {
  const todoRepository = new InMemoryTodoRepository([])
  const useCase = new DeleteTodoUseCase(todoRepository)
  const controller = new DeleteTodoController(useCase)
  return controller
}

export { makeDeleteTodoController }
