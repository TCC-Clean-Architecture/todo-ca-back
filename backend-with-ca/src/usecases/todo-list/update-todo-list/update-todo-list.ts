import { type ITodoList, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { type InvalidTodosOnList } from '@/entities/todo-list/errors/invalid-todos-on-list'
import { type InvalidUserIdError } from '@/entities/todo-list/errors/invalid-user-id'
import { TodoList } from '@/entities/todo-list/todo-list'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'

import { TodoListNotFoundError } from '../shared/errors/todo-list-not-found-error'

class UpdateTodoListUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  async execute (todoListId: string, content: Partial<ITodoList>): Promise<Either<TodoListNotFoundError | InvalidTodoListName | InvalidTodosOnList | InvalidUserIdError | UnexpectedError, ITodoListWithId>> {
    try {
      const todoListExists = await this.todoListRepository.findById(todoListId)
      if (!todoListExists) {
        return left(new TodoListNotFoundError(todoListId))
      }
      const todoListValidation = TodoList.validate({
        ...todoListExists,
        ...content
      })
      if (todoListValidation.isLeft()) {
        return left(todoListValidation.value)
      }
      const updateResult = await this.todoListRepository.update(todoListId, content)
      if (!updateResult) {
        return left(new TodoListNotFoundError(todoListId))
      }
      const result = await this.todoListRepository.findById(todoListId) as ITodoListWithId
      return right(result)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to find todo list by id'))
    }
  }
}

export {
  UpdateTodoListUseCase
}
