import express from 'express'
import { authenticationController } from '../controllers/authenticationController'

const authenticationRouter = express.Router()

authenticationRouter.post('/', authenticationController.authenticate)

export {
  authenticationRouter
}
