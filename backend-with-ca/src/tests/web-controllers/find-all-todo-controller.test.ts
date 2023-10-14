import { expect } from 'chai'

import { todoFixture } from '@/tests/helper/fixtures/todo-fixture'
import { InMemoryTodoRepository } from '@/usecases/shared/repository/in-memory-todo-repository'
import { FindAllTodoUseCase } from '@/usecases/todo/find-all-todos/find-all-todos'
import { FindAllTodoController } from '@/web-controllers/find-all-todo-controller'

describe('FindAllTodoController implementation testing', () => {
  it('should find all instances created  and return success', async () => {
    const fakeTodo = todoFixture()
    const todoRepository = new InMemoryTodoRepository([fakeTodo, fakeTodo])
    const findAllTodosUseCase = new FindAllTodoUseCase(todoRepository)
    const controllerInstance = new FindAllTodoController(findAllTodosUseCase)
    const response = await controllerInstance.handler()
    expect(response.description).to.equal('Find all todos executed successfully')
    expect(response.statusCode).to.equal(200)
    expect(response.message).to.equal('OK')
    expect(response.type).to.equal('success')
    expect(response.content).to.deep.equal([fakeTodo, fakeTodo])
  })
})
