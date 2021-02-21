import { Request, Response} from 'express'
import { getRepository } from 'typeorm';
import User from '../models/User';
import bcrypt from 'bcryptjs'

class UserController {   
   async create (req: Request, res: Response){
        const repository = getRepository(User)  

        const { email, password, name } = req.body

        const userExists = await repository.findOne( { where: { email } } )

        if (userExists) return res.status(409).json({"error": "Usuário já cadastrado."})

        const user = repository.create({email, password, name})
        await repository.save(user)

        return res.status(200).json(user)
   }
   async show (req: Request, res: Response) {
      const repository = getRepository(User)  
      const users = await repository.find()

      users.forEach((user)=> {
         delete user.password
      })
      
      return res.send(users)
   }
   index (req: Request, res: Response) {
      return res.send({ userID: req.userId })
   }
   async delete (req: Request, res: Response) {      
      const repository = getRepository(User)  

      const user = await repository.delete({id: req.userId})
      
      if (!user) return res.status(404).json({"error": "Usuário não encontrado."})
      
      
      return res.status(200).json({"message": "Usuário deletado com sucesso."})

   }
   async update (req: Request, res: Response) {      
      const repository = getRepository(User)  
      const { email, password, name } = req.body
      
      const userId = req.userId
      
      if (!userId) return res.status(409).json({"error": "Sem autorização."})

      const newPassword = bcrypt.hashSync(password)

      await repository.update( userId, { email, password: newPassword, name } )
      
      const updatedUser = await repository.findOne(userId)
      delete updatedUser.password

      return res.status(200).json(updatedUser)

   }
}

export default new UserController;