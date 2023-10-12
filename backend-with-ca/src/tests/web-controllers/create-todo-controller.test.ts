import { expect } from 'chai'
import { type ITodo } from '../../entities/interfaces/todo'
import { CreateNewTodoUseCase } from '../../usecases/create-new-todo/create-new-todo'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { CreateTodoController } from '../../web-controllers/create-todo-controller'
import { type IHttpRequestWithBody } from '../../web-controllers/port/http-request'

describe.only('CreateTodoController implementation testing', () => {
  it('should create an instance of create todo controller and return success', async () => {
    const todoRepository = new InMemoryTodoRepository([])
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const controllerInstance = new CreateTodoController(createNewTodoUseCase)
    const request: IHttpRequestWithBody<ITodo> = {
      body: {
        name: 'todo',
        description: 'desc',
        status: 'inprogress'
      }
    }
    const expectedTodo: ITodo = {
      name: 'todo',
      description: 'desc',
      status: 'inprogress'
    }
    const response = await controllerInstance.handler(request)
    expect(response.statusCode).to.equal(200)
    expect(response.body.description).to.equal('Todo created successfully')
    expect(response.body.statusCode).to.equal(200)
    expect(response.body.message).to.equal('OK')
    expect(response.body.type).to.equal('success')
    expect(response.body.content).to.deep.include(expectedTodo)
  })
  it('should create an instance of create todo controller and return error', async () => {
    const todoRepository = new InMemoryTodoRepository([])
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const controllerInstance = new CreateTodoController(createNewTodoUseCase)
    const request: IHttpRequestWithBody<ITodo> = {
      body: {
        name: 'a',
        description: 'desc',
        status: 'inprogress'
      }
    }
    const expectedContent = {}
    const response = await controllerInstance.handler(request)
    expect(response.statusCode).to.equal(400)
    expect(response.body.description).to.equal('Error on create todo')
    expect(response.body.statusCode).to.equal(400)
    expect(response.body.message).to.equal('Bad Request')
    expect(response.body.type).to.equal('error')
    expect(response.body.content).to.deep.include(expectedContent)
  })
})
