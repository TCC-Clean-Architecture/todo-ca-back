import { type ITodo, type ICompleteTodo, type ITodoWithId } from '../../../entities/interfaces/todo'

export interface ITodoRepository {
  create: (todo: ICompleteTodo) => Promise<string>
  findById: (todoId: string) => Promise<ITodoWithId | null>
  findAll: () => Promise<ITodoWithId[]>
  delete: (todoId: string) => Promise<string>
  update: (todoId: string, content: Partial<ITodo>) => Promise<ITodoWithId | null>
}
