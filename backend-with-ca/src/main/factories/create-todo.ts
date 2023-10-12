import { CreateNewTodoUseCase } from '../../usecases/create-new-todo/create-new-todo'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { CreateTodoController } from '../../web-controllers/create-todo-controller'

const makeCreateTodoController = (): CreateTodoController => {
  const todoRepository = new InMemoryTodoRepository([])
  const useCase = new CreateNewTodoUseCase(todoRepository)
  const controller = new CreateTodoController(useCase)
  return controller
}

export { makeCreateTodoController }
