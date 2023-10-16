import { type Either, left, right } from '@/shared/either'

import { type ITodoWithId } from '../interfaces/todo'
import { type ITodoList, type ITodoListOptional } from '../interfaces/todo-list'
import { type InvalidTodoListName } from './errors/invalid-todo-list-name'
import { InvalidTodosOnList } from './errors/invalid-todos-on-list'
import { TodoListName } from './todo-list-name'
import { TodosEmbedded } from './todos-embedded'

class TodoList {
  public readonly name: string
  public readonly todos: ITodoWithId[]
  constructor (name: TodoListName, todos: TodosEmbedded) {
    this.name = name.value
    this.todos = todos.getAll()
  }

  static create (value: ITodoListOptional): Either<InvalidTodoListName, TodoList> {
    const todoListName = TodoListName.create(value.name)
    if (todoListName.isLeft()) {
      return left(todoListName.value)
    }
    const todosEmbedded = new TodosEmbedded(value.todos ?? [])

    return right(new TodoList(todoListName.value, todosEmbedded))
  }

  static validate (value: ITodoList): Either<InvalidTodoListName | InvalidTodosOnList, TodoList> {
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

    return right(new TodoList(todoListName.value, todoEmbedded))
  }
}

export {
  TodoList
}
