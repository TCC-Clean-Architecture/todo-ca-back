import { expect } from 'chai'

import { CreateNewTodoUseCase } from '../../usecases/create-new-todo/create-new-todo'
import { type ITodo } from '../../entities/interfaces/todo'
import { InMemoryTodoRepository } from '../../usecases/create-new-todo/repository/in-memory-todo-repository'

describe('Create new todo', () => {
  it('should create a new todo', async () => {
    const todo: ITodo = {
      name: 'thisistodo',
      description: 'thisisdescription',
      status: 'todo'
    }
    const todoRepository = new InMemoryTodoRepository([])
    const createNewTodoUseCase = new CreateNewTodoUseCase(todoRepository)
    const result = await createNewTodoUseCase.execute(todo)
    expect(result.isRight()).to.equal(true)
    expect(result.value).to.deep.include(todo)
  })
})
