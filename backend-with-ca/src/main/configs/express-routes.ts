import { type Router } from 'express'

import { expressRouteAdapter } from '@/main/adapters/express-route-adapter'
import {
  makeCreateAuthenticationController,
  makeCreateTodoController,
  makeCreateTodoListController,
  makeCreateUserController,
  makeDeleteTodoController,
  makeDeleteTodoListController,
  makeFindSpecificTodoController,
  makeGetTodoController,
  makeGetTodoListController,
  makeUpdateTodoController
} from '@/main/factories'

import { validateJwtMiddleware } from '../middlewares/validate-jwt'

const routerConfig = (router: Router): void => {
  router.post('/todos/list/:listId', validateJwtMiddleware, expressRouteAdapter(makeCreateTodoController()))
  router.get('/todos/list/:listId', validateJwtMiddleware, expressRouteAdapter(makeGetTodoController()))
  router.get('/todos/:todoId/list/:listId', validateJwtMiddleware, expressRouteAdapter(makeFindSpecificTodoController()))
  router.delete('/todos/:todoId/list/:listId', validateJwtMiddleware, expressRouteAdapter(makeDeleteTodoController()))
  router.put('/todos/:todoId/list/:listId', validateJwtMiddleware, expressRouteAdapter(makeUpdateTodoController()))
  router.post('/todos/list', validateJwtMiddleware, expressRouteAdapter(makeCreateTodoListController()))
  router.delete('/todos/list/:listId', validateJwtMiddleware, expressRouteAdapter(makeDeleteTodoListController()))
  router.get('/todos/lists', validateJwtMiddleware, expressRouteAdapter(makeGetTodoListController()))
  router.post('/users/register', expressRouteAdapter(makeCreateUserController()))
  router.post('/authenticate', expressRouteAdapter(makeCreateAuthenticationController()))
}

export { routerConfig }
