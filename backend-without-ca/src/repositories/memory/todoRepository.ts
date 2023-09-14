import crypto from 'crypto'
import { type ITodoCreated, type ITodoInserted } from '../../interfaces'
import { type ITodoRepository } from '../repositoryInterfaces'
import { type ObjectId } from 'mongodb'
console.log('Memory repository in use')
let todoInMemory: ITodoInserted[] = []

function convertToInsertedHelper (item: ITodoCreated): ITodoInserted {
  return {
    _id: crypto.randomUUID(),
    ...item
  }
}

const todoRepository: ITodoRepository = {
  create: async (todoToInsert: ITodoCreated): Promise<ITodoInserted> => {
    todoInMemory.push(convertToInsertedHelper(todoToInsert))
    return todoInMemory[todoInMemory.length - 1]
  },
  listAll: async (): Promise<ITodoInserted[] | []> => {
    return todoInMemory
  },
  removeAll: async (): Promise<boolean> => {
    todoInMemory.splice(0, todoInMemory.length)
    return todoInMemory.length === 0
  },
  getById: async (id: string | ObjectId): Promise<ITodoInserted | null> => {
    const result = todoInMemory.find(todo => todo._id === id)
    if (result === undefined) {
      return null
    }
    return result
  },
  delete: async (id: string | ObjectId): Promise<ObjectId | string | null> => {
    const hasItem = todoInMemory.find(item => item._id === id)
    if (!hasItem) {
      return null
    }
    todoInMemory = todoInMemory.filter(todo => todo._id !== id)
    return id
  },
  update: async (id: string | ObjectId, content: Omit<ITodoInserted, '_id'>): Promise<ITodoInserted | null> => {
    todoInMemory = todoInMemory.map(todo => {
      if (todo._id === id) {
        return {
          _id: id,
          ...content
        }
      } else {
        return todo
      }
    })

    const result = todoInMemory.find(todo => todo._id === id)
    if (result === undefined) {
      return null
    }
    return result
  }
}

export { todoRepository }
