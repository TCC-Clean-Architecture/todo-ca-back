export class InvalidTodoListName extends Error {
  public readonly name = 'InvalidTodoListName'
  constructor (name: string) {
    super('Invalid todo list name: ' + name + '.')
  }
}
