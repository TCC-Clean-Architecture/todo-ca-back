import { type ICompleteTodo } from '../../../entities/interfaces/todo'

export interface ITodoWithId extends ICompleteTodo {
  id: string
}
