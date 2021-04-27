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

async function post(req, res, next) {
    //check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        return res.render('admin/users/create', fillAllFields)
    }
    //check if user exists [email, cpf_cnpj]
    let { email } = req.body
    const results = await User.findOne({
        where: { email }
    })
    const user = results.rows[0]

    if (user) return res.render('admin/users/create', {
        error: 'Usuário já cadastrado!',
        user:req.body
    })

    next()
}
async function update(req, res, next) {
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        return res.redirect(`/admin/userAdmin/${req.body.userId}/edit`, fillAllFields)
    }
        
        req.user = user
        next()
}

module.exports = {
    post,
    update
}





