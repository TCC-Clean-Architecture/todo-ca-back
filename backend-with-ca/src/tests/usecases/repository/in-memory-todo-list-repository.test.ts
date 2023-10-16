import { expect } from 'chai'

import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'

describe('In memory todo list repository testing', () => {
  describe('Create method testing', () => {
    it('should create a new todo list on repository', async () => {
      const todoList = {
        name: 'thisisname',
        todos: []
      }
      const repository = new InMemoryTodoListRepository([])
      const createdId = await repository.create(todoList)
      const result = await repository.findById(createdId)
      expect(result).to.deep.include({
        ...todoList
      })
      expect(result).to.have.property('id')
    })
    it('should create a new todo list with todos on repository', async () => {
      const todoList = {
        name: 'thisisname',
        todos: [todoFixture()]
      }
      const repository = new InMemoryTodoListRepository([])
      const createdId = await repository.create(todoList)
      const result = await repository.findById(createdId)
      expect(result).to.deep.include({
        ...todoList
      })
      expect(result).to.have.property('id')
    })
  })
  describe('Find by id method testing', () => {
    it('should find by id the todo list', async () => {
      const todoList = {
        name: 'thisisname',
        todos: []
      }
      const repository = new InMemoryTodoListRepository([])
      const createdId = await repository.create(todoList)
      const result = await repository.findById(createdId)
      expect(result).to.deep.include(todoList)
    })
    it('should not find by id the todo list', async () => {
      const repository = new InMemoryTodoListRepository([])
      const result = await repository.findById('nonexistingid')
      expect(result).to.equal(null)
    })
  })
  describe('Find all method testing', () => {
    it('should list all todos lists', async () => {
      const todoLists = [todoListFixture(), todoListFixture()]
      const repository = new InMemoryTodoListRepository(todoLists)
      const result = await repository.findAll()
      expect(result).to.deep.equal(todoLists)
    })
    it('should return empty result', async () => {
      const repository = new InMemoryTodoListRepository([])
      const result = await repository.findAll()
      expect(result).to.deep.equal([])
    })
  })
  describe('Delete method testing', () => {
    it('should delete one todo list', async () => {
      const todoList = [todoListFixture()]
      const expectedId = todoList[0].id
      const repository = new InMemoryTodoListRepository(todoList)
      const result = await repository.delete(expectedId)
      expect(result).to.equal(expectedId)
      const validateId = await repository.findAll()
      expect(validateId).to.deep.equal([])
    })
    it('should return null when cannot delete', async () => {
      const repository = new InMemoryTodoListRepository([])
      const result = await repository.delete('abc')
      expect(result).to.equal(null)
    })
  })
  describe('Update method testing', () => {
    it('should update one todo list', async () => {
      const todoList = [todoListFixture()]
      const todoListUpdate = {
        name: 'dataupdated',
        todos: [todoFixture()]
      }
      const repository = new InMemoryTodoListRepository(todoList)
      const result = await repository.update(todoList[0].id, todoListUpdate)
      const expectedResult = {
        id: todoList[0].id,
        ...todoListUpdate
      }
      expect(result).to.equal(todoList[0].id)
      const validateResult = await repository.findAll()
      expect(validateResult).to.deep.equal([expectedResult])
    })
    it('should return null when not found', async () => {
      const repository = new InMemoryTodoListRepository([])
      const result = await repository.update('abcde', {})
      expect(result).to.equal(null)
    })
  }
  )
})
