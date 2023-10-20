import { type ITodoWithId } from '@/entities/interfaces/todo'
import { TodosEmbedded } from '@/entities/todo-list/todos-embedded'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

class FindTodoByIdUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  public async execute (todoId: string, listId: string, userId: string): Promise<Either<TodoListNotFoundError | TodoNotFoundError | UnexpectedError, ITodoWithId>> {
    try {
      const list = await this.todoListRepository.findById(listId, userId)
      if (!list) {
        return left(new TodoListNotFoundError(listId))
      }
      const todos = new TodosEmbedded(list.todos)
      const result = todos.findById(todoId)
      if (result.isLeft()) {
        return left(new TodoNotFoundError(todoId))
      }
      return right(result.value)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to find todo by id'))
    }
  }
}

export { FindTodoByIdUseCase }
