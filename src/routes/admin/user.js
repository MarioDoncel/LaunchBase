const express = require('express')
const routes = express.Router()
const profile = require('../../app/controller/profile')
const session = require('../../app/controller/session')
const userValidator = require('../../app/validators/user')
const sessionValidator = require('../../app/validators/session')
const {isLogged, onlyUsers} = require('../../app/middleware/session')

// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', userValidator.update, profile.put)// Editar o usuário logado

// login/logout
routes.get('/login',isLogged, session.loginForm)
routes.post('/login', sessionValidator.login, session.login)
routes.post('/logout', session.logout)

// // resetpassword /forgot
routes.get('/forgot-password', session.forgotForm)
routes.get('/password-reset', session.resetForm)
routes.post('/forgot-password', sessionValidator.forgot, session.forgot)
routes.post('/password-reset', sessionValidator.reset, session.reset)


module.exports = routes