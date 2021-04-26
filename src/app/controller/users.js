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
        user.is_Admin ? user.is_Admin = true : user.is_Admin = false
        user.password = "123456" // Password padrão na criação de usário pelo ADMIN

        const results = await User.create(user)
        const userId = results.rows[0]

        return res.redirect("userAdmin/")
        
    },
    async create(req, res) {
        
        return res.render("admin/users/create")
        
    },
    async put(req, res) {
        
        return res.render("/")
        
    },
    async edit(req, res) {
        
        return res.render("admin/users/edit")
        
    },
    async delete(req, res) {
        
        return res.render("/")
        
    },
}