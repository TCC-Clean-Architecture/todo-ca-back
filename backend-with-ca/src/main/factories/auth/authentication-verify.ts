import { Jwt } from '@/external/security/jwt'
import { VerifyAuthenticationUseCase } from '@/usecases/auth/verify-authentication'

const makeAuthenticationVerifyUseCase = (): VerifyAuthenticationUseCase => {
  const jwtProvider = new Jwt('abcde')
  const useCase = new VerifyAuthenticationUseCase(jwtProvider)
  return useCase
}

export { makeAuthenticationVerifyUseCase }
