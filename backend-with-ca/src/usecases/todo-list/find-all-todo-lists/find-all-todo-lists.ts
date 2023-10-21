import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'

class FindAllTodoListsUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  async execute (userId: string): Promise<Either< UnexpectedError, ITodoListWithId[]>> {
    try {
      const todoListsFound = await this.todoListRepository.findAll(userId)
      return right(todoListsFound)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to find all todo lists'))
    }
  }
}

export {
  FindAllTodoListsUseCase
}
