import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { DeleteTodoListUseCase } from '@/usecases/todo-list/delete-todo-list/delete-todo-list'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('Delete todo list by id use case testing', () => {
  it('should delete one todo list', async () => {
    const todoList: ITodoListWithId[] = [todoListFixture()]
    const expectedId = todoList[0].id
    const todoListRepository = new InMemoryTodoListRepository(todoList)
    const useCase = new DeleteTodoListUseCase(todoListRepository)
    const result = await useCase.execute(expectedId, 'userId')
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.equal(expectedId)
  })
  it('should return an error if not find some item to delete', async () => {
    const todoListRepository = new InMemoryTodoListRepository([])
    const useCase = new DeleteTodoListUseCase(todoListRepository)
    const result = await useCase.execute('abcde', 'userId')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async delete (todoId: string, userId: string): Promise<string | null> {
        throw new Error('This is error')
      }
    }
    const todoListRepository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new DeleteTodoListUseCase(todoListRepository)
    const result = await useCase.execute('abcde', 'userId')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UnexpectedError)
  })
})
