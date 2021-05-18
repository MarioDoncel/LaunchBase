const User = require('../models/User')
const {compare} = require("bcryptjs")
const {checkAllFields} = require('../../lib/utils')

async function update(req, res, next) {
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        req.flash('error', fillAllFields.error)
        return res.redirect('/admin/user')
    }
        
    const {id, password} = req.body
    
    const user = await User.find(id)

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





