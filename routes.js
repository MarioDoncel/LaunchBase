const express = require('express')
const routes = express.Router()
const recipes = require("./src/app/controller/recipes")
const chefs = require("./src/app/controller/chefs")
const public = require("./src/app/controller/public")
const multer = require('./src/app/middleware/multer')




// ========== Public Area ==========
routes.get("/", public.index)

routes.get("/about", function(req, res) {
    return res.render("public/about.njk")
})
routes.get("/recipes", public.listRecipes)

routes.get("/recipes/:id", public.showRecipe)

routes.get("/chefs", public.listChefs)

routes.get("/search-results", public.searchResults)

// ========== Admin Area ==========

// RECIPES

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes",multer.array('images', 5), recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes",multer.array('images', 5), recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

// CHEFS

routes.get("/admin/chefs", chefs.index); // Mostrar a lista de chefs
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de nova chef
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de uma chef
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de chef

routes.post("/admin/chefs", chefs.post); // Cadastrar novo chef
routes.put("/admin/chefs", chefs.put); // Editar um chef
routes.delete("/admin/chefs", chefs.delete); // Deletar um chef

module.exports = routes