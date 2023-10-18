import { InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { type Either, left, right } from '@/shared/either'

class TodoListName {
  public readonly value: string
  constructor (value: string) {
    this.value = value
  }

  public static create (todoListName: string): Either<InvalidTodoListName, TodoListName> {
    if (!TodoListName.validate(todoListName)) {
      return left(new InvalidTodoListName(todoListName))
    }
    return right(new TodoListName(todoListName))
  }

  public static validate (todoListName: string): boolean {
    if (todoListName.length < 3 || todoListName.length > 150 || (typeof todoListName !== 'string')) {
      return false
    }

    return true
  }
}

export { TodoListName }
