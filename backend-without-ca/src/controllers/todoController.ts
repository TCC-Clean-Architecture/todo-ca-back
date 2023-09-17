import { type Request, type Response } from 'express'
import { responseFactory, todoFactory } from '../factories'
import { todoService } from '../services/todoService'
import { type ITodoBase } from '../interfaces'

const todoController = {
  post: async (req: Request, res: Response) => {
    try {
      const { body } = req

      const todoItem: ITodoBase = body
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
      const result = await todoService.create(todoInstance)
      res.status(200).json(responseFactory({
        statusCode: 200,
        description: 'Todo created successfuly',
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
  get: async (req: Request, res: Response) => {
    try {
      const result = await todoService.list()
      res.status(200).json(responseFactory({
        statusCode: 200,
        description: 'GET of all todos',
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
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await todoService.getById(id)
      if (!result) {
        return res.status(404).json(responseFactory({
          statusCode: 404,
          description: 'Id not found',
          content: {
          }
        }))
      }
      res.status(200).json(responseFactory({
        statusCode: 200,
        description: `GET of ${id}`,
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
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await todoService.delete(id)
      if (!result) {
        return res.status(404).json(responseFactory({
          statusCode: 404,
          description: 'Id not found',
          content: {
          }
        }))
      }
      res.status(200).json(responseFactory({
        statusCode: 200,
        description: `DELETE of ${id}`,
        content: {
          _id: id
        }
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
  update: async (req: Request, res: Response) => {
    try {
      const { body } = req
      const { id } = req.params
      const result = await todoService.update(id, body)
      if (!result) {
        return res.status(404).json(responseFactory({
          statusCode: 404,
          description: 'Id not found',
          content: {
          }
        }))
      }
      res.status(200).json(responseFactory({
        statusCode: 200,
        description: `UPDATE of ${id}`,
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
  }
}

export { todoController }
