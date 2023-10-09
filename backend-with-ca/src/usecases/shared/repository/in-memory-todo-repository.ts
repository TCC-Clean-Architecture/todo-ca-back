import { type ICompleteTodo, type ITodoWithId } from '../../../entities/interfaces/todo'
import { type ITodoRepository } from '../ports/todo-repository'

class InMemoryTodoRepository implements ITodoRepository {
  public readonly repository: ITodoWithId[]
  constructor (initialValue: ITodoWithId[]) {
    this.repository = initialValue
  }

  async create (todo: ICompleteTodo): Promise<string> {
    const id = 'test'
    this.repository.push({
      id,
      ...todo
    })
    return id
  }

  async findById (todoId: string): Promise<ITodoWithId | null> {
    const todo = this.repository.find(item => item.id === todoId)
    return todo ?? null
  }
}

export { InMemoryTodoRepository }
