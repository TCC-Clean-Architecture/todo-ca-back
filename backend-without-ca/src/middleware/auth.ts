import { type Request, type Response, type NextFunction } from 'express'
import { responseFactory } from '../factories'
import { authenticateService } from '../services/authenticationService'

const verifyToken = (req: Request, res: Response, next: NextFunction): Response | undefined => {
  const token = req.headers.Authorization ?? req.headers['x-access-token']
  if (!token || Array.isArray(token)) {
    return res.status(403).json(responseFactory({
      description: 'A token is required for authentication',
      content: {},
      statusCode: 403
    }))
  }
  const decoded = authenticateService.validate(token)
  if (decoded instanceof Error) {
    return res.status(401).json(responseFactory({
      description: 'Invalid Token',
      content: {},
      statusCode: 401
    }))
  }
  req.tokenData = decoded
}

export { verifyToken }
