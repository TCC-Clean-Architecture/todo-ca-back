import { expect } from 'chai'

import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { InvalidTodoNameError } from '@/entities/todo/errors'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoRepository } from '@/shared/todo-repository'
import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'
import { InMemoryTodoRepository } from '@/usecases/shared/repository/in-memory-todo-repository'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoUpdateError } from '@/usecases/todo/update-todo/errors/todo-update-error'
import { UpdateTodoUseCase } from '@/usecases/todo/update-todo/update-todo'

describe('Update todo use case testing', () => {
  it('should update todo', async () => {
    const todo: ITodoWithId = {
      id: 'id',
      name: 'name',
      description: 'description',
      status: 'todo',
      createdAt: new Date()
    }
    const todoUpdate: ITodo = {
      name: 'dataupdated',
      description: 'dataupdated',
      status: 'inprogress'
    }
    const todoRepository = new InMemoryTodoRepository([todo])
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute(todo.id, todoUpdate)
    const expectedResult = {
      id: todo.id,
      ...todoUpdate,
      createdAt: todo.createdAt
    }
    expect(result.value).to.deep.equal(expectedResult)
    const validateId = await todoRepository.findAll()
    expect(validateId).to.deep.equal([expectedResult])
  })
  it('should not find todo to update', async () => {
    const todoRepository = new InMemoryTodoRepository([])
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute('abcde', {})
    expect(result.value).to.be.instanceOf(TodoNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should cannot update when the some property is not valid', async () => {
    const todo: ITodoWithId = {
      id: 'id',
      name: 'name',
      description: 'description',
      status: 'todo',
      createdAt: new Date()
    }
    const todoUpdate: ITodo = {
      name: 'a'.repeat(300),
      description: 'dataupdated',
      status: 'inprogress'
    }
    const todoRepository = new InMemoryTodoRepository([todo])
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute(todo.id, todoUpdate)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(InvalidTodoNameError)
  })
  it('should return null on update repository', async () => {
    class MockTodoRepositoryNull implements Partial<ITodoRepository> {
      async findById (todoId: string): Promise<ITodoWithId | null> {
        return todoFixture()
      }

      async update (todoId: string, content: Partial<ITodo>): Promise<string | null> {
        return null
      }
    }
    const todoRepository = new MockTodoRepositoryNull() as ITodoRepository
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute('abcde', {})
    expect(result.value).to.be.instanceOf(TodoUpdateError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoRepositoryException implements Partial<ITodoRepository> {
      async update (todoId: string, content: Partial<ITodo>): Promise<string | null> {
        throw new Error('This is error')
      }
    }
    const todoRepository = new MockTodoRepositoryException() as ITodoRepository
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute('abcde', {})
    expect(result.value).to.be.instanceOf(UnexpectedError)
    expect(result.isLeft()).to.equal(true)
  })
})
