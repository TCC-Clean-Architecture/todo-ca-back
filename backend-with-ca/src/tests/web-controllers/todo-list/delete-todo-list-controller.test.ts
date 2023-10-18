import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { DeleteTodoListUseCase } from '@/usecases/todo-list/delete-todo-list/delete-todo-list'
import { DeleteTodoListController } from '@/web-controllers/todo-list/delete-todo-list-controller'

describe('DeleteTodoListController implementation testing', () => {
  it('should create an instance of delete todo list controller and return success', async () => {
    const lists: ITodoListWithId[] = [todoListFixture(), todoListFixture()]
    const expectedId = lists[1].id
    const repository = new InMemoryTodoListRepository(lists)
    const useCase = new DeleteTodoListUseCase(repository)
    const controllerInstance = new DeleteTodoListController(useCase)
    const request = {
      params: {
        listId: expectedId
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Delete todo list executed successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.equal({
      _id: expectedId
    })
  })
  it('should create an instance of find todo list by id and return error', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async delete (todoId: string): Promise<string | null> {
        throw new Error('This is error')
      }
    }

    const repository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new DeleteTodoListUseCase(repository)
    const controllerInstance = new DeleteTodoListController(useCase)
    const request = {
      params: {
        listId: 'abcde'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on delete todo list')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'UnexpectedError: Something went wrong on attempt to delete todo list.'
    })
  })
})
