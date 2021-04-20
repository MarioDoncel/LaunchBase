const express = require('express')
const routes = express.Router()
const public = require("../app/controller/public")

routes.get("/", public.index)
routes.get("/about", function(req, res) {
    return res.render("public/about.njk")
})
routes.get("/recipes", public.listRecipes)
routes.get("/recipes/:id", public.showRecipe)
routes.get("/chefs", public.listChefs)
routes.get("/search-results", public.searchResults)

module.exports = routes