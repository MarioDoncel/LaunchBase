const User = require('../models/User')

module.exports = {
    async list(req, res) {
        const results = await User.all()
        const users = results.rows

        return res.render("admin/users/users",{users})
        
    },
    async post(req, res) {
        
        return res.render("/")
        
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