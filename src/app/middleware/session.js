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
    return res.redirect('admin/user')
    next()
}
module.exports = {
    onlyUsers,
    isLogged
}