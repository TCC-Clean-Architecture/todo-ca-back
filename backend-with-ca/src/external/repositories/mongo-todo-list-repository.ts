import { type ObjectId } from 'mongodb'

import { type ITodoList, type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { convertMongoIdToNormalId } from '@/external/repositories/helpers/convertMongoIdToNormalId'
import { getCollection } from '@/main/configs/mongodb'
import { type ITodoListRepository } from '@/shared/todo-list-repository'

import { isObjectId } from './helpers/is-object-id'

interface ITodoListWithMongoId extends ITodoList {
  _id: ObjectId
}

class MongoTodoListRepository implements ITodoListRepository {
  async create (todoList: ITodoList): Promise<string> {
    const todoListCollection = getCollection('todoLists')
    const { insertedId } = await todoListCollection.insertOne(todoList)
    return insertedId.toString()
  }

  async findById (todoListId: string, userId: string): Promise<ITodoListWithId | null> {
    const todoListCollection = getCollection('todoLists')
    const _id = isObjectId(todoListId)
    if (!_id) {
      return null
    }
    const todo = await todoListCollection.findOne({
      _id,
      userId
    })
    if (!todo) {
      return null
    }

    return convertMongoIdToNormalId(todo)
  }

  async findAll (userId: string): Promise<ITodoListWithId[]> {
    const todoListCollection = getCollection('todoLists')
    const result = await todoListCollection.find({ userId }).toArray() as ITodoListWithMongoId[]
    return result.map(item => convertMongoIdToNormalId(item))
  }

  async delete (todoListId: string, userId: string): Promise<string | null> {
    const todoListCollection = getCollection('todoLists')
    const _id = isObjectId(todoListId)
    if (!_id) {
      return null
    }
    const { deletedCount } = await todoListCollection.deleteOne({
      _id,
      userId
    })
    if (!deletedCount) {
      return null
    }
    return todoListId
  }

  async update (todoListId: string, content: Partial<ITodoListOptional>, userId: string): Promise<string | null> {
    const todoListCollection = getCollection('todoLists')
    const _id = isObjectId(todoListId)
    if (!_id) {
      return null
    }
    const updated = await todoListCollection.updateOne({
      _id,
      userId
    }, {
      $set: content
    })
    if (!updated.matchedCount) {
      return null
    }
    return todoListId
  }
}

export { MongoTodoListRepository }
