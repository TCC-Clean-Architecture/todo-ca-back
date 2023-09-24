import { type ObjectId } from 'mongodb'
import { type ITodoInserted } from './todoInterfaces'

interface ITodoList {
  name: string
  todos?: ITodoInserted[]
}

interface ITodoListBeforeInsert extends Required<ITodoList> {
  createdAt: Date
}

interface ITodoListInserted extends ITodoListBeforeInsert {
  _id: ObjectId | string
}

export type {
  ITodoList,
  ITodoListBeforeInsert,
  ITodoListInserted
}
