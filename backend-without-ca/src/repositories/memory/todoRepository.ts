import crypto from 'crypto'
import { type ITodoListBeforeInsert, type ITodoInserted, type ITodoListInserted } from '../../interfaces'
import { type ITodoRepository } from '../repositoryInterfaces'
import { type Id } from '../../interfaces/ids'
console.log('Memory repository in use')
let todoListInMemory: ITodoListInserted[] = []

const todoRepository: ITodoRepository = {
  listAll: async (id: Id, userId: Id): Promise<ITodoInserted[] | []> => {
    const todoList = todoListInMemory.filter(item => (item._id === id) && (item.userId === userId))
    return todoList[0].todos
  },
  getById: async (listId: Id, todoId: Id, userId: Id): Promise<ITodoInserted | null> => {
    const todoList = todoListInMemory.find(list => (list._id === listId) && (list.userId === userId))
    if (todoList === undefined) {
      return null
    }
    const result = todoList.todos.find(item => item._id === todoId)
    if (result === undefined) {
      return null
    }
    return result
  },
  createTodoList: async (todoListToInsert: ITodoListBeforeInsert): Promise<ITodoListInserted> => {
    const todoList = { ...todoListToInsert, _id: crypto.randomUUID().toString() }
    todoListInMemory.push(todoList)
    return todoList
  },
  getTodoLists: async (userId): Promise<ITodoListInserted[]> => {
    const result = todoListInMemory.filter(todo => todo.userId === userId)
    return result
  },
  getTodoListById: async (id: Id, userId: Id): Promise<ITodoListInserted | null> => {
    return todoListInMemory.find(item => (item._id === id) && (item.userId === userId)) ?? null
  },
  updateTodoList: async (id: Id, content: ITodoListBeforeInsert): Promise<ITodoListInserted | null> => {
    todoListInMemory = todoListInMemory.map(todo => {
      if (todo._id === id) {
        return {
          _id: id,
          ...content
        }
      } else {
        return todo
      }
    })

    const result = todoListInMemory.find(list => list._id === id)
    if (result === undefined) {
      return null
    }
    return result
  },
  removeAllTodoLists: async (): Promise<boolean> => {
    todoListInMemory.splice(0, todoListInMemory.length)
    return todoListInMemory.length === 0
  },
  deleteList: async (id: Id, userId: Id): Promise<boolean> => {
    const previousLength = todoListInMemory.length
    todoListInMemory = todoListInMemory.filter(item => (item._id !== id) && (item.userId === userId))
    return (previousLength - 1) === todoListInMemory.length
  }
}

export { todoRepository }
