const express = require('express')
const User = require('../models/User')
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const mailer = require('../../modules/mailer')
const authConfig = require('../../config/auth.json')

const router = express.Router();

function genarateToken (params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400, // 1 dia
    } )
}

router.post('/register', async (req,res)  => {

    const { email } = req.body

    try {       
 
        if(await User.findOne( { email  } ))
            return res.status(400).send({error: "Usuário já cadastrado."})
        
        const user = await User.create(req.body)

        user.password = undefined;

        return res.status(200).send( {
            user,
            token: genarateToken({id: user.id})
         })
    }
    catch (error) {
        return res.status(400).send( {error: "Falha no cadastro."})
    }
})

router.post('/authenticate', async(req,res)=> {
    const { email,password } = req.body;

    const user = await User.findOne( { email }).select('+password');

    if (!user) 
        return res.status(400).send({ error: 'Usuário não encontrado'})

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Senha incorreta'})

    user.password = undefined


    res.send({ 
        user, 
        token: genarateToken({id: user.id})
    })    
})

router.post('/forgot_password', async(req,res)=> {
    const { email } = req.body

    try {
        const user = await User.findOne({email})

        if (!user)
            res.status(400).send( {error: "Usuário não encontrado."})

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date();
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set':  {
                passwordResetToken: token,
                passwordResetExpires:  now,
            }
        })

        mailer.sendMail({
            to:email,
            from: 'matheus.felizardo2@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err)=> {
            if( err ) 
                return res.status(400).send({error: "Erro ao enviar e-mail para reset de senha, tente novamente"})
           
            return res.status(200).send({Message: "E-mail de reset de senha enviado com sucesso."});
        })
        

    } catch  (err) {
        res.status(400).send( {error: "Erro no esqueci a senha, tente novamente."})
    }
})

router.post('/reset_password', async(req,res)=> {
    const { email, token, password } = req.body

    try {

        const user = await User.findOne({email})
            .select('+passwordResetToken passwordResetExpires')

        if (!user) 
            return res.status(400).send({error: "Usuário não encontrado."})

        if (token !== user.passwordResetToken)
            return res.status(400).send({error: "Token inválido!"})

        const now = new Date()
        if (now > user.passwordResetExpires)
            return res.status(400).send({error: "Token expirado! Gere um novo token."})

            user.password = password;

            await user.save();
        
        res.status(200).send({Message:"Senha resetada com sucesso."})

    } catch(err) {
        if(err) 
            return res.status(400).send({error: "Não foi possível resetar a senha, tente novamente."})
    }
})

module.exports = app  =>  app.use('/auth', router)