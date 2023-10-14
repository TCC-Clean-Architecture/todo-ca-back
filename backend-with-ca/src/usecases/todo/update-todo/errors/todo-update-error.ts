export class TodoUpdateError extends Error {
  public readonly name = 'TodoUpdateError'
  constructor (todoId: string) {
    super('Todo update error: ' + todoId + '.')
  }
}
