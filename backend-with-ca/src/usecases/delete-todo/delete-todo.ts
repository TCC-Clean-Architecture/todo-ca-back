import { type Either, right } from '../../shared/either'
import { type ITodoRepository } from '../shared/ports/todo-repository'
import { type IUseCase } from '../shared/ports/use-case'

class DeleteTodoUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todoId: string): Promise<Either<void, string>> {
    const result = await this.todoRepository.delete(todoId)
    return right(result)
  }
}

export { DeleteTodoUseCase }
