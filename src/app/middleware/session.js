const Recipe = require("../models/Recipe")
const User = require("../models/User")

function onlyUsers(req, res, next) {
    if(!req.session.userId) {
        req.flash('error', "Permitido apenas para usuários, faça o login.")
        return res.redirect('/admin/user/login')
    }
       
    next()
}

function isLogged(req, res, next) {
    if(req.session.userId)
    return res.redirect('/admin/user')
    next()
}
async function onlyAdmin(req, res, next) {
    const id = req.session.userId
    const user = await User.findOne({where:{id}})

    if(!user.is_admin) {
        req.flash('error', `Acesso negado! \n
        Permitido apenas a usuários administradores.`)
        return res.redirect('/admin/user')
    }
    
    next()
}
async function ownRecipeOrAdmin(req, res, next) {
    const id = req.session.userId
    const recipeId = req.params.id

    const user = await User.findOne({where:{id}})

    const recipe = await  Recipe.find(recipeId)
    if(!user.is_admin){
        if (id != recipe.user_id) {
        req.flash('error', "Usuário não pode editar receitas de outro usuário.")
        return res.redirect('/admin/user')
        }
    }
    next()
}
module.exports = {
    onlyUsers,
    isLogged,
    onlyAdmin,
    ownRecipeOrAdmin
}