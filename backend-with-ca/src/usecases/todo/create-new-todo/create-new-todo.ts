import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { type InvalidTodoDescriptionError, type InvalidTodoNameError, type InvalidTodoStatusError } from '@/entities/todo/errors'
import { type InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { type InvalidTodosOnList } from '@/entities/todo-list/errors/invalid-todos-on-list'
import { TodosEmbedded } from '@/entities/todo-list/todos-embedded'
import { type Either, left, right } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { type IUseCase } from '@/usecases/shared/ports/use-case'
import { type TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

type ErrorTypes = InvalidTodoNameError | InvalidTodoDescriptionError | InvalidTodoStatusError | TodoNotFoundError | InvalidTodosOnList | TodoListNotFoundError | InvalidTodoListName | UnexpectedError

class CreateNewTodoUseCase implements IUseCase {
  private readonly todoListRepository: ITodoListRepository
  constructor (todoListRepository: ITodoListRepository) {
    this.todoListRepository = todoListRepository
  }

  public async execute (todo: ITodo, listId: string): Promise<Either<ErrorTypes, ITodoWithId>> {
    try {
      const list = await this.todoListRepository.findById(listId)
      if (!list) {
        return left(new TodoListNotFoundError(listId))
      }
      const todos = new TodosEmbedded(list.todos)
      const createResult = todos.create(todo)
      if (createResult.isLeft()) {
        return left(createResult.value)
      }
      const todoList = { ...list, todos: todos.getAll() }
      const updatedResult = await this.todoListRepository.update(listId, todoList)
      if (!updatedResult) {
        return left(new UnexpectedError('Could not update the list inserting the todo'))
      }
      return right(createResult.value)
    } catch (err) {
      return left(new UnexpectedError('Something went wrong on attempt to create new todo'))
    }
  }
}

export { CreateNewTodoUseCase }
