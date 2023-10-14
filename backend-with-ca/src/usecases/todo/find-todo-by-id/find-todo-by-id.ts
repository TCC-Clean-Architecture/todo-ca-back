import { left, type Either, right } from '../../../shared/either'
import { TodoNotFoundError } from '../create-new-todo/errors/todo-not-found-error'
import { type ITodoWithId } from '../../../entities/interfaces/todo'
import { type ITodoRepository } from '../../../shared/todo-repository'
import { type IUseCase } from '../../shared/ports/use-case'

class FindTodoByIdUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todoId: string): Promise<Either<TodoNotFoundError, ITodoWithId>> {
    const findResult = await this.todoRepository.findById(todoId)
    if (!findResult) {
      return left(new TodoNotFoundError(todoId))
    }
    return right(findResult)
  }
}

export { FindTodoByIdUseCase }
