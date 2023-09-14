import sinon from 'sinon'

import { todoFactory } from '../../../factories/todo'
import { todoService } from '../../../services/todoService'
import { todoRepository } from '../../../repositories'
import { assert } from 'chai'
import { type ITodoInserted, type ITodoCreated, type ITodoCreate } from '../../../interfaces'
import { ObjectId } from 'mongodb'

describe('Todo Service testing', () => {
  let sandbox: sinon.SinonSandbox
  let clock: sinon.SinonFakeTimers
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    clock = sandbox.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
    sandbox.restore()
  })
  it('should call todoRepository with correct params', async () => {
    const todo: ITodoCreate = {
      name: 'test1',
      description: 'this is a description',
      status: 'done'
    }
    const todoInstance = todoFactory(todo)
    const todoRepositoryCreateStub = sandbox.stub(todoRepository, 'create').callsFake(async (todoToInsert: ITodoCreated): Promise<ITodoInserted> => {
      const expectedTodoToInsert = {
        ...todo,
        createdAt: new Date()
      }
      assert.deepEqual(todoToInsert, expectedTodoToInsert)
      return { ...expectedTodoToInsert, _id: new ObjectId() }
    })
    await todoService.create(todoInstance)
    assert.isTrue(todoRepositoryCreateStub.calledOnce)
  })
})
