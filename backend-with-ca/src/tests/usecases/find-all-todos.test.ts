import { expect } from 'chai'
import { FindAllTodoUseCase } from '../../usecases/find-all-todos/find-all-todos'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'

describe('Find all todo use case testing', () => {
  it('should list empty list of todos', () => {
    const todoRepository = new InMemoryTodoRepository([])
    const useCaseInstance = new FindAllTodoUseCase(todoRepository)
    const result = useCaseInstance.execute()
    expect(result).to.deep.equal([])
  })
})
