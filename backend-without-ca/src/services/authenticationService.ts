import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { type IResponseFactoryPayload } from '../interfaces'
import { usersRepository } from '../repositories'
import { responseFactory } from '../factories'

interface ITokenPayload extends JwtPayload {
  _id: string
}

const authenticateService = {
  authenticate: async (email: string, password: string): Promise<IResponseFactoryPayload> => {
    const userFound = await usersRepository.getByEmail(email)
    const authenticationFailed = !userFound || !bcrypt.compareSync(password, userFound.password)
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
  },
  validate: (token: string): ITokenPayload | Error => {
    try {
      const decoded = jwt.verify(token, 'abcde') as ITokenPayload
      return decoded
    } catch (err) {
      return new Error('Invalid Token')
    }
  }
}

export { authenticateService }
