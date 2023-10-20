import { TodosEmbedded } from '@/entities/todo-list/todos-embedded'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

class DeleteTodoUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  public async execute (todoId: string, listId: string, userId: string): Promise<Either<TodoListNotFoundError | TodoNotFoundError | UnexpectedError, string>> {
    try {
      const list = await this.todoListRepository.findById(listId, userId)
      if (!list) {
        return left(new TodoListNotFoundError(listId))
      }
      const todos = new TodosEmbedded(list.todos)
      const result = todos.delete(todoId)
      if (result.isLeft()) {
        return left(new TodoNotFoundError(todoId))
      }
      const todoList = { ...list, todos: todos.getAll() }
      const updatedResult = await this.todoListRepository.update(listId, todoList, userId)
      if (!updatedResult) {
        return left(new UnexpectedError('Could not update the list deleting todo'))
      }
      return right(result.value)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to delete todo'))
    }
  }
}

export { DeleteTodoUseCase }
