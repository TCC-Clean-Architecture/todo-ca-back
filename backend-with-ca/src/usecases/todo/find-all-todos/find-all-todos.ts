import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

class FindAllTodoUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  public async execute (listId: string): Promise<Either<TodoListNotFoundError | UnexpectedError, ITodoListWithId>> {
    try {
      const list = await this.todoListRepository.findById(listId)
      if (!list) {
        return left(new TodoListNotFoundError(listId))
      }
      return right(list)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on list all todos'))
    }
  }
}

export { FindAllTodoUseCase }
