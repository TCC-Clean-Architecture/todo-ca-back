import { type Either, right, left } from '../shared/either'
import { type InvalidTodoDescriptionError } from './errors/invalid-description-error'
import { type InvalidTodoNameError } from './errors/invalid-name-error'
import { type InvalidTodoStatusError } from './errors/invalid-status-error'
import { type AvailableStatus, type ITodo } from './interfaces/todo'
import { TodoDescription } from './todo-description'
import { TodoName } from './todo-name'
import { TodoStatus } from './todo-status'

class Todo {
  public readonly name: string
  public readonly description: string
  public readonly status: AvailableStatus
  public readonly createdAt: Date

  constructor (name: TodoName, description: TodoDescription, status: TodoStatus, createdAt?: Date) {
    this.name = name.value
    this.description = description.value
    this.status = status.value
    this.createdAt = createdAt ?? new Date()
  }

  static create (value: ITodo): Either<InvalidTodoStatusError | InvalidTodoNameError | InvalidTodoDescriptionError, Todo> {
    const todoName = TodoName.create(value.name)
    if (todoName.isLeft()) {
      return left(todoName.value)
    }
    const todoDescription = TodoDescription.create(value.description)
    if (todoDescription.isLeft()) {
      return left(todoDescription.value)
    }
    const todoStatus = TodoStatus.create(value.status)
    if (todoStatus.isLeft()) {
      return left(todoStatus.value)
    }
    return right(new Todo(todoName.value, todoDescription.value, todoStatus.value))
  }
}

export { Todo }
