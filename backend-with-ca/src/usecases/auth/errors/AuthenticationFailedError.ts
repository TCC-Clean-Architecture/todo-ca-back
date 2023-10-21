export class AuthenticationFailedError extends Error {
  public readonly name = 'AuthenticationFailedError'
  constructor () {
    super('Authentication failed.')
  }
}
