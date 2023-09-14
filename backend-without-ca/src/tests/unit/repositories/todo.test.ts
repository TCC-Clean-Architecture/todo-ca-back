import { expect } from 'chai'
import { todoFactory } from '../../../factories/todo'
import { initializeRepository, todoRepository } from '../../../repositories'
import { type ITodoCreate } from '../../../interfaces'
import { todoFixture } from '../../fixtures/todo.fixture'

describe('Todo repository testing', () => {
  before(async () => {
    await initializeRepository()
  })
  beforeEach(async () => {
    await todoRepository.removeAll()
  })
  it('should create todo', async () => {
    const todoToTest: ITodoCreate = {
      name: 'test1',
      description: 'this is a description',
      status: 'done'
    }
    const todoInstance = todoFactory(todoToTest)
    const result = await todoRepository.create(todoInstance)
    expect(result).to.deep.include(todoInstance)
    expect(result).to.have.property('_id')
  })
  it('should list all todo', async () => {
    const todo = todoFixture()
    await todoRepository.create(todo)
    await todoRepository.create(todo)
    const result = await todoRepository.listAll()
    expect(result).to.deep.equals([todo, todo])
  })
  it('should remove all todo', async () => {
    const todo = todoFixture()
    await todoRepository.create(todo)
    await todoRepository.create(todo)
    await todoRepository.removeAll()
    const result = await todoRepository.listAll()
    expect(result).to.deep.equals([])
  })
  it('should get one todo by id', async () => {
    const todo = todoFixture()
    const todo2 = todoFixture()
    await todoRepository.create(todo)
    await todoRepository.create(todo2)

    const result = await todoRepository.getById(todo._id)
    expect(result).to.deep.equals(todo)
  })
})
