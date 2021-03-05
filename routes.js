const express = require('express')
const routes = express.Router()
const recipes = require("./src/app/controller/recipes")
const chefs = require("./src/app/controller/chefs")
const recipesData = require("./data.json")



// ========== Public Area ==========

routes.get("/", function(req, res) {
    const recipesFeatured = []
        for (let index = 0; index < 6; index++) {
            recipesFeatured.push(recipesData.recipes[index]);
        }
    return res.render("public/index.njk", {recipesFeatured : recipesFeatured})
})
routes.get("/about", function(req, res) {
    return res.render("public/about.njk")
})
routes.get("/recipes", function(req, res) {
    return res.render("public/recipes.njk", {recipes : recipesData.recipes})
})
routes.get("/recipes/:index", function(req, res) {
    const recipeIndex = req.params.index;
    return res.render("public/recipeDetails.njk", {recipe : recipesData.recipes[recipeIndex]})
})
routes.get("/chefs", function(req, res) {
    return res.render("public/chefs.njk", {recipes : recipesData.recipes})
})
routes.get("/search-results", function(req, res) {
    return res.render("public/search-results.njk", {recipes : recipesData.recipes})
})
// ========== Admin Area ==========

// RECIPES

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipes.put); // Editar uma receita
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