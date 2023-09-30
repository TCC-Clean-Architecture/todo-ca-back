import { assert } from 'chai'
import sinon from 'sinon'
import { todoListFactory } from '../../../factories/todoList'
import { type ITodoList, type ITodoListBeforeInsert } from '../../../interfaces'
import { todoFixture } from '../../fixtures/todo.fixture'

describe('Todo list factory testing', () => {
  let clock: sinon.SinonFakeTimers
  before(() => {
    clock = sinon.useFakeTimers()
  })
  after(() => {
    clock.restore()
  })
  it('should create a todo list without todos', () => {
    const todoList: ITodoList = {
      name: 'todoListSample'
    }

    const expectedTodoList: ITodoListBeforeInsert = {
      ...todoList,
      todos: [],
      createdAt: new Date()
    }
    const todoListBuilded = todoListFactory(todoList)
    assert.deepEqual(todoListBuilded, expectedTodoList)
  })
  it('should create a todo list with todos', () => {
    const todoItem = todoFixture()
    const todoList: Required<ITodoList> = {
      name: 'todoListSample',
      todos: [todoItem]
    }

    const expectedTodoList: ITodoListBeforeInsert = {
      ...todoList,
      createdAt: new Date()
    }
    const todoListBuilded = todoListFactory(todoList)
    assert.deepEqual(todoListBuilded, expectedTodoList)
  })
  it('should create a todo list with todos', () => {
    const todoItem = todoFixture()
    const todoList: Required<ITodoList> = {
      name: 'todoListSample',
      todos: [todoItem]
    }

    const expectedTodoList: ITodoListBeforeInsert = {
      ...todoList,
      createdAt: new Date()
    }
    const todoListBuilded = todoListFactory(todoList)
    assert.deepEqual(todoListBuilded, expectedTodoList)
  })
  it('should create a todo list with todos', () => {
    const todoItem = todoFixture()
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const todoList = {
      todos: [todoItem]
    } as ITodoList

    const todoListBuilded = todoListFactory(todoList) as Error
    assert.instanceOf(todoListBuilded, Error)
    assert.strictEqual(todoListBuilded.message, 'Error on create todo list instance: name is a required field')
  })
})
