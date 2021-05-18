const User = require('../models/User')
const {compare} = require('bcryptjs')

async function login(req, res, next){
    const {email, password} = req.body
    const user = await User.findOne({
        where: {email}
    })

    if(!user){
        req.flash('error', "Usuário não encontrado")
        req.flash('user', req.body)
        req.flash('errorEmail', true)
        return res.redirect('/admin/user/login')
    }

    const passed = await compare(password, user.password) || password == user.password 

    if(!passed) {
        req.flash('error', "Senha incorreta.")
        req.flash('user', req.body)
        req.flash('errorPassword', true)
        return res.redirect('/admin/user/login')
    }

    req.user = user
    next()
}
async function forgot(req, res, next) {
    const {email} = req.body
    try {
        const user = await User.findOne({
            where: {email}
        })
    
        if(!user) {
            req.flash('error', "Email não cadastrado!")
            req.flash('user', req.body)
            return res.redirect('/admin/user/forgot-password')
        }
        req.user = user
        next()
    } catch (error) {
        console.error(error)
    }    
}
async function reset(req, res, next) {
    const {email, password, passwordRepeat, token} = req.body
    const user = await User.findOne({
        where: {email}
    })

    if(!user) {
        req.flash('error', "Email não cadastrado!")
        req.flash('user', req.body)
        return res.redirect(`/admin/user/password-reset?token=${token}`)   
    }
    //check if password matchs
    if (password != passwordRepeat) {
        req.flash('error', "Senha não confirmada corretamente.")
        req.flash('user', req.body)
        return res.redirect(`/admin/user/password-reset?token=${token}`)   
    }
    
    //Verificar token
    if(token != user.reset_token) {
        req.flash('error', "Token inválido! Solicite uma nova recuperação de senha.")
        return res.redirect(`/admin/user/forgot-password`)   
    }

    // Verificar token expire
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) {
        req.flash('error', "Token expirado!Solicite uma nova recuperação de senha.")
        return res.redirect(`/admin/user/forgot-password`)   
    }
    
    req.user = user
    next()
}
module.exports = {
    login,
    forgot,
    reset
}





