import { type ITodo } from './todo'

export interface ITodoInserted extends ITodo {
  id: string
  createdAt: Date
}
