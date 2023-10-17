import { type Either, left, right } from '@/shared/either'

import { type InvalidIdError } from '../id/errors/id-validation-error'
import { type ITodo, type ITodoWithId } from '../interfaces/todo'
import { type InvalidTodoDescriptionError, type InvalidTodoNameError, type InvalidTodoStatusError } from '../todo/errors'
import { Todo } from '../todo/todo'

class TodosEmbedded {
  private readonly value: ITodoWithId[]
  constructor (initialValue: ITodoWithId[] = []) {
    this.value = initialValue
  }

  public create (todo: ITodo): Either<InvalidTodoStatusError | InvalidTodoDescriptionError | InvalidTodoNameError, ITodoWithId> {
    const result = Todo.create(todo)
    if (result.isLeft()) {
      return left(result.value)
    }
    this.value.push(result.value)
    return right(result.value)
  }

  public createTodoWithId (todo: ITodoWithId): Either<InvalidTodoStatusError | InvalidTodoDescriptionError | InvalidTodoNameError | InvalidIdError, ITodoWithId> {
    const result = Todo.validate(todo)
    if (result.isLeft()) {
      return left(result.value)
    }
    this.value.push(result.value)
    return right(result.value)
  }

  public delete (todoId: string): Either<null, string> {
    const todoIndex = this.value.findIndex(todo => todo.id === todoId)
    if (todoIndex < 0) {
      return left(null)
    }
    this.value.splice(todoIndex, 1)
    return right(todoId)
  }

  public findById (todoId: string): Either<null, ITodoWithId> {
    const todoIndex = this.value.findIndex(todo => todo.id === todoId)
    if (todoIndex < 0) {
      return left(null)
    }
    return right(this.value[todoIndex])
  }

  public update (todoId: string, content: Partial<ITodo>): Either<null, ITodoWithId> {
    const todoIndex = this.value.findIndex(todo => todo.id === todoId)
    if (todoIndex < 0) {
      return left(null)
    }
    const newTodoContent = {
      ...this.value[todoIndex],
      ...content
    }
    this.value[todoIndex] = newTodoContent
    return right(newTodoContent)
  }

  public getAll (): ITodoWithId[] {
    return this.value.slice()
  }
}

export { TodosEmbedded }
