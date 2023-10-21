export class InvalidPasswordError extends Error {
  public readonly name = 'InvalidPasswordError'
  constructor () {
    super('Weak password Password.')
  }
}
