import sinon from 'sinon'
import crypto from 'crypto'
import { assert } from 'chai'
import { before } from 'mocha'

import { todoFactory } from '../../../factories'
import { todoService } from '../../../services/todoService'
import { initializeRepository, todoRepository } from '../../../repositories'
import { type ITodoInserted, type ITodoBeforeInsert, type ITodoBase, type ITodoListBeforeInsert } from '../../../interfaces'
import { type ITodoRepository } from '../../../repositories/repositoryInterfaces'
import { todoFixture } from '../../fixtures/todo.fixture'
import { todoListFixture } from '../../fixtures/todoList.fixture'

describe('Todo Service testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  const stubTodoRepository: Omit<ITodoRepository, 'removeAll' | 'removeAllTodoLists'> = {
    listAll: async (id) => {
      return [todoFixture()]
    },
    getById: async (id) => {
      const fixture = todoFixture()
      fixture._id = id
      return fixture
    },
    createTodoList: async (payload) => {
      return { ...payload, _id: crypto.randomUUID().toString() }
    },
    getTodoLists: async () => {
      return []
    },
    updateTodoList: async (id, content) => {
      return { _id: id, ...content }
    },
    getTodoListById: async (id) => {
      return todoListFixture()
    },
    deleteList: async (id) => {
      return true
    }
  }
  before(async () => {
    await initializeRepository()
  })
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  describe('Testing of create service', () => {
    it('should execute create service and call todoRepository with correct params', async () => {
      const todo: ITodoBase = {
        name: 'test1',
        description: 'this is a description',
        status: 'done'
      }
      const listId = 'abcde'
      const userId = 'thisisuserid'
      const todoInstance = todoFactory(todo) as ITodoBeforeInsert
      const todoRepositoryGetTodoListStub = sandbox.stub(todoRepository, 'getTodoListById').callsFake(stubTodoRepository.getTodoListById)
      const todoRepositoryUpdateTodoListStub = sandbox.stub(todoRepository, 'updateTodoList').callsFake(stubTodoRepository.updateTodoList)
      await todoService.create(listId, todoInstance, userId)
      assert.isTrue(todoRepositoryGetTodoListStub.calledOnceWithExactly(listId, userId))
      assert.isTrue(todoRepositoryUpdateTodoListStub.calledOnce)
    })
    it('should return an error when update repository doesnt work', async () => {
      const todo: ITodoBase = {
        name: 'test1',
        description: 'this is a description',
        status: 'done'
      }
      const listId = 'abcde'
      const userId = 'thisisuserid'
      const todoInstance = todoFactory(todo) as ITodoBeforeInsert
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async () => todoListFixture())
      sandbox.stub(todoRepository, 'updateTodoList').callsFake(async () => null)
      const response = await todoService.create(listId, todoInstance, userId)
      assert.deepEqual(response, {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      })
    })
    it('should return error code 400 when list id not found', async () => {
      const todo: ITodoBase = {
        name: 'test1',
        description: 'this is a description',
        status: 'done'
      }
      const listId = 'abcde'
      const userId = 'thisisuserid'
      const todoInstance = todoFactory(todo) as ITodoBeforeInsert
      const todoRepositoryGetTodoListStub = sandbox.stub(todoRepository, 'getTodoListById').callsFake(async () => {
        return null
      })
      const result = await todoService.create(listId, todoInstance, userId)
      assert.isTrue(todoRepositoryGetTodoListStub.calledOnceWithExactly(listId, userId))
      assert.deepEqual(result, {
        statusCode: 400,
        description: `Id ${listId.toString()} of list not found`,
        content: {
        }
      })
    })
  })
  describe('Testing of list service', () => {
    it('should execute list service and call todoRepository with correct params', async () => {
      const listId = 'abcde'
      const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'listAll').callsFake(stubTodoRepository.listAll)
      await todoService.list(listId)
      assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(listId))
    })
  })
  describe('Testing of getById service', () => {
    it('should execute getById service and call todoRepository with correct params', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'getById').callsFake(stubTodoRepository.getById)
      await todoService.getById(listId, todoId)
      assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(listId, todoId))
    })
    it('should return an 404 error when id not found', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const todoRepositoryGetByIdStub = sandbox.stub(todoRepository, 'getById').callsFake(async () => null)
      const result = await todoService.getById(listId, todoId)
      assert.isTrue(todoRepositoryGetByIdStub.calledOnceWithExactly(listId, todoId))
      assert.deepEqual(result, {
        statusCode: 404,
        description: 'Id not found',
        content: {
        }
      })
    })
  })
  describe('Testing of delete service', () => {
    it('should execute delete service and call todoRepository with correct params', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [{
            _id: todoId,
            name: 'to be deleted',
            description: 'to be deleted',
            status: 'inprogress',
            createdAt: new Date()
          }],
          userId: 'thisisuserid'
        }
      })

      const expectedList = {
        _id: listId,
        name: 'name',
        createdAt: new Date(),
        todos: [],
        userId: 'thisisuserid'
      }
      const userId = 'thisisuserid'
      const todoRepositoryUpdateTodoListStub = sandbox.stub(todoRepository, 'updateTodoList').callsFake(stubTodoRepository.updateTodoList)
      await todoService.delete(listId, todoId, userId)
      assert.isTrue(todoRepositoryUpdateTodoListStub.calledOnceWithExactly(listId, expectedList))
    })
    it('should return error when some error happens on repository', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [{
            _id: todoId,
            name: 'to be deleted',
            description: 'to be deleted',
            status: 'inprogress',
            createdAt: new Date()
          }],
          userId: 'thisisuserid'
        }
      })

      const expectedResponse = {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
      const userId = 'thisisuserid'
      sandbox.stub(todoRepository, 'updateTodoList').callsFake(async () => null)
      const response = await todoService.delete(listId, todoId, userId)
      assert.deepEqual(response, expectedResponse)
    })
    it('should return an error when list not found', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const userId = 'thisisuserid'
      const todoRepositoryGetTodoListByIdStub = sandbox.stub(todoRepository, 'getTodoListById').callsFake(async () => null)
      const result = await todoService.delete(listId, todoId, userId)
      assert.isTrue(todoRepositoryGetTodoListByIdStub.calledOnceWithExactly(listId, userId))
      assert.deepEqual(result, {
        statusCode: 404,
        description: `Id ${listId.toString()} of list not found`,
        content: {
        }
      })
    })
    it('should return an error when todo item not found', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const userId = 'thisisuserid'
      const todoRepositoryGetTodoListByIdStub = sandbox.stub(todoRepository, 'getTodoListById').callsFake(async () => todoListFixture({ _id: listId }))
      const result = await todoService.delete(listId, todoId, userId)
      assert.isTrue(todoRepositoryGetTodoListByIdStub.calledOnceWithExactly(listId, userId))
      assert.deepEqual(result, {
        statusCode: 404,
        description: `Todo id ${todoId.toString()} not found in list ${listId.toString()}`,
        content: {
        }
      })
    })
  })
  describe('Testing of update service', () => {
    it('should execute update service and call todoRepository with correct params', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const todo: Omit<ITodoInserted, '_id'> = {
        name: 'test1',
        description: 'this is a description',
        status: 'done',
        createdAt: new Date()
      }
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [{
            _id: todoId,
            name: 'to be changed',
            description: 'to be changed',
            status: 'inprogress',
            createdAt: new Date()
          }],
          userId: 'thisisuserid'
        }
      })

      const expectedList = {
        _id: listId,
        name: 'name',
        createdAt: new Date(),
        todos: [{
          _id: todoId,
          ...todo
        }],
        userId: 'thisisuserid'
      }
      const userId = 'thisisuserid'
      const todoRepositoryUpdateTodoListStub = sandbox.stub(todoRepository, 'updateTodoList').callsFake(stubTodoRepository.updateTodoList)
      await todoService.update(listId, todoId, todo, userId)
      assert.isTrue(todoRepositoryUpdateTodoListStub.calledOnceWithExactly(listId, expectedList))
    })

    it('should not find todoList and return error', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const todo: Omit<ITodoInserted, '_id'> = {
        name: 'test1',
        description: 'this is a description',
        status: 'done',
        createdAt: new Date()
      }
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return null
      })
      const expectedResult = {
        statusCode: 404,
        description: `Id ${listId.toString()} of list not found`,
        content: {
        }
      }
      const userId = 'thisisuserid'
      const result = await todoService.update(listId, todoId, todo, userId)
      assert.deepEqual(result, expectedResult)
    })

    it('should not find todo item inside of todo list and return error', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const todo: Omit<ITodoInserted, '_id'> = {
        name: 'test1',
        description: 'this is a description',
        status: 'done',
        createdAt: new Date()
      }
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [],
          userId: 'thisisuserid'
        }
      })
      const expectedResult = {
        statusCode: 404,
        description: `Todo id ${todoId.toString()} not found in list ${listId.toString()}`,
        content: {
        }
      }
      const userId = 'thisisuserid'
      const result = await todoService.update(listId, todoId, todo, userId)
      assert.deepEqual(result, expectedResult)
    })

    it('should execute update service and call todoRepository failing on update', async () => {
      const listId = 'abcde'
      const todoId = 'fghij'
      const todo: Omit<ITodoInserted, '_id'> = {
        name: 'test1',
        description: 'this is a description',
        status: 'done',
        createdAt: new Date()
      }
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [{
            _id: todoId,
            name: 'to be changed',
            description: 'to be changed',
            status: 'inprogress',
            createdAt: new Date()
          }],
          userId: 'thisisuserid'
        }
      })

      sandbox.stub(todoRepository, 'updateTodoList').callsFake(async () => null)
      const expectedResult = {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
      const userId = 'thisisuserid'
      const result = await todoService.update(listId, todoId, todo, userId)
      assert.deepEqual(result, expectedResult)
    })
  })
  describe('Testing of createTodoList service', () => {
    it('should execute service of create list and call todoListRepository with correct params', async () => {
      const todoToInsert: ITodoListBeforeInsert = {
        name: 'Some list',
        todos: [],
        createdAt: new Date(),
        userId: 'thisisuserid'
      }
      const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'createTodoList').callsFake(stubTodoRepository.createTodoList)
      await todoService.createTodoList(todoToInsert)
      assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(todoToInsert))
    })
  })
  describe('Testing of deleteTodoList service', () => {
    it('should delete todo list correctly', async () => {
      const listId = 'abcde'
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [],
          userId: 'thisisuserid'
        }
      })

      const expectedResponse = {
        statusCode: 200,
        description: `Deleted on list ${listId.toString()}`,
        content: { _id: listId }
      }
      const userId = 'thisisuserid'
      const deleteListRepositoryStub = sandbox.stub(todoRepository, 'deleteList').callsFake(async () => true)
      const response = await todoService.deleteTodoList(listId, userId)
      assert.deepEqual(response, expectedResponse)
      assert.isTrue(deleteListRepositoryStub.calledOnceWithExactly(listId, userId))
    })
    it('should return an error when something went wrong on repository', async () => {
      const listId = 'abcde'
      sandbox.stub(todoRepository, 'getTodoListById').callsFake(async (listId) => {
        return {
          _id: listId,
          name: 'name',
          createdAt: new Date(),
          todos: [],
          userId: 'thisisuserid'
        }
      })

      const expectedResponse = {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
      const userId = 'thisisuserid'
      const deleteListRepositoryStub = sandbox.stub(todoRepository, 'deleteList').callsFake(async () => false)
      const response = await todoService.deleteTodoList(listId, userId)
      assert.deepEqual(response, expectedResponse)
      assert.isTrue(deleteListRepositoryStub.calledOnceWithExactly(listId, userId))
    })
  })
  describe('Testing of getTodoLists service', () => {
    it('should execute getTodoLists service and call todoRepository with correct params', async () => {
      const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'getTodoLists').callsFake(stubTodoRepository.getTodoLists)
      const userId = 'thisisuserid'
      await todoService.getTodoLists(userId)
      assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(userId))
    })
  })
})
