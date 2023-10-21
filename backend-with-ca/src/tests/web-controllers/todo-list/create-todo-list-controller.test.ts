import { expect } from 'chai'

import { type ITodoList, type ITodoListOptional } from '@/entities/interfaces/todo-list'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { CreateNewTodoListUseCase } from '@/usecases/todo-list/create-new-todo-list/create-new-todo-list'
import { type IHttpRequestWithBody } from '@/web-controllers/port/http-request'
import { CreateTodoListController } from '@/web-controllers/todo-list/create-todo-list-controller'

describe('CreateTodoListController implementation testing', () => {
  it('should create an instance of create todo list controller and return success', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCase = new CreateNewTodoListUseCase(repository)
    const controllerInstance = new CreateTodoListController(useCase)
    const request: IHttpRequestWithBody<ITodoListOptional> = {
      body: {
        name: 'todolist'
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const expectedResponse: ITodoList = {
      name: 'todolist',
      todos: [],
      userId: 'userId'
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Todo list created successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.include(expectedResponse)
  })
  it('should create an instance of create todo list controller and return error', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCase = new CreateNewTodoListUseCase(repository)
    const controllerInstance = new CreateTodoListController(useCase)
    const request: IHttpRequestWithBody<ITodoListOptional> = {
      body: {
        name: 'a'
      },
      tokenData: {
        userId: 'userId'
      }
    }
    const expectedContent = {
      message: 'Invalid todo list name: a.'
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on create todo list')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal(expectedContent)
  })
})
