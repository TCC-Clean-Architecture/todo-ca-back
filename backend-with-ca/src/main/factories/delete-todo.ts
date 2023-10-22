import { MongoTodoRepository } from '@/external-dependencies/repositories/mongo-todo-repository'
import { DeleteTodoUseCase } from '@/usecases/todo/delete-todo/delete-todo'
import { DeleteTodoController } from '@/web-controllers/todo/delete-todo-controller'

const makeDeleteTodoController = (): DeleteTodoController => {
  const todoRepository = new MongoTodoRepository()
  const useCase = new DeleteTodoUseCase(todoRepository)
  const controller = new DeleteTodoController(useCase)
  return controller
}

export { makeDeleteTodoController }
