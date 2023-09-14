import { type ObjectId } from 'mongodb'
import { type ITodoCreated, type ITodoInserted } from '../../interfaces'

interface ITodoRepository {
  create: (todoToInsert: ITodoCreated) => Promise<ITodoInserted>
  listAll: () => Promise<ITodoInserted[] | []>
  removeAll: () => Promise<boolean>
  getById: (id: string | ObjectId) => Promise<ITodoInserted | null>
}

export type {
  ITodoRepository
}
