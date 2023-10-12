import { type ITodo, type ITodoWithId } from '../entities/interfaces/todo'
import { type UpdateTodoUseCase } from '../usecases/update-todo/update-todo'
import { badRequest, ok } from './helper/http-response-builder'
import { type Controller } from './port/controller'
import { type IHttpRequestWithBodyAndParams } from './port/http-request'
import { type IHttpResponse } from './port/http-response'

type RequestType = IHttpRequestWithBodyAndParams<Partial<ITodo>, Pick<ITodoWithId, 'id'>>

class UpdateTodoController implements Controller {
  private readonly useCase: UpdateTodoUseCase
  constructor (useCase: UpdateTodoUseCase) {
    this.useCase = useCase
  }

  async handler (request: RequestType): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.params.id, request.body)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on update todo',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Todo updated successfully',
      content: response.value
    })
  }
}

export {
  UpdateTodoController
}
