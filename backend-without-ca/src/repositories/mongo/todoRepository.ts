import { ObjectId } from 'mongodb'
import { getCollection } from '../../database'
import { type ITodoListBeforeInsert, type ITodoInserted, type ITodoListInserted, type Id } from '../../interfaces'
import { type ITodoRepository } from '../repositoryInterfaces'
console.log('Mongo repository in use')
const todoListCollection = getCollection('todoListCollection')

const todoRepository: ITodoRepository = {
  listAll: async (id: Id): Promise<ITodoListInserted> => {
    const idConverted = typeof id === 'string' ? new ObjectId(id) : id
    const result = await todoListCollection.findOne({
      _id: idConverted
    }) as ITodoListInserted
    return result
  },
  getById: async (listId: Id, todoId: Id): Promise<ITodoInserted | null> => {
    const todoList = await todoListCollection.findOne({
      _id: typeof listId === 'string' ? new ObjectId(listId) : listId
    }) as ITodoListInserted
    if (!todoList) {
      return null
    }
    const result = todoList.todos.find(item => item._id === todoId)
    if (result === undefined) {
      return null
    }
    return result
  },
  createTodoList: async (todoListToInsert: ITodoListBeforeInsert): Promise<ITodoListInserted> => {
    const { insertedId } = await todoListCollection.insertOne(todoListToInsert)
    const result = await todoListCollection.findOne({ _id: insertedId }) as ITodoListInserted
    return result
  },
  getTodoLists: async (): Promise<ITodoListInserted[]> => {
    const result = await todoListCollection.find().toArray() as ITodoListInserted[]
    return result
  },
  getTodoListById: async (id: Id): Promise<ITodoListInserted | null> => {
    const idConverted = typeof id === 'string' ? new ObjectId(id) : id
    const result = await todoListCollection.findOne({ _id: idConverted }) as ITodoListInserted
    return result ?? null
  },
  updateTodoList: async (id: Id, content: ITodoListBeforeInsert): Promise<ITodoListInserted | null> => {
    const idConverted = typeof id === 'string' ? new ObjectId(id) : id
    const updateResult = await todoListCollection.updateOne({
      _id: idConverted
    }, {
      $set: content
    })
    if (!updateResult) {
      return null
    }
    const result = await todoListCollection.findOne({ _id: idConverted }) as ITodoListInserted
    return result
  },
  removeAllTodoLists: async (): Promise<boolean> => {
    const success = await todoListCollection.deleteMany()
    if (success.deletedCount > 0) {
      return true
    } else {
      return false
    }
  },
  deleteList: async (id: Id) => {
    const success = await todoListCollection.deleteOne({
      _id: typeof id === 'string' ? new ObjectId(id) : id
    })
    if (success.deletedCount > 0) {
      return true
    } else {
      return false
    }
  }
}

export { todoRepository }
