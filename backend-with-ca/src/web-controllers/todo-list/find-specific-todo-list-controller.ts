import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type FindTodoListByIdUseCase } from '@/usecases/todo-list/find-todo-list-by-id/find-todo-list-by-id'
import { badRequest, ok } from '@/web-controllers/helper/http-response-builder'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type Controller } from '@/web-controllers/port/controller'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

import { type IHttpRequestWithParams } from '../port/http-request'

class FindSpecificTodoListController implements Controller {
  private readonly useCase: FindTodoListByIdUseCase
  constructor (useCase: FindTodoListByIdUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithParams<Pick<ITodoListWithId, 'id'>>): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.params.id)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on find todo list by id',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Find todo list executed successfully',
      content: idConverter(response.value)
    })
  }
}

export {
  FindSpecificTodoListController
}
