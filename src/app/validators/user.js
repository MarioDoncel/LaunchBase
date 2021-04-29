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

async function update(req, res, next) {
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        req.flash('error', fillAllFields.error)
        return res.redirect('/admin/user')
    }
        
    const {id, password} = req.body
    
    const results = await User.findOne({where: {id}})
    const user = results.rows[0]

    //check if password matches
    const passed = await compare(password, user.password) ||  password == user.password
    
    if(!passed) {
        req.flash('error', "Senha incorreta.")
        return res.redirect('/admin/user')
    }
    req.user = user
    next()
}

module.exports = {
    update
}





