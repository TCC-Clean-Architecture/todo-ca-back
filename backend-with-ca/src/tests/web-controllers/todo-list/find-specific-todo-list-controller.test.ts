import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindTodoListByIdUseCase } from '@/usecases/todo-list/find-todo-list-by-id/find-todo-list-by-id'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type IHttpRequestWithParams } from '@/web-controllers/port/http-request'
import { FindSpecificTodoListController } from '@/web-controllers/todo-list/find-specific-todo-list-controller'

describe('FindSpecificTodoListController implementation testing', () => {
  it('should create an instance of find todo list by id controller and return success', async () => {
    const lists: ITodoListWithId[] = [todoListFixture(), todoListFixture()]
    const repository = new InMemoryTodoListRepository(lists)
    const useCase = new FindTodoListByIdUseCase(repository)
    const controllerInstance = new FindSpecificTodoListController(useCase)
    const request: IHttpRequestWithParams<Pick<ITodoListWithId, 'id'>> = {
      params: {
        id: lists[0].id
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Find todo list executed successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.equal(idConverter(lists[0]))
  })
  it('should create an instance of find todo list by id and return error', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findById (todoId: string): Promise<ITodoListWithId> {
        throw new Error('This is error')
      }
    }

    const repository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new FindTodoListByIdUseCase(repository)
    const controllerInstance = new FindSpecificTodoListController(useCase)
    const request: IHttpRequestWithParams<Pick<ITodoListWithId, 'id'>> = {
      params: {
        id: 'abcde'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on find todo list by id')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    expect(response.content).to.deep.equal({
      message: 'UnexpectedError: Something went wrong on attempt to find todo list by id.'
    })
  })
})
