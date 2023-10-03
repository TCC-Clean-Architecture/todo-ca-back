import { type ITodoListBeforeInsert, type ITodoInserted, type ITodoListInserted, type Id } from '../../interfaces'

interface ITodoRepository {
  listAll: (listId: Id) => Promise<ITodoInserted[] | []>
  getById: (listId: Id, todoId: Id) => Promise<ITodoInserted | null>
  createTodoList: (todoListToInsert: ITodoListBeforeInsert) => Promise<ITodoListInserted>
  getTodoLists: (userId: Id) => Promise<ITodoListInserted[]>
  getTodoListById: (id: Id) => Promise<ITodoListInserted | null>
  updateTodoList: (id: Id, content: ITodoListBeforeInsert) => Promise<ITodoListInserted | null>
  removeAllTodoLists: () => Promise<boolean>
  deleteList: (id: Id, userId: Id) => Promise<boolean>
}

export type {
  ITodoRepository
}
