import { expect } from 'chai'

import { type ITodoListWithId } from '@/entities/interfaces/todo-list'
import { type ITodoListRepository } from '@/shared/todo-list-repository'
import { todoListFixture } from '@/tests/helper/fixtures/todo-list-fixture'
import { InMemoryTodoListRepository } from '@/usecases/shared/repository/in-memory-todo-list-repository'
import { FindAllTodoListsUseCase } from '@/usecases/todo-list/find-all-todo-lists/find-all-todo-lists'
import { idConverter } from '@/web-controllers/helper/id-property-name-converter'
import { type IHttpRequestWithTokenData } from '@/web-controllers/port/http-request'
import { FindAllTodoListsController } from '@/web-controllers/todo-list/find-all-todo-lists-controller'

describe('FindAllTodoListsController implementation testing', () => {
  it('should create an instance of find all todo lists controller and return success', async () => {
    const lists: ITodoListWithId[] = [todoListFixture(), todoListFixture()]
    const repository = new InMemoryTodoListRepository(lists)
    const useCase = new FindAllTodoListsUseCase(repository)
    const controllerInstance = new FindAllTodoListsController(useCase)
    const request: IHttpRequestWithTokenData = {
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Find all todos lists executed successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.equal(lists.map(list => idConverter(list)))
  })
  it('should create an instance of find todo lists controller and return error', async () => {
    class MockTodoListRepository implements Partial<ITodoListRepository> {
      async findAll (userId: string): Promise<ITodoListWithId[]> {
        throw new Error('This is error')
      }
    }

    const repository = new MockTodoListRepository() as ITodoListRepository
    const useCase = new FindAllTodoListsUseCase(repository)
    const controllerInstance = new FindAllTodoListsController(useCase)
    const request: IHttpRequestWithTokenData = {
      tokenData: {
        userId: 'userId'
      }
    }
    const response = await controllerInstance.handler(request)
    expect(response.description).to.equal('Error on find all todo lists')
    expect(response.statusCode).to.equal(400)
    expect(response.message).to.equal('Bad Request')
    expect(response.type).to.equal('error')
    // expect(response.content).to.deep.equal(expectedContent)
  })
})
