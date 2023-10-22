import { MongoTodoListRepository } from '@/external-dependencies/repositories/mongo-todo-list-repository'
import { CreateNewTodoListUseCase } from '@/usecases/todo-list/create-new-todo-list/create-new-todo-list'
import { CreateTodoListController } from '@/web-controllers/todo-list/create-todo-list-controller'

const makeCreateTodoListController = (): CreateTodoListController => {
  const todoRepository = new MongoTodoListRepository()
  const useCase = new CreateNewTodoListUseCase(todoRepository)
  const controller = new CreateTodoListController(useCase)
  return controller
}

export { makeCreateTodoListController }
