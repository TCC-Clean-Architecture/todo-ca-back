import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type Either } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindAllTodoListsUseCase } from '@/usecases/todo-list/find-all-todo-lists/find-all-todo-lists'

describe('List todo list by id use case testing', () => {
  it('should list all todo lists with todos', async () => {
    const todoList: ITodoListWithId[] = [todoListFixture(), todoListFixture()]
    const todoListRepository = new InMemoryTodoListRepository(todoList)
    const useCase = new FindAllTodoListsUseCase(todoListRepository)
    const result = await useCase.execute('userId') as Either<null, ITodoListWithId[]>
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.equal(todoList)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findAll (userId: string): Promise<ITodoListWithId[]> {
        throw new Error('This is error')
      }
    }
    const todoListRepository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new FindAllTodoListsUseCase(todoListRepository)
    const result = await useCase.execute('userId')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UnexpectedError)
  })
})
