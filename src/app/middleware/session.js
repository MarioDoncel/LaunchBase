const Recipe = require("../models/Recipe")
const User = require("../models/User")

function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.render('admin/session/login', {
            user:req.body,
            error:"Permitido apenas para usuários, faça o login."
        })
    next()
}

function isLogged(req, res, next) {
    if(req.session.userId)
    return res.redirect('/admin/user')
    next()
}
async function onlyAdmin(req, res, next) {
    const id = req.session.userId
    const results = await User.findOne({where:{id}})
    const user = results.rows[0]
    if(!user.is_admin)
    return res.render('admin/users/profile', {
        user,
        error: `Acesso negado! \n
        Permitido apenas a usuários administradores.`
    })
    next()
}
async function ownRecipeOrAdmin(req, res, next) {
    const id = req.session.userId
    const recipeId = req.params.id

    let results = await User.findOne({where:{id}})
    const user = results.rows[0]

    results = await  Recipe.find(recipeId)
    const recipe = results.rows[0]

    if(!user.is_admin){
        if (id != recipe.user_id) 
        return res.render('admin/users/profile', {
            user,
            error: `Acesso negado! \n
            Permitido apenas a usuários administradores ou titulares da receita.`
        })
    }
    
    next()
}
module.exports = {
    onlyUsers,
    isLogged,
    onlyAdmin,
    ownRecipeOrAdmin
}