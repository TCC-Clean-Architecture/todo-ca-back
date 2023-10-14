import { expect } from 'chai'

import { InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { TodoListName } from '@/entities/todo-list/todo-list-name'
import { type Either } from '@/shared/either'

describe('Entity todo list name testing', () => {
  describe('Todo list name entity create method testing', () => {
    it('should create new todo list name', () => {
      const todoListName = 'thisisvalidname'
      const todoInstance = TodoListName.create(todoListName) as Either<null, TodoListName>
      expect(todoInstance.isRight()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(TodoListName)
      expect(todoInstance.value?.value).to.equal(todoListName)
    })

    it('should return an error when todo list name validation is false', () => {
      const todoListName = 'ab'
      const todoInstance = TodoListName.create(todoListName)
      expect(todoInstance.isLeft()).to.equal(true)
      expect(todoInstance.value).to.be.instanceOf(InvalidTodoListName)
    })
  })

  describe('Todo list name entity validate method testing', () => {
    it('should validate todo list name and return true', () => {
      const todoListName = 'thisisvalidname'
      expect(TodoListName.validate(todoListName)).to.equal(true)
    })

    it('should return false when send todo list name with length less than 3 chars', () => {
      const todoListName = 'ab'
      expect(TodoListName.validate(todoListName)).to.equal(false)
    })

    it('should return false when send todo list name with length greater than 150 chars', () => {
      const todoListName = 'a'.repeat(151)
      expect(TodoListName.validate(todoListName)).to.equal(false)
    })

    it('should return false when name property is not a string', () => {
      const todoListName = true as unknown as string
      expect(TodoListName.validate(todoListName)).to.equal(false)
    })
  })
})
