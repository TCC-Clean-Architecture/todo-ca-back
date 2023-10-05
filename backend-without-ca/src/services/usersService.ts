import { type IResponseFactoryPayload, type IUser } from '../interfaces'
import { usersRepository } from '../repositories'

const usersService = {
  register: async (user: IUser): Promise<IResponseFactoryPayload> => {
    const userFound = await usersRepository.getByEmail(user.email)
    if (userFound) {
      return {
        statusCode: 400,
        content: {
        },
        description: 'User already exists'
      }
    }
    const userCreated = await usersRepository.create(user)
    if (!userCreated) {
      return {
        statusCode: 500,
        content: {
        },
        description: 'Could not create user, database error'
      }
    }
    delete userCreated.password
    return {
      statusCode: 200,
      content: userCreated,
      description: 'User created successfully'
    }
  }
}

export { usersService }
