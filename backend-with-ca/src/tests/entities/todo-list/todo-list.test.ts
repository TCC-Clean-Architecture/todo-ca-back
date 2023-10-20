import { expect } from 'chai'

import { type ITodoList } from '@/entities/interfaces/todo-list'
import { InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { InvalidTodosOnList } from '@/entities/todo-list/errors/invalid-todos-on-list'
import { InvalidUserIdError } from '@/entities/todo-list/errors/invalid-user-id'
import { TodoList } from '@/entities/todo-list/todo-list'
import { TodoListName } from '@/entities/todo-list/todo-list-name'
import { TodosEmbedded } from '@/entities/todo-list/todos-embedded'
import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'

describe('todo-list testing', () => {
  describe('create method testing', () => {
    it('should instantiate the todo list class', () => {
      const name = TodoListName.create('thisisname').value as TodoListName
      const todos = new TodosEmbedded([])
      const todoList = new TodoList(name, todos, 'userid')
      expect(todoList).to.be.instanceOf(TodoList)
    })
    it('should create a new todo list', () => {
      const todoList = TodoList.create({ name: 'todolist', todos: [], userId: 'userId' }).value as TodoList
      expect(todoList).to.be.instanceOf(TodoList)
      expect(todoList.name).to.equal('todolist')
      expect(todoList.todos).to.deep.equal([])
    })
    it('should not create todo list if not send userid and return invalid user id error', () => {
      const paramTodoList = {
        name: 'thisisalist',
        todos: []
      } as unknown as ITodoList
      const todoListValidated = TodoList.create(paramTodoList)
      expect(todoListValidated.value).to.be.instanceOf(InvalidUserIdError)
      expect(todoListValidated.isLeft()).to.equal(true)
    })
  })
  describe('validate method testing', () => {
    it('should validate and return an instance of todo list', () => {
      const todoList: ITodoList = {
        name: 'thisisalist',
        todos: [todoFixture()],
        userId: 'userId'
      }
      const todoListValidated = TodoList.validate(todoList)
      expect(todoListValidated.value).to.be.instanceOf(TodoList)
      expect(todoListValidated.isRight()).to.equal(true)
      expect(todoListValidated.value).to.deep.equal(todoList)
    })
    it('should validate todo list name and not insert', () => {
      const paramTodoList: ITodoList = {
        name: 'a',
        todos: [],
        userId: 'userId'
      }
      const todoListValidated = TodoList.validate(paramTodoList)
      expect(todoListValidated.value).to.be.instanceOf(InvalidTodoListName)
      expect(todoListValidated.isLeft()).to.equal(true)
    })
    it('should validate todos and do not insert if contains something wrong', () => {
      const paramTodoList: ITodoList = {
        name: 'thisisalist',
        todos: [{
          id: 'a',
          name: 'thisisname',
          status: 'todo',
          description: 'thisisdescription',
          createdAt: new Date()
        }],
        userId: 'userId'
      }
      const todoListValidated = TodoList.validate(paramTodoList)
      expect(todoListValidated.value).to.be.instanceOf(InvalidTodosOnList)
      expect(todoListValidated.isLeft()).to.equal(true)
    })
    it('should not send userid and return invalid user id error', () => {
      const paramTodoList = {
        name: 'thisisalist',
        todos: []
      } as unknown as ITodoList
      const todoListValidated = TodoList.validate(paramTodoList)
      expect(todoListValidated.value).to.be.instanceOf(InvalidUserIdError)
      expect(todoListValidated.isLeft()).to.equal(true)
    })
  })
})
