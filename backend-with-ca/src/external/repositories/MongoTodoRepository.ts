import { ObjectId } from 'mongodb'
import { type ITodo, type ICompleteTodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { getCollection } from '@/main/configs/mongodb'
import { type ITodoRepository } from '@/shared/todo-repository'
import { convertMongoIdToNormalId } from '@/external/repositories/helpers/convertMongoIdToNormalId'

interface ITodoWithMongoId extends ICompleteTodo {
  _id: ObjectId
}

class MongoTodoRepository implements Partial<ITodoRepository> {
  async create (todo: ICompleteTodo): Promise<string> {
    const todoCollection = getCollection('todos')
    const { insertedId } = await todoCollection.insertOne(todo)
    return insertedId.toString()
  }

  async findById (todoId: string): Promise<ITodoWithId | null> {
    const todoCollection = getCollection('todos')
    const todo = await todoCollection.findOne({
      _id: new ObjectId(todoId)
    })
    if (!todo) {
      return null
    }

    return convertMongoIdToNormalId(todo)
  }

  async findAll (): Promise<ITodoWithId[]> {
    const todoCollection = getCollection('todos')
    const result = await todoCollection.find().toArray() as ITodoWithMongoId[]
    return result.map(item => convertMongoIdToNormalId(item))
  }

  async delete (todoId: string): Promise<string> {
    const todoCollection = getCollection('todos')
    await todoCollection.deleteOne({
      _id: new ObjectId(todoId)
    })
    return todoId
  }

  async update (todoId: string, content: Partial<ITodo>): Promise<string | null> {
    const todoCollection = getCollection('todos')
    const updated = await todoCollection.updateOne({
      _id: new ObjectId(todoId)
    }, {
      $set: content
    })
    if (!updated.matchedCount) {
      return null
    }
    return todoId
  }
}

export { MongoTodoRepository }
