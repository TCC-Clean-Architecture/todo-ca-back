import { type ICompleteTodo, type ITodoWithId } from '../../../entities/interfaces/todo'

export interface ITodoRepository {
  create: (todo: ICompleteTodo) => Promise<string>
  findById: (todoId: string) => Promise<ITodoWithId | null>
  findAll: () => Promise<ITodoWithId[]>
}
