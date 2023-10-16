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

  public getAll (): ITodoWithId[] {
    return this.value.slice()
  }
}

export { TodosEmbedded }
