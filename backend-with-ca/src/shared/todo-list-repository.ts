import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'

export interface ITodoListRepository {
  create (todoList: ITodoListOptional): Promise<string>
  findById (todoListId: string, userId: string): Promise<ITodoListWithId | null>
  findAll (userId: string): Promise<ITodoListWithId[]>
  delete (todoListId: string, userId: string): Promise<string | null>
  update (todoListId: string, content: Partial<ITodoListOptional>, userId: string): Promise<string | null>
}
