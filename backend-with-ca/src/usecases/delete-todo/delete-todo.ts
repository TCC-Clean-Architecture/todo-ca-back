import { type Either, right, left } from '../../shared/either'
import { TodoNotFoundError } from '../create-new-todo/errors/todo-not-found-error'
import { type ITodoRepository } from '../shared/ports/todo-repository'
import { type IUseCase } from '../shared/ports/use-case'

class DeleteTodoUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todoId: string): Promise<Either<TodoNotFoundError, string>> {
    const todoExists = await this.todoRepository.findById(todoId)
    if (!todoExists) {
      return left(new TodoNotFoundError(todoId))
    }
    const result = await this.todoRepository.delete(todoId)
    return right(result)
  }
}

export { DeleteTodoUseCase }
