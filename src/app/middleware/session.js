function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.render('session/login', {
            user:req.body,
            error:"Permitido apenas para usuários, faça o login."
        })
    next()
}

function isLogged(req, res, next) {
    if(req.session.userId)
    return res.redirect('/users')
    next()
}
module.exports = {
    onlyUsers,
    isLogged
}