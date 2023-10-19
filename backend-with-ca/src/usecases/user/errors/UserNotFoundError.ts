export class UserNotFoundError extends Error {
  public readonly name = 'UserNotFoundError'
  constructor (email: string) {
    super('User not found: ' + email + '.')
  }
}
