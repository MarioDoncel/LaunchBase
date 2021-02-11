const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require("./data")

const recipesFeatured = []
for (let index = 0; index < 6; index++) {
    recipesFeatured.push(recipes[index]);
}

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express : server,
    autoescape: false,
    noCache: true
})

server.get("/", function(req, res) {
    return res.render("index.njk", {recipesFeatured : recipesFeatured})
})

server.get("/about", function(req, res) {
    return res.render("about.njk")
})

server.get("/recipes", function(req, res) {
    return res.render("recipes.njk", {recipes : recipes})
})

// server.get("/recipe", function(req, res) {
//     return res.render("recipeIndex.njk", {recipes : recipes})
// })
server.get("/recipes/:index", function(req, res) {
    const recipeIndex = req.params.index;
    return res.render("recipeIndex.njk", {recipe : recipes[recipeIndex]})
})


server.listen(5000, function() {
})