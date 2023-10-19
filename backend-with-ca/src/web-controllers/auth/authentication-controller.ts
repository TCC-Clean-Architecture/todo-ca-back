import { type IUserAuth } from '@/entities/interfaces/user'
import { type AuthenticationUseCase } from '@/usecases/auth/authentication'

import { badRequest, ok } from '../helper/http-response-builder'
import { idConverter } from '../helper/id-property-name-converter'
import { type Controller } from '../port/controller'
import { type IHttpRequestWithBody } from '../port/http-request'
import { type IHttpResponse } from '../port/http-response'

class AuthenticationController implements Controller {
  private readonly useCase: AuthenticationUseCase
  constructor (useCase: AuthenticationUseCase) {
    this.useCase = useCase
  }

  async handler (request: IHttpRequestWithBody<IUserAuth>): Promise<IHttpResponse> {
    const response = await this.useCase.execute(request.body)
    if (response.isLeft()) {
      return badRequest({
        description: 'Error on authenticate user',
        content: {
          message: response.value.message
        }
      })
    }
    return ok({
      description: 'User authenticated successfully',
      content: idConverter(response.value)
    })
  }
}

export { AuthenticationController }
