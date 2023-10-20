import { type Either, left, right } from '@/shared/either'

import { type ITodoWithId } from '../interfaces/todo'
import { type ITodoList, type ITodoListOptional } from '../interfaces/todo-list'
import { type InvalidTodoListName } from './errors/invalid-todo-list-name'
import { InvalidTodosOnList } from './errors/invalid-todos-on-list'
import { InvalidUserIdError } from './errors/invalid-user-id'
import { TodoListName } from './todo-list-name'
import { TodosEmbedded } from './todos-embedded'

class TodoList {
  public readonly name: string
  public readonly todos: ITodoWithId[]
  public readonly userId: string
  constructor (name: TodoListName, todos: TodosEmbedded, userId: string) {
    this.name = name.value
    this.todos = todos.getAll()
    this.userId = userId
  }

  static create (value: ITodoListOptional): Either<InvalidTodoListName | InvalidUserIdError, TodoList> {
    const todoListName = TodoListName.create(value.name)
    if (todoListName.isLeft()) {
      return left(todoListName.value)
    }
    const todosEmbedded = new TodosEmbedded(value.todos ?? [])
    if (!value.userId) {
      return left(new InvalidUserIdError())
    }

    return right(new TodoList(todoListName.value, todosEmbedded, value.userId))
  }

  static validate (value: ITodoList): Either<InvalidTodoListName | InvalidTodosOnList | InvalidUserIdError, TodoList> {
    const todoListName = TodoListName.create(value.name)
    if (todoListName.isLeft()) {
      return left(todoListName.value)
    }
    const todoEmbedded = new TodosEmbedded([])
    try {
      value.todos.forEach((todo) => {
        const createResult = todoEmbedded.createTodoWithId(todo)
        if (createResult.isLeft()) {
          throw new InvalidTodosOnList()
        }
      })
    } catch (err) {
      return left(new InvalidTodosOnList())
    }
    if (!value.userId) {
      return left(new InvalidUserIdError())
    }

    return right(new TodoList(todoListName.value, todoEmbedded, value.userId))
  }
}

export {
  TodoList
}
