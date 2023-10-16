import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'

import { TodoListNotFoundError } from '../shared/errors/todo-list-not-found-error'

class DeleteTodoListUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  async execute (todoListId: string): Promise<Either<TodoListNotFoundError | UnexpectedError, string>> {
    try {
      const result = await this.todoListRepository.delete(todoListId)
      if (!result) {
        return left(new TodoListNotFoundError(todoListId))
      }
      return right(result)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to delete todo list'))
    }
  }
}

export {
  DeleteTodoListUseCase
}
