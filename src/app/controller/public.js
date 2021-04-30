const Public = require('../models/Public')
const Recipe = require('../models/Recipe')
const Chef = require("../models/Chef")
const {date, formatList} = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        let results = await Public.allRecipes()
        const recipesFeatured = results.rows 

        //Inserindo src na recipe
        for (let index = 0; index < recipesFeatured.length; index++) { 
            const recipe = recipesFeatured[index];
            results = await Recipe.recipeFiles(recipe.id)
            const recipeFiles = results.rows 
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            })) 
            let files = await Promise.all(filesPromise) 
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        
        return res.render("public/index", {recipesFeatured})
    },
    //======== Recipes========
    async listRecipes(req, res) {
        let results = await Public.allRecipes()
        const recipes = results.rows
        // inserindo src nas recipes para exibição
        for (let index = 0; index < recipes.length; index++) { 
            const recipe = recipes[index];
            results = await Recipe.recipeFiles(recipe.id)
            const recipeFiles = results.rows 
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            })) 
            
            let files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        return res.render("public/recipes", {recipes})
    },
    async showRecipe(req, res) {
        let recipeId = req.params.id
        
        let results = await Public.findRecipe(recipeId)
        const recipe = results.rows[0]
        if(!recipe) return res.send ('Receita não encontrado!')

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)

        results = await Recipe.recipeFiles(recipeId)
        const recipeFiles = results.rows 
        const filesPromise = recipeFiles.map( recipeFile => ({
            ...recipeFile,
            src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
        })) 
        let files = await Promise.all(filesPromise) 
        
        return res.render("public/recipeDetails", {recipe, files})
           
    },
    async searchResults(req,res) {
        let {filter} = req.query
        let results = await Public.filterRecipes(filter)
        const recipes = results.rows
        if(!recipes) return res.send ('Receita não encontrado!')
        
        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            results = await Recipe.recipeFiles(recipe.id)
            const recipeFiles = results.rows 
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            })) 
            let files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        return res.render("public/search-results.njk", {recipes, filter})
    },
    // ====== Chefs =========
    async listChefs(req, res) {
        let results = await Public.allChefs()
        const chefs = results.rows

        for (let index = 0; index < chefs.length; index++) { // inserindo src para exibição
            const chef = chefs[index];
            results = await Chef.file(chef.id)
            const file = results.rows[0] 
            file ? chef.src = `${req.protocol}://${req.headers.host}${file.path.replace('public','')}` : chef.src = 'http://placehold.it/500x500?text=CHEF SEM FOTO'
        }

        return res.render("public/chefs.njk", {chefs})
    }

}


