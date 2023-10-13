import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { makeCreateTodoController } from '../factories/create-todo'
import { makeGetTodoController } from '../factories/find-all-todos'
import { makeFindSpecificTodoController } from '../factories/find-todo'
import { makeDeleteTodoController } from '../factories/delete-todo'
import { makeUpdateTodoController } from '../factories/update-todo'

const routerConfig = (router: Router): void => {
  router.post('/todos', expressRouteAdapter(makeCreateTodoController()))
  router.get('/todos', expressRouteAdapter(makeGetTodoController()))
  router.get('/todos/:id', expressRouteAdapter(makeFindSpecificTodoController()))
  router.delete('/todos/:id', expressRouteAdapter(makeDeleteTodoController()))
  router.put('/todos/:id', expressRouteAdapter(makeUpdateTodoController()))
}

export { routerConfig }
