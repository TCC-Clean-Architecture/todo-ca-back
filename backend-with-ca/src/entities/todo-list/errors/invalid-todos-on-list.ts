export class InvalidTodosOnList extends Error {
  public readonly name = 'InvalidTodosOnList'
  constructor () {
    super('Invalid todo on list.')
  }
}
