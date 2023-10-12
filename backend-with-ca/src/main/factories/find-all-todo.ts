import { FindTodoByIdUseCase } from '../../usecases/find-todo-by-id/find-todo-by-id'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { FindSpecificTodoController } from '../../web-controllers/find-specific-todo-controller'

const makeFindSpecificTodoController = (): FindSpecificTodoController => {
  const todoRepository = new InMemoryTodoRepository([])
  const useCase = new FindTodoByIdUseCase(todoRepository)
  const controller = new FindSpecificTodoController(useCase)
  return controller
}

export { makeFindSpecificTodoController }
