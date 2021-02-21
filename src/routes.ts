import {Router} from 'express'

import authMiddleware from './app/middlewares/AuthMiddleware'

import UserController from './app/controllers/UserController'
import AuthController from './app/controllers/AuthController'

const routes = Router()

routes.post("/user/create", UserController.create)
routes.get("/users/show", UserController.show)
routes.delete("/user/delete", authMiddleware,UserController.delete)

routes.put("/user/update", authMiddleware, UserController.update)
routes.get("/user/validate", authMiddleware, UserController.index) // Verificar se o token é valido e concluir o login

routes.post("/user/auth", AuthController.authenticate) // Recebe usuário e senha para gerar o token



export default routes