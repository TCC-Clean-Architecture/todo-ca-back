import { type ITodoInserted } from './todoInterfaces'
import { type Id } from './ids'

interface ITodoList {
  name: string
  todos?: ITodoInserted[]
}

interface ITodoListBeforeInsert extends Required<ITodoList> {
  createdAt: Date
  userId: Id
}

interface ITodoListInserted extends ITodoListBeforeInsert {
  _id: Id
}

export type {
  ITodoList,
  ITodoListBeforeInsert,
  ITodoListInserted
}
