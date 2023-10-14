import { expect } from 'chai'
import { InMemoryTodoRepository } from '@/usecases/shared/repository/in-memory-todo-repository'
import { type ITodo, type ITodoWithId } from '@/entities/interfaces/todo'
import { UpdateTodoUseCase } from '@/usecases/todo/update-todo/update-todo'
import { TodoNotFoundError } from '@/usecases/todo/create-new-todo/errors/todo-not-found-error'

describe('Update todo use case testing', () => {
  it('should update todo', async () => {
    const todo: ITodoWithId = {
      id: 'id',
      name: 'name',
      description: 'description',
      status: 'todo',
      createdAt: new Date()
    }
    const todoUpdate: ITodo = {
      name: 'dataupdated',
      description: 'dataupdated',
      status: 'inprogress'
    }
    const todoRepository = new InMemoryTodoRepository([todo])
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute(todo.id, todoUpdate)
    const expectedResult = {
      id: todo.id,
      ...todoUpdate,
      createdAt: todo.createdAt
    }
    expect(result.value).to.deep.equal(expectedResult)
    const validateId = await todoRepository.findAll()
    expect(validateId).to.deep.equal([expectedResult])
  })
  it('should not find todo to update', async () => {
    const todoRepository = new InMemoryTodoRepository([])
    const useCaseInstance = new UpdateTodoUseCase(todoRepository)
    const result = await useCaseInstance.execute('abcde', {})
    expect(result.value).to.be.instanceOf(TodoNotFoundError)
    expect(result.isLeft()).to.equal(true)
  })
})
