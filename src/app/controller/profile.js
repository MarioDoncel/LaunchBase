const User = require("../models/User")


module.exports = {
    async index(req, res) {
        
        const id = req.session.userId
        const user = await User.findOne({where:{id}})
        
        return res.render("admin/users/profile.njk", {
            user,
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
        
    },
    async put(req, res) {
        const user = req.body 
        await User.update(user.id, {
            name: user.name,
            email: user.email
        })

        req.flash('success', "Cadastro atualizado com sucesso!")
        return res.redirect("/admin/user")
    },
}