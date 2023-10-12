import { type Router } from 'express'
import { expressRouteAdapter } from '../adapters/express-route-adapter'
import { makeCreateTodoController } from '../factories/create-todo'

const routerConfig = (router: Router): void => {
  router.post('/todos', expressRouteAdapter(makeCreateTodoController()))
}

export { routerConfig }
