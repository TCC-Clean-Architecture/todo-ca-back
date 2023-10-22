import { type ObjectId } from 'mongodb'

import { type ITodoList, type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { convertMongoIdToNormalId } from '@/external-dependencies/repositories/helpers/convertMongoIdToNormalId'
import { getCollection } from '@/main/configs/mongodb'
import { type ITodoListRepository } from '@/shared/todo-list-repository'

import { isObjectId } from './helpers/is-object-id'

interface ITodoListWithMongoId extends ITodoList {
  _id: ObjectId
}

class MongoTodoListRepository implements ITodoListRepository {
  async create (todoList: ITodoListOptional): Promise<string> {
    const todoListCollection = getCollection('todoLists')
    const { insertedId } = await todoListCollection.insertOne(todoList)
    return insertedId.toString()
  }

  async findById (todoListId: string): Promise<ITodoListWithId | null> {
    const todoListCollection = getCollection('todoLists')
    const _id = isObjectId(todoListId)
    if (!_id) {
      return null
    }
    const todo = await todoListCollection.findOne({
      _id
    })
    if (!todo) {
      return null
    }

    return convertMongoIdToNormalId(todo)
  }

  async findAll (): Promise<ITodoListWithId[]> {
    const todoListCollection = getCollection('todoLists')
    const result = await todoListCollection.find().toArray() as ITodoListWithMongoId[]
    return result.map(item => convertMongoIdToNormalId(item))
  }

  async delete (todoListId: string): Promise<string | null> {
    const todoListCollection = getCollection('todoLists')
    const _id = isObjectId(todoListId)
    if (!_id) {
      return null
    }
    const { deletedCount } = await todoListCollection.deleteOne({
      _id
    })
    if (!deletedCount) {
      return null
    }
    return todoListId
  }

  async update (todoListId: string, content: Partial<ITodoListOptional>): Promise<string | null> {
    const todoListCollection = getCollection('todoLists')
    const _id = isObjectId(todoListId)
    if (!_id) {
      return null
    }
    const updated = await todoListCollection.updateOne({
      _id
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
