import { type ObjectId } from 'mongodb'
import { type ITodoCreate } from './todoCreate'

interface ITodoInserted extends ITodoCreate {
  _id: ObjectId | string
  createdAt: Date
}

export type { ITodoInserted }
