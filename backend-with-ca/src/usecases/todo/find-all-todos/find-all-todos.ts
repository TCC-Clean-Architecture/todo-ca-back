import { type ITodoWithId } from '@/entities/interfaces/todo'
import { type Either, right } from '@/shared/either'
import { type ITodoRepository } from '@/shared/todo-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'

class FindAllTodoUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (): Promise<Either<void, ITodoWithId[]>> {
    const result = await this.todoRepository.findAll()
    return right(result)
  }
}

export { FindAllTodoUseCase }
