import { type NextFunction, type Request, type Response } from 'express'

import { forbidden, unauthorized } from '@/web-controllers/helper/http-response-builder'

import { makeAuthenticationVerifyUseCase } from '../factories'

const verify = makeAuthenticationVerifyUseCase()

const validateJwtMiddleware = (req: Request, res: Response, next: NextFunction): Response | undefined => {
  const token = req.headers['x-access-token']
  if (!token || Array.isArray(token)) {
    return res.status(403).json(forbidden({
      description: 'A token is required for authentication',
      content: {}
    }))
  }
  void verify.execute(token).then(decoded => {
    if (decoded.isLeft()) {
      return res.status(401).json(unauthorized({
        description: 'Invalid Token',
        content: {}
      }))
    }
    req.tokenData = decoded.value
    next()
  })
}

export { validateJwtMiddleware }
