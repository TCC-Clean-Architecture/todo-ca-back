import { ObjectId } from 'mongodb'
import { getCollection } from '../../database'
import { type ITodoListBeforeInsert, type ITodoInserted, type ITodoListInserted, type Id } from '../../interfaces'
import { type ITodoRepository } from '../repositoryInterfaces'
console.log('Mongo repository in use')
const todoListCollection = getCollection('todoListCollection')

const convertToObjectId = (param: Id): ObjectId => {
  return typeof param === 'string' ? new ObjectId(param) : param
}

const todoRepository: ITodoRepository = {
  getById: async (listId: Id, todoId: Id, userId: Id): Promise<ITodoInserted | null> => {
    const todoList = await todoListCollection.findOne({
      _id: convertToObjectId(listId),
      userId
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
  getTodoLists: async (userId: Id): Promise<ITodoListInserted[]> => {
    const result = await todoListCollection.find({
      userId
    }).toArray() as ITodoListInserted[]
    return result
  },
  getTodoListById: async (id: Id, userId: Id): Promise<ITodoListInserted | null> => {
    const result = await todoListCollection.findOne({
      _id: convertToObjectId(id),
      userId
    }) as ITodoListInserted
    return result ?? null
  },
  updateTodoList: async (id: Id, content: ITodoListBeforeInsert): Promise<ITodoListInserted | null> => {
    const updateResult = await todoListCollection.updateOne({
      _id: convertToObjectId(id)
    }, {
      $set: content
    })
    if (!updateResult) {
      return null
    }
    const result = await todoListCollection.findOne({ _id: convertToObjectId(id) }) as ITodoListInserted
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
  deleteList: async (id: Id, userId: Id) => {
    const success = await todoListCollection.deleteOne({
      _id: convertToObjectId(id),
      userId
    })
    if (success.deletedCount > 0) {
      return true
    } else {
      return false
    }
  }
}

export { todoRepository }
