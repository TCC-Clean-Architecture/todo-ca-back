import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type Either } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindTodoListByIdUseCase } from '@/usecases/todo-list/find-todo-list-by-id/find-todo-list-by-id'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('List todo list by id use case testing', () => {
  it('should list one todo list with todos', async () => {
    const todoList: ITodoListWithId[] = [todoListFixture()]
    const todoListRepository = new InMemoryTodoListRepository(todoList)
    const useCase = new FindTodoListByIdUseCase(todoListRepository)
    const result = await useCase.execute(todoList[0].id) as Either<null, ITodoListWithId>
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.include(todoList[0])
  })
  it('should return an error if not find some list', async () => {
    const todoListRepository = new InMemoryTodoListRepository([])
    const useCase = new FindTodoListByIdUseCase(todoListRepository)
    const result = await useCase.execute('abcde')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoId: string): Promise<ITodoListWithId> {
        throw new Error('This is error')
      }
    }
    const todoListRepository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new FindTodoListByIdUseCase(todoListRepository)
    const result = await useCase.execute('abcde')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UnexpectedError)
  })
})
