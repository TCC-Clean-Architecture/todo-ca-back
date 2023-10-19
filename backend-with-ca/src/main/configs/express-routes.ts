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

const routerConfig = (router: Router): void => {
  router.post('/todos/list/:listId', expressRouteAdapter(makeCreateTodoController()))
  router.get('/todos/list/:listId', expressRouteAdapter(makeGetTodoController()))
  router.get('/todos/:todoId/list/:listId', expressRouteAdapter(makeFindSpecificTodoController()))
  router.delete('/todos/:todoId/list/:listId', expressRouteAdapter(makeDeleteTodoController()))
  router.put('/todos/:todoId/list/:listId', expressRouteAdapter(makeUpdateTodoController()))
  router.post('/todos/list', expressRouteAdapter(makeCreateTodoListController()))
  router.delete('/todos/list/:listId', expressRouteAdapter(makeDeleteTodoListController()))
  router.get('/todos/lists', expressRouteAdapter(makeGetTodoListController()))
  router.post('/users/register', expressRouteAdapter(makeCreateUserController()))
  router.post('/authenticate', expressRouteAdapter(makeCreateAuthenticationController()))
}

export { routerConfig }
