import { type InvalidIdError } from '@/entities/id/errors/id-validation-error'
import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type InvalidTodoDescriptionError, type InvalidTodoNameError, type InvalidTodoStatusError } from '@/entities/todo/errors'
import { TodosEmbedded } from '@/entities/todo-list/todos-embedded'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { type TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

import { type TodoUpdateError } from './errors/todo-update-error'

type ErrorTypes = TodoListNotFoundError | InvalidTodoNameError | InvalidTodoDescriptionError | InvalidTodoStatusError | TodoNotFoundError | TodoUpdateError | InvalidIdError | UnexpectedError

class UpdateTodoUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  public async execute (todoId: string, listId: string, content: Partial<ITodo>): Promise<Either<ErrorTypes, ITodoWithId>> {
    try {
      const list = await this.todoListRepository.findById(listId)
      if (!list) {
        return left(new TodoListNotFoundError(listId))
      }
      const todos = new TodosEmbedded(list.todos)
      const todoUpdateResult = todos.update(todoId, content)
      if (todoUpdateResult.isLeft()) {
        return left(todoUpdateResult.value)
      }
      const updateResult = await this.todoListRepository.update(listId, {
        ...list,
        todos: todos.getAll()
      })
      if (!updateResult) {
        return left(new TodoListNotFoundError(listId))
      }
      return right(todoUpdateResult.value)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to update todo'))
    }
  }
}

export { UpdateTodoUseCase }
