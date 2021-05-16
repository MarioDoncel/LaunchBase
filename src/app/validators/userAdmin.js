const User = require('../models/User')
const {checkAllFields} = require('../../lib/utils')

async function post(req, res, next) {
    //check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        req.flash('error', fillAllFields.error)
        req.flash('user', fillAllFields.user)
        return res.redirect('/admin/userAdmin/create')
    }
    //check if user exists [email, cpf_cnpj]
    let { email } = req.body
    const results = await User.findOne({
        where: { email }
    })
    const user = results.rows[0]

    if (user) {
        req.flash('error', 'Usuário já cadastrado!')
        req.flash('user', req.body)
        return res.redirect('/admin/userAdmin/create')
    }

    next()
}
async function update(req, res, next) {
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        req.flash('error', fillAllFields.error)
        return res.redirect(`/admin/userAdmin/${req.params.id}/edit`)
    }
        
    next()
}
async function ownAccount(req, res, next) {
    //check fields
    const id = req.session.userId
    const deleteId = req.params.id
    if(id == deleteId){
        req.flash('error', "Usuário não pode deletar a própria conta.")
        return res.redirect(`/admin/userAdmin/${req.params.id}/edit`)
    }
        
    next()
}
module.exports = {
    post,
    update,
    ownAccount
}





