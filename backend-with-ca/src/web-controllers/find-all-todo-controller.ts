import { type ITodoWithId } from '../entities/interfaces/todo'
import { type FindAllTodoUseCase } from '../usecases/find-all-todos/find-all-todos'
import { badRequest, ok } from './helper/http-response-builder'
import { type Controller } from './port/controller'
import { type IHttpResponse } from './port/http-response'

class FindAllTodoController implements Controller {
  private readonly useCase: FindAllTodoUseCase
  constructor (useCase: FindAllTodoUseCase) {
    this.useCase = useCase
  }

  async handler (): Promise<IHttpResponse<ITodoWithId[] | object>> {
    const response = await this.useCase.execute()
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on find all todos',
        content: {}
      })
    }
    return ok<ITodoWithId[]>({
      description: 'Find all todos executed successfully',
      content: response.value
    })
  }
}

export {
  FindAllTodoController
}
