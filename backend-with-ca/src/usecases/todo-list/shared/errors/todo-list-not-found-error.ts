export class TodoListNotFoundError extends Error {
  public readonly name = 'TodoListNotFoundError'
  constructor (todoListId: string) {
    super('Todo list not found: ' + todoListId + '.')
  }
}
