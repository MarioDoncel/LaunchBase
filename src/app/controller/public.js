const Public = require('../models/Public')
const {date, formatList} = require('../../lib/utils')


exports.index = function(req, res) {
    Public.allRecipes(function (recipesFeatured) {
        return res.render("public/index", {recipesFeatured})
    })
}

//======== Recipes========

exports.listRecipes = function(req, res) {
    Public.allRecipes(function (recipes) {
        return res.render("public/recipes", {recipes})
    })
}

exports.showRecipe = function(req, res) {
    let recipeId = req.params.id
    
    Public.findRecipe(recipeId, function (recipe) {
        if(!recipe) return res.send ('Receita não encontrado!')

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)
        
        return res.render("public/recipeDetails", {recipe})
    }) 
}

// ====== Chefs =========

exports.listChefs = function(req, res) {
    Public.allChefs(function (chefs) {
        return res.render("public/chefs.njk", {chefs})
    })
}

// exports.showChef = function(req, res) {
//     let chefId = req.params.id

//     Recipe.find(chefId, function (chef) {
//         if(!chef) return res.send ('Chef não encontrado!')
        
//         return res.render("admin/chefs/show", {chef})
//     }) 
// }