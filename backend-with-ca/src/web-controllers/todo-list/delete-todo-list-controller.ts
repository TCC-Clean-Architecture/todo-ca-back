import { type DeleteTodoListUseCase } from '@/usecases/todo-list/delete-todo-list/delete-todo-list'
import { badRequest, ok } from '@/web-controllers/helper/http-response-builder'
import { type Controller } from '@/web-controllers/port/controller'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

import { type IHttpRequestWithParams } from '../port/http-request'

interface IDeleteRouteParams {
  listId: string
}

class DeleteTodoListController implements Controller {
  private readonly useCase: DeleteTodoListUseCase
  constructor (useCase: DeleteTodoListUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithParams<IDeleteRouteParams>): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.params.listId, request.tokenData.userId)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on delete todo list',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Delete todo list executed successfully',
      content: {
        _id: response.value
      }
    })
  }
}

export {
  DeleteTodoListController
}
