import { expect } from 'chai'

import { type ITodo } from '@/entities/interfaces/todo'
import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { UpdateTodoUseCase } from '@/usecases/todo/update-todo/update-todo'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('Update todo use case testing', () => {
  it('should update todo', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todo = lists[0].todos[0]
    const todoUpdate: ITodo = {
      name: 'dataupdated',
      description: 'dataupdated',
      status: 'inprogress'
    }
    const repository = new InMemoryTodoListRepository(lists)
    const useCaseInstance = new UpdateTodoUseCase(repository)
    const result = await useCaseInstance.execute(todo.id, listId, todoUpdate)
    const expectedResult = {
      id: todo.id,
      ...todoUpdate,
      createdAt: todo.createdAt
    }
    expect(result.value).to.deep.equal(expectedResult)
    const validateId = await repository.findAll()
    expect(validateId[0].todos).to.deep.equal([expectedResult])
  })
  it('should not find list to update', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCaseInstance = new UpdateTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde', {})
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should not find todo to update', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const repository = new InMemoryTodoListRepository(lists)
    const useCaseInstance = new UpdateTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde', listId, {})
    expect(result.value).to.be.instanceOf(TodoNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoListId: string): Promise<ITodoListWithId | null> {
        throw new Error('This is error')
      }
    }
    const repository = new MockTodoListRepository() as ITodoListRepository
    const useCaseInstance = new UpdateTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde', {})
    expect(result.isLeft()).to.equal(true)
    expect(result.value).instanceOf(UnexpectedError)
  })
})
