import { MongoTodoListRepository } from '@/external-dependencies/repositories/mongo-todo-list-repository'
import { FindAllTodoUseCase } from '@/usecases/todo/find-all-todos/find-all-todos'
import { FindAllTodoController } from '@/web-controllers/todo/find-all-todo-controller'

const makeGetTodoController = (): FindAllTodoController => {
  const todoRepository = new MongoTodoListRepository()
  const useCase = new FindAllTodoUseCase(todoRepository)
  const controller = new FindAllTodoController(useCase)
  return controller
}

export { makeGetTodoController }
