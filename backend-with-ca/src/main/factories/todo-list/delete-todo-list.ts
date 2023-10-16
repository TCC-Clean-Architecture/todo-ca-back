import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { DeleteTodoListUseCase } from '@/usecases/todo-list/delete-todo-list/delete-todo-list'
import { DeleteTodoListController } from '@/web-controllers/todo-list/delete-todo-list-controller'

const makeDeleteTodoListController = (): DeleteTodoListController => {
  const todoRepository = new MongoTodoListRepository()
  const useCase = new DeleteTodoListUseCase(todoRepository)
  const controller = new DeleteTodoListController(useCase)
  return controller
}

export { makeDeleteTodoListController }
