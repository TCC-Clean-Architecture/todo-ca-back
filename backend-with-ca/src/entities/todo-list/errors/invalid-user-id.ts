export class InvalidUserIdError extends Error {
  public readonly name = 'InvalidUserIdError'
  constructor () {
    super('Invalid userId.')
  }
}
