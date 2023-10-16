import { faker } from '@faker-js/faker'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'

import { todoFixture } from './todo-fixture'

const todoListFixture = (): ITodoListWithId => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    todos: [todoFixture()]
  }
}

export {
  todoListFixture
}
