const express = require('express')
const routes = express.Router()
const profile = require('../../app/controller/profile')
const session = require('../../app/controller/session')
const {isLogged, onlyUsers} = require('../../app/middleware/session')

// Rotas de perfil de um usuário logado
routes.get('/', profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', profile.put)// Editar o usuário logado

// login/logout
routes.get('/login',/*isLogged,*/ session.loginForm)
routes.post('/login', /*SessionValidator.login,*/ session.login)
routes.post('/logout', session.logout)

// // resetpassword /forgot
routes.get('/forgot-password', session.forgotForm)
routes.get('/password-reset', session.resetForm)
routes.post('/forgot-password', /*SessionValidator.forgot,*/ session.forgot)
routes.post('/password-reset', /*SessionValidator.reset,*/ session.reset)


module.exports = routes