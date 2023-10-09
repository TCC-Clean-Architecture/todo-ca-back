import { type ICompleteTodo } from '../../../entities/interfaces/todo'
import { type ITodoWithId } from '../../create-new-todo/interfaces/todo-inserted'

export interface ITodoRepository {
  create: (todo: ICompleteTodo) => Promise<string>
  findById: (todoId: string) => Promise<ITodoWithId | null>
}
