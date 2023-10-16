import { expect } from 'chai'

import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { InvalidTodoListName } from '@/entities/todo-list/errors/invalid-todo-list-name'
import { type Either } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { CreateNewTodoListUseCase } from '@/usecases/todo-list/create-new-todo-list/create-new-todo-list'

describe('Create new todo list use case testing', () => {
  it('should create a new use case with empty todos', async () => {
    const todoList: ITodoListOptional = {
      name: 'thisislist'
    }
    const todoListRepository = new InMemoryTodoListRepository([])
    const useCase = new CreateNewTodoListUseCase(todoListRepository)
    const result = await useCase.execute(todoList) as Either<null, ITodoListWithId>
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.include({
      ...todoList,
      todos: []
    })
    expect(result.value).has.property('id')
    expect(result.value?.id).is.a('string')
  })
  it('should return an error if create some list with invalid name', async () => {
    const todoList: ITodoListOptional = {
      name: 'a'
    }
    const todoListRepository = new InMemoryTodoListRepository([])
    const useCase = new CreateNewTodoListUseCase(todoListRepository)
    const result = await useCase.execute(todoList)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(InvalidTodoListName)
  })
  it('should return an error if something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async create (todoId: ITodoListOptional): Promise<string> {
        throw new Error('This is error')
      }
    }
    const todoList: ITodoListOptional = {
      name: 'thisistodolist'
    }
    const todoListRepository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new CreateNewTodoListUseCase(todoListRepository)
    const result = await useCase.execute(todoList)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UnexpectedError)
  })
})
