export class InvalidIdError extends Error {
  public readonly name = 'InvalidIdError'
  constructor (id: string) {
    super('Invalid id: ' + id + '.')
  }
}
