const db = require('../../config/db')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')


module.exports = {
    async list(req, res) {
        const results = await User.all()
        const users = results.rows

        return res.render("admin/users/users",{users})
        
    },
    async post(req, res) {
        const newUser = req.body
        newUser.is_admin ? newUser.is_admin = true : newUser.is_admin = false
        const password = crypto.randomBytes(4).toString('hex')// Password aleatório na criação de usário pelo ADMIN
        newUser.password = await hash(password,8)  
        
        let results = await User.create(newUser)
        
        const id = results.rows[0].id
        
        results = await User.findOne({where:{id}})
        const user = results.rows[0]
        
        // criar token
        const token = crypto.randomBytes(20).toString('hex')
        //ciar  validade do token
        const now = new Date()
        const expires = now.setHours(now.getHours()+1)
        await User.update(user.id, {
            reset_token: token,
            reset_token_expires: expires
        })
        
        // enviar email com link para usuario definir (token)
        await mailer.sendMail({
            to:user.email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Recuperação de senha',
            html: `<h2>Você foi cadastrado como usuario do FOODFY</h2>
            <p>Por favor acesse o link abaixo para definir sua senha de acesso.</p>
            <p>
                <a href="http://localhost:3000/admin/user/password-reset?token=${token}" target="_blank">
                    DEFINIR SENHA
                </a>
            </p>
            <p>Ou realize o login com a senha automática abaixo.</p>
            <p>
                SENHA : ${password} <br>
                <a href="http://localhost:3000/admin/user/login" target="_blank">
                    REALIZAR LOGIN
                </a>
            </p>
            `
        })

        results = await User.all()
        const users = results.rows

        return res.render("admin/users/users", {
            users,
            success: 'Usuário cadastrado com sucesso!'
        })
        
    },
    async create(req, res) {
        return res.render("admin/users/create")
    },
    async put(req, res) {
        const user = req.body
        user.is_admin ? user.is_admin = true : user.is_admin = false
        await User.update(user.id, {
            name: user.name,
            email: user.email,
            is_admin: user.is_admin
        })
        return res.redirect("/admin/userAdmin",{success: 'Cadastro atualizado com sucesso!'})
        
    },
    async edit(req, res) {
        const id = req.params.id
        const results = await User.findOne({where:{id}})
        const user = results.rows[0]
        return res.render("admin/users/edit", {user})
    },
    async delete(req, res) {
        const id = req.params.id 
        await User.delete(id)
        return res.redirect("/admin/userAdmin")
    },
}