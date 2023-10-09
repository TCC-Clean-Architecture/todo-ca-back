import { type Either, right, left } from '../../shared/either'
import { type ITodo } from '../../entities/interfaces/todo'
import { type ITodoInserted } from './interfaces/todo-inserted'
import { type ITodoRepository } from './ports/todo-repository'
import { Todo } from '../../entities/todo'
import { type InvalidTodoNameError } from '../../entities/errors/invalid-name-error'
import { type InvalidTodoStatusError } from '../../entities/errors/invalid-status-error'
import { type InvalidTodoDescriptionError } from '../../entities/errors/invalid-description-error'

type ErrorTypes = null | InvalidTodoNameError | InvalidTodoDescriptionError | InvalidTodoStatusError

class CreateNewTodoUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todo: ITodo): Promise<Either<ErrorTypes, ITodoInserted>> {
    const todoInstance = Todo.create(todo)
    if (todoInstance.isLeft()) {
      return left(todoInstance.value)
    }
    const createdId = await this.todoRepository.create(todoInstance.value)
    const todoCreated = await this.todoRepository.findById(createdId)
    if (!todoCreated) {
      return left(null)
    }
    return right(todoCreated)
  }
}

export { CreateNewTodoUseCase }
