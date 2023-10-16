import { type InvalidIdError } from '@/entities/id/errors/id-validation-error'
import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type InvalidTodoDescriptionError, type InvalidTodoNameError, type InvalidTodoStatusError } from '@/entities/todo/errors'
import { Todo } from '@/entities/todo/todo'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoRepository } from '@/shared/todo-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'

import { TodoUpdateError } from './errors/todo-update-error'

type ErrorTypes = InvalidTodoNameError | InvalidTodoDescriptionError | InvalidTodoStatusError | TodoNotFoundError | TodoUpdateError | InvalidIdError | UnexpectedError

class UpdateTodoUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todoId: string, content: Partial<ITodo>): Promise<Either<ErrorTypes, ITodoWithId>> {
    try {
      const todoExists = await this.todoRepository.findById(todoId)
      if (!todoExists) {
        return left(new TodoNotFoundError(todoId))
      }
      const todoValidation = Todo.validate({
        ...todoExists, ...content
      })
      if (todoValidation.isLeft()) {
        return left(todoValidation.value)
      }
      const updateResult = await this.todoRepository.update(todoId, content)
      if (!updateResult) {
        return left(new TodoUpdateError(todoId))
      }
      const result = await this.todoRepository.findById(todoId) as ITodoWithId
      return right(result)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to update todo'))
    }
  }
}

export { UpdateTodoUseCase }
