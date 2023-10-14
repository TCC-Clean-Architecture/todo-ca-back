import { expect } from 'chai'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { type ITodoWithId } from '../../entities/interfaces/todo'
import { DeleteTodoUseCase } from '../../usecases/todo/delete-todo/delete-todo'
import { TodoNotFoundError } from '../../usecases/todo/create-new-todo/errors/todo-not-found-error'

describe('Delete todo use case testing', () => {
  it('should delete todo', async () => {
    const todo: ITodoWithId = {
      id: 'id',
      name: 'name',
      description: 'description',
      status: 'todo',
      createdAt: new Date()
    }
    const todoRepository = new InMemoryTodoRepository([todo])
    const useCaseInstance = new DeleteTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute(todo.id)
    expect(result.value).to.equal(todo.id)
    expect(result.isRight()).to.equal(true)
  })
  it('should not find todo to delete', async () => {
    const todoRepository = new InMemoryTodoRepository([])
    const useCaseInstance = new DeleteTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute('abcde')
    expect(result.value).to.be.instanceOf(TodoNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
})
