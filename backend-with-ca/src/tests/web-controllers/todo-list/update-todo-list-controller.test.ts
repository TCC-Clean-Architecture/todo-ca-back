import { expect } from 'chai'

import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { UpdateTodoListUseCase } from '@/usecases/todo-list/update-todo-list/update-todo-list'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type IHttpRequestWithBodyAndParams } from '@/web-controllers/port/http-request'
import { UpdateTodoListController } from '@/web-controllers/todo-list/update-todo-list-controller'

describe('UpdateTodoListController implementation testing', () => {
  it('should create an instance of update todo list controller and return success', async () => {
    const lists = [todoListFixture()]
    const id = lists[0].id
    const repository = new InMemoryTodoListRepository(lists)
    const useCase = new UpdateTodoListUseCase(repository)
    const controllerInstance = new UpdateTodoListController(useCase)
    const todos = [todoFixture(), todoFixture()]
    const request: IHttpRequestWithBodyAndParams<ITodoListOptional, Pick<ITodoListWithId, 'id'>> = {
      body: {
        name: 'todolist',
        todos
      },
      params: {
        id
      }
    }
    const expectedResponse: ITodoListWithId = {
      id,
      name: 'todolist',
      todos
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Todo list updated successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.include(idConverter(expectedResponse))
  })
  it('should create an instance of update todo list controller and return error', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCase = new UpdateTodoListUseCase(repository)
    const controllerInstance = new UpdateTodoListController(useCase)
    const todos = [todoFixture(), todoFixture()]
    const request: IHttpRequestWithBodyAndParams<ITodoListOptional, Pick<ITodoListWithId, 'id'>> = {
      body: {
        name: 'todolist',
        todos
      },
      params: {
        id: 'abcde'
      }
    }
    const expectedContent = {
      message: 'Todo list not found: abcde.'
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on update todo list')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal(expectedContent)
  })
})
