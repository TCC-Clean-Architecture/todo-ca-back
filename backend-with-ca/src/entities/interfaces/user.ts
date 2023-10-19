interface IUser {
  email: string
  password: string
}

interface IUserWithId extends IUser {
  id: string
}

interface IUserWithoutPassword {
  id: string
  email: string
}

export type { IUser, IUserWithId, IUserWithoutPassword }
