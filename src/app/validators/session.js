const User = require('../models/User')
const {compare} = require('bcryptjs')

async function login(req, res, next){
    const {email, password} = req.body
    const results = await User.findOne({
        where: {email}
    })
    const user = results.rows[0]

    if(!user) return res.render('admin/session/login', {
        errorEmail:true,
        user:req.body,
        error:"Usuário não encontrado"
    })

    const passed = await compare(password, user.password) || password == user.password // função do bcryptjs

    if(!passed) return res.render('admin/session/login', {
        errorPassword:true,
        user: req.body,
        error: 'Senha incorreta'
    })
    req.user = user
    next()
}
async function forgot(req, res, next) {
    const {email} = req.body
    try {
        const results = await User.findOne({
            where: {email}
        })
        const user = results.rows[0]
    
        if(!user) return res.render('admin/session/forgot-password', {
            user:req.body,
            error:"Email não cadastrado!"
        })
        req.user = user
        next()
    } catch (error) {
        console.error(error)
    }    
}
async function reset(req, res, next) {
    const {email, password, passwordRepeat, token} = req.body
    const results = await User.findOne({
        where: {email}
    })
    const user = results.rows[0]

    if(!user) return res.render('admin/session/password-reset', {
        user:req.body,
        token,
        error:"Usuário não encontrado."
    })
    //check if password matchs
    if (password != passwordRepeat) return res.render('admin/session/password-reset', {
        user:req.body,
        token,
        error: 'Senha não confirmada corretamente.'
    })
    //Verificar token
    if(token != user.reset_token) return res.render('admin/session/password-reset', {
        user:req.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha.'
    })
    // Verificar token expire
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
        user:req.body,
        token,
        error: 'Token expirado!Solicite uma nova recuperação de senha.'
    })
    req.user = user
    next()
}
module.exports = {
    login,
    forgot,
    reset
}





