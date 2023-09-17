import { assert } from 'chai'
import sinon from 'sinon'
import { todoFactory } from '../../../factories'
import { type ITodoBase } from '../../../interfaces'

describe('Todo factory testing', () => {
  let clock: sinon.SinonFakeTimers
  before(() => {
    clock = sinon.useFakeTimers()
  })
  after(() => {
    clock.restore()
  })
  it('should create todo instance', () => {
    const todo: ITodoBase = {
      name: 'test1',
      description: 'its a description',
      status: 'done'
    }
    const todoInstance = todoFactory(todo)
    const expectedTodo = {
      ...todo,
      createdAt: new Date()
    }
    assert.deepEqual(todoInstance, expectedTodo)
  })
  it('should return an error when payload is not valid', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const todo = {
      name: 'test1',
      description: 'its a description'
    } as ITodoBase

    const todoInstance = todoFactory(todo) as Error
    assert.instanceOf(todoInstance, Error)
    assert.strictEqual(todoInstance.message, 'Error on create todo instance: status is a required field')
  })
})
