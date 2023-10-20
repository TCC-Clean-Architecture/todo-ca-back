import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindTodoByIdUseCase } from '@/usecases/todo/find-todo-by-id/find-todo-by-id'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('Find todo by id', () => {
  it('should find todo by id', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todo = lists[0].todos[0]
    const repository = new InMemoryTodoListRepository(lists)
    const useCaseInstance = new FindTodoByIdUseCase(repository)
    const result = await useCaseInstance.execute(todo.id, listId)
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.equal(todo)
  })
  it('should not find list to get from', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCaseInstance = new FindTodoByIdUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde')
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should not find todo from list', async () => {
    const repository = new InMemoryTodoListRepository([{
      id: 'abcde',
      name: 'thisisname',
      todos: [],
      userId: 'userId'
    }])
    const useCaseInstance = new FindTodoByIdUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde')
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
    const useCaseInstance = new FindTodoByIdUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).instanceOf(UnexpectedError)
  })
})
