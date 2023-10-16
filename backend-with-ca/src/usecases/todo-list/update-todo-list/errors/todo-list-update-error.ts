export class TodoListUpdateError extends Error {
  public readonly name = 'TodoListUpdateError'
  constructor (todoListId: string) {
    super('Todo list update error: ' + todoListId + '.')
  }
}
