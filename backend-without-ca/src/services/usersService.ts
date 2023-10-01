import { type IResponseFactoryPayload, type IUser } from '../interfaces'
import { usersRepository } from '../repositories'
import { responseFactory } from '../factories'

const usersService = {
  register: async (user: IUser): Promise<IResponseFactoryPayload> => {
    const userCreated = await usersRepository.create(user)
    if (!userCreated) {
      return responseFactory({
        statusCode: 500,
        content: {
        },
        description: 'Could not create user, database error'
      })
    }
    delete userCreated.password
    return responseFactory({
      statusCode: 200,
      content: userCreated,
      description: 'User created successfully'
    })
  }
}

export { usersService }
