import { expect } from 'chai'
import { ObjectId } from 'mongodb'

import { type ITodoList } from '@/entities/interfaces/todo-list'
import { MongoTodoListRepository } from '@/external/repositories/mongo-todo-list-repository'
import { clearCollection, connectDatabase } from '@/main/configs/mongodb'
import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'

describe('Mongo todo lists repository testing', () => {
  before(async () => {
    await connectDatabase()
  })
  afterEach(async () => {
    await clearCollection('todoLists')
  })
  describe('Create method testing', () => {
    it('should create todo list', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.create({
        name: 'test',
        todos: [],
        userId: 'userId'
      })
      expect(result).to.be.a('string')
    })
  })

  describe('findAll method testing', () => {
    it('should find all todo lists', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const todoList: ITodoList = {
        name: 'thisisname',
        todos: [todoFixture()],
        userId: 'userId'
      }
      const todoListExpected = Object.assign({}, todoList)
      await repositoryInstance.create(todoList)
      const result = await repositoryInstance.findAll()
      expect(result[0]).to.deep.include(todoListExpected)
      expect(result[0]).to.have.property('id')
      expect(result[0].id).to.be.a('string')
    })
  })

  describe('find by id method testing', () => {
    it('should find one todo list by id', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const todoList: ITodoList = {
        name: 'thisisname',
        todos: [todoFixture()],
        userId: 'userId'
      }
      const todoListExpected = Object.assign({}, todoList)
      const insertedId = await repositoryInstance.create(todoList)
      const result = await repositoryInstance.findById(insertedId)

      expect(result).to.deep.include(todoListExpected)
      expect(result).to.have.property('id')
      expect(result?.id).to.be.a('string')
    })
    it('should find one and not find', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.findById(new ObjectId().toString())
      expect(result).to.equal(null)
    })
    it('should return null when send something that is not object id as parameter', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.findById('abc')
      expect(result).to.equal(null)
    })
  })

  describe('delete repository testing', () => {
    it('should remove one todo list', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const todoList: ITodoList = {
        name: 'thisisname',
        todos: [todoFixture()],
        userId: 'userId'
      }
      const insertedId = await repositoryInstance.create(todoList)
      const result = await repositoryInstance.delete(insertedId)
      expect(result).to.equal(insertedId)
      const verifyDb = await repositoryInstance.findAll()
      expect(verifyDb).to.deep.equal([])
    })
    it('should not find todo to delete', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.delete(new ObjectId().toString())
      expect(result).to.equal(null)
    })
    it('should return null when send something that is not object id as parameter', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.delete('abc')
      expect(result).to.equal(null)
    })
  })

  describe('update repository testing', () => {
    it('should update one todo list', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const todoList: ITodoList = {
        name: 'thisisname',
        todos: [todoFixture()],
        userId: 'userId'
      }
      const insertedId = await repositoryInstance.create(todoList)
      const todoListUpdatePayload: ITodoList = {
        name: 'updated',
        todos: [todoFixture(), todoFixture()],
        userId: 'userId'
      }
      const result = await repositoryInstance.update(insertedId, todoListUpdatePayload)
      expect(result).to.equal(insertedId)
      const verifyDb = await repositoryInstance.findById(insertedId)
      expect(verifyDb).to.deep.include(todoListUpdatePayload)
    })
    it('should not find todo to update', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.update(new ObjectId().toString(), {})
      expect(result).to.equal(null)
    })
    it('should return null when send something that is not object id as parameter', async () => {
      const repositoryInstance = new MongoTodoListRepository()
      const result = await repositoryInstance.update('abc', {})
      expect(result).to.equal(null)
    })
  })
})
