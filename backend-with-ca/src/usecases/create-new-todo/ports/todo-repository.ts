import { type ITodo } from '../../../entities/interfaces/todo'
import { type ITodoInserted } from '../interfaces/todo-inserted'

export interface ITodoRepository {
  create: (todo: ITodo) => Promise<string>
  findById: (todoId: string) => Promise<ITodoInserted | null>
}
