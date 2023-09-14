import { type ObjectId } from 'mongodb'
import { type ITodoInserted, type ITodoCreated } from '../interfaces'
import { todoRepository } from '../repositories'

const todoService = {
  create: async (todoInstance: ITodoCreated): Promise<ITodoInserted> => {
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
  }
}

export {
  todoService
}
