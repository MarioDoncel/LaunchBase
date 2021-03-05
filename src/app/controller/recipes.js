const Recipe = require('../models/Recipe')
const {date, formatList} = require('../../lib/utils')

exports.index = function(req, res) {
    Recipe.all(function (recipes) {
        return res.render("admin/recipes/recipes", {recipes})
    })
}

exports.create = function(req, res) {
    Recipe.chefOptions(function (chefs) {
        return res.render("admin/recipes/create", {chefs})
    })
    
}

exports.show = function(req, res) {
    let recipeId = req.params.id

    Recipe.find(recipeId, function (recipe) {
        if(!recipe) return res.send ('Recipe não encontrado!')

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)
        
        return res.render("admin/recipes/show", {recipe})
    }) 
}


exports.edit = function(req, res) {
    let recipeId = req.params.id

    Recipe.find(recipeId, function (recipe) {
        if(!recipe) return res.send ('Recipe não encontrado!')
        
        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)

        let chefs = []
        Recipe.chefOptions(function (chefs) {
            return res.render("admin/recipes/edit", {recipe, recipeId, chefs})
        })
       
    }) 
}



exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    //validação de todos os campos preenchidos
    keys.forEach(key => {
        if(req.body[key]==""){
            return res.send("Todos os campos são obrigatorios")
        }
    });

    Recipe.create(req.body, function () {
        return res.redirect('admin/recipes')
    })
}

exports.put = function(req, res) {
    const recipeId = req.body.recipeId
    
    Recipe.update(recipeId, function () {
        return res.redirect('admin/recipes/recipes')
    })
}

exports.delete = function(req, res) {
    const recipeId = req.body.recipeId
    
    Recipe.delete(recipeId, function () {
        return res.redirect('admin/recipes/recipes')
    })
}