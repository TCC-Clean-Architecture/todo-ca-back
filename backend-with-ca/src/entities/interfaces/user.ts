interface IUser {
  name: string
  email: string
  password: string
}

interface IUserWithId extends IUser {
  id: string
}

interface IUserWithoutPassword {
  id: string
  name: string
  email: string
}

export type { IUser, IUserWithId, IUserWithoutPassword }
