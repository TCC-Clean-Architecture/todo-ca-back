import { type Request, type Response } from 'express'
import * as yup from 'yup'
import { todoFactory } from '../factories/todo'
import { todoService } from '../services/todoService'

const todoController = {
  post: async (req: Request, res: Response) => {
    const { body } = req
    const yupValidation = yup.object({
      name: yup.string().min(1).required(),
      description: yup.string().min(1).required(),
      status: yup.string().oneOf(['todo', 'inprogress', 'done']).required()
    })
    await yupValidation.validate(body).catch((err) => {
      return res.status(400).json({
        statusCode: 400,
        message: 'Bad Request',
        description: 'The sent contract is not correct.',
        content: {
          errors: err.errors.join(' | ')
        }
      })
    })

    const todoInstance = todoFactory({
      name: body.name,
      description: body.description,
      status: body.status
    })

    const result = await todoService.create(todoInstance)
    res.status(200).json(result)
  },
  get: async (req: Request, res: Response) => {
    const result = await todoService.list()
    res.status(200).json(result)
  },
  getById: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await todoService.getById(id)
    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Not found',
        description: 'Id not found',
        content: {
        }
      })
    }
    res.status(200).json(result)
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await todoService.delete(id)
    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Not found',
        description: 'Id not found',
        content: {
        }
      })
    }
    res.status(200).json(result)
  },
  update: async (req: Request, res: Response) => {
    const { body } = req
    const { id } = req.params
    const result = await todoService.update(id, body)
    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Not found',
        description: 'Id not found',
        content: {
        }
      })
    }
    res.status(200).json(result)
  }
}

export { todoController }
