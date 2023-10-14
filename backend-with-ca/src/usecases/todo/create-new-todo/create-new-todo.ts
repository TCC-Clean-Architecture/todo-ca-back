import { type Either, right, left } from '@/shared/either'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type ITodoRepository } from '@/shared/todo-repository'
import { type InvalidTodoNameError, type InvalidTodoStatusError, type InvalidTodoDescriptionError } from '@/entities/errors'

import { Todo } from '@/entities/todo/todo'
import { TodoNotFoundError } from '@/usecases/todo/create-new-todo/errors/todo-not-found-error'

type ErrorTypes = InvalidTodoNameError | InvalidTodoDescriptionError | InvalidTodoStatusError | TodoNotFoundError

class CreateNewTodoUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todo: ITodo): Promise<Either<ErrorTypes, ITodoWithId>> {
    const todoInstance = Todo.create(todo)
    if (todoInstance.isLeft()) {
      return left(todoInstance.value)
    }
    const createdId = await this.todoRepository.create(todoInstance.value)
    const todoCreated = await this.todoRepository.findById(createdId)
    if (!todoCreated) {
      return left(new TodoNotFoundError(createdId))
    }
    return right(todoCreated)
  }
}

export { CreateNewTodoUseCase }
