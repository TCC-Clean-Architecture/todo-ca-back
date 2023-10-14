import crypto from 'crypto'
import { type ITodo, type ICompleteTodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type ITodoRepository } from '@/shared/todo-repository'

class InMemoryTodoRepository implements ITodoRepository {
  public repository: ITodoWithId[]
  constructor (initialValue: ITodoWithId[]) {
    this.repository = initialValue
  }

  async create (todo: ICompleteTodo): Promise<string> {
    const id = crypto.randomUUID()
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

  async findAll (): Promise<ITodoWithId[]> {
    return this.repository
  }

  async delete (todoId: string): Promise<string> {
    const filteredRepository = this.repository.filter(todo => todo.id !== todoId)
    this.repository = filteredRepository
    return todoId
  }

  async update (todoId: string, content: Partial<ITodo>): Promise<string | null> {
    const index = this.repository.findIndex(todo => todo.id === todoId)
    if (index === -1) {
      return null
    }
    const updatedContent = {
      ...this.repository[index],
      ...content
    }
    this.repository[index] = updatedContent
    return todoId
  }
}

export { InMemoryTodoRepository }
