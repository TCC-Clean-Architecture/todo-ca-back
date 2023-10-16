import { type ITodoListOptional } from '@/entities/interfaces/todo-list'
import { type CreateNewTodoListUseCase } from '@/usecases/todo-list/create-new-todo-list/create-new-todo-list'
import { badRequest, ok } from '@/web-controllers/helper/http-response-builder'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type Controller } from '@/web-controllers/port/controller'
import { type IHttpRequestWithBody } from '@/web-controllers/port/http-request'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

class CreateTodoListController implements Controller {
  private readonly useCase: CreateNewTodoListUseCase
  constructor (useCase: CreateNewTodoListUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithBody<ITodoListOptional>): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.body)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on create todo list',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Todo list created successfully',
      content: idConverter(response.value)
    })
  }
}

export {
  CreateTodoListController
}
