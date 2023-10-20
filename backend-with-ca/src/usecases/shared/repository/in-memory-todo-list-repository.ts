import crypto from 'crypto'

import { type ITodoList, type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type ITodoListRepository } from '@/shared/todo-list-repository'

class InMemoryTodoListRepository implements ITodoListRepository {
  public repository: ITodoListWithId[]
  constructor (initialValue: ITodoListWithId[]) {
    this.repository = initialValue
  }

  async create (todoList: ITodoList): Promise<string> {
    const id = crypto.randomUUID()
    this.repository.push({
      id,
      ...todoList,
      todos: todoList.todos ? todoList.todos : []
    })
    return id
  }

  async findById (todoListId: string, userId: string): Promise<ITodoListWithId | null> {
    const todoList = this.repository.find(item => item.id === todoListId && item.userId === userId)
    return todoList ?? null
  }

  async findAll (userId: string): Promise<ITodoListWithId[]> {
    return this.repository.slice()
  }

  async delete (todoListId: string, userId: string): Promise<string | null> {
    const indexToRemove = this.repository.findIndex(todo => todo.id === todoListId && todo.userId === userId)
    if (indexToRemove < 0) {
      return null
    }
    this.repository.splice(indexToRemove, 1)
    return todoListId
  }

  async update (todoListId: string, content: Partial<ITodoListOptional>, userId: string): Promise<string | null> {
    const index = this.repository.findIndex(todoList => todoList.id === todoListId && todoList.userId === userId)
    if (index === -1) {
      return null
    }
    const updatedContent = {
      ...this.repository[index],
      ...content
    }
    this.repository[index] = updatedContent
    return todoListId
  }
}

export { InMemoryTodoListRepository }
