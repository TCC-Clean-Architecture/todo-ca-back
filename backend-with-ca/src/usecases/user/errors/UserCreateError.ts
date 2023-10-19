export class UserCreateError extends Error {
  public readonly name = 'UserCreateError'
  constructor (email: string) {
    super('User cannot be created: ' + email + '.')
  }
}
