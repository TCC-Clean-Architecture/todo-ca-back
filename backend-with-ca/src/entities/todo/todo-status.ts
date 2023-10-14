import { type Either, left, right } from '../../shared/either'
import { InvalidTodoStatusError } from '../errors'
import { availableStatus, type AvailableStatus } from '../interfaces/todo'

class TodoStatus {
  public readonly value: AvailableStatus
  constructor (value: AvailableStatus) {
    this.value = value
  }

  public static create (todoStatus: AvailableStatus): Either<InvalidTodoStatusError, TodoStatus> {
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
