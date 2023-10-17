import { expect } from 'chai'

import { type ITodo } from '@/entities/interfaces/todo'
import { type ITodoListOptional, type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { InvalidTodoNameError } from '@/entities/todo/errors/invalid-name-error'
import { UnexpectedError } from '@/shared/errors/unexpected-error'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { CreateNewTodoUseCase } from '@/usecases/todo/create-new-todo/create-new-todo'
import { TodoListNotFoundError } from '@/usecases/todo-list/shared/errors/todo-list-not-found-error'

describe('Create new todo', () => {
  it('should create a new todo', async () => {
    const todo: ITodo = {
      name: 'thisistodo',
      description: 'thisisdescription',
      status: 'todo'
    }
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoListRepository = new InMemoryTodoListRepository(lists)
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoListRepository)
    const result = await createNewTodoUseCase.execute(todo, listId)
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.include(todo)
  })
  it('should not find list on create todo', async () => {
    const todo: ITodo = {
      name: 'thisislistname',
      description: 'thisisdescription',
      status: 'todo'
    }
    const todoRepository = new InMemoryTodoListRepository([])
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const result = await createNewTodoUseCase.execute(todo, 'abcde')
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.instanceOf(TodoListNotFoundError)
  })
  it('should not insert todo and return name error', async () => {
    const todo: ITodo = {
      name: 'a',
      description: 'thisisdescription',
      status: 'todo'
    }
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoRepository = new InMemoryTodoListRepository(lists)
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const result = await createNewTodoUseCase.execute(todo, listId)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.instanceOf(InvalidTodoNameError)
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
    const todo: ITodo = {
      name: 'thisistodoname',
      description: 'thisisdescription',
      status: 'todo'
    }
    const lists = [fakeList]
    const listId = lists[0].id
    const todoRepository = new MockTodoListRepository() as ITodoListRepository
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const result = await createNewTodoUseCase.execute(todo, listId)
    const resultValue = result.value as UnexpectedError
    expect(result.isLeft()).to.equal(true)
    expect(resultValue).to.instanceOf(UnexpectedError)
    expect(resultValue.message).to.include('Could not update the list inserting the todo')
  })
  it('should return an error if something unexpected happens', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async update (todoListId: string, content: Partial<ITodoListOptional>): Promise<string | null> {
        throw new Error('This is error')
      }
    }
    const todo: ITodo = {
      name: 'thisistodo',
      description: 'thisisdescription',
      status: 'todo'
    }
    const lists = [todoListFixture()]
    const listId = lists[0].id
    const todoRepository = new MockTodoListRepository() as ITodoListRepository
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const result = await createNewTodoUseCase.execute(todo, listId)
    expect(result.isLeft()).to.equal(true)
    expect(result.value).to.instanceOf(UnexpectedError)
  })
})
