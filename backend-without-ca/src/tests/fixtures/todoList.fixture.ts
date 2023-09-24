import { faker } from '@faker-js/faker'
import { type ITodoListInserted } from '../../interfaces'

const todoListFixture = (data?: Partial<ITodoListInserted>): ITodoListInserted => {
  return {
    name: faker.lorem.text(),
    _id: data?._id ?? faker.string.uuid(),
    createdAt: new Date(),
    todos: []
  }
}

export {
  todoListFixture
}
