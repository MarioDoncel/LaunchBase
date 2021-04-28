const User = require("../models/User")


module.exports = {
    async index(req, res) {
        
        const id = req.session.userId
        const results = await User.findOne({where:{id}})
        const user = results.rows[0]
        
        return res.render("admin/users/profile.njk", {user})
        
    },
    async put(req, res) {
        const user = req.body 
        await User.update(user.id, {
            name: user.name,
            email: user.email
        })
        return res.render("admin/users/profile.njk",{
            user,
            success: 'Cadastro atualizado com sucesso!'
        })
        
    },
}