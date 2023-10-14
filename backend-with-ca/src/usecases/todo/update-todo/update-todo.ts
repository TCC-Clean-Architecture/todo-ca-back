import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type Either, left, right } from '@/shared/either'
import { type ITodoRepository } from '@/shared/todo-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { TodoNotFoundError } from '@/usecases/todo/create-new-todo/errors/todo-not-found-error'

class UpdateTodoUseCase implements IUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todoId: string, content: Partial<ITodo>): Promise<Either<TodoNotFoundError, ITodoWithId>> {
    const updateResult = await this.todoRepository.update(todoId, content)
    if (!updateResult) {
      return left(new TodoNotFoundError(todoId))
    }
    const result = await this.todoRepository.findById(todoId) as ITodoWithId
    return right(result)
  }
}

export { UpdateTodoUseCase }
