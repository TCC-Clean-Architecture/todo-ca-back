import { type FindAllTodoListsUseCase } from '@/usecases/todo-list/find-all-todo-lists/find-all-todo-lists'
import { badRequest, ok } from '@/web-controllers/helper/http-response-builder'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type Controller } from '@/web-controllers/port/controller'
import { type IHttpResponse } from '@/web-controllers/port/http-response'

class FindAllTodoListsController implements Controller {
  private readonly useCase: FindAllTodoListsUseCase
  constructor (useCase: FindAllTodoListsUseCase) {
    this.useCase = useCase
  }

  async handler (): Promise<IHttpResponse> {
    const response = await this.useCase.execute()
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on find all todo lists',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'Find all todos lists executed successfully',
      content: response.value.map(todoList => idConverter(todoList))
    })
  }
}

export {
  FindAllTodoListsController
}
