const express = require('express')
const routes = express.Router()
const recipes = require("./controller/recipes")
const recipesData = require("./data")



// ========== Public Area ==========

routes.get("/", function(req, res) {
    const recipesFeatured = []
        for (let index = 0; index < 6; index++) {
            recipesFeatured.push(recipesData[index]);
        }
    return res.render("public/index.njk", {recipesFeatured : recipesFeatured})
})
routes.get("/about", function(req, res) {
    return res.render("public/about.njk")
})
routes.get("/recipes", function(req, res) {
    return res.render("public/recipes.njk", {recipes : recipesData})
})
routes.get("/recipes/:index", function(req, res) {
    const recipeIndex = req.params.index;
    return res.render("public/recipeDetails.njk", {recipe : recipesData[recipeIndex]})
})

// ========== Admin Area ==========

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

module.exports = routes