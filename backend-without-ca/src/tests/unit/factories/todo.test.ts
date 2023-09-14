import { assert } from 'chai'
import sinon from 'sinon'
import { todoFactory } from '../../../factories/todo'
import { type ITodoCreate } from '../../../interfaces'

describe('Todo factory testing', () => {
  let clock: sinon.SinonFakeTimers
  before(() => {
    clock = sinon.useFakeTimers()
  })
  after(() => {
    clock.restore()
  })
  it('should create todo instance', () => {
    const todo: ITodoCreate = {
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
})
