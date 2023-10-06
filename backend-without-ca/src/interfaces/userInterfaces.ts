import { type Id } from './ids'

interface IUser {
  name: string
  email: string
  password: string
}

interface IUserInserted extends Omit<IUser, 'password'> {
  _id: Id
  password?: string
}

interface IUserInsertedWithToken extends IUserInserted {
  token: string
}

export type { IUser, IUserInserted, IUserInsertedWithToken }
