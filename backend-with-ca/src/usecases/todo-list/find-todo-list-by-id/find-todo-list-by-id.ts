import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'

import { TodoListNotFoundError } from '../shared/errors/todo-list-not-found-error'

class FindTodoListByIdUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  async execute (todoListId: string, userId: string): Promise<Either<TodoListNotFoundError | UnexpectedError, ITodoListWithId>> {
    try {
      const todoListFound = await this.todoListRepository.findById(todoListId, userId)
      if (!todoListFound) {
        return left(new TodoListNotFoundError(todoListId))
      }
      return right(todoListFound)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to find todo list by id'))
    }
  }
}

export {
  FindTodoListByIdUseCase
}
