const express = require('express')
const routes = express.Router()
const multer = require('../../app/middleware/multer')
const recipes = require('../../app/controller/recipes')
const {onlyUsers, ownRecipeOrAdmin} = require('../../app/middleware/session')

routes.get("/", onlyUsers, recipes.index); // Mostrar a lista de receitas
routes.get("/create", onlyUsers, recipes.create); // Mostrar formulário de nova receita
routes.get("/:id", onlyUsers, recipes.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", onlyUsers, ownRecipeOrAdmin, recipes.edit); // Mostrar formulário de edição de receita

routes.post("/",multer.array('images', 5), recipes.post); // Cadastrar nova receita
routes.put("/",multer.array('images', 5), recipes.put); // Editar uma receita
routes.delete("/", recipes.delete); // Deletar uma receita

module.exports = routes