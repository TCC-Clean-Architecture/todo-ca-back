import express from 'express'
import { todoController } from '../controllers/todoController'

const todoRouter = express.Router()

todoRouter.post('/list/:listId', todoController.post)
todoRouter.get('/list/:listId', todoController.get)
todoRouter.get('/:todoId/list/:listId', todoController.getById)
todoRouter.delete('/:todoId/list/:listId', todoController.delete)
todoRouter.put('/:todoId/list/:listId', todoController.update)

todoRouter.post('/list', todoController.createList)
todoRouter.delete('/list/:listId', todoController.deleteList)
todoRouter.get('/lists', todoController.getLists)

export {
  todoRouter
}
