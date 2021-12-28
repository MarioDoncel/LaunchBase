const Recipe = require('../models/Recipe')
const FileRecipe = require('../models/FileRecipe')
const Chef = require("../models/Chef")
const FileChef = require("../models/FileChef")
const {formatList} = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        
        const recipes = await Recipe.findAll()
        //Inserindo src na recipe
        for (let index = 0; index < recipes.length; index++) { 
            const recipe = recipes[index];
            const recipeFiles = await FileRecipe.findAll({where: {recipe_id:recipe.id}})
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            }))  
            const files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }       
        }
        const recipesFeatured = []
        for (let index = 0; index < 6; index++) {
            recipesFeatured.push(recipes[index])
        }
        return res.render("public/index", {recipesFeatured})
    },
    //======== Recipes========
    async listRecipes(req, res) {
        const recipes = await Recipe.all()
        // inserindo src nas recipes para exibição
        for (let index = 0; index < recipes.length; index++) { 
            const recipe = recipes[index];
            const recipeFiles = await FileRecipe.findAll({where: {recipe_id:recipe.id}})
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            }))  
            const files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        return res.render("public/recipes", {recipes})
    },
    async showRecipe(req, res) {
        const recipe_id = req.params.id
        
        const recipe = await Recipe.find(recipe_id)
        if(!recipe) return res.send ('Receita não encontrado!')

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)

        const recipeFiles = await FileRecipe.findAll({Where: {recipe_id}})
        const filesPromise = recipeFiles.map( recipeFile => ({
            ...recipeFile,
            src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
        })) 
        let files = await Promise.all(filesPromise) 
        
        return res.render("public/recipeDetails", {recipe, files})
           
    },
    async searchResults(req,res) {
        let {filter} = req.query
        const recipes = await Recipe.filterRecipes(filter)
        
        if(!recipes) return res.send ('Receita não encontrado!')
        
        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            const recipe_id = recipe.id
            const recipeFiles = await FileRecipe.findAll({Where: {recipe_id }})
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            })) 
            const files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                const randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        return res.render("public/search-results.njk", {recipes, filter})
    },
    // ====== Chefs =========
    async listChefs(req, res) {
        const chefs = await Chef.all()

        for (let index = 0; index < chefs.length; index++) { // inserindo src para exibição
            const chef = chefs[index];
            const file = await FileChef.findOne({where : {chef_id:chef.id}})
            file ? chef.src = `${req.protocol}://${req.headers.host}${file.path.replace('public','')}` : chef.src = 'http://placehold.it/500x500?text=CHEF SEM FOTO'
        }

        return res.render("public/chefs.njk", {chefs})
    }

}


