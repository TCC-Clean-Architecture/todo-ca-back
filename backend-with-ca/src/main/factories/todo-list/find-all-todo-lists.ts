import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { FindAllTodoListsUseCase } from '@/usecases/todo-list/find-all-todo-lists/find-all-todo-lists'
import { FindAllTodoListsController } from '@/web-controllers/todo-list/find-all-todo-lists-controller'

const makeGetTodoListController = (): FindAllTodoListsController => {
  const todoRepository = new MongoTodoListRepository()
  const useCase = new FindAllTodoListsUseCase(todoRepository)
  const controller = new FindAllTodoListsController(useCase)
  return controller
}

export { makeGetTodoListController }
