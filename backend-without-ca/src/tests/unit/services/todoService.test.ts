import sinon from 'sinon'

import { todoFactory } from '../../../factories'
import { todoService } from '../../../services/todoService'
import { todoRepository } from '../../../repositories'
import { assert } from 'chai'
import { type ITodoInserted, type ITodoCreated, type ITodoPayload } from '../../../interfaces'
import { ObjectId } from 'mongodb'
import { type ITodoRepository } from '../../../repositories/repositoryInterfaces'
import { todoFixture } from '../../fixtures/todo.fixture'

describe('Todo Service testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  const stubTodoRepository: Omit<ITodoRepository, 'removeAll'> = {
    create: async (todoToInsert) => {
      const expectedTodoToInsert = {
        name: todoToInsert.name,
        status: todoToInsert.status,
        description: todoToInsert.description,
        createdAt: new Date()
      }
      assert.deepEqual(todoToInsert, expectedTodoToInsert)
      return { ...expectedTodoToInsert, _id: new ObjectId() }
    },
    listAll: async () => {
      return [todoFixture()]
    },
    getById: async (id) => {
      const fixture = todoFixture()
      fixture._id = id
      return fixture
    },
    delete: async (id) => {
      return id
    },
    update: async (id, payload) => {
      return { ...payload, _id: id }
    }
  }
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  it('should execute create service and call todoRepository with correct params', async () => {
    const todo: ITodoPayload = {
      name: 'test1',
      description: 'this is a description',
      status: 'done'
    }
    const todoInstance = todoFactory(todo) as ITodoCreated
    const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'create').callsFake(stubTodoRepository.create)
    await todoService.create(todoInstance)
    assert.isTrue(todoRepositoryCreateStub.calledOnce)
  })

  it('should execute list service and call todoRepository with correct params', async () => {
    const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'listAll').callsFake(stubTodoRepository.listAll)
    await todoService.list()
    assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly())
  })

  it('should execute getById service and call todoRepository with correct params', async () => {
    const id = 'abcde'
    const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'getById').callsFake(stubTodoRepository.getById)
    await todoService.getById(id)
    assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(id))
  })

  it('should execute delete service and call todoRepository with correct params', async () => {
    const id = 'abcde'
    const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'delete').callsFake(stubTodoRepository.delete)
    await todoService.delete(id)
    assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(id))
  })

  it('should execute update service and call todoRepository with correct params', async () => {
    const id = 'abcde'
    const todo: Omit<ITodoInserted, '_id'> = {
      name: 'test1',
      description: 'this is a description',
      status: 'done',
      createdAt: new Date()
    }

    const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'update').callsFake(stubTodoRepository.update)
    await todoService.update(id, todo)
    assert.isTrue(todoRepositoryCreateStub.calledOnceWithExactly(id, todo))
  })
})
