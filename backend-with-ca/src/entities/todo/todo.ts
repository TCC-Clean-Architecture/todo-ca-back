import { type AvailableStatus, type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type InvalidTodoDescriptionError, type InvalidTodoNameError, type InvalidTodoStatusError } from '@/entities/todo/errors'
import { TodoDescription } from '@/entities/todo/todo-description'
import { TodoName } from '@/entities/todo/todo-name'
import { TodoStatus } from '@/entities/todo/todo-status'
import { type Either, left, right } from '@/shared/either'

import { InvalidIdError } from '../id/errors/id-validation-error'
import { Id } from '../id/id'

type ErrorTypes = InvalidTodoStatusError | InvalidTodoNameError | InvalidTodoDescriptionError
interface IStaticValidationSuccessReturn {
  todoName: TodoName
  todoDescription: TodoDescription
  todoStatus: TodoStatus
}

class Todo {
  public readonly name: string
  public readonly description: string
  public readonly status: AvailableStatus
  public readonly id: string
  public readonly createdAt: Date

  constructor (name: TodoName, description: TodoDescription, status: TodoStatus, id?: Id, createdAt?: Date) {
    this.name = name.value
    this.description = description.value
    this.status = status.value
    this.id = id?.value ?? Id.create().value
    this.createdAt = createdAt ?? new Date()
  }

  static create (value: ITodo): Either<ErrorTypes, Todo> {
    const validationResult = this._validateDefaultParams({
      name: value.name,
      description: value.description,
      status: value.status
    })
    if (validationResult.isLeft()) {
      return left(validationResult.value)
    }
    return right(new Todo(validationResult.value.todoName, validationResult.value.todoDescription, validationResult.value.todoStatus))
  }

  static validate (value: ITodoWithId): Either<ErrorTypes | InvalidIdError, Todo> {
    const validationResult = this._validateDefaultParams({
      name: value.name,
      description: value.description,
      status: value.status
    })
    if (validationResult.isLeft()) {
      return left(validationResult.value)
    }
    const idValidation = Id.validate(value.id)
    if (!idValidation) {
      return left(new InvalidIdError(value.id))
    }
    const id = Id.create(value.id)
    return right(new Todo(validationResult.value.todoName, validationResult.value.todoDescription, validationResult.value.todoStatus, id, value.createdAt))
  }

  static _validateDefaultParams (value: ITodo): Either<ErrorTypes, IStaticValidationSuccessReturn> {
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
    return right({
      todoName: todoName.value,
      todoDescription: todoDescription.value,
      todoStatus: todoStatus.value
    })
  }
}

export { Todo }
