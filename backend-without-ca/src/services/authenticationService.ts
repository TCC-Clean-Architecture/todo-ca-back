import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { type IResponseFactoryPayload } from '../interfaces'
import { usersRepository } from '../repositories'
import { responseFactory } from '../factories'

const authenticateService = {
  authenticate: async (email: string, password: string): Promise<IResponseFactoryPayload> => {
    const userFound = await usersRepository.getByEmail(email)
    const authenticationFailed = !userFound || !bcrypt.compareSync(password, userFound?.password)
    if (authenticationFailed) {
      return responseFactory({
        statusCode: 400,
        content: {
        },
        description: 'Authentication failed'
      })
    }
    const token = jwt.sign({
      id: userFound._id
    }, 'abcde')
    return responseFactory({
      description: 'User authenticated',
      content: {
        _id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        token
      },
      statusCode: 200
    })
  }
}

export { authenticateService }
