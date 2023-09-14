import express from 'express'
import { todoController } from '../controllers/todoController'

const todoRouter = express.Router()

todoRouter.post('/', todoController.post)
todoRouter.get('/', todoController.get)
todoRouter.get('/:id', todoController.getById)

export {
  todoRouter
}
