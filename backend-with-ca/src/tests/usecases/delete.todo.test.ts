import { expect } from 'chai'
import { InMemoryTodoRepository } from '../../usecases/shared/repository/in-memory-todo-repository'
import { type ITodoWithId } from '../../entities/interfaces/todo'
import { DeleteTodoUseCase } from '../../usecases/delete-todo/delete-todo'

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
})
