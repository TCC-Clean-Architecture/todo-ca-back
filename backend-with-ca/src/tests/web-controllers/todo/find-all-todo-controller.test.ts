import { expect } from 'chai'

import { type IListId } from '@/entities/interfaces/todo-list'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindAllTodoUseCase } from '@/usecases/todo/find-all-todos/find-all-todos'
import { type IHttpRequestWithParams } from '@/web-controllers/port/http-request'
import { FindAllTodoController } from '@/web-controllers/todo/find-all-todo-controller'

describe('FindAllTodoController implementation testing', () => {
  it('should find all instances created and return success', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todo = lists[0].todos[0]
    const todoRepository = new InMemoryTodoListRepository(lists)
    const findAllTodosUseCase = new FindAllTodoUseCase(todoRepository)
    const controllerInstance = new FindAllTodoController(findAllTodosUseCase)
    const request: IHttpRequestWithParams<IListId> = {
      params: {
        listId
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Find all todos executed successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    const { id, ...rest } = todo
    const expectedFakeTodo = {
      _id: id,
      ...rest
    }
    expect(response.content).to.deep.equal({
      ...lists[0],
      todos: [expectedFakeTodo]
    })
  })
  it('should return an error happen something unexpected on use case', async () => {
    const todoRepository = new InMemoryTodoListRepository([])
    const findAllTodosUseCase = new FindAllTodoUseCase(todoRepository)
    const controllerInstance = new FindAllTodoController(findAllTodosUseCase)
    const request: IHttpRequestWithParams<IListId> = {
      params: {
        listId: 'abcde'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on find all todos')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'Todo list not found: abcde.'
    })
  })
})
