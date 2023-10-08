import { type ITodo } from '../../../entities/interfaces/todo'

export interface ITodoInserted extends ITodo {
  id: string
  createdAt: Date
}
