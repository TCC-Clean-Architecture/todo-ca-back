import { type Request, type Response } from 'express'
import { responseFactory } from '../factories'
import { authenticateService } from '../services/authenticationService'

const authenticationController = {
  authenticate: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json(responseFactory({
          content: {},
          description: 'Could not authenticate, missing params.',
          statusCode: 400
        }))
      }
      const result = await authenticateService.authenticate(email, password)
      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  }
}

export { authenticationController }
