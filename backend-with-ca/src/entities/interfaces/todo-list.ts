import { type ITodoWithId } from './todo'

interface ITodoList {
  name: string
  userId: string
  todos: ITodoWithId[]
}

interface ITodoListCreate {
  name: string
  userId: string
  todos?: ITodoWithId[]
}

interface ITodoListOptional {
  name: string
  todos?: ITodoWithId[]
}

interface ITodoListWithId extends ITodoList {
  id: string
}

interface IListId {
  listId: string
}

export type {
  IListId,
  ITodoList,
  ITodoListCreate,
  ITodoListOptional,
  ITodoListWithId
}
