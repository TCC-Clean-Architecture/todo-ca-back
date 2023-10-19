import { MongoUserRepository } from '@/external/repositories/mongo-user-repository'
import { Bcrypt } from '@/external/security/bcrypt'
import { Jwt } from '@/external/security/jwt'
import { AuthenticationUseCase } from '@/usecases/auth/authentication'
import { AuthenticationController } from '@/web-controllers/auth/authentication-controller'

const makeCreateAuthenticationController = (): AuthenticationController => {
  const repository = new MongoUserRepository()
  const hashProvider = new Bcrypt()
  const jwtProvider = new Jwt('abcde')
  const useCase = new AuthenticationUseCase(repository, hashProvider, jwtProvider)
  const controller = new AuthenticationController(useCase)
  return controller
}

export { makeCreateAuthenticationController }
