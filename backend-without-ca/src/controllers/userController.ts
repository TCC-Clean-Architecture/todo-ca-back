import { type Request, type Response } from 'express'
import { responseFactory, userFactory } from '../factories'
import { type IUser } from '../interfaces'
import { usersService } from '../services/usersService'

const userController = {
  post: async (req: Request, res: Response) => {
    try {
      const { body } = req
      const user = userFactory(body) as IUser
      if (user instanceof Error) {
        return res.status(400).json(responseFactory({
          statusCode: 400,
          description: 'Could not create user, missing params.',
          content: {
            error: user.message
          }
        }))
      }
      const result = await usersService.register(user)
      res.status(200).json(responseFactory(result))
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

export { userController }
