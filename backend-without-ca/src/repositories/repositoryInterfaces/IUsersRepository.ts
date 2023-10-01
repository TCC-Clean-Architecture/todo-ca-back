import { type IUserInserted, type IUser } from '../../interfaces'

interface IUsersRepository {
  create: (user: IUser) => Promise<IUserInserted | null>
  getByEmail: (email: string) => Promise<Required<IUserInserted> | null>
  deleteAll: () => Promise<void>
}

export type { IUsersRepository }
