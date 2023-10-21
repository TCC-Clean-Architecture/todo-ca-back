export class UserAlreadyExists extends Error {
  public readonly name = 'UserAlreadyExists'
  constructor (email: string) {
    super('User already exists: ' + email + '.')
  }
}
