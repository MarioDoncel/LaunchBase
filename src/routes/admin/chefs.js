const express = require('express')
const routes = express.Router()
const multer = require('../../app/middleware/multer')
const chefs = require('../../app/controller/chefs')
const {onlyUsers, onlyAdmin} = require('../../app/middleware/session')

routes.get("/", onlyUsers, chefs.index); // Mostrar a lista de chefs
routes.get("/create", onlyAdmin, chefs.create); // Mostrar formulário de nova chef
routes.get("/:id", onlyUsers, chefs.show); // Exibir detalhes de uma chef
routes.get("/:id/edit", onlyAdmin, chefs.edit); // Mostrar formulário de edição de chef

routes.post("/",multer.single('avatar'), chefs.post); // Cadastrar novo chef
routes.put("/",multer.single('avatar'), chefs.put); // Editar um chef
routes.delete("/", chefs.delete); // Deletar um chef

module.exports = routes