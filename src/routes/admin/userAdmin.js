const express = require('express')
const routes = express.Router()
const users = require('../../app/controller/users')
const UserAdminValidator = require('../../app/validators/userAdmin')
const {onlyAdmin} = require('../../app/middleware/session')



// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyAdmin, users.list) // Mostrar a lista de usuários cadastrados
routes.get('/create', onlyAdmin, users.create) // Mostrar o formulário de criação de um usuário
routes.get('/:id/edit', onlyAdmin, users.edit) // Mostrar o formulário de edição de um usuário

routes.post('/', UserAdminValidator.post, users.post) // Cadastrar um usuário
routes.put('/:id', UserAdminValidator.update, users.put) // Editar um usuário
routes.delete('/:id', UserAdminValidator.ownAccount, users.delete) // Deletar um usuário

module.exports = routes