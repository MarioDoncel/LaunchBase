const express = require('express')
const routes = express.Router()
const users = require('../../app/controller/users')
const UserAdminValidator = require('../../app/validators/userAdmin')



// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', users.list) // Mostrar a lista de usuários cadastrados
routes.get('/create', users.create) // Mostrar o formulário de criação de um usuário
routes.get('/:id/edit', users.edit) // Mostrar o formulário de edição de um usuário

routes.post('/', UserAdminValidator.post, users.post) // Cadastrar um usuário
routes.put('/:id', users.put) // Editar um usuário
routes.delete('/:id', users.delete) // Deletar um usuário

module.exports = routes