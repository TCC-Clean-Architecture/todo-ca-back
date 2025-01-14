import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { type InvalidUserIdError } from '@/entities/todo-list/errors/invalid-user-id'
import { TodoList } from '@/entities/todo-list/todo-list'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'

class CreateNewTodoListUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  async execute (todoList: ITodoListOptional, userId: string): Promise<Either<InvalidTodoListName | InvalidUserIdError | UnexpectedError, ITodoListWithId>> {
    try {
      const todoListInstance = TodoList.create({ ...todoList, userId })
      if (todoListInstance.isLeft()) {
        return left(todoListInstance.value)
      }
      const todoListId = await this.todoListRepository.create(todoListInstance.value)
      const todoListCreated = await this.todoListRepository.findById(todoListId, userId) as ITodoListWithId
      return right(todoListCreated)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to create new todo list'))
    }
  }
}

export {
  CreateNewTodoListUseCase
}
