import crypto from 'crypto'
import { type ITodoInserted, type ITodoBeforeInsert, type ITodoListBeforeInsert, type ITodoListInserted, type IResponseFactoryPayload, type Id } from '../interfaces'
import { todoRepository } from '../repositories'

const todoService = {
  create: async (listId: Id, todoInstance: ITodoBeforeInsert, userId: Id): Promise<IResponseFactoryPayload> => {
    const todoList = await todoRepository.getTodoListById(listId, userId)
    if (!todoList) {
      return {
        statusCode: 400,
        description: `Id ${listId.toString()} of list not found`,
        content: {
        }
      }
    }
    const newTodo = { _id: crypto.randomUUID(), ...todoInstance }
    todoList.todos.push(newTodo)
    const result = await todoRepository.updateTodoList(listId, todoList)
    if (!result) {
      return {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
    }
    return {
      statusCode: 200,
      description: `Inserted on list ${listId.toString()}`,
      content: newTodo
    }
  },

  list: async (listId: Id, userId: Id): Promise<IResponseFactoryPayload> => {
    const result = await todoRepository.getTodoListById(listId, userId)
    if (!result) {
      return {
        statusCode: 404,
        description: 'Id not found',
        content: {
        }
      }
    }
    return {
      statusCode: 200,
      description: `All items of list ${listId.toString()}`,
      content: result
    }
  },
  getById: async (listId: Id, todoId: Id, userId: Id): Promise<IResponseFactoryPayload> => {
    const result = await todoRepository.getById(listId, todoId, userId)
    if (!result) {
      return {
        statusCode: 404,
        description: 'Id not found',
        content: {
        }
      }
    }
    return {
      statusCode: 200,
      description: `GET of ${todoId.toString()} in list ${listId.toString()}`,
      content: result
    }
  },
  delete: async (listId: Id, todoId: Id, userId: Id): Promise<IResponseFactoryPayload> => {
    const todoList = await todoRepository.getTodoListById(listId, userId)
    if (!todoList) {
      return {
        statusCode: 404,
        description: `Id ${listId.toString()} of list not found`,
        content: {
        }
      }
    }
    const indexOfTodoItem = todoList.todos.findIndex(item => item._id === todoId)
    if (indexOfTodoItem === -1) {
      return {
        statusCode: 404,
        description: `Todo id ${todoId.toString()} not found in list ${listId.toString()}`,
        content: {
        }
      }
    }
    todoList.todos.splice(indexOfTodoItem, 1)
    const result = await todoRepository.updateTodoList(listId, todoList)
    if (!result) {
      return {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
    }
    return {
      statusCode: 200,
      description: `Deleted ${todoId.toString()} on list ${listId.toString()}`,
      content: {
        _id: todoId
      }
    }
  },
  update: async (listId: Id, todoId: Id, content: Omit<ITodoInserted, '_id'>, userId: Id): Promise<IResponseFactoryPayload> => {
    const todoList = await todoRepository.getTodoListById(listId, userId)
    if (!todoList) {
      return {
        statusCode: 404,
        description: `Id ${listId.toString()} of list not found`,
        content: {
        }
      }
    }

    const indexOfTodoItem = todoList.todos.findIndex(item => item._id === todoId)
    if (indexOfTodoItem === -1) {
      return {
        statusCode: 404,
        description: `Todo id ${todoId.toString()} not found in list ${listId.toString()}`,
        content: {
        }
      }
    }
    const newTodoContent = {
      _id: todoList.todos[indexOfTodoItem]._id,
      ...content
    }
    todoList.todos[indexOfTodoItem] = newTodoContent

    const result = await todoRepository.updateTodoList(listId, todoList)
    if (!result) {
      return {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
    }
    return {
      statusCode: 200,
      description: `Updated on list ${listId.toString()}`,
      content: newTodoContent
    }
  },
  createTodoList: async (todoList: ITodoListBeforeInsert): Promise<ITodoListInserted> => {
    const result = await todoRepository.createTodoList(todoList)
    return result
  },
  deleteTodoList: async (listId: Id, userId: Id): Promise<IResponseFactoryPayload> => {
    const result = await todoRepository.deleteList(listId, userId)
    if (!result) {
      return {
        statusCode: 500,
        description: 'Something went wrong on todo operation',
        content: {
        }
      }
    }
    return {
      statusCode: 200,
      description: `Deleted on list ${listId.toString()}`,
      content: { _id: listId }
    }
  },
  getTodoLists: async (userId: Id): Promise<IResponseFactoryPayload> => {
    const result = await todoRepository.getTodoLists(userId)
    return {
      statusCode: 200,
      description: 'Get all lists',
      content: result
    }
  }
}

export {
  todoService
}
