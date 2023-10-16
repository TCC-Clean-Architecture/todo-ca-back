import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type UpdateTodoListUseCase } from '@/usecases/todo-list/update-todo-list/update-todo-list'
import { badRequest, ok } from '@/web-controllers/helper/http-response-builder'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type Controller } from '@/web-controllers/port/controller'
import { type IHttpRequestWithBodyAndParams } from '@/web-controllers/port/http-request'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

class UpdateTodoListController implements Controller {
  private readonly useCase: UpdateTodoListUseCase
  constructor (useCase: UpdateTodoListUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithBodyAndParams<ITodoListOptional, Pick<ITodoListWithId, 'id'>>): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.params.id, request.body)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on update todo list',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Todo list updated successfully',
      content: idConverter(response.value)
    })
  }
}

export {
  UpdateTodoListController
}
