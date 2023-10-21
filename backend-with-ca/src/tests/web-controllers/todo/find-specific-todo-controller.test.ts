import { expect } from 'chai'

import { type IListIdTodoIdParams } from '@/entities/interfaces/todo'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindTodoByIdUseCase } from '@/usecases/todo/find-todo-by-id/find-todo-by-id'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type IHttpRequestWithParams } from '@/web-controllers/port/http-request'
import { FindSpecificTodoController } from '@/web-controllers/todo/find-specific-todo-controller'

describe('FindSpecificTodoController implementation testing', () => {
  it('should find an specific todo by id and return success', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todo = lists[0].todos[0]
    const todoRepository = new InMemoryTodoListRepository(lists)
    const findTodoByIdUseCase = new FindTodoByIdUseCase(todoRepository)
    const controllerInstance = new FindSpecificTodoController(findTodoByIdUseCase)
    const request: IHttpRequestWithParams<IListIdTodoIdParams> = {
      params: {
        todoId: todo.id,
        listId
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Todo found successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.equal(idConverter(todo))
  })
  it('should not find todo and return error', async () => {
    const todoRepository = new InMemoryTodoListRepository([])
    const findTodoByIdUseCase = new FindTodoByIdUseCase(todoRepository)
    const controllerInstance = new FindSpecificTodoController(findTodoByIdUseCase)
    const request: IHttpRequestWithParams<IListIdTodoIdParams> = {
      params: {
        todoId: 'abcde',
        listId: 'abcde'
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on get todo by id')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'Todo list not found: abcde.'
    })
  })
})
