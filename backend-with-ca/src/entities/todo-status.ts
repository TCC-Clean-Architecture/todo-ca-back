import { type Either, left, right } from '../shared/either'
import { InvalidTodoStatusError } from './errors/invalid-status-error'
import { availableStatus } from './interfaces/todo'

class TodoStatus {
  public readonly value: string
  constructor (value: string) {
    this.value = value
  }

  public static create (todoStatus: string): Either<InvalidTodoStatusError, TodoStatus> {
    if (!TodoStatus.validate(todoStatus)) {
      return left(new InvalidTodoStatusError(todoStatus))
    }
    return right(new TodoStatus(todoStatus))
  }

  public static validate (todoStatus: string): boolean {
    if (!availableStatus.includes(todoStatus)) {
      return false
    }
    return true
  }
}

export { TodoStatus }
