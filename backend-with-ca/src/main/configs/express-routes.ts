import { type Router } from 'express'

import { expressRouteAdapter } from '@/main/adapters/express-route-adapter'
import {
  makeCreateTodoController,
  makeCreateTodoListController,
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
  router.post('/list', expressRouteAdapter(makeCreateTodoListController()))
  router.delete('/list/:listId', expressRouteAdapter(makeDeleteTodoListController()))
  router.get('/lists', expressRouteAdapter(makeGetTodoListController()))
}

export { routerConfig }
