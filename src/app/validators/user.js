const User = require('../models/User')
// const {compare} = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (key of keys) {
        if (body[key] == "") {
            return {
                user:body,
                error: 'Por favor preencha todos os campos!'
            }
        }
    }
}
async function show(req, res, next){
    const {userId: id} = req.session
    const results = await User.findOne({
        where:{id}
    })
    const user = results.rows[0]
    if(!user) return res.render('user/register', {
        error:"Usuário não encontrado!"
    })
    req.user = user

    next()
}

async function update(req, res, next) {
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        return res.render('admin/users/profile', fillAllFields)
    }
        //check password exists
        const {id, password} = req.body
        if(!password) return res.render('admin/users/profile', {
                user:req.body,
                error: 'Digite a senha para atualizar o cadastro'
            })
        const results = await User.findOne({where: {id}})
        const user = results.rows[0]

        //check if password matches
        // const passed = await compare(password, user.password) // função do bcryptjs
        const passed = password == user.password
        if(!passed) return res.render('admin/users/profile', {
            user:req.body,
            error: 'Senha incorreta!'
        })
        req.user = user
        next()
}

module.exports = {
    show,
    update
}





