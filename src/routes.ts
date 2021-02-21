import {Router} from 'express'

import authMiddleware from './app/middlewares/AuthMiddleware'

import UserController from './app/controllers/UserController'
import AuthController from './app/controllers/AuthController'

const routes = Router()

routes.post("/users/create", UserController.store)
routes.get("/users", authMiddleware, UserController.index)

routes.post("/users/auth", AuthController.authenticate)



export default routes