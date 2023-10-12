import { type ITodo } from '../entities/interfaces/todo'
import { type CreateNewTodoUseCase } from '../usecases/create-new-todo/create-new-todo'
import { type Controller } from './port/controller'
import { type IHttpRequestWithBody } from './port/http-request'
import { type IHttpResponse } from './port/http-response'

class CreateTodoController implements Controller {
  private readonly useCase: CreateNewTodoUseCase
  constructor (useCase: CreateNewTodoUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithBody<ITodo>): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.body)
    if (response.isLeft()) {
      return {
        description: 'Error on create todo',
        statusCode: 400,
        message: 'Bad Request',
        type: 'error',
        content: response.value
      }
    }
    return {
      description: 'Todo created successfully',
      statusCode: 200,
      message: 'OK',
      type: 'success',
      content: response.value
    }
  }
}

export {
  CreateTodoController
}
