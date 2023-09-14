import { type ITodoCreate, type ITodoCreated } from '../interfaces/todoCreate'

const todoFactory = (todoItem: ITodoCreate): ITodoCreated => {
  return {
    name: todoItem.name,
    description: todoItem.description,
    status: todoItem.status,
    createdAt: new Date()
  }
}

export { todoFactory }
