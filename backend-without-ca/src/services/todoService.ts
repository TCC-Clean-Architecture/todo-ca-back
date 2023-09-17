import { type ObjectId } from 'mongodb'
import { type ITodoInserted, type ITodoBeforeInsert } from '../interfaces'
import { todoRepository } from '../repositories'

const todoService = {
  create: async (todoInstance: ITodoBeforeInsert): Promise<ITodoInserted> => {
    const result = await todoRepository.create(todoInstance)
    return result
  },
  list: async (): Promise<ITodoInserted[]> => {
    const result = await todoRepository.listAll()
    return result
  },
  getById: async (id: string | ObjectId): Promise<ITodoInserted | null> => {
    const result = await todoRepository.getById(id)
    return result
  },
  delete: async (id: string | ObjectId): Promise<ObjectId | string | null> => {
    const result = await todoRepository.delete(id)
    return result
  },
  update: async (id: string | ObjectId, content: Omit<ITodoInserted, '_id'>): Promise<ITodoInserted | null> => {
    const result = await todoRepository.update(id, content)
    return result
  }
}

export {
  todoService
}
