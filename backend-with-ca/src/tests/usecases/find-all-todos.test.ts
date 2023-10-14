import { expect } from 'chai'
import { FindAllTodoUseCase } from '@/usecases/todo/find-all-todos/find-all-todos'
import { InMemoryTodoRepository } from '@/usecases/shared/repository/in-memory-todo-repository'
import { type ITodoWithId } from '@/entities/interfaces/todo'

describe('Find all todo use case testing', () => {
  it('should return all todos inserted', async () => {
    const todos: ITodoWithId = {
      id: 'id',
      name: 'name',
      description: 'description',
      status: 'todo',
      createdAt: new Date()
    }
    const todoRepository = new InMemoryTodoRepository([todos, todos])
    const useCaseInstance = new FindAllTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute()
    expect(result.value).to.deep.equal([todos, todos])
    expect(result.isRight()).to.equal(true)
  })
  it('should list empty list of todos', async () => {
    const todoRepository = new InMemoryTodoRepository([])
    const useCaseInstance = new FindAllTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute()
    expect(result.value).to.deep.equal([])
    expect(result.isRight()).to.equal(true)
  })
})
