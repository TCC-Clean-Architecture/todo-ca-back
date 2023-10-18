import { type IUser, type IUserWithId } from '@/entities/interfaces/user'

export interface IUserRepository {
  create (user: IUser): Promise<string>
  findByEmail (email: string): Promise<IUserWithId | null>
}
