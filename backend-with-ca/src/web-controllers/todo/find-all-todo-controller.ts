import { type ITodoWithId } from '@/entities/interfaces/todo'
import { type IListId } from '@/entities/interfaces/todo-list'
import { type FindAllTodoUseCase } from '@/usecases/todo/find-all-todos/find-all-todos'
import { badRequest, ok } from '@/web-controllers/helper/http-response-builder'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type Controller } from '@/web-controllers/port/controller'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

import { type IHttpRequestWithParams } from '../port/http-request'

class FindAllTodoController implements Controller {
  private readonly useCase: FindAllTodoUseCase
  constructor (useCase: FindAllTodoUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithParams<IListId>): Promise<IHttpResponse<ITodoWithId[] | object>> {
    const response = await this.useCase.execute(request.params.listId)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on find all todos',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Find all todos executed successfully',
      content: idConverter(response.value)
    })
  }
}

export {
  FindAllTodoController
}
