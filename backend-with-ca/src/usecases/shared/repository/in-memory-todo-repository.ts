import { type ITodo } from '../../../entities/interfaces/todo'
import { type ITodoWithId } from '../../create-new-todo/interfaces/todo-inserted'
import { type ITodoRepository } from '../ports/todo-repository'

class InMemoryTodoRepository implements ITodoRepository {
  public readonly repository: ITodoWithId[]
  constructor (initialValue: ITodoWithId[]) {
    this.repository = initialValue
  }

  async create (todo: ITodo): Promise<string> {
    const id = 'test'
    this.repository.push({
      id,
      ...todo,
      createdAt: new Date()
    })
    return id
  }

  async findById (todoId: string): Promise<ITodoWithId | null> {
    const todo = this.repository.find(item => item.id === todoId)
    return todo ?? null
  }
}

export { InMemoryTodoRepository }
