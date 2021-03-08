const data = require("../../../data.json")
const fs = require("fs")
const Chef = require("../models/Chef")

exports.index = function(req, res) {
    Chef.all(function (chefs) {
        return res.render("admin/chefs/chefs.njk", {chefs})
    })
}

exports.create = function(req, res) {
    return res.render("admin/chefs/create.njk")
}

exports.show = function(req, res) {
    let chefId = req.params.id

    Chef.find(chefId, function (chef) {
        if(!chef) return res.send ('Chef não encontrado!')
        chef.avatar_url = chef.avatar_url.replace("https://", "")

        Chef.recipesByChef(chefId, function (recipes) {
            recipes.forEach(recipe => {
                recipe.image = recipe.image.replace("https://","")
            });
            return res.render("admin/chefs/show", {chef, recipes})
        })        
    }) 
        
}

exports.edit = function(req, res) {
    let chefId = req.params.id
    Chef.find(chefId, function (chef) {
        if(!chef) return res.send ('Chef não encontrado!')

        return res.render("admin/chefs/edit", {chef, chefId})
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

    Chef.create(req.body, function () {
        return res.redirect('/admin/chefs')
    })
}

exports.put = function(req, res) {
    Chef.update(req.body, function () {
        return res.redirect('/admin/chefs')
    })
}

exports.delete = function(req, res) {
    const chefId = req.body.chefId
    const total_recipes = req.body.total_recipes

    if (total_recipes>0) return res.send("Erro! Chefs que possuem receitas cadastradas não podem ser excluidos!")
    
    Chef.delete(chefId, function () {
        return res.redirect('/admin/chefs')
    })
}