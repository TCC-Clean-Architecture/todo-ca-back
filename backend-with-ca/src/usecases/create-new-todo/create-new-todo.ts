import { type Either, right, left } from '../../shared/either'
import { type ITodo } from '../../entities/interfaces/todo'
import { type ITodoInserted } from './interfaces/todo-inserted'
import { type ITodoRepository } from './ports/todo-repository'
import { Todo } from '../../entities/todo'

class CreateNewTodoUseCase {
  private readonly todoRepository: ITodoRepository
  constructor (todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository
  }

  public async execute (todo: ITodo): Promise<Either<null, ITodoInserted>> {
    const todoInstance = Todo.create(todo)
    if (todoInstance.isLeft()) {
      return left(null)
    }
    const createdId = await this.todoRepository.create(todoInstance.value)
    const result = await this.todoRepository.findById(createdId)
    if (!createdId || !result) {
      return left(null)
    }
    return right(result)
  }
}

export { CreateNewTodoUseCase }
