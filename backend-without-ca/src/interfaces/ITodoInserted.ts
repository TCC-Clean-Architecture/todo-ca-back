import { type ObjectId } from 'mongodb'
import { type ITodoPayload } from './todoInterfaces'

interface ITodoInserted extends ITodoPayload {
  _id: ObjectId | string
  createdAt: Date
}

export type { ITodoInserted }
