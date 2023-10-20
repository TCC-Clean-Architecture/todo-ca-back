import { expect } from 'chai'

import { type IListIdTodoIdParams } from '@/entities/interfaces/todo'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { DeleteTodoUseCase } from '@/usecases/todo/delete-todo/delete-todo'
import { type IHttpRequestWithParams } from '@/web-controllers/port/http-request'
import { DeleteTodoController } from '@/web-controllers/todo/delete-todo-controller'

describe('DeleteTodoController implementation testing', () => {
  it('should delete an specific todo by id and return success', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoId = lists[0].todos[0].id
    const repository = new InMemoryTodoListRepository(lists)
    const deleteTodoUseCase = new DeleteTodoUseCase(repository)
    const controllerInstance = new DeleteTodoController(deleteTodoUseCase)
    const request: IHttpRequestWithParams<IListIdTodoIdParams> = {
      params: {
        listId,
        todoId
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Todo deleted successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.equal({
      _id: todoId
    })
  })
  it('should not find todo and return error on attempt to delete', async () => {
    const repository = new InMemoryTodoListRepository([])
    const deleteTodoUseCase = new DeleteTodoUseCase(repository)
    const controllerInstance = new DeleteTodoController(deleteTodoUseCase)
    const request: IHttpRequestWithParams<IListIdTodoIdParams> = {
      params: {
        listId: 'abcde',
        todoId: 'abcde'
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on delete todo')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'Todo list not found: abcde.'
    })
  })
})
