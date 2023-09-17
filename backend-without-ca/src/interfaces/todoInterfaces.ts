import { type ObjectId } from 'mongodb'

interface ITodoBase {
  name: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
}

interface ITodoBeforeInsert extends ITodoBase {
  createdAt: Date
}

interface ITodoInserted extends ITodoBeforeInsert {
  _id: ObjectId | string
}

export type { ITodoBase, ITodoBeforeInsert, ITodoInserted }
