const db = require('../../config/db')
const User = require('../models/User')


module.exports = {
    async list(req, res) {
        const results = await User.all()
        const users = results.rows

        return res.render("admin/users/users",{users})
        
    },
    async post(req, res) {
        const user = req.body
        user.is_admin ? user.is_admin = true : user.is_admin = false
        user.password = "123456" // Password padrão na criação de usário pelo ADMIN

        const results = await User.create(user)
        const userId = results.rows[0]

            return res.redirect("userAdmin/", {success: 'Usuário cadastrado com sucesso!'})
        
    },
    async create(req, res) {
        return res.render("admin/users/create")
    },
    async put(req, res) {
        const user = req.body
        user.is_admin ? user.is_admin = true : user.is_admin = false
        await User.update(user)
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
        return res.redirect("/admin/userAdmin", {success: 'Exclusão realizada com sucesso!'})
    },
}