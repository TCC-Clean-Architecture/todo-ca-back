import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindAllTodoUseCase } from '@/usecases/todo/find-all-todos/find-all-todos'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('Find all todo use case testing', () => {
  it('should return all todos inserted', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoRepository = new InMemoryTodoListRepository(lists)
    const useCaseInstance = new FindAllTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute(listId)
    expect(result.value).to.deep.equal(lists[0])
    expect(result.isRight()).to.equal(true)
  })
  it('should not find the list', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCaseInstance = new FindAllTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde')
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should return an error when findAll throws an exception', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoListId: string): Promise<ITodoListWithId | null> {
        throw new Error('Method not implemented.')
      }
    }
    const repository = new MockTodoListRepository() as ITodoListRepository
    const useCaseInstance = new FindAllTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UnexpectedError)
  })
})
