import { type IUser } from '@/entities/interfaces/user'
import { type CreateUserUseCase } from '@/usecases/user/create-user'

import { badRequest, ok } from '../helper/http-response-builder'
import { idConverter } from '../helper/id-property-name-converter'
import { type Controller } from '../port/controller'
import { type IHttpRequestWithBody } from '../port/http-request'
import { type IHttpResponse } from '../port/http-response'

class CreateUserController implements Controller {
  private readonly useCase: CreateUserUseCase
  constructor (useCase: CreateUserUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithBody<IUser>): Promise<IHttpResponse<object>> {
    const response = await this.useCase.execute(request.body)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on create user',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'User created successfully',
      content: idConverter(response.value)
    })
  }
}

export { CreateUserController }
