import { type IUserInserted, type IUser } from '../../interfaces'

interface IUsersRepository {
  create: (user: IUser) => Promise<IUserInserted | null>
}

export type { IUsersRepository }
