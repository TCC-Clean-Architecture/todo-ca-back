import { expect } from 'chai'
import { type ICompleteTodo } from '../../../entities/interfaces/todo'
import { InMemoryTodoRepository } from '../../../usecases/shared/repository/in-memory-todo-repository'

describe('In memory todo repository testing', () => {
  describe('Create method testing', () => {
    it('should create a new todo on repository', async () => {
      const todo: ICompleteTodo = {
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'todo',
        createdAt: new Date()
      }
      const repository = new InMemoryTodoRepository([])
      const createdId = await repository.create(todo)
      const result = await repository.findById(createdId)
      expect(result).to.deep.include({
        ...todo
      })
      expect(result).to.have.property('id')
      expect(result).to.have.property('createdAt')
      expect(result?.createdAt).to.instanceOf(Date)
    })
  })
  describe('Find by id method testing', () => {
    it('should create a new todo on repository', async () => {
      const todo: ICompleteTodo = {
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'todo',
        createdAt: new Date()
      }
      const repository = new InMemoryTodoRepository([])
      await repository.create(todo)
      const result = await repository.findById('notexistingid')
      expect(result).to.equal(null)
    })
  })
})
