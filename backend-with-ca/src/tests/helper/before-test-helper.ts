import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { MongoUserRepository } from '@/external/repositories/mongo-user-repository'
import { Bcrypt } from '@/external/security/bcrypt'
import { Jwt } from '@/external/security/jwt'

interface IUserAllParams {
  id: string
  name: string
  email: string
  password: string
  token: string
}

const loginTestHelper = async (): Promise<IUserAllParams> => {
  const repository = new MongoUserRepository()
  const hashProvider = new Bcrypt()
  const jwtProvider = new Jwt('abcde')
  const password = await hashProvider.hash('Password100')
  const user = {
    name: 'John Doe',
    email: 'email@email.com',
    password
  }
  const id = await repository.create(user)
  const token = jwtProvider.sign({
    userId: id
  })
  return {
    ...user,
    token,
    id
  }
}

const insertList = async (): Promise<ITodoListWithId> => {
  const repository = new MongoTodoListRepository()
  const id = await repository.create({
    name: 'teste',
    userId: 'userId'
  })
  const list = await repository.findById(id) as ITodoListWithId
  return list
}

export { insertList, loginTestHelper }
