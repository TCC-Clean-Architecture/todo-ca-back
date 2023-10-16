import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { UpdateTodoListUseCase } from '@/usecases/todo-list/update-todo-list/update-todo-list'
import { UpdateTodoListController } from '@/web-controllers/todo-list/update-todo-list-controller'

const makeUpdateTodoListController = (): UpdateTodoListController => {
  const todoRepository = new MongoTodoListRepository()
  const useCase = new UpdateTodoListUseCase(todoRepository)
  const controller = new UpdateTodoListController(useCase)
  return controller
}

export { makeUpdateTodoListController }
