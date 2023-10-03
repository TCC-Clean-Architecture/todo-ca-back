import { type Request, type Response } from 'express'
import { responseFactory, todoFactory } from '../factories'
import { todoService } from '../services/todoService'
import { type ITodoList, type ITodoBase } from '../interfaces'
import { todoListFactory } from '../factories/todoList'

const todoController = {
  post: async (req: Request, res: Response) => {
    try {
      const listId = req.params.listId
      const { userId } = req.tokenData
      const todoItem: ITodoBase = req.body
      const todoInstance = todoFactory(todoItem)
      if (todoInstance instanceof Error) {
        return res.status(400).json(responseFactory({
          statusCode: 400,
          description: 'The sent contract is not correct.',
          content: {
            error: todoInstance.message
          }
        }))
      }
      const result = await todoService.create(listId, todoInstance, userId)
      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const { listId } = req.params
      const { userId } = req.tokenData
      const result = await todoService.list(listId, userId)
      res.status(200).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { todoId, listId } = req.params
      const { userId } = req.tokenData
      const result = await todoService.getById(listId, todoId, userId)
      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { todoId, listId } = req.params
      const { userId } = req.tokenData
      const result = await todoService.delete(listId, todoId, userId)
      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { body } = req
      const { todoId, listId } = req.params
      const { userId } = req.tokenData
      const result = await todoService.update(listId, todoId, body, userId)

      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  createList: async (req: Request, res: Response) => {
    try {
      const body: Omit<ITodoList, 'todos'> = req.body
      const todoListInstance = todoListFactory(body, req.tokenData.userId)
      if (todoListInstance instanceof Error) {
        return res.status(400).json(responseFactory({
          statusCode: 400,
          description: 'The sent contract is not correct.',
          content: {
            error: todoListInstance.message
          }
        }))
      }
      const result = await todoService.createTodoList(todoListInstance)
      res.status(200).json(responseFactory({
        statusCode: 200,
        description: 'Todo list created successfuly',
        content: result
      }))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  deleteList: async (req: Request, res: Response) => {
    try {
      const { listId } = req.params
      const { userId } = req.tokenData
      const result = await todoService.deleteTodoList(listId, userId)
      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  },
  getLists: async (req: Request, res: Response) => {
    try {
      const tokenData = req.tokenData
      const result = await todoService.getTodoLists(tokenData.userId)
      res.status(result.statusCode).json(responseFactory(result))
    } catch (err: any) {
      return res.status(500).json(responseFactory({
        statusCode: 500,
        description: 'Something went wrong',
        content: {
          error: err
        }
      }))
    }
  }
}

export { todoController }
