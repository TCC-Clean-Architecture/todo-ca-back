interface IUser {
  name: string
  email: string
  password: string
}

interface IUserWithId extends IUser {
  id: string
}

interface IUserAuth {
  email: string
  password: string
}

interface IUserAuthResponse {
  id: string
  name: string
  email: string
  token: string
}

interface IUserWithoutPassword {
  id: string
  name: string
  email: string
}

export type { IUser, IUserAuth, IUserAuthResponse, IUserWithId, IUserWithoutPassword }
