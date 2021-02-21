import { Request, Response} from 'express'
import { getRepository } from 'typeorm';
import User from '../models/User';

class UserController {

   index (req: Request, res: Response) {
      return res.send({ userID: req.userId })
   }

   async store (req: Request, res: Response){
        const repository = getRepository(User)  

        const { email, password, name } = req.body

        const userExists = await repository.findOne( { where: { email } } )

        if (userExists) return res.status(409).json({"error": "Usuário já cadastrado."})

        const user = repository.create({email, password, name})
        await repository.save(user)

        return res.status(200).json(user)
   }
}

export default new UserController;