import { expect } from 'chai'

import { type IListIdTodoIdParams, type ITodo } from '@/entities/interfaces/todo'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { UpdateTodoUseCase } from '@/usecases/todo/update-todo/update-todo'
import { type IHttpRequestWithBodyAndParams } from '@/web-controllers/port/http-request'
import { UpdateTodoController } from '@/web-controllers/todo/update-todo-controller'

describe('UpdateTodoController implementation testing', () => {
  it('should update an specific todo and return success', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoId = lists[0].todos[0].id
    const todoRepository = new InMemoryTodoListRepository(lists)
    const updateTodoUseCase = new UpdateTodoUseCase(todoRepository)
    const controllerInstance = new UpdateTodoController(updateTodoUseCase)
    const request: IHttpRequestWithBodyAndParams<Partial<ITodo>, IListIdTodoIdParams> = {
      params: {
        listId,
        todoId
      },
      body: {
        name: 'updated',
        description: 'updated',
        status: 'done'
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Todo updated successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.include(request.body)
  })
  it('should not find todo and return error on attempt to update', async () => {
    const todoRepository = new InMemoryTodoListRepository([])
    const updateTodoUseCase = new UpdateTodoUseCase(todoRepository)
    const controllerInstance = new UpdateTodoController(updateTodoUseCase)
    const request: IHttpRequestWithBodyAndParams<Partial<ITodo>, IListIdTodoIdParams> = {
      params: {
        listId: 'abcde',
        todoId: 'abcde'
      },
      body: {
        name: 'updated',
        description: 'updated',
        status: 'done'
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on update todo')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'Todo list not found: abcde.'
    })
  })
})
