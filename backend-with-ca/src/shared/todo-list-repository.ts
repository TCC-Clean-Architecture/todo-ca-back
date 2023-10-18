import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'

export interface ITodoListRepository {
  create (todoList: ITodoListOptional): Promise<string>
  findById (todoListId: string): Promise<ITodoListWithId | null>
  findAll (): Promise<ITodoListWithId[]>
  delete (todoListId: string): Promise<string | null>
  update (todoListId: string, content: Partial<ITodoListOptional>): Promise<string | null>
}
