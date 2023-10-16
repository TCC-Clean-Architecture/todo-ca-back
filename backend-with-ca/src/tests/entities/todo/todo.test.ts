import { expect } from 'chai'

import { InvalidIdError } from '@/entities/id/errors/id-validation-error'
import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { InvalidTodoDescriptionError, InvalidTodoNameError, InvalidTodoStatusError } from '@/entities/todo/errors'
import { Todo } from '@/entities/todo/todo'
import { type Either } from '@/shared/either'

describe('Entity todo testing', () => {
  describe('create method testing', () => {
    it('should validate todo parameters and return true', () => {
      const todo: ITodo = {
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'done',
        createdAt: new Date()
      }
      const expectedTodo = Object.assign({}, todo)
      delete expectedTodo.createdAt
      const todoInstance = Todo.create(todo) as Either<null, Todo>
      expect(todoInstance.value).to.be.instanceOf(Todo)
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.deep.includes(expectedTodo)
      expect(todoInstance.value).to.has.property('createdAt')
      expect(todoInstance.value?.createdAt).to.be.instanceOf(Date)
    })
    it('should create todo instance with createdAt and id without send parameter', () => {
      const todo: ITodo = {
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'done'
      }
      const todoInstance = Todo.create(todo) as Either<null, Todo>
      expect(todoInstance.value).to.be.instanceOf(Todo)
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.deep.include(todo)
      expect(todoInstance.value).to.has.property('createdAt')
      expect(todoInstance.value?.createdAt).to.be.instanceOf(Date)
      expect(todoInstance.value).to.has.property('id')
      expect(todoInstance.value?.id).to.be.a('string')
    })
    it('should return an error for status that not satisfies enum', () => {
      const todo: ITodo = {
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'banana'
      } as unknown as ITodo
      const todoInstance = Todo.create(todo)
      expect(todoInstance.value).to.be.instanceOf(InvalidTodoStatusError)
      expect(todoInstance.isLeft()).to.equal(true)
    })
    it('should return an error for invalid name', () => {
      const todo: ITodo = {
        name: 'a',
        description: 'thisisdescription',
        status: 'done'
      } as unknown as ITodo
      const todoInstance = Todo.create(todo)
      expect(todoInstance.value).to.be.instanceOf(InvalidTodoNameError)
      expect(todoInstance.isLeft()).to.equal(true)
    })
    it('should return an error for invalid description', () => {
      const todo: ITodo = {
        name: 'thisisname',
        description: 'a',
        status: 'done'
      } as unknown as ITodo
      const todoInstance = Todo.create(todo)
      expect(todoInstance.value).to.be.instanceOf(InvalidTodoDescriptionError)
      expect(todoInstance.isLeft()).to.equal(true)
    })
  })
  describe('validate method testing', () => {
    it('should validate all parameters and return the todo', () => {
      const todo: ITodoWithId = {
        id: 'a1179366-1b68-4db0-baff-3e98337cdad7',
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'done',
        createdAt: new Date('0')
      }
      const todoInstance = Todo.validate(todo) as Either<null, Todo>
      expect(todoInstance.value).to.be.instanceOf(Todo)
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.deep.equal(todo)
    })
    it('should validate name param and return invalid id error', () => {
      const todo: ITodoWithId = {
        id: 'a1179366-1b68-4db0-baff-3e98337cdad7',
        name: 'a',
        description: 'thisisdescription',
        status: 'done',
        createdAt: new Date('0')
      }
      const todoInstance = Todo.validate(todo)
      expect(todoInstance.value).to.be.instanceOf(InvalidTodoNameError)
      expect(todoInstance.isLeft()).to.equal(true)
    })
    it('should validate id param and return invalid id error', () => {
      const todo: ITodoWithId = {
        id: 'thisisinvalidid',
        name: 'thisisname',
        description: 'thisisdescription',
        status: 'done',
        createdAt: new Date('0')
      }
      const todoInstance = Todo.validate(todo)
      expect(todoInstance.value).to.be.instanceOf(InvalidIdError)
      expect(todoInstance.isLeft()).to.equal(true)
    })
  })
})
