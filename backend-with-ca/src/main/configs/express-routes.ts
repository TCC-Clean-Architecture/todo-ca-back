import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { makeCreateTodoController, makeGetTodoController, makeFindSpecificTodoController, makeDeleteTodoController, makeUpdateTodoController } from '../factories'

const routerConfig = (router: Router): void => {
  router.post('/todos', expressRouteAdapter(makeCreateTodoController()))
  router.get('/todos', expressRouteAdapter(makeGetTodoController()))
  router.get('/todos/:id', expressRouteAdapter(makeFindSpecificTodoController()))
  router.delete('/todos/:id', expressRouteAdapter(makeDeleteTodoController()))
  router.put('/todos/:id', expressRouteAdapter(makeUpdateTodoController()))
}

export { routerConfig }
