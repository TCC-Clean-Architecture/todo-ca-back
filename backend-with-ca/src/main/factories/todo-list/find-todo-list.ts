import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { FindTodoListByIdUseCase } from '@/usecases/todo-list/find-todo-list-by-id/find-todo-list-by-id'
import { FindSpecificTodoListController } from '@/web-controllers/todo-list/find-specific-todo-list-controller'

const makeFindSpecificTodoListController = (): FindSpecificTodoListController => {
  const todoRepository = new MongoTodoListRepository()
  const useCase = new FindTodoListByIdUseCase(todoRepository)
  const controller = new FindSpecificTodoListController(useCase)
  return controller
}

export { makeFindSpecificTodoListController }
