import { expect } from 'chai'

import { type ITodoList, type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { InvalidTodosOnList } from '@/entities/todo-list/errors/invalid-todos-on-list'
import { type Either } from '@/shared/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'
import { UpdateTodoListUseCase } from '@/usecases/todo-list/update-todo-list/update-todo-list'

describe('Update todo list by id use case testing', () => {
  it('should list one todo list with todos', async () => {
    const todoList: ITodoListWithId[] = [todoListFixture()]
    const updateContent: ITodoList = {
      name: 'updatedContent',
      todos: [todoFixture(), todoFixture()]
    }
    const todoListRepository = new InMemoryTodoListRepository(todoList)
    const useCase = new UpdateTodoListUseCase(todoListRepository)
    const result = await useCase.execute(todoList[0].id, updateContent) as Either<null, ITodoListWithId>
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.include(updateContent)
    expect(await todoListRepository.findById(todoList[0].id)).to.deep.include(updateContent)
  })
  it('should return an error if not find some list', async () => {
    const todoListRepository = new InMemoryTodoListRepository([])
    const useCase = new UpdateTodoListUseCase(todoListRepository)
    const result = await useCase.execute('abcde', {})
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
  })
  it('should return an error when the update content is not valid', async () => {
    const todoList: ITodoListWithId[] = [todoListFixture()]
    const updateContent: ITodoList = {
      name: 'thisisname',
      todos: [todoFixture(), { id: 'a', createdAt: new Date(), description: 'desc', name: 'nam', status: 'inprogress' }]
    }
    const todoListRepository = new InMemoryTodoListRepository(todoList)
    const useCase = new UpdateTodoListUseCase(todoListRepository)
    const result = await useCase.execute(todoList[0].id, updateContent)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(InvalidTodosOnList)
  })
  it('should return an error when something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoId: string): Promise<ITodoListWithId> {
        throw new Error('This is error')
      }
    }
    const todoListRepository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new UpdateTodoListUseCase(todoListRepository)
    const result = await useCase.execute('abcde', {})
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(UnexpectedError)
  })
  it('should return an error when not find todolist to update', async () => {
    const todoList: ITodoListWithId[] = [todoListFixture()]
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoId: string): Promise<ITodoListWithId> {
        return todoList[0]
      }

      async update (listId: string, content: Partial<ITodoListOptional>): Promise<null | string> {
        return null
      }
    }
    const todoListRepository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new UpdateTodoListUseCase(todoListRepository)
    const result = await useCase.execute(todoList[0].id, {}) as Either<null, ITodoListWithId>
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.be.instanceOf(TodoListNotFoundError)
  })
})
