import { expect } from 'chai'

import { InvalidIdError } from '@/entities/id/errors/id-validation-error'
import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { InvalidTodoNameError } from '@/entities/todo/errors'
import { TodosEmbedded } from '@/entities/todo-list/todos-embedded'

describe('Todos embedded on todo list testing', () => {
  describe('create method testing', () => {
    it('should create todo', () => {
      const todo: ITodo = {
        name: 'thisistodo',
        description: 'thisisdescription',
        status: 'todo'
      }
      const todosEmbedded = new TodosEmbedded()
      const result = todosEmbedded.create(todo)
      expect(result.isRight()).to.equal(true)
      expect(result.value).to.deep.include(todo)
      expect(result.value).to.have.property('id')
      expect(result.value).to.have.property('createdAt')
    })
    it('should return an error on attempt to create todo', () => {
      const todo: ITodo = {
        name: 'a',
        description: 'thisisdescription',
        status: 'todo'
      }
      const todosEmbedded = new TodosEmbedded()
      const result = todosEmbedded.create(todo)
      expect(result.isLeft()).to.equal(true)
      expect(result.value).to.be.instanceOf(InvalidTodoNameError)
    })
  })

  describe('createTodoWithId method testing', () => {
    it('should createTodoWithId todo and return true', () => {
      const todo: ITodoWithId = {
        id: 'e8308351-6e05-4d3f-b7f0-25286ba646e8',
        name: 'thisistodo',
        description: 'thisisdescription',
        status: 'todo',
        createdAt: new Date('0')
      }
      const todosEmbedded = new TodosEmbedded()
      const result = todosEmbedded.createTodoWithId(todo)
      expect(result.isRight()).to.equal(true)
      expect(result.value).to.deep.equal(todo)
      expect(todosEmbedded.getAll()).to.deep.equal([todo])
    })
    it('should validate todo and return false', () => {
      const todo: ITodoWithId = {
        id: 'a',
        name: 'thisistodo',
        description: 'thisisdescription',
        status: 'todo',
        createdAt: new Date('0')
      }
      const todosEmbedded = new TodosEmbedded()
      const result = todosEmbedded.createTodoWithId(todo)
      expect(result.isLeft()).to.equal(true)
      expect(result.value).to.be.instanceOf(InvalidIdError)
      expect(todosEmbedded.getAll()).to.deep.equal([])
    })
  })
})
