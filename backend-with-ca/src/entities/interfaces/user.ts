interface IUser {
  email: string
  password: string
}

interface IUserWithId extends IUser {
  id: string
}

export type { IUser, IUserWithId }
