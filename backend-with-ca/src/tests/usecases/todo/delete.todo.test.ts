import { expect } from 'chai'

import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { DeleteTodoUseCase } from '@/usecases/todo/delete-todo/delete-todo'
import { TodoNotFoundError } from '@/usecases/todo/shared/errors/todo-not-found-error'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('Delete todo use case testing', () => {
  it('should delete todo', async () => {
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoId = lists[0].todos[0].id
    const repository = new InMemoryTodoListRepository(lists)
    const todoListBefore = await repository.findById(listId)
    expect(todoListBefore?.todos.length).to.equal(1)
    const useCaseInstance = new DeleteTodoUseCase(repository)
    const result = await useCaseInstance.execute(todoId, listId)
    expect(result.value).to.equal(todoId)
    expect(result.isRight()).to.equal(true)
    const todoListAfter = await repository.findById(listId)
    expect(todoListAfter?.todos.length).to.equal(0)
  })
  it('should not find list to delete from', async () => {
    const repository = new InMemoryTodoListRepository([])
    const useCaseInstance = new DeleteTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde')
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should not find todo to delete from list', async () => {
    const repository = new InMemoryTodoListRepository([{
      id: 'abcde',
      name: 'thisisname',
      todos: []
    }])
    const useCaseInstance = new DeleteTodoUseCase(repository)
    const result = await useCaseInstance.execute('abcde', 'abcde')
    expect(result.value).to.be.instanceOf(TodoNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
  it('should return error on update', async () => {
    const fakeList = todoListFixture()
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoListId: string): Promise<ITodoListWithId | null> {
        return fakeList
      }

      async update (todoListId: string, content: Partial<ITodoListOptional>): Promise<string | null> {
        return null
      }
    }
    const lists = [fakeList]
    const listId = lists[0].id
    const todoId = lists[0].todos[0].id
    const repository = new MockTodoListRepository() as ITodoListRepository
    const useCaseInstance = new DeleteTodoUseCase(repository)
    const result = await useCaseInstance.execute(todoId, listId)
    const resultValue = result.value as UnexpectedError
    expect(resultValue).to.be.instanceOf(UnexpectedError)
    expect(resultValue.message).to.include('Could not update the list deleting todo')
    expect(result.isLeft()).to.equal(true)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoListId: string): Promise<ITodoListWithId | null> {
        throw new Error('This is error')
      }
    }
    const todoRepository = new MockTodoListRepository() as ITodoListRepository
    const useCaseInstance = new DeleteTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute('abcde', 'abcde')
    const resultValue = result.value as UnexpectedError
    expect(resultValue).to.be.instanceOf(UnexpectedError)
    expect(resultValue.message).to.include('Something went wrong on attempt to delete todo')
    expect(result.isLeft()).to.equal(true)
  })
})
